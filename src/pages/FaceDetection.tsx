import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CameraFrame from '../components/FaceDetection/CameraFrame';
import Header from '../components/Header';
import ProgressCircle from '../components/FaceDetection/ProgressCircle';
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
  }, [progress]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    setProgress(0);
    setIsDetected(false);
    setError(null);
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
    <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto">
      <Header
        title="Face Detection"
        onBack={handleBack}
        rightType="text"
        rightText="Cancel"
        onRightClick={handleCancel}
      />

      <main className="flex-1 flex flex-col items-center px-6 w-full relative z-10">
        <div className="w-full text-center mt-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight mb-2">
            명상 전에 카메라를 확인하고
            <br />
            얼굴이 프레임 안에 들어오게 맞춰주세요
          </h2>
          <p className="text-sm text-[#6B7280]">
            정확한 측정을 위해 정면을 바라보고 움직임을 최소화해주세요.
          </p>
        </div>

        <div className="w-full aspect-[3.5/4.5] mb-8 rounded-[2rem] overflow-hidden">
          <CameraFrame stream={stream} />
        </div>

        <ProgressCircle percentage={Math.round(progress)} />

        {error && (
          <div className="w-full mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

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
          </div>
        )}
      </main>
    </div>
  );
};

export default FaceDetection;
