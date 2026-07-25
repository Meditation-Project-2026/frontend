import { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSelect(url);
  };

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
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
  );
};

export default BackgroundPicker;
