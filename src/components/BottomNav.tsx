import { NavLink } from 'react-router-dom';
import { Home, Leaf, PlusCircle, User } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  Icon: typeof Home;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈', Icon: Home, end: true },
  { to: '/contents', label: '콘텐츠', Icon: Leaf },
  { to: '/upload', label: '업로드', Icon: PlusCircle },
  { to: '/profile', label: '프로필', Icon: User },
];

const BottomNav: React.FC = () => {
  return (
    <nav
      className="shrink-0 bg-white dark:bg-accent border-t border-gray-100 dark:border-white/10
                 flex items-stretch px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      {NAV_ITEMS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-secondary dark:text-primary' : 'text-gray-400 dark:text-white/40'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
