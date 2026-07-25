import { useRef } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const PRESET_BACKGROUNDS: string[] = [
  '/images/medi4.jpg',
  '/images/medi5.jpg',
  '/images/medi6.jpg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAAtotyUOYsYjvDm3dvxslvOi8n2EGa5B9wFkcMiL1_Q97SRNakWuecQJ0T0KXRoslOcu8oKP998qftmz_Wr6RZsHVKRfyj6rlpxoX82RU9kNXaSKwuDp3tkAkxXpmZdFiCACGtFQpdcPc_cE6ehHLAkZzPbyCyjPPR4vNZilEFNUKIK1oJQinvW-kXkYcd8spiW4X1gtw1MnJvQkDwvi_vXLd_ADCL8Bgkycm0RVHvqOeM3iQv5Oq0lBVorbPOg09ECGgw3fPT4-E7',
];

interface BackgroundPickerProps {
  selected: string | null;
  onSelect: (imageUrl: string) => void;
}

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ selected, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(url);
  };

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* 마우스로도 넘길 수 있도록 좌우 화살표 버튼 추가 (스크롤바가 숨겨져 있어 드래그 지원 없는 데스크톱에서 넘길 방법이 없었음) */}
      <button
        type="button"
        onClick={() => scrollByAmount(-120)}
        aria-label="이전 배경 보기"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.12] shadow-sm flex items-center justify-center text-gray-500 dark:text-white/60"
      >
        <ChevronLeft size={14} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-[84px] h-[84px] rounded-2xl border border-dashed border-gray-300 dark:border-white/[0.12]
                     bg-white dark:bg-[#1E212B] flex flex-col items-center justify-center gap-1.5 text-gray-400 dark:text-[#F5F3EF]/40 text-center px-1"
        >
          <ImageIcon size={16} />
          <span className="text-[10px] font-semibold leading-tight">내 파일에서 업로드</span>
        </button>

        {PRESET_BACKGROUNDS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onSelect(url)}
            aria-label="배경 선택"
            style={{ backgroundImage: `url(${url})` }}
            className={`shrink-0 w-[84px] h-[84px] rounded-2xl bg-cover bg-center ${
              selected === url ? 'ring-2 ring-primary' : 'ring-2 ring-transparent'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(120)}
        aria-label="다음 배경 보기"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.12] shadow-sm flex items-center justify-center text-gray-500 dark:text-white/60"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default BackgroundPicker;
