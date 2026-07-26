import { ChevronRight, Leaf } from 'lucide-react';
import type { DaySession } from '../../types/content';

interface DaySessionListProps {
  dateLabel: string;
  sessions: DaySession[];
  onSessionClick?: (id: number) => void;
}

const DaySessionList: React.FC<DaySessionListProps> = ({ dateLabel, sessions, onSessionClick }) => {
  return (
    <div className="px-5 mt-5">
      <p className="text-xs font-bold text-gray-400 dark:text-[#F5F3EF]/50 mb-2.5">{dateLabel}</p>
      {sessions.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-[#F5F3EF]/40 py-4 text-center bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl">
          이 날은 기록이 없어요.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionClick?.(session.id)}
              className="w-full flex items-center gap-3 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-xl px-3.5 py-3"
            >
              <span className="w-[30px] h-[30px] rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Leaf size={14} strokeWidth={1.8} />
              </span>
              <span className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-accent dark:text-[#F5F3EF]">{session.title}</p>
                <p className="text-xs text-gray-400 dark:text-[#F5F3EF]/40 truncate">
                  {session.note?.trim() ? session.note : '작성된 메모가 없습니다.'}
                </p>
              </span>
              <ChevronRight size={15} className="text-gray-400 dark:text-[#F5F3EF]/40 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaySessionList;
