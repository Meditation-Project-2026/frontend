interface FeedbackCardProps {
  title: string;
  value: number;
  unit: string;
  change: string;
  start: { val: number; percent: string };
  end: { val: number; percent: string };
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, value, unit, change, start, end }) => {
  // change 문자열의 부호(-)로 개선/악화 판단 -> 색상 결정
  const isImprovement = !change.trim().startsWith('-');

  return (
    <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
      <p className="text-xs text-gray-400 dark:text-white/50 mb-1">{title}</p>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">{value}</span>
        <span className="text-xs font-medium text-gray-400 dark:text-white/40">{unit}</span>
        <span
          className={`flex items-center gap-0.5 text-xs font-bold ${
            isImprovement ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {isImprovement ? '↓' : '↑'} {change.replace('-', '')}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 text-[10px] text-gray-300 dark:text-white/30 shrink-0">초반</span>
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gray-300 dark:bg-white/25 rounded-full" style={{ width: start.percent }} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 dark:text-white/40 w-7 text-right shrink-0">{start.val}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-7 text-[10px] text-gray-300 dark:text-white/30 shrink-0">후반</span>
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#45947D] dark:bg-primary rounded-full" style={{ width: end.percent }} />
          </div>
          <span className="text-[11px] font-bold text-[#45947D] dark:text-primary w-7 text-right shrink-0">{end.val}</span>
        </div>
      </div>
    </div>
  );
};
