import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Waves } from 'lucide-react';

import type { RPPGStreamMessage } from '../api/meditation';

import {
  connectRPPGStream,
  sendFrameToWebSocket,
} from '../api/meditation';

import Header from '../components/BreathingGuide/Header';
import SessionPlayer from '../components/BreathingGuide/SessionPlayer';
import ConnectionStatus from '../components/BreathingMonitor/ConnectionStatus';
import MeditationTimer from '../components/BreathingMonitor/MeditationTimer';
import EndMeditationButton from '../components/BreathingMonitor/EndMeditationButton';
import CameraFrame from '../components/BreathingGuide/CameraFrame';

interface BiometricData {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

// BreathingFull.tsx와 거의 동일하지만 호흡 가이드 원(BreathingCircle)이 없는 버전.
// 콘텐츠(음성/음악)만 재생하면서 생체 데이터만 측정하고 싶을 때 사용 (호흡 페이싱 가이드 없음).
const BreathingContent: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const logId = searchParams.get('logId');

  // 상태
  const [biometricData, setBiometricData] =
    useState<BiometricData>({
      heartRate: 0,
      lfHfRatio: 0,
      isFaceDetected: false,
    });

  const [meditationTime, setMeditationTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const [isConnected, setIsConnected] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  // refs
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  // 명상 타이머 작동
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

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

        if (videoRef.current) {
          videoRef.current.srcObject =
            mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error(err);

        setError(
          '카메라 접근이 거부되었습니다.'
        );
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (
          videoRef.current
            .srcObject as MediaStream
        ).getTracks();

        tracks.forEach((track) =>
          track.stop()
        );
      }
    };
  }, []);

  // WebSocket 연결
  useEffect(() => {
    if (!logId || wsRef.current) return;

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

      setIsConnected(true);
    };

    const handleError = (e: Event) => {
      console.error(e);

      setIsConnected(false);
    };

    const ws = connectRPPGStream(
      parseInt(logId),
      handleMessage,
      handleError
    );

    wsRef.current = ws;

    const frameInterval = setInterval(() => {
      const video = videoRef.current;

      const canvas = canvasRef.current;

      if (
        video &&
        canvas &&
        video.readyState >= 2
      ) {
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const frameData =
            canvas.toDataURL(
              'image/jpeg',
              0.5
            );

          if (wsRef.current) {
            sendFrameToWebSocket(
              wsRef.current,
              frameData,
              Number(logId)
            );
          }
        }
      }
    }, 200);

    return () => {
      clearInterval(frameInterval);

      if (wsRef.current) {
        wsRef.current.close();

        wsRef.current = null;
      }

      setIsConnected(false);
    };
  }, [logId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleEndMeditation = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'END', totalDuration: meditationTime }));
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

  return (
    <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col relative overflow-hidden">

      {/* 숨겨진 video/canvas */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />

      <canvas
        ref={canvasRef}
        className="hidden"
        width="640"
        height="480"
      />

      {/* 헤더 */}
      <Header title="콘텐츠 재생" />

      {/* 우측 상단 미니 웹캠 칸 - BreathingGuide/BreathingFull과 동일 */}
      <div className="absolute top-24 right-6 w-20 h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg z-20 bg-black">
        <CameraFrame stream={stream} />
      </div>

      <main className="flex-1 flex flex-col px-5 pt-4 pb-5 w-full overflow-y-auto hide-scrollbar">
        <div>
          {/* 웹소켓 연결 상태 */}
          <ConnectionStatus isConnected={isConnected} />

          {/* 에러 */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 명상 시간 */}
          <MeditationTimer time={formatTime(meditationTime)} />

          {/* 호흡 가이드 원 없음 - 콘텐츠(음성/음악)만 재생하며 생체 데이터만 측정 */}

          {/* 실시간 생체 측정 패널 (지어낸 기능 없이 실제 측정값만, 기존 카드 스타일에 맞춤) */}
          {/* mt-12: 우측 상단 카메라(absolute, top-24 + h-28 = 하단 약 208px)와 겹치지 않도록 충분한 여백 확보 */}
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl mt-12 mb-5 shadow-sm overflow-hidden">
            <div className="flex">
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-[#45947D]" />
                  <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">심박수</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
                    {biometricData.heartRate || '-'}
                  </span>
                  <span className="text-xs font-medium text-slate-400">bpm</span>
                </div>
              </div>

              <div className="w-px bg-gray-100 dark:bg-white/10 my-4" />

              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Waves size={16} className="text-[#45947D]" />
                  <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">스트레스 지수</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
                    {biometricData.lfHfRatio || '-'}
                  </span>
                  <span className="text-xs font-medium text-slate-400">ratio</span>
                </div>
              </div>
            </div>

            {!biometricData.isFaceDetected && (
              <p className="text-xs text-gray-300 dark:text-white/30 text-center pb-3">
                얼굴을 프레임 안에 맞추면 측정이 시작돼요
              </p>
            )}
          </div>

          {/* 명상 종료 버튼 */}
          <EndMeditationButton
            isRunning={isRunning}
            isFaceDetected={biometricData.isFaceDetected}
            onClick={handleEndMeditation}
          />
        </div>
      </main>

      <SessionPlayer />
    </div>
  );
};

export default BreathingContent;
