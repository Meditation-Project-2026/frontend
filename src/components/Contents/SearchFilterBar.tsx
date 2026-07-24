import { Search } from 'lucide-react';

export type ContentFilter = 'all' | 'popular';

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="마음챙김 명상 검색..."
          className="flex-1 bg-transparent outline-none text-sm text-accent placeholder:text-gray-400"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onFilterChange('all')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-primary text-accent'
              : 'bg-white border border-gray-100 text-gray-500'
          }`}
        >
          전체 콘텐츠 보기
        </button>
        <button
          onClick={() => onFilterChange('popular')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            filter === 'popular'
              ? 'bg-primary text-accent'
              : 'bg-white border border-gray-100 text-gray-500'
          }`}
        >
          인기순
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
