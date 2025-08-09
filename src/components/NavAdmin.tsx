import  { useState } from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      {/* DESKTOP NAVBAR */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Greeting */}
        <h1 className="text-xl font-semibold text-gray-800">
          Selamat Datang, Admin!
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-md mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Notification & User */}
        <div className="flex items-center space-x-4">
          <button className="relative p-4 text-gray-600 border border-gray-200 hover:text-gray-800 hover:bg-gray-200 rounded-4xl transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              10
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 border border-gray-200 rounded-4xl px-2.5 py-2 hover:bg-gray-100 cursor-pointer transition">
              <div className="rounded-full flex items-center justify-center">
                <img src="public/img/male avatar.svg" alt="" className="w-10 h-10" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Asesi</p>
                <p className="text-sm text-gray-500">example@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="sm:hidden flex flex-col space-y-2">
        {/* Row: Icons (Search, Bell, Avatar) */}
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-semibold text-gray-800 ml-15">
            Selamat Datang, Admin!
          </h1>

          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Search className="h-6 w-6 text-gray-600" />
            </button>

            {/* Bell Icon */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                10
              </span>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
              <img src="public/img/male avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Search Input (if toggled) */}
        {showMobileSearch && (
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              autoFocus
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
