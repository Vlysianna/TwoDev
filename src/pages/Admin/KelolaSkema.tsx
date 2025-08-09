import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Edit3,
  Eye,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';

interface UserData {
  id: number;
  okupasi: string;
  skema: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

const KelolaMUK: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userData: UserData[] = [
    { id: 1, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
    { id: 2, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
    { id: 3, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
    { id: 4, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
    { id: 5, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
    { id: 6, okupasi: 'Pemrogram Junior(Junior Coder)', skema: 'RPL', tanggalMulai: '22/07/2025', tanggalSelesai: '23/07/2025' },
  ];

  const handleEdit = (id: number) => console.log('Edit user:', id);
  const handleView = (id: number) => console.log('View user:', id);
  const handleDelete = (id: number) => console.log('Delete user:', id);
  const handleFilter = () => console.log('Filter clicked');
  const handleExport = () => console.log('Export to Excel clicked');
  const handleCreateAccount = () => console.log('Create account clicked');

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-[#000000]">Kelengkapan MUK</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-4">Kelengkapan MUK</h1>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Link to="/tambah-muk">
                <button
                  className="w-[191px] h-[41px] bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                >
                  Tambah MUK
                </button>
              </Link>

              <Link to="/kelola-jurusan">
                <button
                  className="w-[151px] h-[41px] border border-[#E77D35] text-[#E77D35] text-sm font-medium rounded-md hover:bg-orange-50 transition-colors"
                >
                  Kelola Jurusan
                </button>
              </Link>
            </div>
          </div>

          {/* Main Content Card - This is the box container like in Figma */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header with full border line */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h2 className="text-[20px] sm:text-[26px] font-semibold text-[#000000]">
                  Kelengkapan MUK
                </h2>
                <div className="flex flex-wrap gap-3 sm:space-x-3">
                  <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Filter
                    <Filter size={16} className="text-[#E77D35]" />
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors w-full sm:w-[152px] h-[41px]"
                  >
                    Export ke Excel
                  </button>
                </div>
              </div>
              {/* Full width border line */}
              <div className="border-b border-gray-200"></div>
            </div>

            {/* Table Container with padding */}
            <div className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#E77D35] text-white">
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Nama Okupasi
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Skema
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Tanggal Mulai
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Tanggal Selesai
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.okupasi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.skema}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.tanggalMulai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.tanggalSelesai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleView(user.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KelolaMUK;