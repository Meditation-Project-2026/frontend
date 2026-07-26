import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';
import TodayMessageCard from '../components/Profile/TodayMessageCard';
import StatsCards from '../components/Profile/StatsCards';
import MeditationCalendar from '../components/Profile/MeditationCalendar';
import DaySessionList from '../components/Profile/DaySessionList';
import PageContainer from '../components/Layout/PageContainer';
import type { ProfileStats } from '../types/content';
import { useSessions, toDateKey } from '../contexts/SessionsContext';

// TODO: api/meditation.ts 의 getProfile() 로 교체
const MOCK_STATS: ProfileStats = {
  totalSessions: 4,
  longestStreakDays: 1,
  totalMinutes: 0 * 60 + 21,
};

const WEEKDAY_KOR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { sessionsByDate } = useSessions();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  // 현재 보고 있는 년/월 기준으로 기록이 있는 날짜들만 추림
  const sessionDays = useMemo(() => {
    const days = new Set<number>();
    Object.keys(sessionsByDate).forEach((key) => {
      const [y, m, d] = key.split('-').map(Number);
      if (y === year && m === month && (sessionsByDate[key]?.length ?? 0) > 0) {
        days.add(d);
      }
    });
    return days;
  }, [sessionsByDate, year, month]);

  const sessionsForSelectedDay = selectedDay
    ? sessionsByDate[toDateKey(new Date(year, month - 1, selectedDay))] ?? []
    : [];

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

  return (
    <PageContainer className="pb-6">
      <ProfileHeader nickname="BioCalm" />
      <TodayMessageCard userName="BioCalm" />
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
