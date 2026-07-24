import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { RPPGStreamMessage } from '../api/meditation';

import {
  connectRPPGStream,
  sendFrameToWebSocket,
} from '../api/meditation';

import Header from '../components/BreathingGuide/Header';
import BreathingCircle from '../components/BreathingGuide/BreathingCircle';
import StatusCards from '../components/BreathingGuide/StatusCards';
import SessionPlayer from '../components/BreathingGuide/SessionPlayer';
import CameraFrame from '../components/BreathingGuide/CameraFrame';

interface BiometricData {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

const BreathingFull: React.FC = () => {

  const [searchParams] = useSearchParams();

  const logId = searchParams.get('logId');

  // 상태
  const [biometricData, setBiometricData] =
    useState<BiometricData>({
      heartRate: 0,
      lfHfRatio: 0,
      isFaceDetected: false,
    });

  const [isConnected, setIsConnected] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // refs
  const wsRef = useRef<WebSocket | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

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

  return (
    <div className="min-h-[100svh] bg-[#F6F8FA] dark:bg-[#0F172A] flex flex-col relative overflow-hidden">

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

      <main className="flex-1 overflow-y-auto hide-scrollbar flex flex-col justify-center px-5 pb-6">

        {/* 연결 상태 */}
        <div className="mb-4 flex items-center gap-2 justify-center">
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

        {/* 호흡 원 */}
        <BreathingCircle />

        {/* 상태 카드 */}
        <StatusCards
          heartRate={biometricData.heartRate}
          lfHfRatio={biometricData.lfHfRatio}
        />

      </main>

      

      <SessionPlayer />
      
    </div>
  );
};

export default BreathingFull;