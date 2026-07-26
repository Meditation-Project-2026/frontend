import { User } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

interface ProfileHeaderProps {
  nickname: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ nickname }) => {
  return (
    <div className="bg-accent dark:bg-[#1E212B] rounded-b-[28px] px-5 pt-6 pb-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
          <User size={18} strokeWidth={1.8} />
        </div>
        <p className="text-base font-bold text-white dark:text-[#F5F3EF]">{nickname}</p>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default ProfileHeader;
