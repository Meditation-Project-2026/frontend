import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Pencil } from 'lucide-react';
import type { MeditationFeedbackResponse } from '../api/meditation';
import Header from "../components/Header";
import { FeedbackCard } from "../components/MeditationFeedback/FeedbackCard";
import { getMeditationFeedback, updateUserNote } from '../api/meditation';
import { MEDITATION_CONTENTS } from '../data/meditationContents';

interface FeedbackState {
  data: MeditationFeedbackResponse | null;
  loading: boolean;
  error: string | null;
}

// 디자인 확인용 목데이터. 실제 백엔드에 없는 logId로는 화면을 볼 수 없어서 추가함.
// /meditation-feedback?preview=1 로 접속하면 API 호출 없이 이 데이터로 바로 렌더링됨.
// resultStatus를 FAILURE로 둬서 "추천 명상" 섹션(실패 시에만 노출)도 미리 확인할 수 있게 함.
const MOCK_FEEDBACK: MeditationFeedbackResponse = {
  meditationDate: new Date().toISOString(),
  title: '10분 아침 명상',
  totalDuration: '612',
  lfhf: { start: 1.62, end: 0.84, changeRate: -48.1 },
  heartRate: { start: 78, end: 66, diff: -12 },
  resultStatus: 'FAILURE',
  userNote: null,
  // 기존 콘텐츠(콘텐츠 탭과 동일한 데이터)를 그대로 추천 목록으로 사용
  recommendedMeditations: MEDITATION_CONTENTS.slice(1, 3).map((c) => ({
    id: c.id,
    title: c.title,
    backgroundUrl: c.imageUrl,
  })),
};

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('logId');
  const isPreview = searchParams.get('preview') === '1' || !logId;

  const [feedback, setFeedback] = useState<FeedbackState>({
    data: null,
    loading: true,
    error: null,
  });

  const [userNote, setUserNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editableTitle, setEditableTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  // 📊 피드백 데이터 로드 및 폴링 로직 구현
  useEffect(() => {
    if (isPreview) {
      // 목데이터로 즉시 렌더링 (API 호출 없음)
      // ?title=콘텐츠제목 으로 넘어온 경우 그 제목을 그대로 반영 (실제로는 logId 기준으로 서버가 내려주는 값)
      const titleParam = searchParams.get('title');
      const previewData = titleParam ? { ...MOCK_FEEDBACK, title: titleParam } : MOCK_FEEDBACK;
      setFeedback({ data: previewData, loading: false, error: null });
      setUserNote(MOCK_FEEDBACK.userNote || '');
      setEditableTitle(previewData.title);
      return;
    }

    if (!logId) return;

    let timerId: ReturnType<typeof setTimeout>;

    const loadFeedback = async () => {
      try {
        const data = await getMeditationFeedback(parseInt(logId));

        if (data.resultStatus !== 'SUCCESS' && data.resultStatus !== 'FAILURE') {
          setFeedback({ data: null, loading: true, error: null });
          timerId = setTimeout(loadFeedback, 1500);
        } else {
          setFeedback({ data, loading: false, error: null });
          setUserNote(data.userNote || '');
          setEditableTitle(data.title);
        }
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

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [logId, isPreview]);

  // 💾 사용자 노트 저장 및 홈 이동 로직
  const handleSaveNote = async () => {
    if (isPreview) {
      // 미리보기 모드에서는 실제 저장 API가 없으니 그냥 홈으로 이동만
      navigate('/home');
      return;
    }

    if (!logId) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateUserNote({
        logId: parseInt(logId),
        userNote: userNote,
        title: editableTitle,
      });

      setSaveMessage({
        type: 'success',
        text: '메모가 저장되었습니다!',
      });

      setTimeout(() => {
        setSaveMessage(null);
        navigate('/home');
      }, 1500);
    } catch (err) {
      console.error('Failed to save note:', err);
      setSaveMessage({
        type: 'error',
        text: '메모 저장에 실패했습니다.',
      });
      setIsSaving(false);
    }
  };

  // 📅 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 시간 포맷팅 (초 -> OO분 OO초)
  const formatDuration = (seconds: string | number): string => {
    const sec = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    if (isNaN(sec) || sec < 0) return '0';
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}분 ${s}초`;
  };

  let totalDuration = feedback.data?.totalDuration;
  const lastMeditationTime = localStorage.getItem('lastMeditationTime');
  if (lastMeditationTime && !isNaN(Number(lastMeditationTime))) {
    totalDuration = String(Number(lastMeditationTime));
  }

  // 로딩 중 (디자인 수정 버전)
  if (feedback.loading) {
    return (
      <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] text-[#2D3142] dark:text-[#F5F3EF] flex flex-col overflow-hidden">
        <Header title="명상 피드백" onBack={() => navigate(-1)} />
        <div className="flex-1 flex flex-col items-center justify-center pb-20 overflow-y-auto hide-scrollbar">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#45947D]"></div>
            <p className="mt-4 text-[#64748B] dark:text-[#F5F3EF]/50 font-medium animate-pulse">
              피드백 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (feedback.error || !feedback.data) {
    return (
      <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] text-[#2D3142] dark:text-[#F5F3EF] flex flex-col overflow-hidden">
        <Header title="명상 피드백" onBack={() => navigate(-1)} />
        <main className="flex-1 flex items-center justify-center px-6 overflow-y-auto hide-scrollbar">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-bold mb-4">{feedback.error || '데이터를 불러올 수 없습니다.'}</p>
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

  const lfhfStart = data.lfhf.start !== null && data.lfhf.start !== undefined ? Number(data.lfhf.start.toFixed(2)) : 0;
  const lfhfEnd = data.lfhf.end !== null && data.lfhf.end !== undefined ? Number(data.lfhf.end.toFixed(2)) : 0;
  const lfhfChange = data.lfhf.changeRate !== null && data.lfhf.changeRate !== undefined ? Number(data.lfhf.changeRate.toFixed(1)) : 0;
  const hrStart = data.heartRate.start !== null && data.heartRate.start !== undefined ? Math.round(data.heartRate.start) : 0;
  const hrEnd = data.heartRate.end !== null && data.heartRate.end !== undefined ? Math.round(data.heartRate.end) : 0;
  const hrChange = data.heartRate.diff !== null && data.heartRate.diff !== undefined ? Math.round(data.heartRate.diff) : 0;

  let resultText = '';
  if (lfhfChange !== 0 && !isNaN(Number(lfhfChange))) {
    if (Number(lfhfChange) > 0) {
      resultText = '깊은 이완 상태에 도달하셨습니다. 심신이 안정된 상태입니다.';
    } else {
      resultText = '명상 중 잡념이 많으셨나요? 호흡에 조금 더 집중해보세요.';
    }
  } else {
    resultText = isSuccess ? '명상 성공을 통해 안정되었습니다.' : '명상 미완성';
  }

  let resultColor = '';
  if (lfhfChange !== 0 && !isNaN(Number(lfhfChange))) {
    if (Number(lfhfChange) > 0) {
      resultColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    } else {
      resultColor = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    }
  } else {
    resultColor = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  }

  return (
    <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] text-[#2D3142] dark:text-[#F5F3EF] flex flex-col overflow-hidden">
      <Header title="명상 피드백" onBack={() => navigate(-1)} />

      {/* 🚀 [수정] space-y-8을 space-y-5로 변경하여 요소들 사이의 간격을 좁혔습니다. */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 space-y-5">
        {/* 1. 기본 정보 섹션 */}
        <div className="space-y-3 text-sm border-b border-gray-100 dark:border-white/[0.07] text-[#64748B] dark:text-[#F5F3EF]/50 pb-4">
          <div className="flex justify-between">
            <span>날짜</span>
            <span className="text-[#0F172A] dark:text-[#F5F3EF] font-medium">{formatDate(data.meditationDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>명상</span>
            {isEditingTitle ? (
              <input
                autoFocus
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                }}
                className="text-right bg-transparent border-b border-primary text-[#0F172A] dark:text-[#F5F3EF] font-medium outline-none max-w-[60%]"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 text-[#0F172A] dark:text-[#F5F3EF] font-medium"
              >
                {editableTitle || data.title}
                <Pencil size={12} className="text-gray-300 dark:text-white/30" />
              </button>
            )}
          </div>
          <div className="flex justify-between">
            <span>총 시간</span>
            <span className="text-[#0F172A] dark:text-[#F5F3EF] font-medium">{formatDuration(totalDuration || 0)}</span>
          </div>
        </div>

        {/* 2. 한 줄 메모 입력창 */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-[#64748B] dark:text-[#F5F3EF]/50 uppercase">한 줄 메모</label>
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="오늘 명상은 어땠나요?"
            className="w-full bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-xl px-4 py-3 text-sm text-[#2D3142] dark:text-[#F5F3EF] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45947D] placeholder:text-[#6B7280] dark:placeholder:text-white/40"
          />
        </div>

        {/* 3. 메모 저장 상태 메시지 */}
        {saveMessage && (
          <div
            className={`p-4 rounded-lg text-center font-semibold text-sm ${
              saveMessage.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className={`p-4 rounded-lg text-center font-semibold text-sm shadow-sm ${resultColor}`}>
          {resultText}
        </div>

        {/* 4. 최종 생체 데이터 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
            <p className="text-xs text-gray-400 dark:text-white/50 mb-1">최종 심박수</p>
            <p className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
              {hrEnd || '-'} <span className="text-xs font-medium text-gray-400 dark:text-white/40">BPM</span>
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
            <p className="text-xs text-gray-400 dark:text-white/50 mb-1">최종 스트레스 지수</p>
            <p className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">{lfhfEnd || '-'}</p>
          </div>
        </div>

        {/* 4-1. 전후 비교 카드 (요청에 따라 최종값 카드와 함께 유지, 심박수를 먼저) */}
        <FeedbackCard
          title="심박수 변화"
          value={hrEnd}
          unit="BPM"
          change={`${hrChange !== 0 ? Math.abs(Number(hrChange)) : 0}bpm`}
          start={{ val: hrStart, percent: `${hrStart !== 0 ? Math.min((hrStart / 120) * 100, 100) : 0}%` }}
          end={{ val: hrEnd, percent: `${hrEnd !== 0 ? Math.min((hrEnd / 120) * 100, 100) : 0}%` }}
        />

        <FeedbackCard
          title="스트레스 지수 변화"
          value={lfhfEnd}
          unit="ratio"
          change={`${lfhfChange !== 0 ? Math.abs(Number(lfhfChange)).toFixed(1) : 0}%`}
          start={{ val: lfhfStart, percent: `${lfhfStart !== 0 ? Math.min(lfhfStart * 30, 100) : 0}%` }}
          end={{ val: lfhfEnd, percent: `${lfhfEnd !== 0 ? Math.min(lfhfEnd * 30, 100) : 0}%` }}
        />

        {/* 5. 추천 명상 섹션 (실패 시에만 출력) */}
        {!isSuccess && data.recommendedMeditations.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-[#191B1F] dark:text-[#F5F3EF] mb-3">추천 명상</h3>
            <div className="flex flex-col gap-2.5">
              {data.recommendedMeditations.map((meditation) => (
                <button
                  key={meditation.id}
                  onClick={() => navigate(`/face-detection?id=${meditation.id}&type=full`)}
                  className="w-full flex items-center gap-3 p-3 bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl text-left active:scale-[0.98] transition-transform"
                >
                  {meditation.backgroundUrl && (
                    <div
                      className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${meditation.backgroundUrl})` }}
                    />
                  )}
                  <p className="flex-1 min-w-0 text-sm font-bold text-[#191B1F] dark:text-[#F5F3EF] truncate">
                    {meditation.title}
                  </p>
                  <ChevronRight size={16} className="text-gray-300 dark:text-white/30 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. 저장하기 버튼 */}
        <button
          onClick={handleSaveNote}
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-bold text-base shadow-sm active:scale-[0.98] transition-all !mt-8 ${
            isSaving
              ? 'bg-gray-300 dark:bg-[#1E212B] text-gray-500 dark:text-[#F5F3EF]/30 cursor-not-allowed'
              : 'bg-[#6BE6C1] text-[#0F172A] hover:bg-[#5FD4A3]'
          }`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </main>
    </div>
  );
}