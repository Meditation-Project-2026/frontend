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
      <section className="px-6 space-y-3 pb-8">
        {/* 명상 시작 버튼 */}
        <button
          onClick={onStartMeditation}
          className="w-full bg-[#6BE6C1] rounded-[2.2rem] p-7 flex items-center justify-between shadow-md hover:opacity-95 transition-opacity"
        >
          <div className="text-left">
            <h3 className="text-[19px] font-bold mb-1 text-[#1A4D43]">명상 시작</h3>
            <p className="text-[12px] font-medium text-[#1A4D43]/60">오늘의 평온을 찾아서</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined filled text-[#1A4D43] text-[28px]">
              play_arrow
            </span>
          </div>
        </button>

        {/* 호흡 가이드 시작 버튼 */}
        <button
          onClick={handleBreathingClick}
          className="w-full bg-white border border-[#6BE6C1]/20 rounded-[2.2rem] p-7 flex items-center justify-between shadow-sm hover:bg-accent/5 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-[19px] font-bold mb-1 text-[#1A4D43]">호흡 가이드 시작</h3>
            <p className="text-[12px] font-medium text-[#1A4D43]">안정적인 호흡을 따라가보세요</p>
          </div>
          <div className="w-12 h-12 bg-[#6BE6C1]/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#1A4D43] text-[28px]">
              air
            </span>
          </div>
        </button>
      </section>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[85%] max-w-sm shadow-xl">
            <h2 className="text-xl font-bold text-center text-[#1A4D43] mb-3">
              호흡 가이드와 함께하시겠습니까?
            </h2>
            <p className="text-sm text-[#1A4D43] text-center mb-6">
              안정적인 호흡 패턴을 따라 명상을 진행합니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold"
              >
                아니오
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-2xl bg-[#6BE6C1] text-[#1A4D43] font-bold"
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