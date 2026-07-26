import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ContentTypeToggle, { type ContentType } from '../components/Upload/ContentTypeToggle';
import AudioUploadBox from '../components/Upload/AudioUploadBox';
import BackgroundPicker from '../components/Upload/BackgroundPicker';
import MetadataForm from '../components/Upload/MetadataForm';
import PageContainer from '../components/Layout/PageContainer';
import { useContents } from '../contexts/ContentsContext';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addContent } = useContents();

  const [contentType, setContentType] = useState<ContentType>('voice');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [background, setBackground] = useState<string | null>('/images/medi5.jpg');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(audioFile && background && title.trim());

  // 업로드한 오디오 파일의 실제 길이(초)를 읽어온다.
  const getAudioDurationSeconds = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => reject(new Error('오디오 길이를 읽어올 수 없습니다.'));
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || !background || !audioFile) return;
    setSubmitting(true);
    try {
      // TODO: api/meditation.ts 의 uploadMeditationContent() 로 교체
      // const formData = new FormData();
      // formData.append('type', contentType);
      // formData.append('audio', audioFile);
      // formData.append('background', background);
      // formData.append('title', title);
      // formData.append('description', description);
      // await uploadMeditationContent(formData);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 실제 업로드한 파일 길이(분, 최소 1분)와 선택한 콘텐츠 타입에 맞는 태그를 사용
      let minutes = 0;
      try {
        const durationSeconds = await getAudioDurationSeconds(audioFile);
        minutes = Math.max(1, Math.round(durationSeconds / 60));
      } catch (err) {
        console.warn('오디오 길이 계산 실패:', err);
      }
      const tag = contentType === 'voice' ? '음성 가이드' : '명상 음악';

      // 프론트 상태로 콘텐츠 목록 최상단에 반영
      const audioUrl = URL.createObjectURL(audioFile);
      addContent({ title, description, imageUrl: background, audioUrl, minutes, tag });

      navigate('/contents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="h-[100svh] flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <div className="flex items-center gap-3 px-5 pt-6 pb-2">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/[0.07] flex items-center justify-center text-accent dark:text-[#F5F3EF]"
          >
            <ArrowLeft size={17} />
          </button>
          <h1 className="text-lg font-bold text-accent dark:text-[#F5F3EF]">새 명상 콘텐츠 업로드</h1>
        </div>

        <div className="px-5 flex flex-col gap-8 pt-6 pb-10">
          <section>
            <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-3">콘텐츠 타입 선택</p>
            <ContentTypeToggle value={contentType} onChange={setContentType} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-3">오디오 파일 업로드</p>
            <AudioUploadBox file={audioFile} onFileSelect={setAudioFile} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-3">배경 선택</p>
            <BackgroundPicker selected={background} onSelect={setBackground} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent dark:text-[#F5F3EF] mb-3">정보 입력</p>
            <MetadataForm
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
            />
          </section>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full py-3.5 rounded-2xl bg-primary text-accent font-bold text-sm
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? '업로드 중...' : '업로드 및 게시'}
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Upload;
