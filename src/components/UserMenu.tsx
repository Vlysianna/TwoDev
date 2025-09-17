import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { getAssetPath } from '@/utils/assetPath';

const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Asesor';
      case 3: return 'Asesi';
      default: return 'User';
    }
  };

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="relative" ref={profileRef}>
      {/* Tombol Profile */}
      <button
        type="button"
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center sm:space-x-2 border border-gray-200 rounded-full px-2 py-2 hover:bg-gray-100 transition cursor-pointer"
      >
        <img
          src={getAssetPath('/img/avatar-asesor.svg')}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="hidden md:block text-start text-sm">
          <p className="font-medium text-gray-800">{getRoleName(user.role_id)}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </button>

      {/* Dropdown Profile */}
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img
                src={getAssetPath('/img/avatar-asesor.svg')}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-start">
                <p className="font-medium text-gray-800">{getRoleName(user.role_id)}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center text-red-500 hover:bg-gray-100 p-2 rounded transition cursor-pointer"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Yakin ingin keluar?"
        message="Logout akan mengakhiri sesi Anda saat ini, dan Anda perlu login kembali untuk melanjutkan aktivitas."
        confirmText="Keluar"
        cancelText="Batalkan"
        type="danger"
        icon={<img src={getAssetPath('/img/gambarprialogout.svg')} alt="Logout" className="w-48 h-48" />}
      />
    </div>
  );
};

export default UserMenu;