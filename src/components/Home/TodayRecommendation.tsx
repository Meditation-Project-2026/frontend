interface TodayRecommendationProps {
  title: string;
  tag: string;
  onPlay: () => void;
}

const TodayRecommendation: React.FC<TodayRecommendationProps> = ({ title, tag, onPlay }) => {
  return (
    <div className="px-5 -mt-3 relative z-10">
      <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5 shadow-md">
        <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-1">오늘의 추천</p>
        <p className="text-xs text-gray-400 dark:text-white/40 mb-4">{title}</p>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#1E8F6B] dark:text-primary bg-primary/15 rounded-full px-3 py-1.5">
            {tag}
          </span>
          <button
            onClick={onPlay}
            aria-label="명상 시작"
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined filled text-accent text-[20px]">play_arrow</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayRecommendation;
