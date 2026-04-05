import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { MeditationFeedbackResponse } from '../api/meditation';
import Header from "../components/Header";
import { FeedbackCard } from "../components/MeditationFeedback/FeedbackCard";
import { getMeditationFeedback, updateUserNote } from '../api/meditation';

interface FeedbackState {
  data: MeditationFeedbackResponse | null;
  loading: boolean;
  error: string | null;
}

// 🎭 Mock 데이터
const mockFeedbackData: MeditationFeedbackResponse = {
  meditationDate: '2026-04-05',
  title: '아침 집중 명상',
  totalDuration: '10분 00초',
  lfhf: {
    start: 1.41,
    end: 1.20,
    changeRate: -14.9,
  },
  heartRate: {
    start: 68,
    end: 62,
    diff: -6,
  },
  resultStatus: 'SUCCESS',
  userNote: null,
  recommendedMeditations: [
    {
      id: 2,
      title: '숲 소리 명상',
      backgroundUrl: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=500&h=300&fit=crop',
    },
    {
      id: 3,
      title: '스트레스 해소 명상',
      backgroundUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=500&h=300&fit=crop',
    },
  ],
};

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('logId');

  const [feedback, setFeedback] = useState<FeedbackState>({
    data: null,
    loading: true,
    error: null,
  });

  const [userNote, setUserNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 📊 피드백 데이터 로드
  useEffect(() => {
    const loadFeedback = async () => {
      if (!logId) {
        setFeedback({
          data: null,
          loading: false,
          error: 'logId가 없습니다.',
        });
        return;
      }

      try {
        setFeedback({ data: null, loading: true, error: null });
        
        // 🎭 Mock 데이터 사용 (백엔드 없을 때)
        // 실제 백엔드 연결:
        // const result = await getMeditationFeedback(parseInt(logId));
        
        const result = mockFeedbackData; // ← Mock 데이터
        
        setFeedback({ data: result, loading: false, error: null });
        setUserNote(result.userNote || '');
      } catch (err) {
        console.error('Failed to load feedback:', err);
        setFeedback({
          data: null,
          loading: false,
          error: '피드백 데이터를 불러올 수 없습니다.',
        });
      }
    };

    loadFeedback();
  }, [logId]);

  // 💾 사용자 노트 저장
  const handleSaveNote = async () => {
    if (!logId) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserNote({
        logId: parseInt(logId),
        userNote: userNote,
      });

      setSaveMessage({
        type: 'success',
        text: '메모가 저장되었습니다!',
      });

      setTimeout(() => {
        setSaveMessage(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to save note:', err);
      setSaveMessage({
        type: 'error',
        text: '메모 저장에 실패했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 📅 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 로딩 중
  if (feedback.loading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF] text-[#2D3142] flex items-center justify-center pb-10">
        <Header title="명상 피드백" onBack={() => navigate(-1)} />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#45947D]"></div>
          <p className="mt-4 text-[#64748B]">피드백 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (feedback.error || !feedback.data) {
    return (
      <div className="min-h-screen bg-[#F8FBFF] text-[#2D3142] flex flex-col">
        <Header title="명상 피드백" onBack={() => navigate(-1)} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-red-600 font-bold mb-4">{feedback.error || '데이터를 불러올 수 없습니다.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-[#45947D] text-white rounded-lg font-bold"
            >
              돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { data } = feedback;
  const isSuccess = data.resultStatus === 'SUCCESS';

  const lfhfChange = data.lfhf.changeRate;
  const hrChange = data.heartRate.diff;

  const resultColor = isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const resultText = isSuccess ? '명상 성공을 통해 안정되었습니다.' : '명상 미완성';

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#2D3142] pb-10">
      <Header title="명상 피드백" onBack={() => navigate(-1)} />

      <main className="px-6 space-y-8">
        <div className={`p-4 rounded-lg text-center font-bold text-lg ${resultColor}`}>
          {resultText}
        </div>

        <div className="space-y-4 text-md border-b border-gray-100 text-[#64748B] pb-4">
          <div className="flex justify-between">
            <span>날짜</span>
            <span className="text-[#0F172A] font-medium">{formatDate(data.meditationDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>명상</span>
            <span className="text-[#0F172A] font-medium">{data.title}</span>
          </div>
          <div className="flex justify-between">
            <span>총 시간</span>
            <span className="text-[#0F172A] font-medium">{data.totalDuration}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-[#64748B] uppercase">한 줄 메모</label>
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="오늘 명상은 어땠나요?"
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45947D] placeholder:text-[#6B7280]"
          />
        </div>

        {saveMessage && (
          <div
            className={`p-4 rounded-lg text-center font-bold ${
              saveMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <FeedbackCard
          title="LF/HF 변화"
          value={data.lfhf.end}
          unit="ratio"
          decrease={`${Math.abs(lfhfChange).toFixed(1)}%`}
          start={{ val: data.lfhf.start, percent: `${Math.min(data.lfhf.start * 30, 100)}%` }}
          end={{ val: data.lfhf.end, percent: `${Math.min(data.lfhf.end * 30, 100)}%` }}
        />

        <FeedbackCard
          title="심박수 변화"
          value={data.heartRate.end}
          unit="BPM"
          decrease={`${Math.abs(hrChange)}bpm`}
          start={{ val: data.heartRate.start, percent: `${Math.min((data.heartRate.start / 120) * 100, 100)}%` }}
          end={{ val: data.heartRate.end, percent: `${Math.min((data.heartRate.end / 120) * 100, 100)}%` }}
        />

        {!isSuccess && data.recommendedMeditations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0F172A]">추천 명상</h3>
            <div className="space-y-3">
              {data.recommendedMeditations.map((meditation) => (
                <div
                  key={meditation.id}
                  className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  {meditation.backgroundUrl && (
                    <img
                      src={meditation.backgroundUrl}
                      alt={meditation.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <p className="font-bold text-[#0F172A]">{meditation.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSaveNote}
          disabled={isSaving}
          className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg shadow-[#6BE6C1]/20 active:scale-[0.95] transition-all ${
            isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#6BE6C1] text-[#0F172A] hover:bg-[#5FD4A3]'
          }`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </main>
    </div>
  );
}