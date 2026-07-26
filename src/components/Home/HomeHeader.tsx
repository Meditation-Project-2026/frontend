interface HomeHeaderProps {
  userName?: string;
}

// 시간대에 따라 인사말을 자동으로 바꿔준다 (05~11시: 아침, 11~17시: 오후, 17~05시: 저녁)
const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '좋은 아침이에요';
  if (hour >= 12 && hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
};

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName = 'BioCalm' }) => {
  const timeGreeting = getTimeGreeting();

  return (
    <header className="bg-accent dark:bg-[#1E212B] rounded-b-[28px] pt-6 pb-7 px-5 flex justify-between items-start">
      <div>
        <p className="text-xs text-white/50 font-medium">안녕하세요</p>
        <h1 className="text-lg font-bold tracking-tight text-white mt-1">
          {timeGreeting}, {userName}님
        </h1>
      </div>
      <button className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined text-[18px]">notifications</span>
      </button>
    </header>
  );
};

export default HomeHeader;
