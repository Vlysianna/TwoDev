import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  GraduationCap,
  User,
  UserCheck,
  UserPlus,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  name: string;
  icon: LucideIcon;
  section: string;
  path: string;
}

interface MenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      section: 'main',
      path: '/dashboard'
    },
    {
      name: 'Kelola Asesmen',
      icon: FileText,
      section: 'main',
      path: '/kelola-asesmen'
    },
    {
      name: 'Kelola Skema',
      icon: Users,
      section: 'main',
      path: '/kelola-muk'
    },
    {
      name: 'Kelola Jurusan',
      icon: GraduationCap,
      section: 'main',
      path: '/kelola-jurusan'
    }
  ];

  const managementItems: MenuItem[] = [
    {
      name: 'Akun Asesi',
      icon: User,
      section: 'management',
      path: '/kelola-akun-asesi'
    },
    {
      name: 'Akun Asesor',
      icon: UserCheck,
      section: 'management',
      path: '/kelola-akun-asesor'
    },
    {
      name: 'Register',
      icon: UserPlus,
      section: 'management',
      path: '/register'
    }
  ];

  const handleItemClick = (): void => {
    // Close mobile menu when item is clicked
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = (): void => {
    // Add logout logic here
    console.log('Logout clicked');
    setIsMobileMenuOpen(false);
  };

  const MenuItem: React.FC<MenuItemProps> = ({ item, isActive, onClick }) => {
    const IconComponent = item.icon;

    return (
      <Link
        to={item.path}
        className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 ${isActive
          ? 'bg-[#ffffff80] text-white'
          : 'text-orange-100 hover:bg-[#ffffff80] hover:text-white'
          }`}
        onClick={onClick}
      >
        <IconComponent size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex flex-col items-start pl-4">
        <Link to="/dashboard" className="py-10">
          <img src="/img/logo-lsp.svg" alt="Logo" className="h-15 w-auto" />
        </Link>
      </div>


      {/* Main Menu Items */}
      <div className="flex-1">
        <div className="pb  -2">
          <div className="px-4 py-3">
            <span className="text-xs text-orange-200 font-medium uppercase tracking-wider">
              Sertifikasi
            </span>
          </div>
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.path}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* Management Section */}
        <div className="py-2">
          <div className="px-4 py-3">
            <span className="text-xs text-orange-200 font-medium uppercase tracking-wider">
              Managemen
            </span>
          </div>
          {managementItems.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.path}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      {/* Separator Line */}
      <div className="mx-4 border-t border-orange-400"></div>

      {/* Logout */}
      <div className="p-2">
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 text-orange-100 hover:bg-orange-500 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Hidden on desktop */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-md shadow-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, slide on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        w-64 h-screen bg-[#E77D35] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </div>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
