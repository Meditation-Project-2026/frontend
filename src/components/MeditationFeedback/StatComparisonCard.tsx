import { ArrowRight } from 'lucide-react';

interface StatComparisonCardProps {
  title: string;
  startValue: number | string;
  endValue: number | string;
  unit?: string;
  changeLabel: string; // 완성된 문구 그대로 전달 (예: "12bpm 감소", "48.1% 감소")
  isImprovement: boolean; // 초록(개선) vs 빨강(악화) 색상 결정
}

const StatComparisonCard: React.FC<StatComparisonCardProps> = ({
  title,
  startValue,
  endValue,
  unit,
  changeLabel,
  isImprovement,
}) => {
  return (
    <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5">
      <p className="text-center text-sm font-bold text-gray-400 dark:text-white/40 mb-4">{title}</p>

      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#FFE8CC] flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-[#8A5A16]">{startValue}</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1.5">초반</p>
        </div>

        <ArrowRight size={18} className="text-gray-300 dark:text-white/20 shrink-0" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#D9F2E6] flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-[#1E8F6B]">{endValue}</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1.5">후반</p>
        </div>
      </div>

      <p
        className={`text-center text-sm font-bold mt-4 ${
          isImprovement ? 'text-[#1E8F6B] dark:text-primary' : 'text-red-500'
        }`}
      >
        {changeLabel}
      </p>
      {unit && <p className="sr-only">{unit}</p>}
    </div>
  );
};

export default StatComparisonCard;
