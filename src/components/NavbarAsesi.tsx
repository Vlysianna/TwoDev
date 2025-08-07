import React from 'react';
import { Bell, User, Search, FileText, LogOut } from 'lucide-react';

interface NavbarAsesiProps {
    title: string;
}

export default function NavbarAsesi({ title }: NavbarAsesiProps) {
    const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between z-50">
            {/* Left Section - Greeting */}
            <div className='flex items-center'>
                <div className='mr-2 sm:mr-4'>
                    <FileText className='h-6 w-6 sm:h-8 sm:w-8' />
                </div>
                <div className="w-full">
                    <h1 className="text-sm sm:text-lg font-semibold text-gray-800 line-clamp-2">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right Section - Notifications and User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notification Dropdown */}
                <div className="relative">
                    <button
                        className="relative p-2 sm:p-3 hover:cursor-pointer text-gray-600 border border-gray-200 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={() => {
                            setIsNotificationOpen(!isNotificationOpen);
                            setIsProfileOpen(false);
                        }}
                    >
                        <Bell size={20} />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            10
                        </span>
                    </button>

                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-medium text-gray-800">Notifications</h3>
                            </div>
                            <div className="p-4">
                                <div className="text-center text-gray-500 text-sm">
                                    You have 10 unread notifications
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center space-x-2 border border-gray-200 hover:cursor-pointer rounded-full px-2 py-2 sm:text-center hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationOpen(false);
                        }}
                    >
                        <img
                            src="public/img/male avatar.svg"
                            alt="User avatar"
                            className='w-8 h-8 sm:w-10 sm:h-10 rounded-full '
                        />
                        <div className="hidden md:block text-sm text-start">
                            <p className="font-medium text-gray-800">Asesi</p>
                            <p className="text-xs text-gray-500">example@example.com</p>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200 hover:cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="public/img/male avatar.svg"
                                        alt="User avatar"
                                        className='w-8 h-8 rounded-full'
                                    />
                                    <div className='text-start'>
                                        <p className="font-medium text-gray-800">Asesi</p>
                                        <p className="text-xs text-gray-500">example@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center justify-center text-red-500 hover:bg-gray-100 p-2 rounded">
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};