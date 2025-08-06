import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const NavLanding: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveItem('home');
    else if (path.includes('/about') || path.includes('/struktur') || path.includes('/pengelola')) {
      setActiveItem('profil');
    } else if (
      path.includes('/skema') ||
      path.includes('/tempat-uji') ||
      path.includes('/asesor') ||
      path.includes('/prosedur-pendaftaran')
    ) {
      setActiveItem('layanan');
    } else if (path.includes('/berita')) setActiveItem('berita');
    else if (path.includes('/galeri')) setActiveItem('galeri');
    else if (path.includes('/dokumen')) setActiveItem('dokumen');
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Berita', path: '/berita' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Dokumen', path: '/dokumen' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/twodev-teks.svg" alt="Wodev" className="h-8" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  activeItem === item.name.toLowerCase() ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.name}
                {activeItem === item.name.toLowerCase() && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}

            {/* Profil Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('profil')}
                className={`relative px-3 py-2 text-sm font-medium flex items-center transition-colors ${
                  activeItem === 'profil' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Profil
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${activeDropdown === 'profil' ? 'rotate-180' : ''}`}
                />
                {activeItem === 'profil' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
              {activeDropdown === 'profil' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50 py-2">
                  <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Tentang LSP
                  </Link>
                  <Link to="/struktur" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Struktur Organisasi
                  </Link>
                  <Link to="/pengelola-sdm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Pengelola SDM
                  </Link>
                </div>
              )}
            </div>

            {/* Layanan Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('layanan')}
                className={`relative px-3 py-2 text-sm font-medium flex items-center transition-colors ${
                  activeItem === 'layanan' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Layanan
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${activeDropdown === 'layanan' ? 'rotate-180' : ''}`}
                />
                {activeItem === 'layanan' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
              {activeDropdown === 'layanan' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg border rounded-md z-50 py-2">
                  <Link to="/skema" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Skema
                  </Link>
                  <Link to="/tempat-uji" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Tempat Uji
                  </Link>
                  <Link to="/asesor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Asesor
                  </Link>
                  <Link to="/prosedur-pendaftaran" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Prosedur Pendaftaran
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md text-sm font-medium">
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-gray-900">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 z-40 relative">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>

            {/* Profil Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-profil')}
                className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Profil
                <ChevronDown
                  size={16}
                  className={`transition-transform ${activeDropdown === 'mobile-profil' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'mobile-profil' && (
                <div className="pl-4 space-y-1">
                  <Link to="/about" className="block text-sm text-gray-600 hover:text-blue-600">
                    Tentang LSP
                  </Link>
                  <Link to="/struktur" className="block text-sm text-gray-600 hover:text-blue-600">
                    Struktur Organisasi
                  </Link>
                  <Link to="/pengelola-sdm" className="block text-sm text-gray-600 hover:text-blue-600">
                    Pengelola SDM
                  </Link>
                </div>
              )}
            </div>

            {/* Layanan Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-layanan')}
                className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Layanan
                <ChevronDown
                  size={16}
                  className={`transition-transform ${activeDropdown === 'mobile-layanan' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'mobile-layanan' && (
                <div className="pl-4 space-y-1">
                  <Link to="/skema" className="block text-sm text-gray-600 hover:text-blue-600">
                    Skema
                  </Link>
                  <Link to="/tempat-uji" className="block text-sm text-gray-600 hover:text-blue-600">
                    Tempat Uji
                  </Link>
                  <Link to="/asesor" className="block text-sm text-gray-600 hover:text-blue-600">
                    Asesor
                  </Link>
                  <Link to="/prosedur-pendaftaran" className="block text-sm text-gray-600 hover:text-blue-600">
                    Prosedur Pendaftaran
                  </Link>
                </div>
              )}
            </div>

            <Link to="/berita" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Berita
            </Link>
            <Link to="/galeri" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Galeri
            </Link>
            <Link to="/dokumen" className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Dokumen
            </Link>

            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm mt-4">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavLanding;
