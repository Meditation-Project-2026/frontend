import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Pause, Heart, HeartCrack } from 'lucide-react';
import Header from '../components/Header';
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
        <Header title="콘텐츠" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-sm text-gray-400 dark:text-white/40">콘텐츠를 찾을 수 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col overflow-hidden">
      <Header title="명상 콘텐츠" onBack={() => navigate(-1)} />

      {content.audioUrl && <audio ref={audioRef} src={content.audioUrl} />}

      <main className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 space-y-5">
        {/* 배경 이미지 */}
        <div
          className="w-full aspect-[4/3] rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        />

        {/* 제목 + 좋아요 */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold text-accent dark:text-[#F5F3EF] leading-snug">{content.title}</p>
            <p className="text-xs text-gray-400 dark:text-white/40 mt-1">by {content.author}</p>
          </div>
          <button
            onClick={toggleLike}
            aria-label="좋아요"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] shrink-0 flex items-center justify-center"
          >
            {liked ? (
              <Heart size={18} fill="#E24B6B" className="text-[#E24B6B]" strokeWidth={0} />
            ) : (
              <HeartCrack size={18} className="text-gray-300 dark:text-white/30" strokeWidth={1.8} />
            )}
          </button>
        </div>
        <p className="-mt-3 text-xs text-gray-400 dark:text-white/40">좋아요 {likeCount}</p>

        {content.description && (
          <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">{content.description}</p>
        )}

        {/* 재생바 */}
        <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0"
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <Pause size={18} className="text-accent" fill="currentColor" />
              ) : (
                <Play size={18} className="text-accent" fill="currentColor" />
              )}
            </button>
            <div className="flex-1 min-w-0">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentDetail;
