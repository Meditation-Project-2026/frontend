import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 로그인 API 연동. 지금은 화면 전환만 구현.
    navigate('/home');
  };

  return (
    <div className="h-[100svh] w-full max-w-[390px] mx-auto bg-[#FAF9F5] dark:bg-[#14161C] flex flex-col justify-center overflow-hidden px-6">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🧘</span>
        </div>
        <h1 className="text-xl font-bold text-accent dark:text-[#F5F3EF] mb-1">마음챙김 명상</h1>
        <p className="text-sm text-gray-400 dark:text-white/40">로그인하고 오늘의 명상을 시작해보세요</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-gray-400 dark:text-white/50 mb-2">
            이메일
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-accent dark:text-[#F5F3EF] placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold text-gray-400 dark:text-white/50 mb-2">
            비밀번호
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-accent dark:text-[#F5F3EF] placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-bold text-base bg-primary text-accent active:scale-[0.98] transition-all mt-2"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
