import React, { createContext, useContext, useState } from 'react';
import { MEDITATION_CONTENTS, type MeditationContentItem } from '../data/meditationContents';

export interface UploadedContent extends MeditationContentItem {
  description?: string;
  audioUrl?: string;
  isUploaded?: boolean;
}

interface AddContentInput {
  title: string;
  description: string;
  imageUrl: string;
  audioUrl?: string;
  minutes: number;
  tag: string;
}

interface ContentsContextType {
  contents: UploadedContent[];
  addContent: (input: AddContentInput) => number;
  toggleLike: (id: number) => void;
}

const ContentsContext = createContext<ContentsContextType | undefined>(undefined);

export const useContents = () => {
  const ctx = useContext(ContentsContext);
  if (!ctx) throw new Error('useContents must be used within a ContentsProvider');
  return ctx;
};

// 업로드한 콘텐츠는 기존 목데이터(id 1~4)와 겹치지 않도록 1000번대부터 부여한다.
let nextUploadedId = 1000;

export const ContentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 좋아요 상태를 홈/콘텐츠 화면이 같이 보고 바꿀 수 있도록 base 콘텐츠도 state로 관리한다.
  const [baseContents, setBaseContents] = useState<UploadedContent[]>(MEDITATION_CONTENTS);
  const [uploadedContents, setUploadedContents] = useState<UploadedContent[]>([]);

  const addContent = ({ title, description, imageUrl, audioUrl, minutes, tag }: AddContentInput): number => {
    const id = nextUploadedId++;
    const newItem: UploadedContent = {
      id,
      title,
      minutes,
      author: '나',
      imageUrl,
      tag,
      likes: 0,
      isLiked: false,
      category: 'other' as const,
      description,
      audioUrl,
      isUploaded: true,
    };
    // 최상단에 추가
    setUploadedContents((prev) => [newItem, ...prev]);
    return id;
  };

  const toggleLike = (id: number) => {
    const updater = (item: UploadedContent) =>
      item.id === id
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? Math.max(0, item.likes - 1) : item.likes + 1 }
        : item;

    setBaseContents((prev) => prev.map(updater));
    setUploadedContents((prev) => prev.map(updater));
  };

  const contents: UploadedContent[] = [...uploadedContents, ...baseContents];

  return (
    <ContentsContext.Provider value={{ contents, addContent, toggleLike }}>
      {children}
    </ContentsContext.Provider>
  );
};
