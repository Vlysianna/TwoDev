import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            logout();
            navigate("/auth/login");
        }
        setIsMobileMenuOpen(false);
    };

    const MenuItem: React.FC<MenuItemProps> = ({ item, isActive, onClick }) => {
        const IconComponent = item.icon;

        return (
            <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 relative
    ${isActive
                        ? "bg-[#ffffff80] text-white font-medium"
                        : ""}
  `}
                onClick={onClick}
            >
                {/* Border kiri putih saat aktif */}
                {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-sm" />
                )}

                <IconComponent size={18} className="flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{item.name}</span>
            </Link>
        );
    };

    const SidebarAsesiContent = () => (
        <>
            {/* Logo Section */}
            <div className="p-2 border-b border-orange-400 flex justify-center">
                <Link to={paths.asesi.root} className="p-6">
                    <div className="h-20 flex items-center justify-center">
                        <img src="/img/logo-lsp.svg" alt="Logo" className="h-full w-auto" />
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

        {/* SidebarAsesi - Always visible on desktop, slide on mobile */}
        <div
          className={`
  fixed top-0 left-0 h-full w-64 bg-[#E77D35] text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
  ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
        >
          <SidebarAsesiContent />
        </div>

        {/* Spacer for desktop layout */}
        <div className="hidden lg:block w-64 flex-shrink-0" />
      </>
    );
};

export default SidebarAsesi;

