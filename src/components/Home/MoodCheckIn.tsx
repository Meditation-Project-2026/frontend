import { useState } from 'react';
import { Frown, Meh, Smile, Laugh } from 'lucide-react';

const MOODS = [
  { id: 'sad', Icon: Frown, bg: 'bg-[#FADCE3]', border: 'border-[#E187A3]', text: 'text-[#B2456A]' },
  { id: 'neutral', Icon: Meh, bg: 'bg-gray-100 dark:bg-white/10', border: 'border-gray-300 dark:border-white/20', text: 'text-gray-500 dark:text-white/60' },
  { id: 'happy', Icon: Smile, bg: 'bg-[#FFE8CC]', border: 'border-[#E0A756]', text: 'text-[#8A5A16]' },
  { id: 'great', Icon: Laugh, bg: 'bg-primary/25', border: 'border-primary', text: 'text-[#1E8F6B] dark:text-primary' },
] as const;

const MoodCheckIn: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="px-5">
      <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-3">오늘 기분이 어떠세요?</p>
      <div className="flex gap-2">
        {MOODS.map(({ id, Icon, bg, border, text }) => {
          const isActive = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              aria-label={id}
              className={`flex-1 rounded-xl py-3 flex items-center justify-center border-2 transition-all ${bg} ${text} ${
                isActive ? border : 'border-transparent'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MoodCheckIn;
