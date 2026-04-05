import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FaceDetection from './pages/FaceDetection';
import BreathingMonitor from './pages/BreathingMonitor';
import MeditationFeedback from './pages/MeditationFeedback';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-white dark:bg-[#1A4D43]">
          <Routes>
            {/* 얼굴 인식 화면 */}
            <Route path="/face-detection" element={<FaceDetection />} />
            
            {/* 호흡 모니터링 화면 */}
            <Route path="/breathing-monitor" element={<BreathingMonitor />} />
            
            {/* 피드백 화면 */}
            <Route path="/meditation-feedback" element={<MeditationFeedback />} />
            
            {/* 기본 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;