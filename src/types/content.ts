export type ThumbnailTheme = 'sunrise' | 'night' | 'ocean' | 'forest';

export interface MeditationContent {
  id: number;
  title: string;
  minutes: number;
  author: string;
  likes: number;
  theme: ThumbnailTheme;
}

export interface DaySession {
  id: number;
  title: string;
  time: string;
  logId: number;
}

export interface ProfileStats {
  totalSessions: number;
  longestStreakDays: number;
  totalMinutes: number;
}
