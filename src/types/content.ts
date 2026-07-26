export interface MeditationContent {
  id: number;
  title: string;
  minutes: number;
  author: string;
  likes: number;
  imageUrl: string;
  tag: string;
  isLiked: boolean;
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
