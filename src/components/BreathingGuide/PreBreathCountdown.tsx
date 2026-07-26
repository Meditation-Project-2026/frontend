import { useEffect, useRef, useState } from 'react';

interface PreBreathCountdownProps {
  onComplete: () => void;
}

const PreBreathCountdown: React.FC<PreBreathCountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const onCompleteRef = useRef(onComplete);

  // 최신 onComplete 콜백 유지
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 카운트다운 타이머 (부모의 리렌더링 영향 완전 차단)
  useEffect(() => {
    if (count <= 0) {
      onCompleteRef.current();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]); // 🚀 count 변화만 감지하여 1초마다 안정적으로 차감됨

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