import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StepProgress from '../components/Upload/StepProgress';
import ContentTypeToggle, { type ContentType } from '../components/Upload/ContentTypeToggle';
import AudioUploadBox from '../components/Upload/AudioUploadBox';
import BackgroundPicker from '../components/Upload/BackgroundPicker';
import MetadataForm from '../components/Upload/MetadataForm';
import PageContainer from '../components/Layout/PageContainer';
import type { ThumbnailTheme } from '../types/content';

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const [contentType, setContentType] = useState<ContentType>('voice');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [background, setBackground] = useState<ThumbnailTheme | null>('night');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(audioFile && background && title.trim());

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: api/meditation.ts 의 uploadMeditationContent() 로 교체
      // const formData = new FormData();
      // formData.append('type', contentType);
      // formData.append('audio', audioFile!);
      // formData.append('background', background!);
      // formData.append('title', title);
      // formData.append('description', description);
      // await uploadMeditationContent(formData);
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate('/contents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="h-[100svh] flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <div className="flex items-center gap-3 px-5 pt-6">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-accent"
          >
            <ArrowLeft size={17} />
          </button>
          <h1 className="text-base font-bold text-accent">새 명상 콘텐츠 업로드</h1>
        </div>

        <StepProgress totalSteps={4} currentStep={1} />

        <div className="px-5 flex flex-col gap-8 pb-10">
          <section>
            <p className="text-sm font-bold text-accent mb-3">1단계: 콘텐츠 타입 선택</p>
            <ContentTypeToggle value={contentType} onChange={setContentType} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent mb-3">2단계: 오디오 파일 업로드</p>
            <AudioUploadBox file={audioFile} onFileSelect={setAudioFile} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent mb-3">3단계: 배경 선택</p>
            <BackgroundPicker selected={background} onSelect={setBackground} />
          </section>

          <section>
            <p className="text-sm font-bold text-accent mb-3">4단계: 정보 입력</p>
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
