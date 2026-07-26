import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/Home/HomeHeader';
import SearchBar from '../components/Home/SearchBar';
import RecentMeditations from '../components/Home/RecentMeditations';
import FavoriteContents from '../components/Home/FavoriteContents';
import ActionButtons from '../components/Home/ActionButtons';
import PageContainer from '../components/Layout/PageContainer';
import { useContents } from '../contexts/ContentsContext';
import { useState } from 'react';

// 임시 meditationId (실제로는 선택한 콘텐츠 ID를 전달)
const DEFAULT_MEDITATION_ID = 1;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { contents } = useContents();
  const likedItems = contents
    .filter((c) => c.isLiked)
    .map((c) => ({ id: c.id, title: c.title, imageUrl: c.imageUrl }));

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleStartMeditation = () => {
    navigate(`/face-detection?id=${DEFAULT_MEDITATION_ID}&type=meditation`);
  };

  const handleStartBreathing = () => {
    navigate(`/face-detection?id=${DEFAULT_MEDITATION_ID}&type=breathing`);
  };

  const handleContentClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // 호흡 가이드 포함
  const handleConfirm = () => {
    setShowModal(false);
    if (selectedId) {
      navigate(`/face-detection?id=${selectedId}&type=full`);
    } 
  };

  // 호흡 가이드 미포함
  const handleCancel = () => {
    if (!selectedId) return;
    setShowModal(false);
    navigate(`/face-detection?id=${selectedId}&type=content`);
  };
  
  return (
    <PageContainer className="relative pb-6">
      {/* 헤더 */}
      <HomeHeader greeting="좋은 저녁이에요" userName="BioCalm" />

      {/* 검색 바 */}
      <SearchBar />

      {/* 메인 콘텐츠 */}
      <main className="space-y-5 pb-6">
        {/* 최근에 들은 명상 */}
        <RecentMeditations
          onViewAll={() => navigate('/contents')}
          onItemClick={(item) => handleContentClick(item.id)}
        />

        {/* 즐겨찾기한 콘텐츠 */}
        <FavoriteContents
          items={likedItems}
          onItemClick={(item) => handleContentClick(item.id)}
        />

        {/* 명상 시작 / 호흡 가이드 버튼 */}
        <ActionButtons
          onStartMeditation={handleStartMeditation}
          onStartBreathing={handleStartBreathing}
        />
      </main>
      {/* 모달 */}
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

export default Home;