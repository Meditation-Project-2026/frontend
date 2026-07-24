import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface MeditationCalendarProps {
  year: number;
  month: number; // 1-12
  sessionDays: Set<number>;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MeditationCalendar: React.FC<MeditationCalendarProps> = ({
  year,
  month,
  sessionDays,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) => {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mx-5 mt-5 bg-white border border-gray-100 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-accent">
        <button onClick={onPrevMonth} aria-label="이전 달" className="text-gray-400">
          <ChevronLeft size={16} />
        </button>
        <span>
          {year}년 {month}월
        </span>
        <button onClick={onNextMonth} aria-label="다음 달" className="text-gray-400">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={`${label}-${i}`} className="text-center text-[10px] text-gray-400 pb-1">
            {label}
          </span>
        ))}

        {cells.map((day, i) => {
          const isSelected = day !== null && day === selectedDay;
          const hasSession = day !== null && sessionDays.has(day);
          return (
            <button
              key={i}
              disabled={day === null}
              onClick={() => day !== null && onSelectDay(day)}
              className={`relative h-[30px] rounded-full text-xs flex items-center justify-center ${
                day === null
                  ? 'invisible'
                  : isSelected
                  ? 'bg-primary text-accent font-bold'
                  : 'text-accent'
              }`}
            >
              {day}
              {hasSession && !isSelected && (
                <span className="absolute bottom-1 w-[3.5px] h-[3.5px] rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MeditationCalendar;
