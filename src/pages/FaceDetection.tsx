import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';

import CameraFrame from '../components/FaceDetection/CameraFrame';
import Header from '../components/Header';
import { startMeditation } from '../api/meditation';

const FaceDetection: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const meditationId = searchParams.get('id');
  const type = searchParams.get('type');

  const [progress, setProgress] = useState<number>(0);
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(err);
        setError('카메라를 시작하지 못했습니다.');
      }
    };

    initCamera();

    return () => {
      mounted = false;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // 카메라 스트림이 없거나 에러가 있으면 감지를 진행하지 않는다.
    // (기존엔 카메라 성공 여부와 무관하게 무조건 진행률이 100%까지 올라가서,
    //  "카메라를 시작하지 못했습니다" 에러와 "얼굴 감지 완료"가 동시에 뜨는 모순이 있었다.)
    if (!stream || error) {
      return;
    }

    if (progress >= 100) {
      setIsDetected(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        return next > 100 ? 100 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress, stream, error]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartMeditation = async () => {
    if (!meditationId) {
      setError('명상 ID가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await startMeditation(parseInt(meditationId));

      localStorage.setItem('logId', result.logId.toString());
      localStorage.setItem('startedAt', result.startedAt);

      if (type === 'breathing') {
        navigate(`/breathing-guide?logId=${result.logId}`);
      } else if (type === 'full') {
        navigate(`/breathing-full?logId=${result.logId}`);
      } else if (type === 'content') {
        navigate(`/breathing-content?logId=${result.logId}`);
      } else {
        navigate(`/breathing-monitor?logId=${result.logId}`);
      }
    } catch (err) {
      console.error('Failed to start meditation:', err);
      setError('명상 시작에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] w-full max-w-md mx-auto bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col items-center overflow-hidden">
      <Header
        title="얼굴 인식"
        onBack={handleBack}
        rightType="none"
      />

      <main className="flex-1 flex flex-col items-center px-5 pb-6 w-full relative z-10 overflow-y-auto hide-scrollbar">
        <div className="w-full text-center mt-2 mb-5">
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F5F3EF] leading-snug mb-2">
            카메라를 확인하고 얼굴을
            <br />
            프레임 안에 맞춰주세요
          </h2>
          <p className="text-xs text-[#6B7280]">
            정면을 바라보고 움직임을 최소화해주세요
          </p>
        </div>

        <div className="relative w-64 aspect-[3.5/4.5] mx-auto mb-4">
          <div
            className={`w-full h-full rounded-2xl overflow-hidden border-[3px] transition-colors duration-300 ${
              isDetected ? 'border-[#6BE6C1]' : 'border-gray-200 dark:border-white/15'
            }`}
          >
            <CameraFrame stream={stream} />
          </div>
          {isDetected && (
            <div className="absolute -bottom-3.5 -right-3.5 w-11 h-11 rounded-full bg-[#6BE6C1] flex items-center justify-center shadow-md">
              <Check size={20} className="text-[#14161C]" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* 진행률/버튼 그룹을 화면 하단으로 배치 */}
        <div className="w-full mt-auto space-y-5">
          <p
            className={`text-center text-sm font-medium ${
              isDetected ? 'text-[#1E8F6B] dark:text-primary' : 'text-gray-400 dark:text-white/40'
            }`}
          >
            {isDetected ? '얼굴 감지 완료' : `${Math.round(progress)}%`}
          </p>

          {error && (
            <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isDetected && (
            <div className="w-full space-y-3">
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FaceDetection;
