import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { RPPGStreamMessage } from '../api/meditation';
import DataCard from "../components/BreathingMonitor/DataCard";
import Header from "../components/Header";
import RecognitionArea from "../components/BreathingMonitor/RecognitionArea";
import { connectRPPGStream, sendFrameToWebSocket } from '../api/meditation';

interface BiometricData {
  heartRate: number;
  lfHfRatio: number;
  isFaceDetected: boolean;
}

const BreathingMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('logId');

  // 상태 관리
  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 0,
    lfHfRatio: 0,
    isFaceDetected: false,
  });
  
  const [meditationTime, setMeditationTime] = useState<number>(0); // 초 단위
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // WebSocket & 타이머 참조
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 웹캠 초기화
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Camera initialized');
        }
      } catch (err) {
        console.error('Failed to access camera:', err);
        setError('카메라 접근이 거부되었습니다.');
      }
    };

    initCamera();

    return () => {
      // 컴포넌트 언마운트 시 스트림 정지
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // 명상 시간 카운트
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // WebSocket 연결
  useEffect(() => {
    if (!logId) {
      setError('logId가 없습니다.');
      return;
    }

    const handleMessage = (data: RPPGStreamMessage) => {
      setBiometricData({
        heartRate: Math.round(data.heartRate * 10) / 10, // 소수점 1자리
        lfHfRatio: Math.round(data.lfHfRatio * 100) / 100, // 소수점 2자리
        isFaceDetected: data.isFaceDetected,
      });
    };

    const handleError = (error: Event) => {
      console.error('WebSocket error:', error);
      setError('WebSocket 연결 오류가 발생했습니다.');
    };

    const handleClose = (event: CloseEvent) => {
      console.log('WebSocket closed:', event);
      setIsConnected(false);
    };

    // WebSocket 연결
    wsRef.current = connectRPPGStream(parseInt(logId), handleMessage, handleError, handleClose);
    setIsConnected(true);

    // WebSocket 연결 후 프레임 전송 시작
    const frameInterval = setInterval(() => {
      if (canvasRef.current && videoRef.current && wsRef.current) {
        try {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // 비디오 프레임을 canvas에 그리기
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Canvas를 Base64로 변환 후 전송
            const frameData = canvas.toDataURL('image/jpeg', 0.8);
            sendFrameToWebSocket(wsRef.current, frameData);
          }
        } catch (err) {
          console.error('Failed to send frame:', err);
        }
      }
    }, 100); // 100ms마다 프레임 전송 (약 10fps)

    return () => {
      clearInterval(frameInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [logId]);

  // 명상 종료
  const handleEndMeditation = () => {
    setIsRunning(false);

    // WebSocket 종료
    if (wsRef.current) {
      wsRef.current.close();
    }

    // 타이머 종료
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // logId와 함께 피드백 페이지로 이동
    // (실제로는 AI 서버에서 분석을 완료하고 데이터가 저장되기까지 잠시 대기)
    setTimeout(() => {
      navigate(`/meditation-feedback?logId=${logId}`);
    }, 2000);
  };

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-zinc-950 flex flex-col">
      <Header 
        title="호흡 모니터링" 
        onBack={() => {
          if (wsRef.current) wsRef.current.close();
          navigate(-1);
        }} 
      />

      <main className="flex-1 flex flex-col justify-center px-6 pb-10 max-w-2xl mx-auto w-full">
        {/* 숨겨진 비디오 & Canvas (프레임 캡처용) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
          width="640"
          height="480"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width="640"
          height="480"
        />

        {/* 연결 상태 표시 */}
        <div className="mb-4 flex items-center gap-2 justify-center">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          ></div>
          <span className="text-sm text-[#45947D] font-medium">
            {isConnected ? 'WebSocket 연결됨' : 'WebSocket 연결 중...'}
          </span>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 명상 시간 표시 */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-2">명상 시간</p>
          <p className="text-5xl font-bold text-[#1A4D43]">{formatTime(meditationTime)}</p>
        </div>

        {/* 얼굴 감지 영역 */}
        <RecognitionArea />

        {/* 생체 지표 카드 */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <DataCard 
            label="심박수" 
            value={biometricData.heartRate || '-'} 
            unit="bpm" 
          />
          <DataCard 
            label="LF/HF" 
            value={biometricData.lfHfRatio || '-'} 
            unit="ratio" 
          />
        </section>

        {/* 얼굴 감지 상태 */}
        <div className="text-center mb-6 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800">
          <span
            className={`text-sm font-bold ${
              biometricData.isFaceDetected ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {biometricData.isFaceDetected ? '✓ 얼굴 감지됨' : '✗ 얼굴 감지 안 됨'}
          </span>
        </div>

        {/* 종료 버튼 */}
        <button
          onClick={handleEndMeditation}
          disabled={!isRunning}
          className={`w-full py-4 px-4 rounded-2xl font-bold text-lg transition-all ${
            isRunning
              ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          명상 종료
        </button>
      </main>
    </div>
  );
};

export default BreathingMonitor;