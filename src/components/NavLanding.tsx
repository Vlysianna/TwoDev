import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const NavLanding: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');
  const location = useLocation();
const currentPath = location.pathname;


  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menu: string): void => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleItemClick = (item: string): void => {
    setActiveItem(item);
  };

  return (
    <nav className="sticky bg-white border-b border-gray-200 shadow-sm absolute inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img src="/TwodevTeks.png" alt="Wodev" className="w-auto h-8 " />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/"
                onClick={() => handleItemClick('home')}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                  currentPath === 'home' ? 'text-blue-600' : ''
                }`}
              >
                Home
                {currentPath === 'home' && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </a>
              
              {/* Profil Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('profil')}
                                    
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 relative ${
                    currentPath === 'profil' ? 'text-blue-600' : ''
                  }`}
                >
                  Profil
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform duration-200 ${
                      activeDropdown === 'profil' ? 'rotate-180' : ''
                    }`} 
                  />
                  {currentPath === 'profil' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
                {activeDropdown === 'profil' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <a 
                      href="/about" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('profil')}
                    >
                      Tentang LSP
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('profil')}
                    >
                      Struktur Organisai
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('profil')}
                    >
                      Pengelola SDM
                    </a>
                  </div>
                )}
              </div>

              {/* Layanan Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    toggleDropdown('layanan');
                    handleItemClick('layanan');
                  }}
                  className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 relative ${
                    currentPath === 'layanan' ? 'text-blue-600' : ''
                  }`}
                >
                  Layanan
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform duration-200 ${
                      activeDropdown === 'layanan' ? 'rotate-180' : ''
                    }`} 
                  />
                  {currentPath === 'layanan' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
                {activeDropdown === 'layanan' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('layanan')}
                    >
                      Skema
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('layanan')}
                    >
                      Tempat Uji
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('layanan')}
                    >
                      Asesor
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleItemClick('layanan')}
                    >
                      Prosedur Pendaftaran
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#"
                onClick={() => handleItemClick('berita')}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                  currentPath === 'berita' ? 'text-blue-600' : ''
                }`}
              >
                Berita
                {currentPath === 'berita' && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </a>
              
              <a
                href="#"
                onClick={() => handleItemClick('galeri')}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                  currentPath === 'galeri' ? 'text-blue-600' : ''
                }`}
              >
                Galeri
                {currentPath === 'galeri' && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </a>
              
              <a
                href="#"
                onClick={() => handleItemClick('dokumen')}
                className={`text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                  currentPath === 'dokumen' ? 'text-blue-600' : ''
                }`}
              >
                Dokumen
                {currentPath === 'dokumen' && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                onClick={() => handleItemClick('home')}
                className={`text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium ${
                  currentPath === 'home' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                }`}
              >
                Home
              </a>
              
              {/* Mobile Profil Dropdown */}
              <div>
                <button
                  onClick={() => {
                    toggleDropdown('mobile-profil');
                    handleItemClick('mobile-profil');
                  }}
                  className={`text-gray-700 hover:text-gray-900 w-full text-left px-3 py-2 text-base font-medium flex items-center justify-between ${
                    currentPath === 'mobile-profil' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                  }`}
                >
                  Profil
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      activeDropdown === 'mobile-profil' ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {activeDropdown === 'mobile-profil' && (
                  <div className="pl-6 space-y-1">
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-profil-tentang' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-profil-tentang')}
                    >
                      Tentang Kami
                    </a>
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-profil-tim' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-profil-tim')}
                    >
                      Tim
                    </a>
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-profil-visi' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-profil-visi')}
                    >
                      Visi & Misi
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Layanan Dropdown */}
              <div>
                <button
                  onClick={() => {
                    toggleDropdown('mobile-layanan');
                    handleItemClick('mobile-layanan');
                  }}
                  className={`text-gray-700 hover:text-gray-900 w-full text-left px-3 py-2 text-base font-medium flex items-center justify-between ${
                    currentPath === 'mobile-layanan' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                  }`}
                >
                  Layanan
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      activeDropdown === 'mobile-layanan' ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {activeDropdown === 'mobile-layanan' && (
                  <div className="pl-6 space-y-1">
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-layanan-web' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-layanan-web')}
                    >
                      Web Development
                    </a>
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-layanan-mobile' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-layanan-mobile')}
                    >
                      Mobile App
                    </a>
                    <a 
                      href="#" 
                      className={`block px-3 py-2 text-sm ${
                        currentPath === 'mobile-layanan-design' 
                          ? 'text-blue-600 border-l-4 border-blue-600 pl-2' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => handleItemClick('mobile-layanan-design')}
                    >
                      UI/UX Design
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#"
                onClick={() => handleItemClick('berita')}
                className={`text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium ${
                  currentPath === 'berita' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                }`}
              >
                Berita
              </a>
              
              <a
                href="#"
                onClick={() => handleItemClick('galeri')}
                className={`text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium ${
                  currentPath === 'galeri' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                }`}
              >
                Galeri
              </a>
              
              <a
                href="#"
                onClick={() => handleItemClick('dokumen')}
                className={`text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium ${
                  currentPath === 'dokumen' ? 'text-blue-600 border-l-4 border-blue-600 pl-2' : ''
                }`}
              >
                Dokumen
              </a>

              {/* Mobile Login Button */}
              <div className="pt-2">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay untuk menutup dropdown ketika klik di luar */}
      {(activeDropdown || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setActiveDropdown(null);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default NavLanding;