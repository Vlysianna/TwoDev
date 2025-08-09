import React, { useState } from 'react';
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
}

interface MenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: (itemName: string) => void;
}

const SideAsesor: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      name: 'List Asesmen Aktif',
      icon: LayoutDashboard,
      section: 'main'
    },
    {
      name: 'Asesment Diikuti',
      icon: FileText,
      section: 'main'
    },   
  ];
 

  const handleItemClick = (itemName: string): void => {
    setActiveItem(itemName);
    // Close mobile menu when item is clicked
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const MenuItem: React.FC<MenuItemProps> = ({ item, isActive, onClick }) => {
    const IconComponent = item.icon;
    
    return (
      <div
        className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'bg-orange-600 text-white' 
            : 'text-orange-100 hover:bg-orange-500 hover:text-white'
        }`}
        onClick={() => onClick(item.name)}
      >
        <IconComponent size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
      </div>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-orange-400">
        <div className="flex items-center space-x-2 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded flex-shrink-0 textcenter">
            <img src="/images/logo.png" alt="" />
          </div>         
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="flex-1">
        <div className="py-2">
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              item={item}
              isActive={activeItem === item.name}
              onClick={handleItemClick}
            />
          ))}
        </div>                
      </div>

      {/* Separator Line */}
      <div className="mx-4 border-t border-orange-400"></div>

      {/* Logout */}
      <div className="p-2">
        <div
          className="flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 text-orange-100 hover:bg-orange-500 hover:text-white"
          onClick={() => handleItemClick('Logout')}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </div>
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

      {/* Sidebar - Always visible on desktop, slide on mobile */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 h-screen bg-orange-500 text-white flex flex-col
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

export default SideAsesor;