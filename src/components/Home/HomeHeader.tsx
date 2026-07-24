interface HomeHeaderProps {
  greeting?: string;
  userName?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  greeting = '좋은 저녁이에요',
  userName = '재석님',
}) => {
  return (
    <header className="pt-6 px-5 pb-5 flex justify-between items-center">
      <div className="space-y-1">
        <p className="text-xs text-[#45947D] font-medium tracking-tight">안녕하세요</p>
        <h1 className="text-lg font-bold tracking-tight text-[#1A4D43]">
          {greeting}, {userName}
        </h1>
      </div>
      <div className="flex gap-2">
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100/50">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
        </button>
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100/50 relative">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 bg-accent rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;