import { Heart, Headphones, Music } from 'lucide-react';
import type { MeditationContent } from '../../types/content';

interface ContentCardProps {
  content: MeditationContent;
  onClick?: (id: number) => void;
  onLikeToggle?: (id: number) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick, onLikeToggle }) => {
  const TagIcon = content.tag === '음성 가이드' ? Headphones : Music;

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
          className="relative w-[76px] h-[76px] rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        >
          <div
            className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-secondary"
            aria-label={content.tag}
          >
            <TagIcon size={11} strokeWidth={2} />
          </div>
        </div>
        <span
          role="button"
          aria-label={content.isLiked ? '좋아요 취소' : '좋아요'}
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle?.(content.id);
          }}
          className={`flex items-center gap-1 border rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
            content.isLiked
              ? 'bg-black/30 border-white/20 text-primary'
              : 'bg-black/10 border-white/10 text-white/50'
          }`}
        >
          <Heart size={11} strokeWidth={content.isLiked ? 0 : 2} fill={content.isLiked ? 'currentColor' : 'none'} />
          {content.likes}
        </span>
      </div>
    </button>
  );
};

export default ContentCard;
