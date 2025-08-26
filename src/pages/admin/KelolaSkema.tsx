import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Edit3,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import paths from '@/routes/paths';
import axiosInstance from '@/helper/axios';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

interface Occupation {
  id: number;
  name: string;
  scheme: {
    id: number;
    code: string;
    name: string;
  };
}

interface Scheme {
  id: number;
  name: string;
  code: string;
}

const KelolaMUK: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [occupationModalOpen, setOccupationModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    fetchSchemes();
    fetchOccupations();
  }, []);

  const fetchOccupations = async () => {
    try {
  const response = await axiosInstance.get('/occupations');
      if (response.data.success) {
        setOccupations(response.data.data);
      } else {
        setError('Gagal memuat data okupasi');
      }
    } catch (error) {
      setError('Gagal memuat data okupasi');
    }
  };
  useEffect(() => {
    const filtered = schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchemes(filtered);
  }, [schemes, searchQuery]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
  const response = await axiosInstance.get('/schemes');
      
      if (response.data.success) {
        setSchemes(response.data.data);
      } else {
        setError('Gagal memuat data skema');
      }
    } catch (error: unknown) {
      console.error('Error fetching schemes:', error);
      setError('Gagal memuat data skema');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => console.log('Edit user:', id);
  const handleView = (id: number) => console.log('View user:', id);
  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleteLoading(true);
  await axiosInstance.delete(`/schemes/${deletingId}`);
      // optimistic update
      setSchemes(prev => prev.filter(s => s.id !== deletingId));
      setFilteredSchemes(prev => prev.filter(s => s.id !== deletingId));
      setDeleteModalOpen(false);
      setDeletingId(null);
    } catch (error: unknown) {
      console.error('Error deleting scheme:', error);
      setError('Gagal menghapus skema');
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleFilter = () => console.log('Filter clicked');
  const handleExport = async () => {
    setExportLoading(true);
    setError(null);
    try {
  const response = await axiosInstance.get('/schemes/export/excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'schemes.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      setError('Gagal mengekspor data ke Excel');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E77D35] mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data skema...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-[#000000]">Kelengkapan MUK</span>
            </nav>
          </div>
          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setDeletingId(null); }}
            onConfirm={confirmDelete}
            loading={deleteLoading}
            title="Hapus Skema"
            message="Apakah Anda yakin ingin menghapus skema ini? Tindakan ini tidak dapat dibatalkan."
          />

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-4">Kelengkapan MUK</h1>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Link to={paths.admin.tambahSkema}>
                <button
                  className="w-[191px] h-[41px] bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                >
                  Tambah MUK
                </button>
              </Link>

              <Link to={paths.admin.kelolaJurusan}>
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
                <div className="flex flex-wrap gap-3 sm:space-x-3 items-center">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Cari skema..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 w-full sm:w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                  <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Filter
                    <Filter size={16} className="text-[#E77D35]" />
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors w-full sm:w-[152px] h-[41px] flex items-center justify-center"
                    disabled={exportLoading}
                  >
                    {exportLoading ? (
                      <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Exporting...</span>
                    ) : (
                      <>Export ke Excel</>
                    )}
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
                        Judul Skema
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Nomor Skema
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchemes.map((scheme, index) => (
                      <tr
                        key={scheme.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scheme.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {scheme.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(scheme.id)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleView(scheme.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => { setDeletingId(scheme.id); setDeleteModalOpen(true); }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => { setSelectedScheme(scheme); setOccupationModalOpen(true); }}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                              title="Lihat Okupasi"
                            >
                              Okupasi
                            </button>
                          </div>
                        </td>
      {/* Occupation Modal */}
      {occupationModalOpen && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Daftar Okupasi untuk Skema: <span className="text-orange-600">{selectedScheme.name}</span></h3>
            <ul className="mb-4 max-h-60 overflow-y-auto">
              {occupations.filter(o => o.scheme.id === selectedScheme.id).length === 0 ? (
                <li className="text-gray-500">Belum ada okupasi untuk skema ini.</li>
              ) : (
                occupations.filter(o => o.scheme.id === selectedScheme.id).map(o => (
                  <li key={o.id} className="py-1 border-b last:border-b-0">{o.name}</li>
                ))
              )}
            </ul>
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={() => setOccupationModalOpen(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
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