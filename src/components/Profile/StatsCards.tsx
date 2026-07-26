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
    <div className="px-5 flex gap-2.5 mt-5">
      <div className="flex-1 bg-[#D9F2E6] dark:bg-primary/10 rounded-2xl p-3.5 text-center">
        <p className="text-lg font-bold text-accent dark:text-[#F5F3EF]">{stats.totalSessions}회</p>
        <p className="text-[10px] text-[#3F6D57] dark:text-white/45 mt-1">총 명상</p>
      </div>
      <div className="flex-1 bg-[#FFE8CC] dark:bg-white/[0.06] rounded-2xl p-3.5 text-center">
        <p className="text-lg font-bold text-accent dark:text-[#F5F3EF]">{stats.longestStreakDays}일</p>
        <p className="text-[10px] text-[#8A5A16] dark:text-white/45 mt-1">최장 연속</p>
      </div>
      <div className="flex-1 bg-[#E4E8FA] dark:bg-white/[0.06] rounded-2xl p-3.5 text-center">
        <p className="text-lg font-bold text-accent dark:text-[#F5F3EF]">{formatTotalTime(stats.totalMinutes)}</p>
        <p className="text-[10px] text-[#3D3F80] dark:text-white/45 mt-1">총 시간</p>
      </div>
    </div>
  );
};

export default StatsCards;
