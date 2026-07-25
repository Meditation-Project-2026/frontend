import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';
import StatsCards from '../components/Profile/StatsCards';
import MeditationCalendar from '../components/Profile/MeditationCalendar';
import DaySessionList from '../components/Profile/DaySessionList';
import PageContainer from '../components/Layout/PageContainer';
import type { DaySession, ProfileStats } from '../types/content';

// TODO: api/meditation.ts 의 getProfile() / getSessionsByMonth() 로 교체
const MOCK_STATS: ProfileStats = {
  totalSessions: 150,
  longestStreakDays: 30,
  totalMinutes: 25 * 60 + 10,
};

const MOCK_SESSIONS_BY_DAY: Record<number, DaySession[]> = {
  5: [
    { id: 1, title: '10분 호흡 명상', time: '오전 10:30', logId: 1001 },
    { id: 2, title: '15분 감사 명상', time: '오후 9:00', logId: 1002 },
  ],
  8: [{ id: 3, title: '아침을 시작하는 긍정 명상', time: '오전 7:15', logId: 1003 }],
  15: [{ id: 4, title: '스트레스 해소를 위한 호흡', time: '오후 1:00', logId: 1004 }],
};

const WEEKDAY_KOR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const sessionDays = useMemo(() => new Set(Object.keys(MOCK_SESSIONS_BY_DAY).map(Number)), []);

  const handleSessionClick = (sessionId: number) => {
    const session = sessionsForSelectedDay.find((s) => s.id === sessionId);
    if (session) navigate(`/meditation-feedback?logId=${session.logId}`);
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

  const sessionsForSelectedDay = selectedDay ? MOCK_SESSIONS_BY_DAY[selectedDay] ?? [] : [];

  return (
    <PageContainer className="pb-6">
      <ProfileHeader nickname="사용자 닉네임" />
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
