import type { MeditationContent } from '../../types/content';
import ContentCard from './ContentCard';

interface ContentListProps {
  items: MeditationContent[];
  onItemClick?: (id: number) => void;
  onLikeToggle?: (id: number) => void;
}

const ContentList: React.FC<ContentListProps> = ({ items, onItemClick, onLikeToggle }) => {
  if (items.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-gray-400 dark:text-[#F5F3EF]/40">조건에 맞는 콘텐츠가 없어요.</p>;
  }

  return (
    <div className="px-5 flex flex-col gap-3">
      {items.map((item) => (
        <ContentCard key={item.id} content={item} onClick={onItemClick} onLikeToggle={onLikeToggle} />
      ))}
    </div>
  );
};

export default ContentList;
