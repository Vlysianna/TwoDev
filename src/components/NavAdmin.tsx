import { Bell, LayoutDashboard } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface NavAdminProps {
  title?: string;
  icon?: React.ReactNode;
}

const NavAdmin: React.FC<NavAdminProps> = ({ 
  title = "Dashboard Admin", 
  icon = <LayoutDashboard size={20} />
}) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 w-full z-50 relative">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center flex-1 min-w-0 space-x-3 ml-10">
          {icon && <div className="text-black-500 hover:text-black-600 shrink-0">{icon}</div>}
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug break-words whitespace-normal">
            {title}
          </h1>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center shrink-0">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavAdmin;
