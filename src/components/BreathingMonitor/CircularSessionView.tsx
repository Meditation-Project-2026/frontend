import { useEffect, useRef } from 'react';

interface CircularSessionViewProps {
  videoStream: MediaStream | null;
  isFaceDetected: boolean;
  time: string;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularSessionView: React.FC<CircularSessionViewProps> = ({ videoStream, isFaceDetected, time }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2">
      <div className="relative w-[190px] h-[190px]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="currentColor" className="text-primary/15" strokeWidth="6" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            className={isFaceDetected ? 'text-primary' : 'text-red-400/60'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * 0.25}
          />
        </svg>

        <div className="absolute inset-[10px] rounded-full overflow-hidden bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      </div>

      <p className="text-3xl font-bold text-white mt-5 tabular-nums">{time}</p>
      <p className="text-xs text-white/40 mt-1">명상 시간</p>
    </div>
  );
};

export default CircularSessionView;
