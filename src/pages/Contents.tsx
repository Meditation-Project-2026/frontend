import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilterBar, { type ContentFilter } from '../components/Contents/SearchFilterBar';
import ContentList from '../components/Contents/ContentList';
import PageContainer from '../components/Layout/PageContainer';
import type { MeditationContent } from '../types/content';

// TODO: api/meditation.ts 의 getContents() 로 교체
const MOCK_CONTENTS: MeditationContent[] = [
  { id: 1, title: '아침을 시작하는 긍정 명상', minutes: 10, author: '평온한마음', likes: 1200, theme: 'sunrise' },
  { id: 2, title: '깊은 잠을 위한 수면 유도', minutes: 15, author: '고요의숲', likes: 986, theme: 'night' },
  { id: 3, title: '스트레스 해소를 위한 호흡', minutes: 5, author: '숨쉬는순간', likes: 812, theme: 'ocean' },
  { id: 4, title: '집중력 향상 사운드스케이프', minutes: 25, author: '사운드테라피', likes: 750, theme: 'forest' },
];

const Contents: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ContentFilter>('popular');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    let items = MOCK_CONTENTS.filter((item) => item.title.includes(query) || item.author.includes(query));
    if (filter === 'popular') {
      items = [...items].sort((a, b) => b.likes - a.likes);
    }
    return items;
  }, [query, filter]);

  const handleContentClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (selectedId) navigate(`/face-detection?id=${selectedId}&type=full`);
  };

  const handleCancel = () => {
    if (!selectedId) return;
    setShowModal(false);
    navigate(`/face-detection?id=${selectedId}&type=content`);
  };

  return (
    <PageContainer className="relative pb-6">
      <h1 className="pt-6 px-5 text-lg font-bold text-accent">명상 콘텐츠</h1>

      <SearchFilterBar query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} />

      <div className="mt-5">
        <ContentList items={filteredItems} onItemClick={handleContentClick} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[85%] max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-center text-accent mb-3">
              호흡 가이드와 함께하시겠습니까?
            </h2>
            <p className="text-sm text-accent text-center mb-6">
              안정적인 호흡 패턴을 따라 명상을 진행합니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold"
              >
                아니오
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-2xl bg-primary text-accent font-bold"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Contents;
