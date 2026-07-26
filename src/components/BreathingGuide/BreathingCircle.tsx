import React, { useEffect, useState } from 'react';

type Phase = 'inhale' | 'hold' | 'exhale';

// 4-7-8 호흡법: 4초 들이마시기 - 7초 멈추기 - 8초 내쉬기
const PHASE_DURATIONS: Record<Phase, number> = { inhale: 4000, hold: 7000, exhale: 8000 };
const NEXT_PHASE: Record<Phase, Phase> = { inhale: 'hold', hold: 'exhale', exhale: 'inhale' };
const PHASE_LABELS: Record<Phase, string> = {
  inhale: '들이마시세요',
  hold: '숨을 멈추세요',
  exhale: '내쉬세요',
};

const BreathingCircle: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.inhale / 1000);
  // isExpanded를 phase의 단순 파생값으로 두면, 마운트되자마자 phase가 이미 'inhale'이라
  // 처음부터 "확장된" 크기로 렌더링되어버려서 들이마시는 애니메이션이 아예 재생되지 않는 문제가 있었다.
  // 그래서 항상 "작은 상태"로 먼저 마운트한 뒤, 다음 프레임에 목표 상태로 전환해 트랜지션이 실제로 걸리게 한다.
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. 단계 전환 (들이마시기 → 멈추기 → 내쉬기 → 반복)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase((prev) => NEXT_PHASE[prev]);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  // 1-1. phase에 맞춰 원 크기 상태 갱신 (마운트 시에는 다음 프레임에 반영되어 확장 애니메이션이 보이도록 함)
  useEffect(() => {
    const shouldExpand = phase !== 'exhale';
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setIsExpanded(shouldExpand);
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [phase]);

  // 2. 초 단위 카운트다운 (사용자가 얼마나 더 기다려야 하는지 숫자로 보여줌)
  useEffect(() => {
    setSecondsLeft(PHASE_DURATIONS[phase] / 1000);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // 커질 땐 4초(들이마시는 속도), 작아질 땐 8초(내쉬는 속도)에 맞춰 전환
  const sizeTransitionMs = phase === 'exhale' ? 8000 : 4000;

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center shrink-0">
      {/* 바깥 Glow */}
      <div
        style={{ transitionDuration: `${sizeTransitionMs}ms` }}
        className={`absolute rounded-full bg-[#72E0BF]/10 blur-xl transition-all ease-in-out ${
          isExpanded ? 'w-52 h-52' : 'w-40 h-40'
        }`}
      />

      {/* 바깥 원 */}
      <div
        style={{ transitionDuration: `${sizeTransitionMs}ms` }}
        className={`absolute rounded-full bg-[#72E0BF]/15 transition-all ease-in-out ${
          isExpanded ? 'w-44 h-44' : 'w-36 h-36'
        }`}
      />

      {/* 중간 원 */}
      <div
        style={{ transitionDuration: `${sizeTransitionMs}ms` }}
        className={`absolute rounded-full bg-[#72E0BF]/25 transition-all ease-in-out ${
          isExpanded ? 'w-36 h-36' : 'w-28 h-28'
        }`}
      />

      {/* 메인 원 (숫자 카운트다운 + 안내 문구) */}
      <div
        style={{ transitionDuration: `${sizeTransitionMs}ms` }}
        className={`absolute rounded-full bg-gradient-to-br from-[#8EF2D4] to-[#72E0BF] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(114,224,191,0.35)] transition-all ease-in-out ${
          isExpanded ? 'w-28 h-28' : 'w-24 h-24'
        }`}
      >
        <span className="text-white font-bold text-2xl leading-none tabular-nums">
          {secondsLeft}
        </span>
        <span className="text-white font-semibold text-center leading-tight text-[11px] tracking-tight mt-1 px-2">
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  );
};

export default BreathingCircle;
