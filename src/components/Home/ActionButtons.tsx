import React, { useState } from 'react';

interface ActionButtonsProps {
  onStartMeditation?: () => void;
  onStartBreathing?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onStartMeditation,
  onStartBreathing,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleBreathingClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    onStartBreathing?.();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="px-5 space-y-2.5">
        {/* 명상 시작 버튼 */}
        <button
          onClick={onStartMeditation}
          className="w-full bg-primary rounded-2xl p-5 flex items-center justify-between shadow-md hover:opacity-95 transition-opacity"
        >
          <div className="text-left">
            <h3 className="text-base font-bold mb-1 text-accent">명상 시작</h3>
            <p className="text-xs font-medium text-accent/60">오늘의 평온을 찾아서</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined filled text-accent text-[22px]">
              play_arrow
            </span>
          </div>
        </button>

        {/* 호흡 가이드 시작 버튼 */}
        <button
          onClick={handleBreathingClick}
          className="w-full bg-white dark:bg-[#1E212B] border border-primary/20 dark:border-white/[0.07] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:bg-accent/5 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-base font-bold mb-1 text-accent dark:text-[#F5F3EF]">호흡 가이드 시작</h3>
            <p className="text-xs font-medium text-accent/70 dark:text-[#F5F3EF]/70">안정적인 호흡을 따라가보세요</p>
          </div>
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-accent dark:text-primary text-[22px]">
              air
            </span>
          </div>
        </button>
      </section>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1E212B] rounded-3xl p-8 w-[85%] max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-center text-accent dark:text-[#F5F3EF] mb-3">
              호흡 가이드와 함께하시겠습니까?
            </h2>
            <p className="text-sm text-accent dark:text-[#F5F3EF]/70 text-center mb-6">
              안정적인 호흡 패턴을 따라 명상을 진행합니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl border border-gray-300 dark:border-white/[0.12] text-gray-600 dark:text-[#F5F3EF]/70 font-semibold"
              >
                아니오
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-2xl bg-primary text-accent font-bold"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
