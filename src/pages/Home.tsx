import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/Home/HomeHeader';
import SearchBar from '../components/Home/SearchBar';
import RecentMeditations from '../components/Home/RecentMeditations';
import FavoriteContents from '../components/Home/FavoriteContents';
import ActionButtons from '../components/Home/ActionButtons';

// 임시 meditationId (실제로는 선택한 콘텐츠 ID를 전달)
const DEFAULT_MEDITATION_ID = 1;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartMeditation = () => {
    navigate(`/face-detection?id=${DEFAULT_MEDITATION_ID}`);
  };

  const handleStartBreathing = () => {
    navigate(`/breathing-monitor`);
  };

  const handleCameraClick = () => {
    navigate(`/face-detection?id=${DEFAULT_MEDITATION_ID}`);
  };

  return (
    <div className="w-full max-w-md bg-background-serene flex flex-col relative min-h-screen pb-24">
      {/* 헤더 */}
      <HomeHeader greeting="좋은 저녁이에요" userName="현수님" />

      {/* 검색 바 */}
      <SearchBar />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 space-y-9 overflow-y-auto hide-scrollbar pb-10">
        {/* 최근에 들은 명상 */}
        <RecentMeditations
          onViewAll={() => navigate('/contents')}
          onItemClick={(item) => navigate(`/face-detection?id=${item.id}`)}
        />

        {/* 즐겨찾기한 콘텐츠 */}
        <FavoriteContents
          onItemClick={(item) => navigate(`/face-detection?id=${item.id}`)}
        />

        {/* 명상 시작 / 호흡 가이드 버튼 */}
        <ActionButtons
          onStartMeditation={handleStartMeditation}
          onStartBreathing={handleStartBreathing}
        />
      </main>
    </div>
  );
};

export default Home;