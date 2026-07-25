import React, { useEffect, useRef } from 'react';

interface CameraFrameProps {
  stream: MediaStream | null;
}

const CameraFrame: React.FC<CameraFrameProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  );
};

export default CameraFrame;