interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

// 모든 페이지가 동일한 폭/배경을 공유하도록 하는 공통 래퍼.
// 페이지 배경은 살짝 톤 다운된 오프화이트(#FAF9F5)로, 카드(bg-white)가 그 위에서 떠 보이도록 한다.
// 다크모드는 프레임과 동일한 #14161C.
const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return <div className={`w-full max-w-md mx-auto min-h-full bg-[#FAF9F5] dark:bg-[#14161C] ${className}`}>{children}</div>;
};

export default PageContainer;
