import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { RPPGStreamMessage } from '../api/meditation';

import {
  connectRPPGStream,
  sendFrameToWebSocket,
} from '../api/meditation';

import Header from '../components/BreathingGuide/Header';
import BreathingCircle from '../components/BreathingGuide/BreathingCircle';
import StatusCards from '../components/BreathingGuide/StatusCards';
import CameraFrame from '../components/BreathingGuide/CameraFrame';
import MeditationTimer from '../components/BreathingMonitor/MeditationTimer';

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

    // 프레임 전송
    const frameInterval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (
        video &&
        (video.paused || video.ended)
      ) {
        video
          .play()
          .catch((e) =>
            console.error('Play failed:', e)
          );
      }

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
      console.log('Cleaning up WebSocket...');

      clearInterval(frameInterval);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      setIsConnected(false);
    };
  }, [logId]);

  // 종료
  const handleEndMeditation = () => {
    setIsRunning(false);

    if (wsRef.current) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'END',
            totalDuration: meditationTime,
          })
        );
      } catch (e) {
        console.warn(
          '명상 시간 전송 실패:',
          e
        );
      }

      wsRef.current.close();
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
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0F172A] flex flex-col relative">

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
      <Header />

      <div
        className="
          absolute
          top-24
          right-6
          w-20
          h-28
          rounded-2xl
          overflow-hidden
          border-2
          border-white
          dark:border-slate-700
          shadow-lg
          z-20
          bg-black
        "
      >
        <CameraFrame />
      </div>

      <main className="overflow-y-auto px-6 pb-20">

        {/* 연결 상태 */}
        <div className="m-6 flex items-center gap-2 justify-center">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500'
            }`}
          />

          <span className="text-sm text-[#45947D] font-medium">
            {isConnected
              ? 'WebSocket 연결됨'
              : 'WebSocket 연결 중...'}
          </span>
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 명상 타이머 */}
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-[#1A4D43]">
            <MeditationTimer
                  time={formatTime(meditationTime)}
                />
          </h2>
        </div>

        {/* 호흡 원 */}
        <BreathingCircle />

        {/* 상태 카드 */}
        <StatusCards
          heartRate={biometricData.heartRate}
          lfHfRatio={biometricData.lfHfRatio}
        />

        <button
          onClick={handleEndMeditation}
          className="w-full py-4 rounded-2xl bg-[#6BE6C1] text-[#0F172A] font-bold text-lg"
        >
          명상 종료하기
        </button>

      </main>
      
    </div>
  );
};

export default BreathingGuide;