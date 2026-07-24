interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

// 모든 페이지가 동일한 폭/배경을 공유하도록 하는 공통 래퍼.
// (기존에 쓰던 bg-background-serene는 tailwind.config.js에 정의돼 있지 않아
//  아무 효과가 없던 클래스였다. App.tsx 바깥 wrapper와 동일한 bg-white / dark:bg-accent로 교체.)
// 높이(min-h-screen 등)와 하단 여백은 페이지 성격에 따라 className으로 넘긴다.
const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return <div className={`w-full max-w-md mx-auto bg-white dark:bg-accent ${className}`}>{children}</div>;
};

export default PageContainer;
