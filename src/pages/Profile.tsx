import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';
import TodayMessageCard from '../components/Profile/TodayMessageCard';
import StatsCards from '../components/Profile/StatsCards';
import MeditationCalendar from '../components/Profile/MeditationCalendar';
import DaySessionList from '../components/Profile/DaySessionList';
import PageContainer from '../components/Layout/PageContainer';
import type { ProfileStats } from '../types/content';

interface CalendarItem {
  logId: number;
  day: number;
  startedAt: string;
  title: string;
  totalDuration: number;
}

const WEEKDAY_KOR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate()); // 👈 오늘 날짜로 초기 선택

  // 1. 상단 통계 상태
  const [stats, setStats] = useState<ProfileStats>({
    totalSessions: 0,
    longestStreakDays: 0,
    totalMinutes: 0,
  });

  // 2. 캘린더 기록 목록 상태
  const [calendarLogs, setCalendarLogs] = useState<CalendarItem[]>([]);

  // 🚀 상단 통계 불러오기 (GET /main/users/me/stats)
  useEffect(() => {
    fetch('http://localhost:8080/main/users/me/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalSessions: data.totalCount,
          longestStreakDays: data.longestStreak,
          totalMinutes: data.totalMinutes,
        });
      })
      .catch((err) => console.error('통계 조회 실패:', err));
  }, []);

  // 🚀 월별 기록 불러오기 (GET /main/records/calendar?year=...&month=...)
  useEffect(() => {
    fetch(`http://localhost:8080/main/records/calendar?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data: CalendarItem[]) => {
        setCalendarLogs(data);
      })
      .catch((err) => console.error('캘린더 기록 조회 실패:', err));
  }, [year, month]);

  // 🚀 백엔드에서 받은 기록들 중 날짜(day)만 모아서 점(dot) 표시용 Set 생성
  const sessionDays = useMemo(() => {
    return new Set<number>(calendarLogs.map((item) => item.day));
  }, [calendarLogs]);

  // 🚀 선택된 날짜에 해당하는 세션 목록 필터링
  const sessionsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return calendarLogs
      .filter((item) => item.day === selectedDay)
      .map((item) => ({
        id: item.logId,
        logId: item.logId,
        title: item.title,
        time: new Date(item.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${Math.floor(item.totalDuration / 60)}분 ${item.totalDuration % 60}초`,
      }));
  }, [calendarLogs, selectedDay]);

  const handleSessionClick = (sessionId: number) => {
    const session = sessionsForSelectedDay.find((s) => s.id === sessionId);
    if (session) navigate(`/meditation-feedback?logId=${session.logId}&readOnly=true`);
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
      <StatsCards stats={stats} />
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