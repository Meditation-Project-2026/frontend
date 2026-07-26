import { useState } from 'react';
import { Heart, Waves, Info } from 'lucide-react';

interface StatusCardsProps {
  heartRate: number;
  lfHfRatio: number;
}

const StatusCards: React.FC<StatusCardsProps> = ({
  heartRate,
  lfHfRatio,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-3 mb-5 shrink-0">

      {/* 심박수 */}
      <div className="bg-white dark:bg-[#1E212B] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/[0.07]">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-[#45947D]" />
          <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">
            심박수
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
            {heartRate || '-'}
          </span>
          <span className="text-xs font-medium text-slate-400">bpm</span>
        </div>
      </div>

      {/* 스트레스 지수 (기존 LF/HF) */}
      <div className="bg-white dark:bg-[#1E212B] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/[0.07]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Waves size={16} className="text-[#45947D]" />
            <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">
              스트레스 지수
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            aria-label="스트레스 지수 설명 보기"
            className="text-slate-300 dark:text-white/30"
          >
            <Info size={14} />
          </button>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
            {lfHfRatio || '-'}
          </span>
          <span className="text-xs font-medium text-slate-400">ratio</span>
        </div>
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 col-span-2"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white dark:bg-[#1E212B] rounded-3xl p-6 w-[85%] max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-center text-[#191B1F] dark:text-[#F5F3EF] mb-3">
              스트레스 지수란?
            </h2>
            <p className="text-sm text-slate-500 dark:text-white/60 text-center leading-relaxed mb-6">
              lf/hf의 값으로, 심박수의 미세한 변화 패턴(심박변이도)을 분석해 자율신경의 균형 상태를 나타내는 지표예요.
              수치가 낮을수록 몸이 이완되어 부교감 신경이 우세한 편안한 상태에 가깝고,
              수치가 높을수록 교감 신경이 활성화된 긴장 상태에 가까워요.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-3 rounded-2xl bg-primary text-accent font-bold text-sm"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCards;
