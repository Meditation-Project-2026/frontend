interface DataCardProps {
  label: string;
  value: number | string;
  unit: string;
}

const DataCard: React.FC<DataCardProps> = ({ label, value, unit }) => {
  return (
    <div className="bg-white dark:bg-[#1E212B] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/[0.07]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-[#45947D] uppercase tracking-tight">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-white/40">{unit}</span>
      </div>
    </div>
  );
};

export default DataCard;