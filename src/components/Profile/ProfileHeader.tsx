import { User } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

interface ProfileHeaderProps {
  nickname: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ nickname }) => {
  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1E212B] border border-gray-100 dark:border-white/[0.07] flex items-center justify-center text-primary">
            <User size={20} strokeWidth={1.8} />
          </div>
          <p className="text-lg font-bold text-accent dark:text-[#F5F3EF]">{nickname}</p>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ProfileHeader;
