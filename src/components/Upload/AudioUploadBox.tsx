import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface AudioUploadBoxProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const AudioUploadBox: React.FC<AudioUploadBoxProps> = ({ file, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,audio/mpeg,audio/wav"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 bg-accent dark:bg-[#1E212B] rounded-2xl py-8"
      >
        <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center mb-1">
          <Upload size={18} className="text-primary" />
        </div>
        <p className="text-sm font-bold text-white dark:text-[#F5F3EF]">
          {file ? file.name : '음성 파일 업로드'}
        </p>
        <p className="text-[11px] text-white/40">MP3, WAV</p>
      </button>
    </div>
  );
};

export default AudioUploadBox;
