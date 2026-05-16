interface FaceStatusProps {
  isFaceDetected: boolean;
}

const FaceStatus: React.FC<FaceStatusProps> = ({
  isFaceDetected,
}) => {
  return (
    <div className="text-center mb-6 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800">
      <span
        className={`text-sm font-bold ${
          isFaceDetected
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      >
        {isFaceDetected
          ? '✓ 얼굴 감지됨'
          : '✗ 얼굴 감지 안 됨'}
      </span>
    </div>
  );
};

export default FaceStatus;