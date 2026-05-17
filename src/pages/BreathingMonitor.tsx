import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { RPPGStreamMessage } from '../api/meditation';
import {
  connectRPPGStream,
  sendFrameToWebSocket,
} from '../api/meditation';

import Header from '../components/Header';
import RecognitionArea from '../components/BreathingMonitor/RecognitionArea';

import ConnectionStatus from '../components/BreathingMonitor/ConnectionStatus';
import MeditationTimer from '../components/BreathingMonitor/MeditationTimer';
import BiometricCards from '../components/BreathingMonitor/BiometricCards';
import FaceStatus from '../components/BreathingMonitor/FaceStatus';
import EndMeditationButton from '../components/BreathingMonitor/EndMeditationButton';
import HiddenCamera from '../components/BreathingMonitor/HiddenCamera';

interface BiometricData {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

const BreathingMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const logId = searchParams.get('logId');
  const frameIntervalMs = 1000 / 30;

  // 상태 관리
  const [biometricData, setBiometricData] =
    useState<BiometricData>({
      heartRate: 0,
      lfHfRatio: 0,
      isFaceDetected: false,
    });

  const [meditationTime, setMeditationTime] =
    useState<number>(0);

  const [isRunning, setIsRunning] =
    useState<boolean>(true);

  const [isConnected, setIsConnected] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  // 카메라 스트림
  const [stream, setStream] =
    useState<MediaStream | null>(null);

  // refs
  const wsRef = useRef<WebSocket | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 카메라 초기화
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user',
            },
            audio: false,
          });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        console.log('Camera initialized');
      } catch (err) {
        console.error(err);

        setError('카메라 접근이 거부되었습니다.');
      }
    };

    initCamera();

    return () => {
      console.log('Stopping camera tracks...');

      if (videoRef.current?.srcObject) {
        const tracks = (
          videoRef.current.srcObject as MediaStream
        ).getTracks();

        tracks.forEach((track) => track.stop());
      }

      if (stream) {
        stream.getTracks().forEach((track) =>
          track.stop()
        );
      }
    };
  }, []);

  // 명상 타이머
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // WebSocket 연결
  useEffect(() => {
    if (!logId || wsRef.current) return;

    console.log(
      'WebSocket connecting with logId:',
      logId
    );

    const handleMessage = (
      data: RPPGStreamMessage
    ) => {
      setBiometricData({
        heartRate:
          Math.round(data.heartRate * 10) / 10,

        lfHfRatio:
          Math.round(data.lfHfRatio * 100) / 100,

        isFaceDetected:
          data.isFaceDetected,
      });

      if (!isConnected) {
        setIsConnected(true);
      }
    };

    const handleError = (e: Event) => {
      console.error('WebSocket error:', e);

      setIsConnected(false);
    };

    // 연결
    const ws = connectRPPGStream(
      parseInt(logId),
      handleMessage,
      handleError
    );

    wsRef.current = ws;

  // 재귀적 setTimeout을 위한 플래그와 타이머 참조
  let isRunningLocal = true;
  let frameTimer: ReturnType<typeof setTimeout> | null = null;

  // WebSocket이 닫힐 때 프레임 전송을 멈추도록 핸들러 추가
  ws.onclose = () => {
    isRunningLocal = false;
    if (frameTimer) {
      clearTimeout(frameTimer);
      frameTimer = null;
    }
    setIsConnected(false);
    wsRef.current = null;
    console.log('WebSocket closed, stopped frame timer.');
  };

  const captureAndSend = async () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.4);

          // 전송 전에 WebSocket 상태 검사: OPEN일 때만 전송
          if (ws.readyState === WebSocket.OPEN) {
            try {
              sendFrameToWebSocket(ws, frameData);
            } catch (e) {
              // 전송 중 소켓이 닫히거나 오류가 발생해도 워커가 멈추지 않도록 무시
              console.warn('sendFrameToWebSocket failed:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('captureAndSend error:', err);
    } finally {
      if (isRunningLocal) {
        frameTimer = setTimeout(captureAndSend, frameIntervalMs);
      }
    }
  };

  // 최초 호출
  frameTimer = setTimeout(captureAndSend, frameIntervalMs);

  return () => {
    // 3. 페이지 나갈 때만 확실히 닫기
    console.log("Cleaning up WebSocket...");
    // 전송 루프 중지
    isRunningLocal = false;
    if (frameTimer) {
      clearTimeout(frameTimer);
      frameTimer = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };
}, [logId]); // 의존성 배열에 logId 하나만 두기

  // 명상 종료
  const handleEndMeditation = async () => {
    setIsRunning(false);

    if (wsRef.current) {
      // 종료 직전에 AI 서버가 summary를 마무리할 수 있도록 종료 메시지를 먼저 보냅니다.
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'END',
            totalDuration: meditationTime,
          })
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(
          '명상 시간 전송 실패:',
          e
        );
      }

      wsRef.current.close();
      wsRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    localStorage.setItem(
      'lastMeditationTime',
      meditationTime.toString()
    );

    setTimeout(() => {
      navigate(
        `/meditation-feedback?logId=${logId}`
      );
    }, 2000);
  };

  // 시간 포맷
  const formatTime = (
    seconds: number
  ): string => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-zinc-950 flex flex-col">
      <Header
        title="호흡 모니터링"
        onBack={() => {
          if (wsRef.current) {
            wsRef.current.close();
          }

          navigate(-1);
        }}
      />

      <main className="flex-1 flex flex-col justify-center px-6 pb-10 max-w-2xl mx-auto w-full">
              {/* 숨겨진 카메라 유민 변경*/}
        <HiddenCamera
          videoRef={videoRef}
          canvasRef={canvasRef}
        />

        {/* 숨겨진 비디오 & Canvas (프레임 캡처용) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
          width="640"
          height="480"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width="72"
          height="72"


        {/* 연결 상태 표시 */}
        <div className="mb-4 flex items-center gap-2 justify-center">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          ></div>
          <span className="text-sm text-[#45947D] font-medium">
            {isConnected ? 'WebSocket 연결됨' : 'WebSocket 연결 중...'}
          </span>
        </div>

        {/* 연결 상태 */}
        <ConnectionStatus
          isConnected={isConnected}
        />

        {/* 에러 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 타이머 */}
        <MeditationTimer
          time={formatTime(meditationTime)}
        />

        {/* 얼굴 인식 */}
        <RecognitionArea
          videoStream={stream}
        />

        {/* 생체 데이터 */}
        <BiometricCards
          heartRate={
            biometricData.heartRate
          }
          lfHfRatio={
            biometricData.lfHfRatio
          }
        />
        {/* 생체 지표 카드 */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <DataCard 
            label="심박수" 
            value={biometricData.heartRate > 0 ? biometricData.heartRate : '-'} 
            unit="bpm" 
          />
          <DataCard 
            label="LF/HF" 
            value={biometricData.lfHfRatio > 0 ? biometricData.lfHfRatio : '-'}
            unit="ratio" 
          />
        </section>
        
        {/* 얼굴 감지 상태 */}
        <FaceStatus
          isFaceDetected={
            biometricData.isFaceDetected
          }
        />

        {/* 종료 버튼 */}
        <EndMeditationButton
          isRunning={isRunning}
          onClick={handleEndMeditation}
        />
      </main>
    </div>
  );
};

export default BreathingMonitor;