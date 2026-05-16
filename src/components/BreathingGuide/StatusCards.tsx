import { Heart, Waves } from 'lucide-react';

interface StatusCardsProps {
  heartRate: number;
  lfHfRatio: number;
}

const StatusCards: React.FC<StatusCardsProps> = ({ heartRate, lfHfRatio  }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">

      {/* 심박수 */}
      <div
        className="
          bg-white
          dark:bg-[#1E293B]
          p-4
          rounded-3xl
          shadow-sm
          border
          border-slate-100
          dark:border-slate-800
        "
      >
        <div className="flex items-center space-x-2 mb-1">
          <Heart
            size={16}
            className="text-red-500"
          />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            심박수 (HR)
          </span>
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold">
            {heartRate || '-'}
          </span>

          <span className="text-xs font-medium text-slate-400">
            bpm
          </span>
        </div>
      </div>

      {/* HRV */}
      <div
        className="
          bg-white
          dark:bg-[#1E293B]
          p-4
          rounded-3xl
          shadow-sm
          border
          border-slate-100
          dark:border-slate-800
        "
      >
        <div className="flex items-center space-x-2 mb-1">
          <Waves
            size={16}
            className="text-blue-500"
          />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            LF/HF
          </span>
        </div>

        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold">
            {lfHfRatio || '-'}
          </span>

          <span className="text-xs font-medium text-slate-400">
            ratio
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusCards;