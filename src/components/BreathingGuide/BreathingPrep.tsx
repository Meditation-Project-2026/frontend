import { Wind, ArrowUp, Pause, ArrowDown, ChevronRight } from 'lucide-react';

interface BreathingPrepProps {
  onStart: () => void;
}

// 호흡 가이드 화면에 들어가자마자 바로 시작하면 따라가기 버거우니,
// 4-7-8 단계 안내 + 사용자가 직접 누르는 시작 버튼을 먼저 보여준다.
const BreathingPrep: React.FC<BreathingPrepProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <Wind size={26} className="text-primary" strokeWidth={2} />
        </div>
        <p className="text-lg font-bold text-[#191B1F] dark:text-[#F5F3EF]">4-7-8 호흡을 시작할게요</p>
        <p className="text-xs text-gray-400 dark:text-white/40 mt-1.5">
          편하게 앉아서 준비되면 아래 버튼을 눌러주세요
        </p>
      </div>

      {/* 4-7-8 흐름 다이어그램 */}
      <div className="flex items-center justify-center gap-1 w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#45947D]/15 border-2 border-[#45947D]/30 flex items-center justify-center">
            <ArrowUp size={20} className="text-[#45947D]" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-bold text-[#191B1F] dark:text-[#F5F3EF]">4초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40">들이마시기</p>
        </div>

        <ChevronRight size={16} className="text-gray-300 dark:text-white/20 mb-8 shrink-0" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#45947D]/20 border-2 border-[#45947D]/40 flex items-center justify-center">
            <Pause size={20} className="text-[#45947D]" strokeWidth={2.5} fill="currentColor" />
          </div>
          <p className="text-sm font-bold text-[#191B1F] dark:text-[#F5F3EF]">7초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40">멈추기</p>
        </div>

        <ChevronRight size={16} className="text-gray-300 dark:text-white/20 mb-8 shrink-0" />

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#6BE6C1]/25 border-2 border-[#6BE6C1]/50 flex items-center justify-center">
            <ArrowDown size={22} className="text-[#1E8F6B] dark:text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-bold text-[#191B1F] dark:text-[#F5F3EF]">8초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40">내쉬기</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl bg-primary text-accent font-bold text-base active:scale-[0.98] transition-transform"
      >
        시작할게요
      </button>
    </div>
  );
};

export default BreathingPrep;
