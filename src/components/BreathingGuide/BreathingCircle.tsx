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

// 진행률 링 (SVG)
const RING_RADIUS = 100;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const BreathingCircle: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.inhale / 1000);
  const [ringOffset, setRingOffset] = useState(RING_CIRCUMFERENCE); // 처음엔 빈 링

  // 1. 단계 전환 (들이마시기 → 멈추기 → 내쉬기 → 반복)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase((prev) => NEXT_PHASE[prev]);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  // 2. 초 단위 카운트다운 (사용자가 얼마나 더 기다려야 하는지 숫자로 보여줌)
  useEffect(() => {
    setSecondsLeft(PHASE_DURATIONS[phase] / 1000);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // 3. 진행률 링: 단계가 바뀔 때마다 즉시 0%로 리셋한 뒤,
  //    다음 프레임부터 해당 단계 길이(4/7/8초)에 걸쳐 서서히 100%까지 채운다.
  useEffect(() => {
    setRingOffset(RING_CIRCUMFERENCE);
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setRingOffset(0);
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [phase]);

  // 원 크기: 들이마시기+멈추기 구간은 커진 상태 유지, 내쉬는 구간에서만 작아짐
  const isExpanded = phase !== 'exhale';
  // 커질 땐 4초(들이마시는 속도), 작아질 땐 8초(내쉬는 속도)에 맞춰 전환
  const sizeTransitionMs = phase === 'exhale' ? 8000 : 4000;

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center shrink-0">
      {/* 진행률 링: 지금 단계가 얼마나 남았는지 시각적으로 보여줌 */}
      <svg
        viewBox="0 0 220 220"
        width="200"
        height="200"
        className="absolute -rotate-90"
      >
        <circle
          cx="110"
          cy="110"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-[#45947D]/15"
          strokeWidth="5"
        />
        <circle
          cx="110"
          cy="110"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-[#45947D]"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={ringOffset}
          style={{ transition: `stroke-dashoffset ${PHASE_DURATIONS[phase]}ms linear` }}
        />
      </svg>

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
