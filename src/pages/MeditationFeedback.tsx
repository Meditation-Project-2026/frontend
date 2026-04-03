import Header from "../components/Header";
import { FeedbackCard } from "../components/MeditationFeedback/FeedbackCard";


export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#2D3142] pb-10">
      <Header title="명상 피드백" />

      <main className="px-6 space-y-8">
        {/* 요약 정보 */}
        <div className="space-y-4 text-md border-b border-gray-100 text-[#64748B]">
          <div className="flex justify-between">날짜<span className="text-[#0F172A] font-medium">2024년 7월 26일</span></div>
          <div className="flex justify-between">명상<span className="text-[#0F172A] font-medium">아침 집중 명상</span></div>
          <div className="flex justify-between">총 시간<span className="text-[#0F172A] font-medium">10분 00초</span></div>
        </div>

        {/* 메모 입력 */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-[#64748B] uppercase">한 줄 메모</label>
          <input type="text" placeholder="오늘 명상은 어땠나요?" 
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45947D] placeholder:text-[#6B7280]" />
        </div>

        {/* 카드들 */}
        <FeedbackCard 
          title="LF/HF 변화" value="1.2" unit="ratio" decrease="15%"
          start={{ val: 1.41, percent: "75%" }} end={{ val: 1.2, percent: "60%" }} 
        />
        
        <FeedbackCard 
          title="심박수 변화" value="62" unit="BPM" decrease="8%"
          start={{ val: 68, percent: "85%" }} end={{ val: 62, percent: "75%" }} 
        />

        <button className="w-full bg-[#6BE6C1] text-[#0F172A] py-5 rounded-2xl font-bold text-xl shadow-lg shadow-[#6BE6C1]/20 active:scale-[0.95] transition-all">
          저장하기
        </button>
      </main>
    </div>
  );
}