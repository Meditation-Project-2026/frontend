import React, { useEffect, useState } from 'react';

const BreathingCircle: React.FC = () => {
  const [isBreathingIn, setIsBreathingIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBreathingIn((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        relative
        w-full
        h-[260px]
        flex
        items-center
        justify-center
        shrink-0
      "
    >
      {/* 바깥 Glow */}
      <div
        className={`
          absolute
          rounded-full
          bg-[#72E0BF]/10
          blur-xl
          transition-all
          duration-[4000ms]
          ease-in-out
          ${
            isBreathingIn
              ? 'w-52 h-52'
              : 'w-40 h-40'
          }
        `}
      />

      {/* 바깥 원 */}
      <div
        className={`
          absolute
          rounded-full
          bg-[#72E0BF]/15
          transition-all
          duration-[4000ms]
          ease-in-out
          ${
            isBreathingIn
              ? 'w-44 h-44'
              : 'w-36 h-36'
          }
        `}
      />

      {/* 중간 원 */}
      <div
        className={`
          absolute
          rounded-full
          bg-[#72E0BF]/25
          transition-all
          duration-[4000ms]
          ease-in-out
          ${
            isBreathingIn
              ? 'w-36 h-36'
              : 'w-28 h-28'
          }
        `}
      />

      {/* 메인 원 */}
      <div
        className={`
          absolute
          rounded-full
          bg-gradient-to-br
          from-[#8EF2D4]
          to-[#72E0BF]
          flex
          items-center
          justify-center
          shadow-[0_0_40px_rgba(114,224,191,0.35)]
          transition-all
          duration-[4000ms]
          ease-in-out
          ${
            isBreathingIn
              ? 'w-28 h-28'
              : 'w-24 h-24'
          }
        `}
      >
        <span
          className="
            text-white
            font-bold
            text-center
            leading-tight
            text-sm
            tracking-tight
          "
        >
          {isBreathingIn ? (
            <>
              숨을 <br />
              들이마시세요
            </>
          ) : (
            <>
              숨을 <br />
              내쉬세요
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default BreathingCircle;