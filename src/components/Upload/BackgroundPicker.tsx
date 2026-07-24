import { Image as ImageIcon } from 'lucide-react';
import type { ThumbnailTheme } from '../../types/content';
import { THUMBNAIL_GRADIENTS } from '../../utils/thumbnailThemes';

const PRESET_BACKGROUNDS: ThumbnailTheme[] = ['forest', 'night', 'sunrise', 'ocean'];

interface BackgroundPickerProps {
  selected: ThumbnailTheme | null;
  onSelect: (theme: ThumbnailTheme) => void;
  onUploadOwn?: () => void;
}

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ selected, onSelect, onUploadOwn }) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
      <button
        type="button"
        onClick={onUploadOwn}
        className="shrink-0 w-[84px] h-[84px] rounded-2xl border border-dashed border-gray-300
                   bg-white flex flex-col items-center justify-center gap-1.5 text-gray-400 text-center px-1"
      >
        <ImageIcon size={16} />
        <span className="text-[10px] font-semibold leading-tight">내 파일에서 업로드</span>
      </button>

      {PRESET_BACKGROUNDS.map((theme) => (
        <button
          key={theme}
          type="button"
          onClick={() => onSelect(theme)}
          aria-label={`${theme} 배경 선택`}
          className={`shrink-0 w-[84px] h-[84px] rounded-2xl ${THUMBNAIL_GRADIENTS[theme]} ${
            selected === theme ? 'ring-2 ring-primary' : 'ring-2 ring-transparent'
          }`}
        />
      ))}
    </div>
  );
};

export default BackgroundPicker;
