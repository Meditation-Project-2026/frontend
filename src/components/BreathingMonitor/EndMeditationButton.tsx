interface EndMeditationButtonProps {
  isRunning: boolean;
  onClick: () => void;
}

const EndMeditationButton: React.FC<
  EndMeditationButtonProps
> = ({ isRunning, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isRunning}
      className={`w-full py-4 px-4 rounded-2xl font-bold text-lg transition-all ${
        isRunning
          ? 'bg-[#6BE6C1] text-[#0F172A] active:scale-95'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      명상 종료
    </button>
  );
};

export default EndMeditationButton;