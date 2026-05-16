import { Heart, Waves } from 'lucide-react';

interface StatusCardsProps {
  heartRate: number;
  lfHfRatio: number;
}

const StatusCards: React.FC<StatusCardsProps> = ({
  heartRate,
  lfHfRatio,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8 shrink-0">

      {/* 심박수 */}
      <div
        className="
          bg-white
          dark:bg-zinc-900
          p-6
          rounded-[32px]
          shadow-sm
          border
          border-slate-100
          dark:border-zinc-800
        "
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart
            size={18}
            className="text-[#45947D]"
          />

          <span
            className="
              text-xs
              font-bold
              text-[#45947D]
              uppercase
              tracking-tight
            "
          >
            심박수
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className="
              text-4xl
              font-bold
              text-[#1A4D43]
              dark:text-slate-100
            "
          >
            {heartRate || '-'}
          </span>

          <span className="text-sm font-medium text-slate-400">
            bpm
          </span>
        </div>
      </div>

      {/* LF/HF */}
      <div
        className="
          bg-white
          dark:bg-zinc-900
          p-6
          rounded-[32px]
          shadow-sm
          border
          border-slate-100
          dark:border-zinc-800
        "
      >
        <div className="flex items-center gap-2 mb-4">
          <Waves
            size={18}
            className="text-[#45947D]"
          />

          <span
            className="
              text-xs
              font-bold
              text-[#45947D]
              uppercase
              tracking-tight
            "
          >
            LF/HF
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className="
              text-4xl
              font-bold
              text-[#1A4D43]
              dark:text-slate-100
            "
          >
            {lfHfRatio || '-'}
          </span>

          <span className="text-sm font-medium text-slate-400">
            ratio
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusCards;