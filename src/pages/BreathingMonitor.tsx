import { useEffect, useRef, useState } from 'react';
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
import EndMeditationButton from '../components/BreathingMonitor/EndMeditationButton';

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

  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 0,
    lfHfRatio: 0,
    isFaceDetected: false,
  });
  const [meditationTime, setMeditationTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(err);
        setError('카메라를 시작하지 못했습니다.');
      }
    };

    initCamera();

    return () => {
      mounted = false;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

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

  useEffect(() => {
    if (!logId || wsRef.current) return;

    const handleMessage = (data: RPPGStreamMessage) => {
      setBiometricData({
        heartRate: Math.round(data.heartRate * 10) / 10,
        lfHfRatio: Math.round(data.lfHfRatio * 100) / 100,
        isFaceDetected: data.isFaceDetected,
      });

      setIsConnected(true);
    };

    const handleError = (e: Event) => {
      console.error('WebSocket error:', e);
      setIsConnected(false);
    };

    const ws = connectRPPGStream(parseInt(logId), handleMessage, handleError);
    wsRef.current = ws;

    let cancelled = false;
    const captureFrame = () => {
      if (cancelled) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx && wsRef.current?.readyState === WebSocket.OPEN) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          sendFrameToWebSocket(wsRef.current, canvas.toDataURL('image/jpeg', 0.5), Number(logId));
        }
      }

      setTimeout(captureFrame, frameIntervalMs);
    };

    const timer = setTimeout(captureFrame, frameIntervalMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      setIsConnected(false);
    };
  }, [logId, frameIntervalMs]);

  const stopCameraNow = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  };

  const handleEndMeditation = () => {
    setIsRunning(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'END', totalDuration: meditationTime }));
      } catch (e) {
        console.warn('명상 종료 메시지 전송 실패:', e);
      }

      wsRef.current.close();
      wsRef.current = null;
    }

    stopCameraNow();

    localStorage.setItem('lastMeditationTime', meditationTime.toString());

    setTimeout(() => {
      navigate(`/meditation-feedback?logId=${logId}`);
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
      <Header title="명상 모니터링" onBack={() => navigate(-1)} />

      <main className="flex-1 flex flex-col gap-4 px-5 pt-2 pb-5 max-w-2xl mx-auto w-full overflow-y-auto hide-scrollbar">
        <video ref={videoRef} autoPlay playsInline muted className="hidden" width="640" height="480" />
        <canvas ref={canvasRef} className="hidden" width="72" height="72" />

        <div>
          <ConnectionStatus isConnected={isConnected} />

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <MeditationTimer time={formatTime(meditationTime)} />

          <RecognitionArea videoStream={stream} isFaceDetected={biometricData.isFaceDetected} />

          <BiometricCards heartRate={biometricData.heartRate} lfHfRatio={biometricData.lfHfRatio} />
        </div>

        <div className="space-y-3 w-full">
          <EndMeditationButton
            isRunning={isRunning}
            isFaceDetected={biometricData.isFaceDetected}
            onClick={handleEndMeditation}
          />
        </div>
      </main>
    </div>
  );
};

export default BreathingMonitor;
