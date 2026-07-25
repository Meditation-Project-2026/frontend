'react';
import { ChevronLeft, Share2, X } from 'lucide-react'; // 필요한 아이콘들을 가져옵니다.

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightType?: 'text' | 'icon' | 'none';
  rightText?: string;   // 예: "취소", "저장"
  rightIcon?: 'share' | 'close'; // 아이콘 이름을 예약어로 관리하면 편해요
  onRightClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  rightType, 
  rightText, 
  rightIcon, 
  onRightClick 
}) => {
  return (
    <header className="w-full px-5 pt-5 pb-4 flex justify-between items-center z-10 bg-transparent">
      {/* 왼쪽 뒤로가기 버튼 */}
      <button 
        onClick={onBack}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1E212B] shadow-sm text-gray-500 dark:text-gray-300 active:scale-90 transition-transform"
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      {/* 중앙 타이틀 */}
      <h1 className="text-[#0F172A] dark:text-[#F5F3EF] text-base font-bold">{title}</h1>

      {/* 오른쪽 영역 */}
      <div className="w-9 flex justify-end">
        {rightType === 'text' && (
          <button 
            onClick={onRightClick}
            className="text-sm font-bold text-gray-500 hover:text-[#0F172A] dark:text-gray-400 dark:hover:text-[#6BE6C1] whitespace-nowrap"
          >
            {rightText}
          </button>
        )}

        {rightType === 'icon' && (
          <button 
            onClick={onRightClick}
            className="p-2 text-[#191B1F] dark:text-[#6BE6C1] active:scale-90 transition-transform flex items-center justify-end"
          >
            {/* 조건부로 아이콘 렌더링 */}
            {rightIcon === 'share' && <Share2 size={20} />}
            {rightIcon === 'close' && <X size={20} />}
          </button>
        )}

        {(rightType === 'none' || !rightType) && <div className="w-9" />}
      </div>
    </header>
  );
};

export default Header;