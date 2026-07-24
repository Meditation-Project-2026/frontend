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
        className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300
                   rounded-2xl py-4 text-sm font-semibold text-accent"
      >
        <Upload size={16} />
        {file ? file.name : '음성 파일 업로드'}
      </button>
      <p className="text-center text-[11px] text-gray-400 mt-2">지원 파일 형식: MP3, WAV</p>
    </div>
  );
};

export default AudioUploadBox;
