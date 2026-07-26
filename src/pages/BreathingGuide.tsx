import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { RPPGStreamMessage } from '../api/meditation';
import { connectRPPGStream, sendFrameToWebSocket } from '../api/meditation';

import Header from '../components/BreathingGuide/Header';
import BreathingCircle from '../components/BreathingGuide/BreathingCircle';
import BreathingPrep from '../components/BreathingGuide/BreathingPrep';
import PreBreathCountdown from '../components/BreathingGuide/PreBreathCountdown';
import StatusCards from '../components/BreathingGuide/StatusCards';
import CameraFrame from '../components/BreathingGuide/CameraFrame';
import MeditationTimer from '../components/BreathingMonitor/MeditationTimer';
import ConnectionStatus from '../components/BreathingMonitor/ConnectionStatus';
import EndMeditationButton from '../components/BreathingMonitor/EndMeditationButton';

interface BiometricData {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

const BreathingGuide: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('logId');

  // 상태 관리
  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 0,
    lfHfRatio: 0,
    isFaceDetected: false,
  });
  const [meditationTime, setMeditationTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [countdownDone, setCountdownDone] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 단 하나의 카메라 스트림 상태
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. 카메라 스트림 캡슐화 종료 함수
  const stopCameraNow = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // 2. 카메라 초기화 및 이동 시 완전 해제 (OOM 방지)
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 360 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(err);
        setError('카메라 접근이 거부되었습니다.');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 3. 명상 타이머 작동 (3-2-1 카운트다운 완료 후 countdownDone이 true가 되어야 가동)
  useEffect(() => {
    if (!isRunning || !hasStarted || !countdownDone) return;

    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, hasStarted, countdownDone]);

  // 4. 웹소켓 및 프레임 고정 송신 루프 (toBlob 메모리 최적화 + 이중 연결 차단)
  useEffect(() => {
    if (!logId) return;
    if (wsRef.current && wsRef.current.readyState <= 1) return;

    const handleMessage = (data: any) => {
      if (data.type === 'SUMMARY_SYNCED') {
        console.log('Summary sync verified. Navigating to feedback...');
        stopCameraNow();
        navigate(`/meditation-feedback?logId=${logId}`);
        return;
      }

      setBiometricData({
        heartRate: Math.round(data.heartRate * 10) / 10,
        lfHfRatio: Math.round(data.lfHfRatio * 100) / 100,
        isFaceDetected: data.isFaceDetected,
      });
      if (!isConnected) setIsConnected(true);
    };

    const ws = connectRPPGStream(parseInt(logId), handleMessage, (e) => {
      console.error('WebSocket error:', e);
      setIsConnected(false);
    });

    // 실시간 메시지 수신 콘솔 로그
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('실시간 생체 데이터 수신:', data);
        handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsRef.current = ws;

    let isCancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const sendFrameLoop = () => {
      if (isCancelled) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx && wsRef.current?.readyState === WebSocket.OPEN) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // toBlob으로 메모리 쓰레기 누수 차단
          canvas.toBlob(
            (blob) => {
              if (!blob || isCancelled || wsRef.current?.readyState !== WebSocket.OPEN) return;

              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Data = reader.result as string;
                if (base64Data && wsRef.current?.readyState === WebSocket.OPEN) {
                  sendFrameToWebSocket(wsRef.current, base64Data, Number(logId));
                }
              };
              reader.readAsDataURL(blob);
            },
            'image/jpeg',
            0.85
          );
        }
      }

      timerId = setTimeout(sendFrameLoop, 33);
    };

    sendFrameLoop();

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [logId, navigate]);

  // 5. 명상 종료 함수
  const handleEndMeditation = async () => {
    setIsRunning(false);

    if (timerRef.current) clearInterval(timerRef.current);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'END', totalDuration: meditationTime }));
        console.log('Sent END packet to AI server. Awaiting validation...');
      } catch (e) {
        console.warn('명상 시간 전송 실패:', e);
      }
    }

    localStorage.setItem('lastMeditationTime', meditationTime.toString());

    setTimeout(() => {
      stopCameraNow();
      navigate(`/meditation-feedback?logId=${logId}`);
    }, 500);
  };

  // 6. 카운트다운 완료 콜백 참조 고정 (리렌더링으로 인한 타이머 리셋 방지)
  const handleCountdownComplete = useCallback(() => {
    console.log('3초 카운트다운 완료! 명상 타이머 가동 시작.');
    setCountdownDone(true);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-[100svh] w-full bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
      {/* 분석용 숨겨진 비디오 및 캔버스 */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" width="360" height="480" />
      <canvas ref={canvasRef} className="hidden" width="360" height="480" />

      {/* 상단 헤더 */}
      <Header title="호흡 모니터링" onBack={() => navigate(-1)} />

      {/* 우측 상단 미니 웹캠 */}
      {hasStarted && (
        <div className="absolute top-24 right-6 w-20 h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg z-20 bg-black">
          <CameraFrame stream={stream} />
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col gap-4 px-5 pt-4 pb-5 w-full overflow-y-auto hide-scrollbar">
        {!hasStarted ? (
          <BreathingPrep onStart={() => setHasStarted(true)} />
        ) : (
          <>
            <div>
              {/* 웹소켓 연결 상태 */}
              <ConnectionStatus isConnected={isConnected} />

              {error && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

              {/* 타이머 */}
              <MeditationTimer time={formatTime(meditationTime)} />

              {/* 원형 애니메이션 호흡 가이드 */}
              {!countdownDone ? (
                <PreBreathCountdown onComplete={handleCountdownComplete} />
              ) : (
                <BreathingCircle />
              )}

              {/* 실시간 생체 데이터 카드 */}
              <StatusCards heartRate={biometricData.heartRate} lfHfRatio={biometricData.lfHfRatio} />
            </div>

            {/* 하단 인터랙션 영역 */}
            <div className="space-y-3 w-full">
              {/* 실시간 얼굴 감지 상태창 */}
              <div
                className={`w-full py-3 px-4 rounded-2xl border-2 bg-white dark:bg-[#1E212B] text-center font-bold text-sm shadow-sm transition-all duration-300 ${
                  biometricData.isFaceDetected
                    ? 'border-[#45947D] text-[#45947D]'
                    : 'border-red-200 text-red-500'
                }`}
              >
                {biometricData.isFaceDetected ? (
                  <span>✓ 얼굴 감지됨</span>
                ) : (
                  <span>✕ 얼굴 감지 안 됨</span>
                )}
              </div>

              {/* 명상 종료 버튼 */}
              <EndMeditationButton
                isRunning={isRunning}
                isFaceDetected={biometricData.isFaceDetected}
                onClick={handleEndMeditation}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BreathingGuide;