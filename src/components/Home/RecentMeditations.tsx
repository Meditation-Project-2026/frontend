export interface MeditationItem {
  id: number;
  title: string;
  duration: string;
  tag: string;
  imageUrl: string;
}

interface MeditationCardProps {
  item: MeditationItem;
  onClick?: (item: MeditationItem) => void;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ item, onClick }) => (
  <div
    className="flex-shrink-0 w-40 cursor-pointer"
    onClick={() => onClick?.(item)}
  >
    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-3 shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-secondary">
        {item.tag}
      </div>
    </div>
    <h3 className="font-bold text-[14px] leading-tight px-1 mb-1 truncate">{item.title}</h3>
    <p className="text-[11px] text-secondary px-1">{item.duration}</p>
  </div>
);

interface RecentMeditationsProps {
  items?: MeditationItem[];
  onViewAll?: () => void;
  onItemClick?: (item: MeditationItem) => void;
}

const defaultItems: MeditationItem[] = [
  {
    id: 1,
    title: '10분 아침 명상',
    duration: '10 min',
    tag: '음성 가이드',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFl04oEf-6kGTknyHrQ1inAXLzzU1bs2ceIl0S0vn4TqvxzqwNelwFIelKT3JTHBhm-n2xbfsYwj7CSNDVkZXtUrjxzEeEYqlWtU-4Xv1TOoFQMIVZ7ec4JkPGnhTQT2OSQjXFVuj0btouvZYzRvHk2Sv53IB0P1ygxoagBr7hOiTUbSCXpGFm6HEEWDdWb8EisOnkOk_9F_3GGiVDlzmG9lHqnNsK7FfI6SGnSQ6zC5CV6jWny89bcEO6AoM0JC7T60sNJClBdDpB',
  },
  {
    id: 2,
    title: '깊은 수면을 위한 소리',
    duration: '25 min',
    tag: '명상 음악',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAtotyUOYsYjvDm3dvxslvOi8n2EGa5B9wFkcMiL1_Q97SRNakWuecQJ0T0KXRoslOcu8oKP998qftmz_Wr6RZsHVKRfyj6rlpxoX82RU9kNXaSKwuDp3tkAkxXpmZdFiCACGtFQpdcPc_cE6ehHLAkZzPbyCyjPPR4vNZilEFNUKIK1oJQinvW-kXkYcd8spiW4X1gtw1MnJvQkDwvi_vXLd_ADCL8Bgkycm0RVHvqOeM3iQv5Oq0lBVorbPOg09ECGgw3fPT4-E7',
  },
  {
    id: 3,
    title: '숲속의 아침',
    duration: '15 min',
    tag: '힐링 사운드',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMrJpeJ_glnUgLyayWffCCS3lqX4U02cC1rxX5Uyi5YI6o6ASFMcWT9GuEZggpxCCP64uUyJAE6EJ0x3gCkqEd5mL4qj9K07Gw1SrJnhFx6AortQgYMx1YYGLPFtXe12sgUpa_D1Eejoqz9EdRuUUoxilZtQNeGxFlOFQO2sy-KncTQUL1AIxI137hVhwYBjRp-K0zg0axI_OfuTC1oMcjTYpKXW5bFyOKkH_g2dHxqNDidA0TCgQ1GyQQggWiHbe-lXFCllNkaAtu',
  },
];

const RecentMeditations: React.FC<RecentMeditationsProps> = ({
  items = defaultItems,
  onViewAll,
  onItemClick,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center px-6">
        <h2 className="font-bold text-lg tracking-tight">최근에 들은 명상</h2>
        <button
          onClick={onViewAll}
          className="text-[12px] font-semibold text-secondary flex items-center gap-0.5"
        >
          전체보기
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
      <div className="flex overflow-x-auto px-6 gap-4">
        {items.map((item) => (
          <MeditationCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
};

export default RecentMeditations;