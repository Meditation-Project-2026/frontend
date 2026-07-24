import { useEffect, useRef } from 'react';

interface RecognitionAreaProps {
  videoStream: MediaStream | null; // 부모로부터 스트림을 받습니다.
}

const RecognitionArea: React.FC<RecognitionAreaProps> = ({ videoStream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream; // 부모가 준 스트림을 그대로 연결
    }
  }, [videoStream]);

  return (
    <section className="relative mb-6">
      <div className="relative w-56 h-56 mx-auto overflow-hidden rounded-3xl border-4 border-[#45947D] shadow-2xl shadow-[#6BE6C1]/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />


        <div className="absolute inset-4 border-2 border-[#45947D]/40 rounded-2xl"></div>
      </div>

      <p className="text-center text-xs mt-4 text-[#45947D] dark:text-[#6BE6C1] font-semibold tracking-wide">
        안면 인식 유지 중...
      </p>
    </section>
  );
};

export default RecognitionArea;