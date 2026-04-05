import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CameraFrame from "../components/FaceDetection/CameraFrame";
import Header from "../components/Header";
import ProgressCircle from "../components/FaceDetection/ProgressCircle";
import { startMeditation } from '../api/meditation';

const FaceDetection: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meditationId = searchParams.get('id'); // URL에서 meditation ID 받기
  
  const [progress, setProgress] = useState<number>(0);
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 얼굴 인식 진행도 시뮬레이션
  useEffect(() => {
    if (progress >= 100) {
      setIsDetected(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 취소
  const handleCancel = () => {
    setProgress(0);
    setIsDetected(false);
    setError(null);
  };

  // 얼굴 인식 완료 후 명상 시작
  const handleStartMeditation = async () => {
    if (!meditationId) {
      setError('명상 ID가 전달되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await startMeditation(parseInt(meditationId));
      console.log('Meditation started:', result);

      // logId를 저장하고 BreathingMonitor 페이지로 이동
      localStorage.setItem('logId', result.logId.toString());
      localStorage.setItem('startedAt', result.startedAt);

      // BreathingMonitor 페이지로 이동 (logId 전달)
      navigate(`/breathing-monitor?logId=${result.logId}`);
    } catch (err) {
      console.error('Failed to start meditation:', err);
      setError('명상 시작에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto">
      <Header title="Face Detection" onBack={handleBack} rightType="text" rightText="Cancel" onRightClick={handleCancel} />
      
      <main className="flex-1 flex flex-col items-center px-6 w-full relative z-10">
        <div className="w-full text-center mt-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight mb-2">
            명상 전, 카메라를 응시하고<br/>얼굴을 프레임 안에 맞춰주세요.
          </h2>
          <p className="text-sm text-[#6B7280]">
            정확한 측정을 위해 움직임을 최소화해주세요.
          </p>
        </div>

        <CameraFrame />
        <ProgressCircle percentage={Math.round(progress)} />

        {/* 에러 메시지 */}
        {error && (
          <div className="w-full mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 얼굴 감지 완료 후 버튼 표시 */}
        {isDetected && (
          <div className="w-full mt-8 space-y-3">
            <button
              onClick={handleStartMeditation}
              disabled={isLoading}
              className={`w-full py-4 px-4 rounded-2xl font-bold text-lg transition-all ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#6BE6C1] text-[#0F172A] hover:bg-[#5FD4A3] active:scale-95'
              }`}
            >
              {isLoading ? '명상 시작 중...' : '명상 시작하기'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-2xl font-bold border-2 border-[#45947D] text-[#45947D] transition-all ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#45947D]/10 active:scale-95'
              }`}
            >
              다시 하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FaceDetection;