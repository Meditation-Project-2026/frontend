import { Heart } from 'lucide-react';
import type { MeditationContent } from '../../types/content';

interface ContentCardProps {
  content: MeditationContent;
  onClick?: (id: number) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  return (
    <button
      onClick={() => onClick?.(content.id)}
      className="w-full flex items-start justify-between gap-3 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07]
                 rounded-2xl p-4 text-left"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] leading-snug mb-2">{content.title}</p>
        <p className="text-xs text-gray-400 dark:text-[#F5F3EF]/40">
          {content.minutes} min · by {content.author}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <div
          className="w-[76px] h-[76px] rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        />
        <span className="flex items-center gap-1 bg-black/30 border border-white/20 rounded-full px-2.5 py-1 text-[11px] font-bold text-primary">
          <Heart size={11} strokeWidth={0} fill="currentColor" />
          {content.likes}
        </span>
      </div>
    </button>
  );
};

export default ContentCard;
