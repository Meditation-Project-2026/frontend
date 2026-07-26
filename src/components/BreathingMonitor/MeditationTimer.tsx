interface MeditationTimerProps {
  time: string;
  inverted?: boolean;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({
  time,
  inverted = false,
}) => {
  return (
    <div className="text-center mb-5">
      <p className={`text-xs mb-1 ${inverted ? 'text-white/50' : 'text-gray-500 dark:text-[#F5F3EF]/50'}`}>
        명상 시간
      </p>

      <p className={`text-3xl font-bold ${inverted ? 'text-white' : 'text-[#191B1F] dark:text-[#F5F3EF]'}`}>
        {time}
      </p>
    </div>
  );
};

export default MeditationTimer;