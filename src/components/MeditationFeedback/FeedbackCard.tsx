interface CardProps {
  title: string;
  value: string | number;
  unit: string;
  change: string; // decrease -> change
  start: { val: number; percent: string };
  end: { val: number; percent: string };
}

export const FeedbackCard = ({ title, value, unit, change, start, end }: CardProps) => {
  // 변화량 계산
  const diff = Number(end.val) - Number(start.val);
  let arrow = '';
  let color = '';
  if (diff > 0) {
    arrow = '↑';
    color = 'text-red-500';
  } else if (diff < 0) {
    arrow = '↓';
    color = 'text-green-600';
  } else {
    arrow = '-';
    color = 'text-gray-400';
  }

  return (
    <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-50">
      <h3 className="text-gray-500 text-sm font-bold mb-3 uppercase tracking-wide">{title}</h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-extrabold">{value}</span>
        <span className="text-xl font-bold text-[#94A3B8]">{unit}</span>
        <span className={`ml-2 text-sm font-bold ${color}`}>{arrow} {change}</span>
      </div>
      <div className="space-y-5">
        {[ { label: "초반", data: start, color: "bg-[#9FB6B0]" },
           { label: "후반", data: end, color: "bg-[#45947D]" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-xs text-gray-300 w-8">{item.label}</span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: item.data.percent }}></div>
            </div>
            <span className={`text-xs font-bold w-10 text-right ${idx === 1 ? 'text-[#45947D]' : ''}`}>{item.data.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
