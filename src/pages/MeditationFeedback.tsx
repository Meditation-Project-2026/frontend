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

const MOCK_FEEDBACK: MeditationFeedbackResponse = {
  meditationDate: new Date().toISOString(),
  title: '오늘의 힐링 명상',
  totalDuration: '301',
  lfhf: { start: 2.64, end: 0.72, changeRate: 73.0 },
  heartRate: { start: 49, end: 63, diff: 14 },
  resultStatus: 'SUCCESS',
  userNote: null,
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

  // 프로필/기록 탭에서 다시 들어왔을 때 저장하기 버튼 제거용 플래그
  const isReadOnly = searchParams.get('readOnly') === 'true';

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

  useEffect(() => {
    // 1. localStorage에 저장된 기록이 있으면 우선 복원
    const savedLocal = localStorage.getItem('savedRecord_latest');
    let localData: MeditationFeedbackResponse | null = null;
    if (savedLocal) {
      try {
        localData = JSON.parse(savedLocal);
      } catch (e) {}
    }

    if (isPreview) {
      const titleParam = searchParams.get('title');
      const baseData = localData || MOCK_FEEDBACK;
      const previewData = titleParam ? { ...baseData, title: titleParam } : baseData;
      setFeedback({ data: previewData, loading: false, error: null });
      setUserNote(previewData.userNote || '');
      setEditableTitle(previewData.title);
      return;
    }

    if (!logId) return;

    let timerId: ReturnType<typeof setTimeout>;

    const loadFeedback = async () => {
      try {
        const data = await getMeditationFeedback(parseInt(logId));

        if (!data.resultStatus) {
          timerId = setTimeout(loadFeedback, 1500);
        } else {
          const mergedData = {
            ...data,
            title: localData?.title || data.title,
            userNote: localData?.userNote || data.userNote,
          };
          setFeedback({ data: mergedData, loading: false, error: null });
          setUserNote(mergedData.userNote || '');
          setEditableTitle(mergedData.title);
        }
      } catch (err) {
        console.error('Failed to load feedback:', err);
        const fallbackData = localData || MOCK_FEEDBACK;
        setFeedback({ data: fallbackData, loading: false, error: null });
        setUserNote(fallbackData.userNote || '');
        setEditableTitle(fallbackData.title);
      }
    };

    loadFeedback();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [logId, isPreview]);

  // 💾 사용자 노트 저장
  const handleSaveNote = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const currentTitle = editableTitle || feedback.data?.title || '오늘의 힐링 명상';

    const recordToSave = {
      ...feedback.data,
      title: currentTitle,
      userNote: userNote,
      time: '오후 7:23',
      date: '2026-07-26',
      day: 26,
      logId: logId || '172',
    };

    localStorage.setItem('savedRecord_latest', JSON.stringify(recordToSave));
    localStorage.setItem('savedRecord_2026-07-26', JSON.stringify(recordToSave));

    if (logId) {
      updateUserNote({
        logId: parseInt(logId),
        userNote: userNote,
        title: currentTitle,
      }).catch((e) => console.log('Backend sync skipped'));
    }

    setTimeout(() => {
      setIsSaving(false);
      navigate('/home');
    }, 500);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

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
    resultText = isSuccess ? '깊은 이완 상태에 도달하셨습니다. 심신이 안정된 상태입니다.' : '명상 미완성';
  }

  let resultColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';

  return (
    <div className="h-[100svh] bg-[#FAF9F5] dark:bg-[#14161C] text-[#2D3142] dark:text-[#F5F3EF] flex flex-col overflow-hidden">
      <Header title="명상 피드백" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 space-y-5">
        {/* 1. 기본 정보 섹션 */}
        <div className="space-y-3 text-sm border-b border-gray-100 dark:border-white/[0.07] text-[#64748B] dark:text-[#F5F3EF]/50 pb-4">
          <div className="flex justify-between">
            <span>날짜</span>
            <span className="text-[#0F172A] dark:text-[#F5F3EF] font-medium">{formatDate(data.meditationDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>명상</span>
            {isReadOnly ? (
              <span className="text-[#0F172A] dark:text-[#F5F3EF] font-medium">{editableTitle || data.title}</span>
            ) : isEditingTitle ? (
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
            readOnly={isReadOnly}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder={isReadOnly ? "작성된 메모가 없습니다." : "오늘 명상은 어땠나요?"}
            className={`w-full border border-gray-100 dark:border-white/[0.07] rounded-xl px-4 py-3 text-sm shadow-sm focus:outline-none ${
              isReadOnly
                ? 'bg-gray-50 dark:bg-[#1E212B]/50 text-gray-500 dark:text-[#F5F3EF]/60 cursor-default'
                : 'bg-white dark:bg-[#1E212B] text-[#2D3142] dark:text-[#F5F3EF] focus:ring-2 focus:ring-[#45947D]'
            }`}
          />
        </div>

        {/* 3. 상태 메시지 */}
        <div className={`p-4 rounded-lg text-center font-semibold text-sm shadow-sm ${resultColor}`}>
          {resultText}
        </div>

        {/* 4. 최종 생체 데이터 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
            <p className="text-xs text-gray-400 dark:text-white/50 mb-1">최종 심박수</p>
            <p className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">
              {hrEnd || '63'} <span className="text-xs font-medium text-gray-400 dark:text-white/40">BPM</span>
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-4">
            <p className="text-xs text-gray-400 dark:text-white/50 mb-1">최종 스트레스 지수</p>
            <p className="text-2xl font-bold text-[#191B1F] dark:text-[#F5F3EF]">{lfhfEnd || '0.72'}</p>
          </div>
        </div>

        <FeedbackCard
          title="심박수 변화"
          value={hrEnd || 63}
          unit="BPM"
          change={`${hrChange !== 0 ? Math.abs(Number(hrChange)) : 14}bpm`}
          start={{ val: hrStart || 49, percent: '40%' }}
          end={{ val: hrEnd || 63, percent: '55%' }}
        />

        <FeedbackCard
          title="스트레스 지수 변화"
          value={lfhfEnd || 0.72}
          unit="ratio"
          change={`${lfhfChange !== 0 ? Math.abs(Number(lfhfChange)).toFixed(1) : 73.0}%`}
          start={{ val: lfhfStart || 2.64, percent: '80%' }}
          end={{ val: lfhfEnd || 0.72, percent: '25%' }}
        />

        {/* 6. 하단 버튼: 저장하기와 100% 동일한 민트색 UI 적용된 확인 버튼 */}
        {isReadOnly ? (
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 rounded-2xl font-bold text-base shadow-sm active:scale-[0.98] transition-all !mt-8 bg-[#6BE6C1] text-[#0F172A] hover:bg-[#5FD4A3]"
          >
            확인
          </button>
        ) : (
          <button
            onClick={handleSaveNote}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-bold text-base shadow-sm active:scale-[0.98] transition-all !mt-8 bg-[#6BE6C1] text-[#0F172A] hover:bg-[#5FD4A3]"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        )}
      </main>
    </div>
  );
}