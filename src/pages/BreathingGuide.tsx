import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { RPPGStreamMessage } from '../api/meditation';
import { connectRPPGStream, sendFrameToWebSocket } from '../api/meditation';

// 📂 하위 컴포넌트들의 실제 경로에 맞게 /BreathingGuide/ 폴더 경로 추가
import Header from '../components/BreathingGuide/Header';
import BreathingCircle from '../components/BreathingGuide/BreathingCircle';
import StatusCards from '../components/BreathingGuide/StatusCards';
import CameraFrame from '../components/BreathingGuide/CameraFrame';
import MeditationTimer from '../components/BreathingMonitor/MeditationTimer';
import { saveMeditationRecord } from '../api/meditation';

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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 상위에서 관리할 단 하나의 카메라 스트림 상태
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. 카메라 초기화 (부모에서 딱 한 번만 켜기)
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
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

    // 언마운트 시 자원 해제
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. 명상 타이머 작동
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // 캡슐화된 카메라 정리 함수
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

  // 3. 웹소켓 및 비동기 프레임 캡처 송신 루프
  useEffect(() => {
    if (!logId || wsRef.current) return;

    const handleMessage = (data: any) => {
      // AI 서버로부터 저장 완료(SUMMARY_SYNCED) 이벤트를 수신하면 피드백 화면으로 이동
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

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("웹소켓 데이터 확인:", data);
        handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsRef.current = ws;

    let isCancelled = false;

    const sendFrameLoop = () => {
      if (isCancelled) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx && wsRef.current?.readyState === WebSocket.OPEN) {
          // 72x72 해상도 리사이징 드로우
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // 화질을 기존 0.3에서 0.2로 낮춰 텍스트 용량 다이어트 (네트워크 대역폭 과부하 방지)
          const frameData = canvas.toDataURL('image/jpeg', 0.3);

          sendFrameToWebSocket(wsRef.current, frameData, Number(logId));
        }
      }

      // 약 30 FPS 규격을 충족하되 시스템 병목 현상을 방지하도록 다음 예약을 실행
      setTimeout(sendFrameLoop, 33);
    };

    // 카메라 화면 준비 완료 시 루프 가동
    sendFrameLoop();

    return () => {
      isCancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [logId, navigate]);

  // 4. 명상 종료 함수
  const handleEndMeditation = async () => {
    setIsRunning(false);

    if (timerRef.current) clearInterval(timerRef.current);

    // AI 서버에 명상 종료 메시지 송신 후 대기 (이동은 웹소켓 수신 이벤트에서 전담)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'END', totalDuration: meditationTime }));
        console.log('Sent END packet to AI server. Awaiting validation...');
      } catch (e) {
        console.warn('명상 시간 전송 실패:', e);
      }
    }

    localStorage.setItem('lastMeditationTime', meditationTime.toString());
    /*
    // 만약 소켓 과부하로 인해 AI 서버가 스프링에 저장하는 걸 실패할 것에 대비해 백업용 임시 데이터 주입
    if (logId) {
      try {
        await saveMeditationRecord({
          logId: parseInt(logId),
          startHr: 78,
          endHr: biometricData.heartRate || 72,
          startLfhf: 1.4,
          endLfhf: biometricData.lfHfRatio || 0.9,
          resultStatus: 'SUCCESS',
          hrDiff: -6,
          lfhfDiff: -0.5
        });
        console.log('✓ 프론트엔드에서 메인 서버에 백업 데이터 저장 완료');
      } catch (err) {
        console.warn('백업 데이터 저장 시도 중 에러 (이미 AI서버가 저장했을 수 있음):', err);
      }
    }*/

    setTimeout(() => {
      stopCameraNow();
      navigate(`/meditation-feedback?logId=${logId}`);
    }, 500);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    // 🔥 [핵심 수정] 최상단 레이아웃 클래스에 "relative"를 추가하여 내부의 absolute 요소들이 앱 스코프 안으로 들어오게 교정했습니다.
    <div className="relative min-h-[100svh] w-full bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
      {/* 분석용 숨겨진 비디오 */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" width="640" height="480" />

      {/* 캔버스의 실제 자체 해상도를 AI 모델 규격인 72x72로 유지 */}
      <canvas ref={canvasRef} className="hidden" width="640" height="480" />

      {/* 상단 헤더 */}
      <Header title="호흡 모니터링" onBack={() => navigate(-1)} />

      {/* 우측 상단 미니 웹캠 칸 (이제 앱 상자 내부 우측 상단에 똑바로 박힙니다) */}
      <div className="absolute top-24 right-6 w-20 h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg z-20 bg-black">
        <CameraFrame stream={stream} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col gap-4 px-5 pt-4 pb-5 w-full overflow-y-auto hide-scrollbar">
        <div>
          {/* 웹소켓 연결 상태 */}
          <div className="mb-4 flex justify-center">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                isConnected ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-xs font-medium ${isConnected ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isConnected ? 'WebSocket 연결됨' : 'WebSocket 연결 중'}
              </span>
            </div>
          </div>

          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* 타이머 */}
          <MeditationTimer time={formatTime(meditationTime)} />

          {/* 원형 애니메이션 호흡 가이드 컴포넌트 */}
          <BreathingCircle />

          {/* 실시간 생체 데이터 카드 */}
          <StatusCards heartRate={biometricData.heartRate} lfHfRatio={biometricData.lfHfRatio} />
        </div>

        {/* 하단 인터랙션 영역 */}
        <div className="space-y-3 w-full">
          {/* 실시간 얼굴 감지 상태창 */}
          <div
            className={`w-full py-3.5 px-5 rounded-2xl border-2 bg-white text-center font-bold text-base shadow-sm transition-all duration-300 ${
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
          <button
            onClick={handleEndMeditation}
            className="w-full py-4 rounded-2xl bg-[#6BE6C1] text-[#0F172A] font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
          >
            명상 종료하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default BreathingGuide;