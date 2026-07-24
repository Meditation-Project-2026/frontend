import { Pause, ThumbsUp } from 'lucide-react';

const SessionPlayer: React.FC = () => {
  return (
    <div
      className="
        mx-5
        mb-4
        bg-slate-900/95
        dark:bg-slate-800/95
        backdrop-blur-md
        rounded-2xl
        p-4
        shadow-2xl
        flex
        flex-col
        space-y-3
        border
        border-white/10
      "
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-3">

          <div
            className="
              w-10
              h-10
              bg-[#8DE12C]/20
              rounded-xl
              flex
              items-center
              justify-center
            "
          >
            🧘
          </div>

          <div>
            <div className="flex items-center space-x-1">

              <h4 className="text-white text-xs font-bold">
                마음챙김 호흡
              </h4>

              <ThumbsUp
                size={14}
                className="text-slate-400"
              />
            </div>

            <p className="text-slate-400 text-[10px]">
              10분 세션
            </p>
          </div>
        </div>

        <button
          className="
            w-10
            h-10
            bg-[#72E0BF]
            rounded-xl
            flex
            items-center
            justify-center
          "
        >
          <Pause
            size={18}
            className="text-slate-900"
          />
        </button>
      </div>

      <div className="space-y-1">
        <div className="relative h-1 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-[#72E0BF] rounded-full" />
        </div>

        <div className="flex justify-between text-[9px] text-slate-500 font-medium">
          <span>02:30</span>
          <span>10:00</span>
        </div>
      </div>
    </div>
  );
};

export default SessionPlayer;