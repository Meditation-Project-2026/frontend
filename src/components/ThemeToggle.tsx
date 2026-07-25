import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="w-9 h-9 rounded-full bg-white dark:bg-[#1E212B] flex items-center justify-center text-primary shadow-sm border border-gray-100/50 dark:border-white/[0.07]"
    >
      {theme === "dark" ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
    </button>
  );
};

export default ThemeToggle;
