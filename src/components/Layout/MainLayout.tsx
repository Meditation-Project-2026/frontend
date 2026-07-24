import { Outlet } from 'react-router-dom';
import BottomNav from '../BottomNav';

// 하단 탭바가 필요한 화면(홈/콘텐츠/프로필)을 감싸는 레이아웃.
// 얼굴인식·호흡모니터링·피드백·업로드 같은 단독 플로우 화면은 이 레이아웃 밖에 둔다.
//
// index.css에서 body에 overflow-hidden이 걸려있어 브라우저 창 자체는 스크롤되지 않는다
// (BreathingGuide.tsx의 min-h-[100svh] + overflow-hidden + 내부 flex-1 overflow-y-auto와 동일한 패턴).
// 그래서 BottomNav를 fixed로 띄우고 페이지마다 padding-bottom을 추측해서 넣는 대신,
// 이 레이아웃 자체를 뷰포트 높이로 고정하고 flex-col로 나눈다.
// - 위쪽(Outlet)은 flex-1 + overflow-y-auto인 실제 스크롤 영역
// - 아래쪽(BottomNav)은 일반 flow 요소로 항상 같은 자리를 차지
const MainLayout: React.FC = () => {
  return (
    <div className="h-[100svh] flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
