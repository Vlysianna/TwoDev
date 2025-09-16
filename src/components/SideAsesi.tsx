import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAssetPath } from '@/utils/assetPath';
import {
    ClipboardList,
    LogOut,
    Menu,
    X,
    ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import paths from "@/routes/paths";

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

const SidebarAsesi: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems: MenuItem[] = [
        {
            name: "List Asesmen Aktif",
            icon: ClipboardList,
            section: "main",
            path: paths.asesi.dashboard,
        },
        {
            name: "Asesmen Diikuti",
            icon: ListChecks,
            section: "main",
            path: paths.asesi.asesmenDiikuti,
        },
    ];

    const handleItemClick = (): void => {
        // Close mobile menu when item is clicked
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = (): void => {
        setIsLogoutModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const confirmLogout = (): void => {
        logout();
        navigate("/auth/login");
        setIsLogoutModalOpen(false);
    };

    const cancelLogout = (): void => {
        setIsLogoutModalOpen(false);
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

    const SidebarAsesiContent = () => (
        <>
            {/* Logo Section */}
            <div className="p-2 border-b border-orange-400 flex justify-center">
                <Link to={paths.asesi.root} className="p-6">
                    <div className="h-20 flex items-center justify-center">
                        <img src={getAssetPath("/img/logo-lsp.svg")} alt="Logo" className="h-full w-auto" />
                    </div>
                </Link>
            </div>


            {/* Main Menu Items */}
            <div className="flex-1 flex flex-col ">
                <div className="py-3">
                    {menuItems.map((item) => (
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
        </>
    );

    return (
      <>
        {/* Mobile Menu Button - Hidden on desktop */}
        <button
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-orange-500 text-white rounded-md shadow-lg"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[55] bg-black bg-opacity-50"
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
          <SidebarAsesiContent />
        </div>

        {/* Spacer for desktop layout */}
        <div className="hidden lg:block w-64 flex-shrink-0" />

        {/* Logout Confirmation Modal */}
        {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
            <div className="mb-4 flex justify-center">
                <img src={getAssetPath('/img/gambarprialogout.svg')} alt="Pria Sigma" />
              </div>

              <h2 className="font-bold text-lg mb-2">Yakin ingin keluar?</h2>
              <p className="text-gray-500 text-sm mb-4">
                Logout akan mengakhiri sesi Anda saat ini, dan Anda perlu login kembali untuk melanjutkan aktivitas.
              </p>

              <div className="flex justify-between gap-2">
                <button
                  onClick={cancelLogout}
                  className="flex-1 border border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-50 cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-[#E77D35] text-white py-2 rounded hover:bg-orange-600 cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

export default SidebarAsesi;

