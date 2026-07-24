interface MeditationTimerProps {
  time: string;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({
  time,
}) => {
  return (
    <div className="text-center mb-5">
      <p className="text-gray-500 text-xs mb-1">
        명상 시간
      </p>

      <p className="text-3xl font-bold text-[#1A4D43]">
        {time}
      </p>
    </div>
  );
};

export default MeditationTimer;