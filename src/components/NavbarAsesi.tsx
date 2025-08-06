import React from 'react';
import { Bell, User, Search, FileText, LogOut } from 'lucide-react';

interface NavbarAsesiProps {
  title: string;
}

export default function NavbarAsesi({ title }: NavbarAsesiProps) {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            {/* Left Section - Greeting */}
            <div className="flex justify-start">
                <div className='mr-4'>
                    <FileText className='h-8 w-8' />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right Section - Notifications and User Profile */}
            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="relative p-4 text-gray-600 border border-gray-200 hover:text-gray-800 hover:bg-gray-200 hover:cursor-pointer rounded-4xl transition-colors duration-200">
                    <Bell size={20} />
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        10
                    </span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 border border-gray-200 rounded-4xl px-2.5 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                        <div className="rounded-full flex items-center justify-center">
                            <img src="public/img/male avatar.svg" alt="" className='w-10 h-10' />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-800">Asesi</p>
                            <p className="font-sm text-gray-500">example@example.com</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3 mr-4">
                    <LogOut className='h-6 w-6 text-gray-500 hover:cursor-pointer' />
                </div>
            </div>
        </nav>
    );
};