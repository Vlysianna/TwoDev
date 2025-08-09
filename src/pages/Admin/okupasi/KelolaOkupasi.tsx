import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Filter, Bell } from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import { Link, useNavigate } from 'react-router-dom';

interface OkupasiData {
  id: number;
  namaOkupasi: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

const KelolaOkupasi: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [okupasiData] = useState<OkupasiData[]>([
    {
      id: 1,
      namaOkupasi: 'Pemrogram Junior',
      deskripsi: 'RPL',
      tanggalMulai: '22/07/2025',
      tanggalSelesai: '23/07/2025'
    },
    {
      id: 2,
      namaOkupasi: 'Network Administrator',
      deskripsi: 'TKJ',
      tanggalMulai: '24/07/2025',
      tanggalSelesai: '25/07/2025'
    },
    {
      id: 3,
      namaOkupasi: 'Multimedia Designer',
      deskripsi: 'Multimedia',
      tanggalMulai: '26/07/2025',
      tanggalSelesai: '27/07/2025'
    },
    {
      id: 4,
      namaOkupasi: 'Web Developer',
      deskripsi: 'RPL',
      tanggalMulai: '28/07/2025',
      tanggalSelesai: '29/07/2025'
    },
    {
      id: 5,
      namaOkupasi: 'System Analyst',
      deskripsi: 'TKJ',
      tanggalMulai: '30/07/2025',
      tanggalSelesai: '31/07/2025'
    },
    {
      id: 6,
      namaOkupasi: 'UI/UX Designer',
      deskripsi: 'Multimedia',
      tanggalMulai: '01/08/2025',
      tanggalSelesai: '02/08/2025'
    }
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: number) => {
    console.log('Edit okupasi:', id);
    // Navigate to edit page with the ocupasi ID
    navigate(`/edit-okupasi/${id}`);
  };

  const handleView = (id: number) => {
    console.log('View okupasi:', id);
    // Navigate to view/detail page
    navigate(`/detail-okupasi/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log('Delete okupasi:', id);
    // Show confirmation dialog before delete
    if (window.confirm('Apakah Anda yakin ingin menghapus okupasi ini?')) {
      // Add delete logic here
      console.log(`Okupasi dengan ID ${id} berhasil dihapus`);
      // In real application, you would update the state or refetch data
    }
  };

  const handleFilter = () => {
    console.log('Filter okupasi');
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 lg:px-6 lg:py-4 ml-0 lg:ml-0">
            <div className="flex items-center justify-end">
              <div className="ml-12 lg:ml-0 flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Notification Bell */}
                <button
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                  title="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Admin User</span>
                    <span className="text-xs text-gray-500">admin@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Breadcrumb & Title */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>Dashboard</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Kelola Okupasi</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Kelola Okupasi</h1>
            </div>

            {/* Add Button */}
            <div className="px-6 py-4 border-b border-gray-200">
              <Link
                to="/tambah-okupasi"
                className="inline-flex bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg items-center space-x-2 transition-colors duration-200"
                >
                <Plus size={16} />
                <span className="text-sm font-medium">Tambah Okupasi</span>
                </Link>
            </div>

            {/* Filter & Export */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Okupasi</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleFilter}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Filter size={16} />
                    <span className="text-sm hidden sm:inline">Filter</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <span className="hidden sm:inline">Export to Excel</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="px-6 py-4 text-left text-sm font-medium">Nama Okupasi</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Skema</th>
                    <th className="px-6 py-4 text-left text-sm font-medium hidden sm:table-cell">Tanggal Mulai</th>
                    <th className="px-6 py-4 text-left text-sm font-medium hidden sm:table-cell">Tanggal Selesai</th>
                    <th className="px-6 py-4 text-center text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {okupasiData
                    .filter(item =>
                      item.namaOkupasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.namaOkupasi}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.deskripsi}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">{item.tanggalMulai}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">{item.tanggalSelesai}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors duration-200"
                              title="Edit Okupasi"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleView(item.id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                              title="Hapus Okupasi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Empty State */}
              {okupasiData.filter(item =>
                item.namaOkupasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data okupasi yang ditemukan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaOkupasi;