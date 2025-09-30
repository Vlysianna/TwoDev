import React, { useState } from 'react';
import { useBiodataAdminCheck } from '@/hooks/useBiodataAdminCheck';
import { Link, useLocation } from 'react-router-dom';
import { getAssetPath } from '@/utils/assetPath';
import {
  LayoutDashboard,
  FileText,
  Users,
  User,
  UserCheck,
  Menu,
  X,
  File,
  Calendar,
  Album,
  ClipboardPen,
  ListCheck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import paths from '@/routes/paths';

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

  
  const { biodataComplete } = useBiodataAdminCheck();

  // If biodataComplete is null (still checking), don't render admin-specific menu items yet to avoid flicker.
  // Only show full admin menu when biodataComplete === true
  const menuItems: MenuItem[] = biodataComplete === true
    ? [
        {
          name: 'Dashboard',
          icon: LayoutDashboard,
          section: 'admin',
          path: paths.admin.root,
        },
        {
          name: 'Kelola Jurusan',
          icon: Album,
          section: 'admin',
          path: paths.admin.kelolaJurusan,
        },
        {
          name: 'Kelola Okupasi',
          icon: Calendar,
          section: 'main',
          path: paths.admin.okupasi.index,
        },
        {
          name: 'Kelola MUK',
          icon: File,
          section: 'admin',
          path: paths.admin.muk.root,
        },
        {
          name: 'Kelola Jadwal Asesmen',
          icon: ClipboardPen,
          section: 'admin',
          path: paths.admin.kelolaJadwal,
        },
        {
          name: 'Hasil Asesmen',
          icon: FileText,
          section: 'admin',
          path: paths.admin.resultAssessment.root,
        },
        {
          name: 'Verifikasi',
          icon: ListCheck,
          section: 'admin',
          path: paths.admin.verifikasi,
        },
        {
        name: 'Persetujuan',
        icon: ListCheck,
        section: 'admin',
        path: paths.admin.persetujuan,
      },
    ]
    : (
      biodataComplete === false
        ? [
            {
              name: 'Biodata Admin',
              icon: FileText,
              section: 'admin',
              path: paths.admin.biodata,
            },
          ]
        : // while checking, render an empty array so the menu doesn't flicker
          []
    );

  const managementItems: MenuItem[] = [
    {
      name: 'Kelola Pengguna',
      icon: Users,
      section: 'management',
      path: paths.admin.kelolaUser,
    },
    {
      name: 'Akun Asesi',
      icon: User,
      section: 'management',
      path: paths.admin.kelolaAkunAsesi,
    },
    {
      name: 'Akun Asesor',
      icon: UserCheck,
      section: 'management',
      path: paths.admin.kelolaAkunAsesor,
    }
  ];

  const handleItemClick = (): void => {
    // Close mobile menu when item is clicked
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // logout handled elsewhere

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
        <Link to={paths.admin.root} className="py-10">
          <img src={getAssetPath('/img/logo-lsp.svg')} alt="Logo" className="h-15 w-auto" />
        </Link>
      </div>

      <div className="mx-4 border-t border-orange-400"></div>

      {/* Main Menu Items */}
      <div className="flex-1">
        <div className="pb  -2">
          <div className="px-4 py-3">
            <span className="text-xs text-orange-200 font-medium uppercase tracking-wider">
              {biodataComplete ? 'Sertifikasi' : 'Biodata'}
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

        {/* Separator Line */}
        <div className="mx-4 border-t border-orange-400"></div>

        {/* Management Section */}
        {biodataComplete && (
          <div>
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
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Hidden on desktop */}
      <button
        className="lg:hidden fixed top-6 left-4 z-[60] p-2 bg-orange-500 text-white rounded-md shadow-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[55]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop, slide on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-[58]
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
