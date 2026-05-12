'react';

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '콘텐츠 제목 또는 사용자 검색',
  onChange,
}) => {
  return (
    <div className="px-6 mb-8">
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-secondary/60 text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-accent/30 placeholder:text-gray-400 font-medium shadow-sm outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;