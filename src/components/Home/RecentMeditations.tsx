import { Headphones, Music } from 'lucide-react';

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

const MeditationCard: React.FC<MeditationCardProps> = ({ item, onClick }) => {
  const TagIcon = item.tag === '음성 가이드' ? Headphones : Music;

  return (
    <div
      className="flex-shrink-0 w-32 cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 shadow-sm">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-secondary"
          aria-label={item.tag}
        >
          <TagIcon size={12} strokeWidth={2} />
        </div>
      </div>
      <h3 className="font-bold text-sm leading-tight px-0.5 mb-0.5 truncate">{item.title}</h3>
      <p className="text-xs text-secondary px-0.5">{item.duration}</p>
    </div>
  );
};

interface RecentMeditationsProps {
  items?: MeditationItem[];
  onViewAll?: () => void;
  onItemClick?: (item: MeditationItem) => void;
}

const defaultItems: MeditationItem[] = [
  {
    id: 1,
    title: '아침을 시작하는 긍정 명상',
    duration: '10 min',
    tag: '음성 가이드',
    imageUrl: '/images/medi4.jpg',
  },
  {
    id: 4,
    title: '집중력 향상 사운드스케이프',
    duration: '25 min',
    tag: '명상 음악',
    imageUrl: '/images/medi5.jpg',
  },
  {
    id: 2,
    title: '깊은 잠을 위한 수면 유도',
    duration: '15 min',
    tag: '명상 음악',
    imageUrl:
        '/images/medi6.jpg'  },
];

const RecentMeditations: React.FC<RecentMeditationsProps> = ({
  items = defaultItems,
  onViewAll,
  onItemClick,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center px-5">
        <h2 className="font-bold text-lg tracking-tight">최근에 들은 명상</h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-secondary flex items-center gap-0.5"
        >

          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>
      <div className="flex overflow-x-auto px-5 gap-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <MeditationCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
};

export default RecentMeditations;
