import type { RefObject } from 'react';

interface HiddenCameraProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const HiddenCamera: React.FC<HiddenCameraProps> = ({
  videoRef,
  canvasRef,
}) => {
  return (
    <>
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
        width="640"
        height="480"
      />
    </>
  );
};

export default HiddenCamera;