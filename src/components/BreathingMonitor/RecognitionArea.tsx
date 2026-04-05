import { useEffect, useRef } from 'react';

const RecognitionArea: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Camera initialized in RecognitionArea');
        }
      } catch (err) {
        console.error('Failed to access camera:', err);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <section className="relative mb-12">
      <div className="relative w-72 h-72 mx-auto overflow-hidden rounded-[40px] border-4 border-[#45947D] shadow-2xl shadow-[#6BE6C1]/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#45947D] shadow-[0_0_15px_#6BE6C1] animate-pulse"></div>

        <div className="absolute inset-6 border-2 border-[#45947D]/40 rounded-3xl"></div>
      </div>

      <p className="text-center text-sm mt-6 text-[#45947D] dark:text-[#6BE6C1] font-semibold tracking-wide">
        안면 인식 유지 중...
      </p>
    </section>
  );
};

export default RecognitionArea;