import React from 'react';
import UserMenu from './UserMenu';

const Navbar = () => {

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      {/* DESKTOP NAVBAR */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Greeting */}
        <h1 className="text-xl font-semibold text-gray-800">
          Selamat Datang, Admin!
        </h1>
        {/* UserMenu only */}
        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="sm:hidden flex flex-col space-y-2">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-semibold text-gray-800 ml-15">
            Selamat Datang, Admin!
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
              <img src="/img/male avatar.svg" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
