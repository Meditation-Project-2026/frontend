import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Play, Pause, Heart } from 'lucide-react';
import { useContents } from '../contexts/ContentsContext';

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const ContentDetail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get('id'));
  const { contents } = useContents();

  const content = contents.find((item) => item.id === id);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(content?.likes ?? 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [content?.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => c + (next ? 1 : -1));
      return next;
    });
  };

  if (!content) {
    return (
      <div className="min-h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
        <div className="px-5 pt-5">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#1E212B] flex items-center justify-center text-accent dark:text-[#F5F3EF]"
          >
            <ChevronLeft size={17} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-sm text-gray-400 dark:text-white/40">콘텐츠를 찾을 수 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
      {content.audioUrl && <audio ref={audioRef} src={content.audioUrl} />}

      {/* 상단 히어로: 배경 이미지 + 어두운 그라디언트 오버레이 위에 제목 표시 */}
      <div
        className="relative h-44 bg-cover bg-center flex flex-col justify-between p-3.5 shrink-0"
        style={{ backgroundImage: `url(${content.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="relative w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="relative">
          <p className="text-[11px] font-bold text-primary mb-1">
            {content.minutes ? `${content.minutes}분 · ` : ''}
            {content.tag}
          </p>
          <p className="text-lg font-bold text-white leading-snug">{content.title}</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-4">
        {/* 부제 + 좋아요 */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-white/40">by {content.author}</p>
          <button onClick={toggleLike} aria-label="좋아요" className="flex items-center gap-1">
            <Heart
              size={17}
              className={liked ? 'text-[#E24B6B]' : 'text-gray-300 dark:text-white/25'}
              fill={liked ? '#E24B6B' : 'none'}
              strokeWidth={1.8}
            />
            <span className="text-xs text-gray-400 dark:text-white/40">{likeCount}</span>
          </button>
        </div>

        {/* 재생 버튼 + 정보 */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? '일시정지' : '재생'}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            {isPlaying ? (
              <Pause size={22} className="text-accent" fill="currentColor" />
            ) : (
              <Play size={22} className="text-accent" fill="currentColor" />
            )}
          </button>
          <div>
            <p className="text-sm font-bold text-accent dark:text-[#F5F3EF]">
              {isPlaying ? '재생 중' : '재생하기'}
            </p>
            <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
              {content.minutes ? `${content.minutes}분 · ` : ''}
              {content.tag}
            </p>
          </div>
        </div>

        {/* 재생 진행바 */}
        <div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-white/40 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 설명 카드 */}
        {content.description && (
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
            <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">{content.description}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContentDetail;
