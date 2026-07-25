import { useEffect, useState } from 'react';

interface PreBreathCountdownProps {
  onComplete: () => void;
}

// BreathingCircle이 놓이는 자리에 먼저 3-2-1을 보여주고, 끝나면 onComplete를 호출해서
// 실제 호흡 애니메이션(BreathingCircle)으로 자연스럽게 넘어가게 하는 카운트다운.
// 별도 화면이 아니라 같은 레이아웃(h-[260px]) 안에서 원만 바뀌는 방식.
const PreBreathCountdown: React.FC<PreBreathCountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="relative w-full h-[260px] flex flex-col items-center justify-center shrink-0 gap-4">
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#8EF2D4] to-[#72E0BF] flex items-center justify-center shadow-[0_0_40px_rgba(114,224,191,0.35)]">
        <span className="text-white font-bold text-4xl tabular-nums">{count}</span>
      </div>
      <p className="text-sm text-gray-400 dark:text-white/50">마음을 편안히 가져보세요</p>
    </div>
  );
};

export default PreBreathCountdown;
