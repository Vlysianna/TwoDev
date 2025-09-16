import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import paths from '@/routes/paths';
import { getAssetPath } from '@/utils/assetPath';

const NavLanding: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');
  const { isAuthenticated, user } = useAuth();

	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		if (path === paths.root) {
			setActiveItem("home");
		} else if (
			path.includes(paths.dashboard.about) ||
			path.includes(paths.dashboard.struktur)
		) {
			setActiveItem("profil");
		} else if (
			path.includes(paths.dashboard.skema) ||
			path.includes(paths.dashboard.tempatUji) ||
			path.includes(paths.dashboard.asesor) ||
			path.includes(paths.dashboard.prosedurPendaftaran)
		) {
			setActiveItem("layanan");
		} else if (path.includes(paths.dashboard.berita)) {
			setActiveItem("berita");
		} else if (path.includes(paths.dashboard.galeri)) {
			setActiveItem("galeri");
		} else if (path.includes(paths.dashboard.contact)) {
			setActiveItem("dokumen");
		}
	}, [location.pathname]);

	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMobileMenuOpen]);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		setActiveDropdown(null);
	};

  const getDashboardPath = (roleId: number) => {
    switch (roleId) {
      case 1:
        return paths.admin.root;
      case 2:
        return paths.asesor.root;
      case 3:
        return paths.asesi.root;
      default:
        return paths.root;
    }
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const menuItems = [
    { name: 'Home', path: paths.root },
    { name: 'Berita', path: paths.dashboard.berita },
    { name: 'Galeri', path: paths.dashboard.galeri },
    { name: 'Contact', path: paths.dashboard.contact },
  ];

	return (
		<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<img src={getAssetPath('/twodev-teks.svg')} alt="Wodev" className="h-8" />
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{menuItems.map((item) => (
							<Link
								key={item.name}
								to={item.path}
								className={`relative px-3 py-2 text-sm font-medium transition-colors ${
									activeItem === item.name.toLowerCase()
										? "text-blue-600"
										: "text-gray-700 hover:text-gray-900"
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
								onClick={() => toggleDropdown("profil")}
								className={`relative px-3 py-2 text-sm font-medium flex items-center transition-colors ${
									activeItem === "profil"
										? "text-blue-600"
										: "text-gray-700 hover:text-gray-900"
								}`}
							>
								Profil
								<ChevronDown
									size={16}
									className={`ml-1 transition-transform ${
										activeDropdown === "profil" ? "rotate-180" : ""
									}`}
								/>
								{activeItem === "profil" && (
									<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
								)}
							</button>
							{activeDropdown === "profil" && (
								<div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50 py-2">
									<Link
										to={paths.dashboard.about}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Tentang LSP
									</Link>
									<Link
										to={paths.dashboard.struktur}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Struktur Organisasi
									</Link>
								</div>
							)}
						</div>

            {/* Layanan Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('layanan')}
                className={`relative px-3 py-2 text-sm font-medium flex items-center transition-colors ${activeItem === 'layanan' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
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
                  <Link to={paths.dashboard.skema} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Skema
                  </Link>
                  <Link to={paths.dashboard.tempatUji} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Tempat Uji
                  </Link>
                  <Link to={paths.dashboard.asesor} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Asesor
                  </Link>
                  <Link to={paths.dashboard.prosedurPendaftaran} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Prosedur Pendaftaran
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Authentication Section */}
          <div className="hidden md:block">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={getDashboardPath(user.role_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <UserMenu />
              </div>
            ) : (
              <Link className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md text-sm font-medium" to={paths.auth.login}>
                Login
              </Link>
            )}
          </div>

					{/* Mobile Menu Toggle */}
					<div className="md:hidden">
						<button
							onClick={toggleMobileMenu}
							className="text-gray-700 hover:text-gray-900"
						>
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 z-40 relative">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to={paths.root} className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>

						{/* Profil Mobile */}
						<div>
							<button
								onClick={() => toggleDropdown("mobile-profil")}
								className="w-full flex justify-between items-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
							>
								Profil
								<ChevronDown
									size={16}
									className={`transition-transform ${
										activeDropdown === "mobile-profil" ? "rotate-180" : ""
									}`}
								/>
							</button>
							{activeDropdown === "mobile-profil" && (
								<div className="pl-4 space-y-1">
									<Link
										to={paths.dashboard.about}
										className="block text-sm text-gray-600 hover:text-blue-600"
									>
										Tentang LSP
									</Link>
									<Link
										to={paths.dashboard.struktur}
										className="block text-sm text-gray-600 hover:text-blue-600"
									>
										Struktur Organisasi
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
                  <Link to={paths.dashboard.skema} className="block text-sm text-gray-600 hover:text-blue-600">
                    Skema
                  </Link>
                  <Link to={paths.dashboard.tempatUji} className="block text-sm text-gray-600 hover:text-blue-600">
                    Tempat Uji
                  </Link>
                  <Link to={paths.dashboard.asesor} className="block text-sm text-gray-600 hover:text-blue-600">
                    Asesor
                  </Link>
                  <Link to={paths.dashboard.prosedurPendaftaran} className="block text-sm text-gray-600 hover:text-blue-600">
                    Prosedur Pendaftaran
                  </Link>
                </div>
              )}
            </div>

            <Link to={paths.dashboard.berita} className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Berita
            </Link>
            <Link to={paths.dashboard.galeri} className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Galeri
            </Link>
            <Link to={paths.dashboard.contact} className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Contact
            </Link>

            {/* Mobile Authentication Section */}
            {isAuthenticated && user ? (
              <div className="space-y-2 mt-4">
                <Link 
                  to={getDashboardPath(user.role_id)}
                  className="w-full bg-[#E77D35] hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-2">
                  <UserMenu />
                </div>
              </div>
            ) : (
              <Link 
                to={paths.auth.login}
                className="w-full bg-[#E77D35] hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavLanding;
