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
}

interface ContentsContextType {
  contents: UploadedContent[];
  addContent: (input: AddContentInput) => number;
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
  const [uploadedContents, setUploadedContents] = useState<UploadedContent[]>([]);

  const addContent = ({ title, description, imageUrl, audioUrl }: AddContentInput): number => {
    const id = nextUploadedId++;
    const newItem: UploadedContent = {
      id,
      title,
      minutes: 0,
      author: '나',
      imageUrl,
      tag: '내가 업로드',
      likes: 0,
      description,
      audioUrl,
      isUploaded: true,
    };
    // 최상단에 추가
    setUploadedContents((prev) => [newItem, ...prev]);
    return id;
  };

  const contents: UploadedContent[] = [...uploadedContents, ...MEDITATION_CONTENTS];

  return (
    <ContentsContext.Provider value={{ contents, addContent }}>
      {children}
    </ContentsContext.Provider>
  );
};
