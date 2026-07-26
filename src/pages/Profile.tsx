import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StatsCards from '../components/Profile/StatsCards';
import MeditationCalendar from '../components/Profile/MeditationCalendar';
import DaySessionList from '../components/Profile/DaySessionList';
import PageContainer from '../components/Layout/PageContainer';
import type { DaySession, ProfileStats } from '../types/content';

const MOCK_STATS: ProfileStats = {
  totalSessions: 4,
  longestStreakDays: 1,
  totalMinutes: 21,
};

const INITIAL_SESSIONS_BY_DAY: Record<number, DaySession[]> = {
  5: [
    { id: 1, title: '10분 호흡 명상', time: '오전 10:30', logId: 1001 },
    { id: 2, title: '15분 감사 명상', time: '오후 9:00', logId: 1002 },
  ],
  8: [{ id: 3, title: '아침을 시작하는 긍정 명상', time: '오전 7:15', logId: 1003 }],
};

const WEEKDAY_KOR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(26); // 기본선택 15일

  // -----------------------------------------------------------------
  // 🗓️ [눈속임 26일 저장 데이터 연동]
  // -----------------------------------------------------------------
  const [sessionsByDay, setSessionsByDay] = useState<Record<number, DaySession[]>>(INITIAL_SESSIONS_BY_DAY);

  useEffect(() => {
    // 피드백 화면에서 저장하기 누른 기록이 있는지 확인
    const savedData = localStorage.getItem('savedRecord_2026-07-26');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const newRecordSession: DaySession = {
          id: 999,
          title: parsed.title || '스트레스 해소를 위한 호흡',
          time: parsed.time || '오후 1:00',
          logId: Number(parsed.logId) || 172,
        };

        // 15일 및 26일 세션 데이터 업데이트
        setSessionsByDay((prev) => ({
          ...prev,
          15: [newRecordSession],
          26: [newRecordSession],
        }));
      } catch (e) {}
    } else {
      setSessionsByDay((prev) => ({
        ...prev,
        15: [{ id: 4, title: '스트레스 해소를 위한 호흡', time: '오후 1:00', logId: 1004 }],
      }));
    }
  }, []);

  const sessionDays = useMemo(() => new Set(Object.keys(sessionsByDay).map(Number)), [sessionsByDay]);

  const handleSessionClick = (sessionId: number) => {
    const session = sessionsForSelectedDay.find((s) => s.id === sessionId);
    if (session) {
      // 🚀 readOnly=true 파라미터를 추가하여 읽기 전용 모드로 피드백 화면 출력
      navigate(`/meditation-feedback?logId=${session.logId}&readOnly=true`);
    }
  };

  const handlePrevMonth = () => {
    setSelectedDay(null);
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDay(null);
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const dateLabel = selectedDay
    ? `${month}월 ${selectedDay}일, ${WEEKDAY_KOR[new Date(year, month - 1, selectedDay).getDay()]}`
    : '날짜를 선택해주세요';

  const sessionsForSelectedDay = selectedDay ? sessionsByDay[selectedDay] ?? [] : [];

  return (
    <PageContainer className="pb-6">
      <ProfileHeader nickname="BioCalm" />
      <StatsCards stats={MOCK_STATS} />
      <MeditationCalendar
        year={year}
        month={month}
        sessionDays={sessionDays}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <DaySessionList dateLabel={dateLabel} sessions={sessionsForSelectedDay} onSessionClick={handleSessionClick} />
    </PageContainer>
  );
};

export default Profile;