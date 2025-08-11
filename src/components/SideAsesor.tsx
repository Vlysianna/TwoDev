import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ClipboardList,
    LogOut,
    Menu,
    X,
    ListCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

const SidebarAsesor: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const location = useLocation();

    const menuItems: MenuItem[] = [
        {
            name: "List Asesment Aktif",
            icon: ClipboardList,
            section: "main",
            path: "/dashboard-asesi",
        },
        {
            name: "Asesment Aktif",
            icon: ListCheck,
            section: "main",
            path: "/asesmen-aktif-asesi",
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
        // Add logout logic here
        console.log("Logout clicked");
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

    const SidebarAsesorContent = () => (
        <>
            {/* Logo Section */}
            <div className="p-2 border-b border-orange-400 flex justify-center">
                <Link to="/dashboard" className="p-6">
                    <div className="h-20 flex items-center justify-center">
                        <img
                            src="img/final logo twodev teks putih 1.svg"
                            alt="Logo"
                            className="h-full object-contain"
                        />
                    </div>
                </Link>
            </div>


            {/* Main Menu Items */}
            <div className="flex-1 flex flex-col ">
                <div className="py-2">
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

            {/* SidebarAsesor - Always visible on desktop, slide on mobile */}
            <div className={`
                fixed inset-y-0 left-0 z-40
                w-64 h-screen bg-[#E77D35] text-white flex flex-col
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                <SidebarAsesorContent />
            </div>

            {/* Spacer for desktop layout */}
            <div className="hidden lg:block w-64 flex-shrink-0" />
        </>
    );
};

export default SidebarAsesor;