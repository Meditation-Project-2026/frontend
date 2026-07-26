import type { ContentCategory } from '../data/meditationContents';

export interface MeditationContent {
  id: number;
  title: string;
  minutes: number;
  author: string;
  likes: number;
  imageUrl: string;
  tag: string;
  isLiked: boolean;
  category: ContentCategory;
}

export interface DaySession {
  id: number;
  title: string;
  time: string;
  // 프로필 목록에서는 time 대신 이 한 줄 메모를 보여준다.
  note: string;
  logId: number;
}

export interface ProfileStats {
  totalSessions: number;
  longestStreakDays: number;
  totalMinutes: number;
}
