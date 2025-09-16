import React, { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import UserMenu from './UserMenu';

interface NavbarAsesorProps {
  title: string;
  icon: React.ReactNode;
}

export default function NavbarAsesor({ title, icon }: NavbarAsesorProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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
          <UserMenu />
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="sm:hidden flex items-center justify-between relative w-full">
        {/* Left Section (Icon + Title) */}
        <div className="flex gap-3 items-center">
          {icon && <div className="text-orange-500 hover:text-orange-600">{icon}</div>}
          <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        </div>

        {/* Right Section (Notifications + UserMenu) */}
        <div className="flex items-center space-x-2">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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

          {/* Use centralized UserMenu for consistent logout flow */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
