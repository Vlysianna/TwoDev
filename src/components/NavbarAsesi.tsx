import UserMenu from './UserMenu';
import { getAssetPath } from '@/utils/assetPath';

interface NavbarAsesiProps {
  title: string;
  icon: React.ReactNode;
}

export default function NavbarAsesi({ title, icon }: NavbarAsesiProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 w-full z-50 relative">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center flex-1 min-w-0 space-x-3">
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
}
