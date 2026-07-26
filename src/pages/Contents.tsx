import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilterBar, { type ContentFilter } from '../components/Contents/SearchFilterBar';
import FeaturedContentCard from '../components/Contents/FeaturedContentCard';
import ContentList from '../components/Contents/ContentList';
import PageContainer from '../components/Layout/PageContainer';
import { useContents } from '../contexts/ContentsContext';

const Contents: React.FC = () => {
  const navigate = useNavigate();
  const { contents, toggleLike } = useContents();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ContentFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    let items = contents.filter((item) => item.title.includes(query) || item.author.includes(query));
    if (filter === 'popular') {
      items = [...items].sort((a, b) => b.likes - a.likes);
    }
    return items;
  }, [contents, query, filter]);

  // 좋아요 수가 가장 많은 콘텐츠를 실제 데이터 기준으로 계산
  const mostPopular = useMemo(() => {
    if (contents.length === 0) return null;
    return [...contents].sort((a, b) => b.likes - a.likes)[0];
  }, [contents]);

  const handleContentClick = (id: number) => {
    const target = contents.find((item) => item.id === id);
    if (target?.isUploaded) {
      // 업로드한 콘텐츠는 상세 화면으로
      navigate(`/content-detail?id=${id}`);
      return;
    }
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
      <h1 className="pt-6 px-5 text-lg font-bold text-accent dark:text-[#F5F3EF]">명상 콘텐츠</h1>

      <SearchFilterBar query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} />

      {mostPopular && (
        <FeaturedContentCard
          label="가장 인기 많은 콘텐츠"
          title={mostPopular.title}
          subtitle={`by ${mostPopular.author} · 좋아요 ${mostPopular.likes}`}
          minutes={mostPopular.minutes}
          onPlay={() => navigate(`/face-detection?id=${mostPopular.id}&type=full`)}
        />
      )}

      <div className="mt-5">
        <ContentList items={filteredItems} onItemClick={handleContentClick} onLikeToggle={toggleLike} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1E212B] rounded-3xl p-8 w-[85%] max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-center text-accent dark:text-[#F5F3EF] mb-3">
              호흡 가이드와 함께하시겠습니까?
            </h2>
            <p className="text-sm text-accent dark:text-[#F5F3EF]/70 text-center mb-6">
              안정적인 호흡 패턴을 따라 명상을 진행합니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl border border-gray-300 dark:border-white/[0.12] text-gray-600 dark:text-[#F5F3EF]/70 font-semibold"
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
