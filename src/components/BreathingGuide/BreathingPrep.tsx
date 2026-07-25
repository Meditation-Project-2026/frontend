interface BreathingPrepProps {
  onStart: () => void;
}

// 호흡 가이드 화면에 들어가자마자 바로 시작하면 따라가기 버거우니,
// 4-7-8 단계 안내 + 사용자가 직접 누르는 시작 버튼을 먼저 보여준다.
// (별도의 3-2-1 카운트다운은 넣지 않음 - 시작하면 BreathingCircle의 첫 들이마시기 단계 자체가
//  4초 카운트다운(4→3→2→1)을 이미 보여주므로 그걸로 충분함)
const BreathingPrep: React.FC<BreathingPrepProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5">
      <p className="text-base font-bold text-[#191B1F] dark:text-[#F5F3EF] text-center">
        4-7-8 호흡을 시작할게요
      </p>

      <div className="flex gap-2.5 w-full">
        <div className="flex-1 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl py-3 text-center">
          <p className="text-lg font-bold text-[#45947D]">4초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">들이마시기</p>
        </div>
        <div className="flex-1 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl py-3 text-center">
          <p className="text-lg font-bold text-[#45947D]">7초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">멈추기</p>
        </div>
        <div className="flex-1 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl py-3 text-center">
          <p className="text-lg font-bold text-[#45947D]">8초</p>
          <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">내쉬기</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-white/40 text-center leading-relaxed">
        편하게 앉아서 준비되면
        <br />
        버튼을 눌러주세요
      </p>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl bg-primary text-accent font-bold text-base active:scale-[0.98] transition-transform"
      >
        시작할게요
      </button>
    </div>
  );
};

export default BreathingPrep;
