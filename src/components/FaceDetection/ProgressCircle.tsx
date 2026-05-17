'react';

interface ProgressCircleProps {
  percentage: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full mb-auto">
      <div className="relative w-20 h-20 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-gray-200 dark:text-[#45947D]/30 stroke-current" 
            cx="50" cy="50" r={radius} strokeWidth="8" fill="transparent"
          />
          <circle 
            className="text-[#45947D] stroke-current progress-ring__circle" 
            cx="50" cy="50" r={radius} strokeWidth="8" fill="transparent"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-sm font-bold text-[#1A4D43] dark:text-white">{percentage}%</span>
        </div>
      </div>
      <p className="text-[#45947D] dark:text-[#6BE6C1] font-medium text-base animate-pulse">
        {percentage >= 100 ? '얼굴 감지 완료' : '얼굴을 감지 중입니다...'}
      </p>
    </div>
  );
};

export default ProgressCircle;