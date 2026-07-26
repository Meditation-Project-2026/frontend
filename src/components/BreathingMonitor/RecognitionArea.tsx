import { useEffect, useRef } from 'react';

interface RecognitionAreaProps {
  videoStream: MediaStream | null; // 부모로부터 스트림을 받습니다.
  isFaceDetected: boolean;
}

const RecognitionArea: React.FC<RecognitionAreaProps> = ({ videoStream, isFaceDetected }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream; // 부모가 준 스트림을 그대로 연결
    }
  }, [videoStream]);

  return (
    <section className="relative mb-6">
      <div className="relative w-56 h-56 mx-auto overflow-hidden rounded-3xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <p
        className={`text-center text-xs mt-4 font-semibold tracking-wide ${
          isFaceDetected ? 'text-[#1E8F6B] dark:text-primary' : 'text-red-500 dark:text-red-400'
        }`}
      >
        {isFaceDetected ? '✓ 안면 인식 중' : '✕ 얼굴을 프레임 안에 맞춰주세요'}
      </p>
    </section>
  );
};

export default RecognitionArea;