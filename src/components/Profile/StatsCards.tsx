import { Leaf } from 'lucide-react';
import type { ProfileStats } from '../../types/content';

interface StatsCardsProps {
  stats: ProfileStats;
}

const formatTotalTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="px-5 flex flex-col gap-2.5 mt-4">
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-2xl p-4">
        <Leaf size={16} className="text-primary" strokeWidth={1.8} />
        <div>
          <p className="text-xs text-gray-500">총 명상 횟수</p>
          <p className="text-xl font-bold text-accent">{stats.totalSessions}회</p>
        </div>
      </div>

      <div className="flex gap-2.5">
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3.5">
          <p className="text-lg font-bold text-accent">{stats.longestStreakDays}일</p>
          <p className="text-xs text-gray-400">최장 연속 수행</p>
        </div>
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-3.5">
          <p className="text-lg font-bold text-accent">{formatTotalTime(stats.totalMinutes)}</p>
          <p className="text-xs text-gray-400">총 명상시간</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
