import React, { createContext, useContext, useState } from 'react';
import type { DaySession } from '../types/content';

export type SessionsByDate = Record<string, DaySession[]>; // key: 'YYYY-MM-DD'

interface SessionsContextType {
  sessionsByDate: SessionsByDate;
  addSession: (date: Date, session: Omit<DaySession, 'id'>) => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export const useSessions = () => {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error('useSessions must be used within a SessionsProvider');
  return ctx;
};

export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 프로필 캘린더에 처음부터 보여줄 목데이터 (이번 달 5일/8일/15일).
// TODO: 실제로는 api/meditation.ts 의 getSessionsByMonth() 로 교체.
const buildInitialMock = (): SessionsByDate => {
  const now = new Date();
  const dateFor = (day: number) => toDateKey(new Date(now.getFullYear(), now.getMonth(), day));
  return {
    [dateFor(5)]: [
      { id: 1, title: '10분 호흡 명상', time: '오전 10:30', logId: 1001 },
      { id: 2, title: '15분 감사 명상', time: '오후 9:00', logId: 1002 },
    ],
    [dateFor(8)]: [{ id: 3, title: '아침을 시작하는 긍정 명상', time: '오전 7:15', logId: 1003 }],
    [dateFor(15)]: [{ id: 4, title: '스트레스 해소를 위한 호흡', time: '오후 1:00', logId: 1004 }],
  };
};

let nextSessionId = 5000;

export const SessionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionsByDate, setSessionsByDate] = useState<SessionsByDate>(() => buildInitialMock());

  const addSession = (date: Date, session: Omit<DaySession, 'id'>) => {
    const key = toDateKey(date);
    const newSession: DaySession = { ...session, id: nextSessionId++ };
    setSessionsByDate((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), newSession],
    }));
  };

  return (
    <SessionsContext.Provider value={{ sessionsByDate, addSession }}>
      {children}
    </SessionsContext.Provider>
  );
};
