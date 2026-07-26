export type ContentCategory = 'sleep' | 'focus' | 'stress' | 'other';

export interface MeditationContentItem {
  id: number;
  title: string;
  minutes: number;
  author: string;
  imageUrl: string;
  tag: string;
  likes: number;
  isLiked: boolean;
  category: ContentCategory;
}

// 홈(최근에 들은 명상/좋아요한 콘텐츠)과 콘텐츠 탭이 공유하는 단일 데이터 소스.
// 콘텐츠 화면에 있던 제목/작성자를 기준으로 통일했고, 이미지도 홈에 이미 있던 실제 파일을 그대로 사용한다.
export const MEDITATION_CONTENTS: MeditationContentItem[] = [
  {
    id: 1,
    title: '아침을 시작하는 긍정 명상',
    minutes: 10,
    author: 'BioCalm',
    imageUrl: '/images/medi4.jpg',
    tag: '음성 가이드',
    likes: 1,
    isLiked: true,
    category: 'other',
  },
  {
    id: 2,
    title: '깊은 잠을 위한 수면 유도',
    minutes: 15,
    author: 'BioCalm',
    imageUrl: '/images/medi6.jpg',
    tag: '명상 음악',
    likes: 3,
    isLiked: true,
    category: 'sleep',
  },
  {
    id: 3,
    title: '스트레스 해소를 위한 호흡',
    minutes: 5,
    author: 'BioCalm',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFl04oEf-6kGTknyHrQ1inAXLzzU1bs2ceIl0S0vn4TqvxzqwNelwFIelKT3JTHBhm-n2xbfsYwj7CSNDVkZXtUrjxzEeEYqlWtU-4Xv1TOoFQMIVZ7ec4JkPGnhTQT2OSQjXFVuj0btouvZYzRvHk2Sv53IB0P1ygxoagBr7hOiTUbSCXpGFm6HEEWDdWb8EisOnkOk_9F_3GGiVDlzmG9lHqnNsK7FfI6SGnSQ6zC5CV6jWny89bcEO6AoM0JC7T60sNJClBdDpB',
    tag: '명상 음악',
    likes: 2,
    isLiked: true,
    category: 'stress',
  },
  {
    id: 4,
    title: '집중력 향상 사운드스케이프',
    minutes: 25,
    author: 'BioCalm',
    imageUrl: '/images/medi5.jpg',
    tag: '명상 음악',
    likes: 0,
    isLiked: false,
    category: 'focus',
  },
];
