const PPGChart: React.FC = () => {
  return (
    <div
      className="
        bg-white
        dark:bg-[#1E293B]
        p-5
        rounded-3xl
        shadow-sm
        border
        border-slate-100
        dark:border-slate-800
        mt-4
        shrink-0
      "
    >
      <div className="flex justify-between items-center mb-4">

        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          PPG 파형
        </h3>

        <span
          className="
            text-[10px]
            px-2
            py-0.5
            bg-[#72E0BF]/10
            text-[#72E0BF]
            font-bold
            rounded-full
            uppercase
            tracking-wider
          "
        >
          Live
        </span>
      </div>

      <div className="h-20 w-full">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 400 100"
        >
          <path
            d="
              M0 70
              Q 25 20, 50 60
              T 100 70
              T 150 50
              T 200 80
              T 250 30
              T 300 60
              T 350 85
              T 400 50
            "
            fill="none"
            stroke="#72E0BF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default PPGChart;