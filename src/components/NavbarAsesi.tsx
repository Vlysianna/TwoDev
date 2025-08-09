import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarAsesiProps {
  title: string;
  icon: React.ReactNode;
}

export default function NavbarAsesi({ title, icon }: NavbarAsesiProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    console.log("User logged out");
    setShowModal(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 w-full z-50 relative">
      {/* DESKTOP NAVBAR */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon && <div className="text-black-500 hover:text-black-600">{icon}</div>}
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-3 text-gray-600 border border-gray-200 hover:text-gray-800 hover:bg-gray-100 rounded-full transition cursor-pointer"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                10
              </span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                </div>
                <div className="p-4 text-sm text-gray-500 text-center">
                  You have 10 unread notifications
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
            >
              <img
                src="/public/img/male avatar.svg"
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="hidden md:block text-start text-sm">
                <p className="font-medium text-gray-800">Asesi</p>
                <p className="text-xs text-gray-500">example@example.com</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 hover:cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/public/img/male avatar.svg"
                      alt="User avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-start">
                      <p className="font-medium text-gray-800">Asesi</p>
                      <p className="text-xs text-gray-500">example@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center text-red-500 hover:bg-gray-100 p-2 rounded transition cursor-pointer"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="sm:hidden flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          {icon && <div className="text-orange-500 hover:text-orange-600">{icon}</div>}
          <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                10
              </span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                </div>
                <div className="p-4 text-sm text-gray-500 text-center">
                  You have 10 unread notifications
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="w-9 h-9 rounded-full overflow-hidden border border-gray-200"
            >
              <img src="/public/img/male avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-800">Asesi</p>
                  <p className="text-xs text-gray-500">example@example.com</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center text-red-500 hover:bg-gray-100 p-2 rounded transition cursor-pointer"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
            <div className="mb-4 flex justify-center">
              <img src="public/img/gambarprialogout.svg" alt="Pria Sigma" />
            </div>

            <h2 className="font-bold text-lg mb-2">Yakin ingin keluar?</h2>
            <p className="text-gray-500 text-sm mb-4">
              Logout akan mengakhiri sesi Anda saat ini, dan Anda perlu login kembali untuk melanjutkan aktivitas.
            </p>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-50 cursor-pointer"
              >
                Batalkan
              </button>
              <Link
                to="/login"
                className="flex-1 bg-[#E77D35] text-white py-2 rounded hover:bg-orange-600 cursor-pointer text-center"
              >
                Keluar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
