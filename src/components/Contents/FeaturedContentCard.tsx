interface FeaturedContentCardProps {
  label: string;
  title: string;
  subtitle: string;
  minutes: number;
  onPlay: () => void;
}

const FeaturedContentCard: React.FC<FeaturedContentCardProps> = ({ label, title, subtitle, minutes, onPlay }) => {
  return (
    <div className="mx-5 mt-4 bg-accent dark:bg-[#1E212B] rounded-2xl p-5">
      <p className="text-[11px] font-bold text-primary mb-1.5">{minutes}분 · {label}</p>
      <p className="text-base font-bold text-white dark:text-[#F5F3EF] mb-1">{title}</p>
      <p className="text-xs text-white/50 dark:text-white/40 mb-4">{subtitle}</p>
      <button
        onClick={onPlay}
        aria-label="재생"
        className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
      >
        <span className="material-symbols-outlined filled text-accent text-[16px]">play_arrow</span>
      </button>
    </div>
  );
};

export default FeaturedContentCard;
