import React from 'react';
import { ChevronLeft } from 'lucide-react';


interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = '호흡 모니터링',
  onBack,
}) => {
  return (
    <div
      className="
        relative
        px-5
        pt-5
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
          w-9
          h-9
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
        <ChevronLeft size={18} />
      </button>

      {/* 제목 */}
      <h1
        className="
          absolute
          left-1/2
          -translate-x-1/2
          text-base
          font-bold
          tracking-tight
          text-[#191B1F]
          dark:text-[#F5F3EF]
        "
      >
        {title}
      </h1>
    </div>
  );
};

export default Header;