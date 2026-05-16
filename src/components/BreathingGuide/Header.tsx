import React from 'react';
import { ChevronLeft } from 'lucide-react';


interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onBack, 
}) => {
  return (
    <div
      className="
        relative
        px-6
        pt-10
        pb-4
        flex
        items-center
        shrink-0
        z-10
      "
    >

      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        className="
          p-2
          rounded-full
          bg-white
          dark:bg-[#1E293B]
          shadow-sm
          border
          border-slate-100
          dark:border-slate-800
          flex
          items-center
          justify-center
          transition-all
          active:scale-95
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* 제목 */}
      <h1
        className="
          absolute
          left-1/2
          -translate-x-1/2
          text-lg
          font-bold
          tracking-tight
        "
      >
        호흡 모니터링
      </h1>
    </div>
  );
};

export default Header;