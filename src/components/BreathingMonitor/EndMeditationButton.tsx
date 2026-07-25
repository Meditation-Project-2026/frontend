interface EndMeditationButtonProps {
  isRunning: boolean;
  isFaceDetected: boolean;
  onClick: () => void;
}

const EndMeditationButton: React.FC<
  EndMeditationButtonProps
> = ({ isRunning, isFaceDetected, onClick }) => {
  const enabled = isRunning && isFaceDetected;

  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={`w-full py-4 px-4 rounded-2xl font-bold text-lg transition-all ${
        enabled
          ? 'bg-[#6BE6C1] text-[#0F172A] active:scale-95'
          : 'bg-gray-300 dark:bg-[#1E212B] text-gray-500 dark:text-[#F5F3EF]/30 cursor-not-allowed'
      }`}
    >
      명상 종료
    </button>
  );
};

export default EndMeditationButton;