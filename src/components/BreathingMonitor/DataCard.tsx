interface DataCardProps {
  label: string;
  value: number | string;
  unit: string;
}

const DataCard: React.FC<DataCardProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-[#1A4D43] dark:text-slate-100">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
    </div>
  );
};

export default DataCard;