import { useEffect, useState } from 'react';

interface PreBreathCountdownProps {
  onComplete: () => void;
}

// BreathingCircle이 놓이는 자리에 먼저 3-2-1을 보여주고, 끝나면 onComplete를 호출해서
// 실제 호흡 애니메이션(BreathingCircle)으로 자연스럽게 넘어가게 하는 카운트다운.
// 별도 화면이 아니라 같은 레이아웃(h-[260px]) 안에서 원만 바뀌는 방식.
// 항상 다크 배경(BreathingGuide/Full 페이지 자체가 항상 다크) 위에 놓이는 걸 전제로 한 스타일.
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
    <div className="relative w-full h-[260px] flex flex-col items-center justify-center shrink-0 gap-5 text-center">
      <p className="text-xs text-gray-400 dark:text-white/50">잠시 후 명상이 시작돼요</p>
      <div className="w-[100px] h-[100px] rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-primary font-bold text-4xl tabular-nums">{count}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-white/40">편안한 자세를 잡아주세요</p>
    </div>
  );
};

export default PreBreathCountdown;
