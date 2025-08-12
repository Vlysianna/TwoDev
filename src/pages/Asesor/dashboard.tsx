import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ListFilter, Clock, ChevronRight, LayoutDashboard } from "lucide-react";
import { Link } from 'react-router-dom';
import SidebarAsesor from '@/components/SideAsesor';
import NavbarAsesor from '@/components/NavAsesor';

const DashboardAsesor: React.FC = () => {
  const { user } = useAuth();

  const okupasiData = [
    {
      id: 1,
      title: "Okupasi Junior Code",
      subtitle: "Rekayasa Perangkat Lunak ( RPL )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "EY",
      avatarBg: "bg-[#60B5FF]",
      instructor: "Eva Yeprilianti, S.Kom",
      role: "Asesor",
      borderColor: "border-[#60B5FF]"
    },
    {
      id: 2,
      title: "Okupasi Front Office",
      subtitle: "Perhotelan ( PH )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "AA",
      avatarBg: "bg-[#7A7A73]",
      instructor: "Aan Aspriansya, S.Tr.Par",
      role: "Asesor",
      borderColor: "border-[#7A7A73]"
    },
    {
      id: 3,
      title: "Okupasi Pastry & Confictionary",
      subtitle: "Tata Boga ( TBG )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "IW",
      avatarBg: "bg-[#FF7A30]",
      instructor: "Ibnu Widianto, S.Pd",
      role: "Asesor",
      borderColor: "border-[#FF7A30]"
    },
    {
      id: 4,
      title: "Okupasi Tour Planning",
      subtitle: "Usaha Layanan Wisata ( ULW )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "AW",
      avatarBg: "bg-[#640D5F]",
      instructor: "Ana Wijayanti, A.Md",
      role: "Asesor",
      borderColor: "border-[#640D5F]"
    },
    {
      id: 5,
      title: "Okupasi Menjahit Rok",
      subtitle: "Tata Busana ( TBS )",
      status: "Sewaktu",
      startDate: "24 Okt, 07:00pm",
      endDate: "25 Okt, 15:00pm",
      avatar: "ES",
      avatarBg: "bg-[#B33791]",
      instructor: "Eni Susilawanti, S.Pd",
      role: "Asesor",
      borderColor: "border-[#B33791]"
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <SidebarAsesor />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavbarAsesor title="Dashboard Asesor" icon={<LayoutDashboard size={25} />} />
        </div>

        {/* Main Body */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header Welcome */}
          <div className="mb-6 px-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat Datang, {user?.email || "Asesor"}
            </h2>
            <p className="text-gray-600">
              Kelola penilaian dan asesmen peserta dari dashboard ini.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mb-6 px-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50">
              <ListFilter className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Filter</span>
            </button>
          </div>

          {/* Grid Okupasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {okupasiData.map((okupasi) => (
              <div
                key={okupasi.id}
                className={`bg-white rounded-lg shadow-sm border-b-4 ${okupasi.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{okupasi.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{okupasi.subtitle}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{okupasi.status}</span>
                  </div>
                </div>

                <div className="px-4 pt-3 pb-10">
                  <div className="flex flex-col items-center">
                    <div className="flex justify-between w-full text-sm text-gray-500 mb-2">
                      <span>{okupasi.startDate}</span>
                      <span>{okupasi.endDate}</span>
                    </div>
                    <div className="relative w-full h-4 flex items-center">
                      <div className="absolute left-0 right-0 h-[2px] bg-gray-300" />
                      <div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
                      <div className="flex-1"></div>
                      <div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${okupasi.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                        {okupasi.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{okupasi.instructor}</p>
                        <p className="text-xs text-gray-500">{okupasi.role}</p>
                      </div>
                    </div>
                    <Link to="/apl-01" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAsesor;