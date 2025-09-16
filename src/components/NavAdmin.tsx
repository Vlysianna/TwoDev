import { Bell } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface NavAdminProps {
  title?: string;
  icon?: React.ReactNode;
}

const NavAdmin: React.FC<NavAdminProps> = ({ 
  title = "Dashboard Admin", 
  icon 
}) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 w-full z-50 relative">
      {/* DESKTOP NAVBAR */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon && <div className="text-orange-500 hover:text-orange-600">{icon}</div>}
          <h1 className="text-lg font-semibold text-gray-800">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-3 text-gray-600 border border-gray-200 hover:text-gray-800 hover:bg-gray-100 rounded-full transition cursor-pointer">
              <Bell size={20} />
              <span className="absolute -top-[5px] -right-[5px] h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="sm:hidden flex items-center justify-between relative w-full">
        {/* Left Section (Icon + Title) */}
        <div className="flex gap-3 items-center flex-1 min-w-0">
          {icon && (
            <div className="text-orange-500 hover:text-orange-600 flex-shrink-0">
              {icon}
            </div>
          )}
          <h1 className="text-base font-semibold text-gray-800 break-words truncate">
            {title}
          </h1>
        </div>

        {/* Right Section (Notification + UserMenu) */}
        <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
          {/* Mobile Notification */}
          <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition border border-gray-200">
              <Bell size={18} />
              <span className="absolute -top-[1px] -right-[1px] h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Welcome Message for Mobile */}
      <div className="sm:hidden mt-2 text-center">
        <p className="text-sm text-gray-600">
          Selamat datang, <span className="font-medium text-gray-800">{user?.email || 'Admin'}</span>
        </p>
      </div>
    </nav>
  );
};

export default NavAdmin;
