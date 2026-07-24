interface FaceStatusProps {
  isFaceDetected: boolean;
}

const FaceStatus: React.FC<FaceStatusProps> = ({
  isFaceDetected,
}) => {
  return (
    <div
      className={`w-full py-3.5 px-5 rounded-2xl border-2 bg-white dark:bg-zinc-900 text-center font-bold text-sm shadow-sm transition-all duration-300 ${
        isFaceDetected
          ? 'border-[#45947D] text-[#45947D]'
          : 'border-red-200 text-red-500'
      }`}
    >
      {isFaceDetected ? '✓ 얼굴 감지됨' : '✕ 얼굴 감지 안 됨'}
    </div>
  );
};

export default FaceStatus;