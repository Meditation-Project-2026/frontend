import { useState } from 'react';

// 실적/횟수를 강조하지 않고, 매번 다른 잔잔한 문구를 보여주는 웰컴 카드.
// StatsCards가 이미 숫자(총 명상/연속/시간)를 보여주고 있어서, 여기서는 순수하게 인사말만.
const MESSAGES = [
  '오늘도 편안한 하루를 보내세요.',
  '오늘도 나를 위한 10분 어떠세요?',
  '잠시 멈추고 숨 쉬어도 괜찮아요.',
  '오늘도 잠시 쉬어가세요.',
  '천천히, 나만의 속도로 괜찮아요.',
];

interface TodayMessageCardProps {
  userName?: string;
}

const TodayMessageCard: React.FC<TodayMessageCardProps> = () => {
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  return (
    <div className="px-5 -mt-6 relative z-10">
      <div className="bg-gray-50 dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl px-4 py-3.5 flex flex-col justify-center gap-0.5 min-h-[64px]">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40">오늘의 한 줄</p>
        <p className="text-sm font-medium text-accent dark:text-[#F5F3EF]">{message}</p>
      </div>
    </div>
  );
};

export default TodayMessageCard;
