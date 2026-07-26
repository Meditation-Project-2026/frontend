interface HomeHeaderProps {
  greeting?: string;
  userName?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  greeting = '좋은 저녁이에요',
  userName = 'BioCalm',
}) => {
  return (
    <header className="pt-6 px-5 pb-5 flex justify-between items-center">
      <div className="space-y-1">
        <p className="text-xs text-[#45947D] font-medium tracking-tight">안녕하세요</p>
        <h1 className="text-lg font-bold tracking-tight text-[#191B1F] dark:text-[#F5F3EF]">
          {greeting}, {userName}
        </h1>
      </div>
      <div className="flex gap-2">
        <button className="w-9 h-9 rounded-full bg-white dark:bg-[#1E212B] flex items-center justify-center text-primary shadow-sm border border-gray-100/50 dark:border-white/[0.07]">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;