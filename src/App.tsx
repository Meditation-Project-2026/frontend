import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogIdProvider } from './contexts/LogIdContext';
import FaceDetection from './pages/FaceDetection';
import BreathingMonitor from './pages/BreathingMonitor';
import MeditationFeedback from './pages/MeditationFeedback';
import Home from './pages/Home';
import BreathingGuide from './pages/BreathingGuide';

function App() {
  return (
    <BrowserRouter>
      <LogIdProvider>
        <div className="App">
          <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-white dark:bg-[#1A4D43]">
            <Routes>
              {/* 얼굴 인식 화면 */}
              <Route path="/face-detection" element={<FaceDetection />} />

              {/* 호흡 모니터링 화면 */}
              <Route path="/breathing-monitor" element={<BreathingMonitor />} />

              {/* 호흡 가이드 화면 */}
              <Route path="/breathing-guide" element={<BreathingGuide />} />

              {/* 피드백 화면 */}
              <Route path="/meditation-feedback" element={<MeditationFeedback />} />

              {/* 기본 리다이렉트 */}
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </LogIdProvider>
    </BrowserRouter>
  );
}

export default App;