export type ContentType = 'voice' | 'sound';

interface ContentTypeToggleProps {
  value: ContentType;
  onChange: (type: ContentType) => void;
}

const ContentTypeToggle: React.FC<ContentTypeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex bg-white border border-gray-100 rounded-xl p-1">
      <button
        onClick={() => onChange('voice')}
        className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors ${
          value === 'voice' ? 'bg-primary text-accent' : 'text-gray-400'
        }`}
      >
        음성 가이드 명상
      </button>
      <button
        onClick={() => onChange('sound')}
        className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-colors ${
          value === 'sound' ? 'bg-primary text-accent' : 'text-gray-400'
        }`}
      >
        명상 음악/소리
      </button>
    </div>
  );
};

export default ContentTypeToggle;
