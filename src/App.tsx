import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogIdProvider } from './contexts/LogIdContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import FaceDetection from './pages/FaceDetection';
import BreathingMonitor from './pages/BreathingMonitor';
import MeditationFeedback from './pages/MeditationFeedback';
import Home from './pages/Home';
import BreathingGuide from './pages/BreathingGuide';
import BreathingFull from './pages/BreathingFull';
import Contents from './pages/Contents';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LogIdProvider>
          <div className="App">
            <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-white dark:bg-[#14161C] dark:border-x dark:border-white/[0.06]">
              <Routes>
                {/* 시작 화면: 로그인 */}
                <Route path="/" element={<Login />} />

                {/* 하단 탭바가 있는 화면 */}
                <Route element={<MainLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/contents" element={<Contents />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* 탭바 없는 단독 플로우 화면 */}
                <Route path="/upload" element={<Upload />} />
                <Route path="/face-detection" element={<FaceDetection />} />
                <Route path="/breathing-monitor" element={<BreathingMonitor />} />
                <Route path="/breathing-guide" element={<BreathingGuide />} />
                <Route path="/breathing-full" element={<BreathingFull />} />
                <Route path="/meditation-feedback" element={<MeditationFeedback />} />
              </Routes>
            </div>
          </div>
        </LogIdProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
