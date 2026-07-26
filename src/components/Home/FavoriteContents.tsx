import { Headphones, Music } from 'lucide-react';

export interface FavoriteItem {
  id: number;
  title: string;
  imageUrl: string;
  tag?: string;
}

interface FavoriteItemCardProps {
  item: FavoriteItem;
  onClick?: (item: FavoriteItem) => void;
}

const FavoriteItemCard: React.FC<FavoriteItemCardProps> = ({ item, onClick }) => {
  const TagIcon = item.tag === '음성 가이드' ? Headphones : Music;

  return (
    <div className="text-center group cursor-pointer" onClick={() => onClick?.(item)}>
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 ring-1 ring-black/5">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        {item.tag && (
          <div
            className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-secondary"
            aria-label={item.tag}
          >
            <TagIcon size={12} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="text-xs font-bold text-secondary truncate">{item.title}</p>
    </div>
  );
};

interface FavoriteContentsProps {
  items?: FavoriteItem[];
  onMoreClick?: () => void;
  onItemClick?: (item: FavoriteItem) => void;
}

const defaultItems: FavoriteItem[] = [
  {
    id: 1,
    title: '집중력 향상',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAtotyUOYsYjvDm3dvxslvOi8n2EGa5B9wFkcMiL1_Q97SRNakWuecQJ0T0KXRoslOcu8oKP998qftmz_Wr6RZsHVKRfyj6rlpxoX82RU9kNXaSKwuDp3tkAkxXpmZdFiCACGtFQpdcPc_cE6ehHLAkZzPbyCyjPPR4vNZilEFNUKIK1oJQinvW-kXkYcd8spiW4X1gtw1MnJvQkDwvi_vXLd_ADCL8Bgkycm0RVHvqOeM3iQv5Oq0lBVorbPOg09ECGgw3fPT4-E7',
  },
  {
    id: 2,
    title: '편안한 잠자리',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMrJpeJ_glnUgLyayWffCCS3lqX4U02cC1rxX5Uyi5YI6o6ASFMcWT9GuEZggpxCCP64uUyJAE6EJ0x3gCkqEd5mL4qj9K07Gw1SrJnhFx6AortQgYMx1YYGLPFtXe12sgUpa_D1Eejoqz9EdRuUUoxilZtQNeGxFlOFQO2sy-KncTQUL1AIxI137hVhwYBjRp-K0zg0axI_OfuTC1oMcjTYpKXW5bFyOKkH_g2dHxqNDidA0TCgQ1GyQQggWiHbe-lXFCllNkaAtu',
  },
  {
    id: 3,
    title: '스트레스 해소',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFl04oEf-6kGTknyHrQ1inAXLzzU1bs2ceIl0S0vn4TqvxzqwNelwFIelKT3JTHBhm-n2xbfsYwj7CSNDVkZXtUrjxzEeEYqlWtU-4Xv1TOoFQMIVZ7ec4JkPGnhTQT2OSQjXFVuj0btouvZYzRvHk2Sv53IB0P1ygxoagBr7hOiTUbSCXpGFm6HEEWDdWb8EisOnkOk_9F_3GGiVDlzmG9lHqnNsK7FfI6SGnSQ6zC5CV6jWny89bcEO6AoM0JC7T60sNJClBdDpB',
  },
];

const FavoriteContents: React.FC<FavoriteContentsProps> = ({
  items = defaultItems,
  onMoreClick,
  onItemClick,
}) => {
  return (
    <section className="px-5 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg tracking-tight">좋아요한 콘텐츠</h2>
        <button onClick={onMoreClick}>
             {/* 🚀 text-[#45947D] 클래스를 추가하여 초록색으로 변경 */}
             <span className="material-symbols-outlined text-base text-[#45947D]">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <FavoriteItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
};

export default FavoriteContents;