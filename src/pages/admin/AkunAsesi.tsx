import React, { useState, useEffect } from 'react';
import {
  Eye,
  Loader2,
  AlertCircle,
  User
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import AssesseeModal from '@/components/AssesseeModal';
import api from '@/helper/axios';
import { formatDate } from "@/helper/format-date";


interface AssesseeItem {
  id: number;
  user_id?: number;
  name: string;
  identity_number?: string;
  birth_date?: string;
  birth_location?: string;
  gender?: string;
  nationality?: string;
  phone_no?: string;
  house_phone_no?: string | null;
  office_phone_no?: string | null;
  address?: string;
  postal_code?: string | null;
  educational_qualifications?: string;
  job?: any;
  results?: any[];
  email?: string; // optional if joined
}

const KelolaAkunAsesi: React.FC = () => {
  const [users, setUsers] = useState<AssesseeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail modal state (for view only)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssessee, setSelectedAssessee] = useState<AssesseeItem | null>(null);

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Reset to first page when searchTerm changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchAssessees(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchTerm]);

  const fetchAssessees = async (p = 1, l = 10) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch assessee paginated data
      const params: any = { page: p, limit: l };
      if (searchTerm && searchTerm.trim() !== '') params.keyword = searchTerm.trim();
      const response = await api.get('/assessee', { params });
      if (response?.data?.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setUsers(data);
        const meta = response.data.meta || {};
        setTotal(meta.total || data.length);
        setTotalPages(meta.total_pages || 1);
        setPage(meta.current_page || p);
        setLimit(meta.limit || l);
      } else {
        setError(response?.data?.message || 'Gagal memuat data asesi');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch assessees:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.response?.data?.message || 'Gagal memuat data asesi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  const handleView = async (id: number) => {
    try {
      // fetch assessee detail
      const res = await api.get(`/assessee/${id}`);
      if (res?.data?.success) {
        setSelectedAssessee(res.data.data);
        setIsDetailModalOpen(true);
      } else {
        setError(res?.data?.message || 'Gagal memuat data pengguna');
      }
    } catch (err) {
      console.error('Failed to fetch assessee detail:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message || 'Gagal memuat detail pengguna');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Kelola Akun Asesi" icon={<User size={20} />} />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E77D35]" />
              <p className="text-gray-600">Memuat data asesi...</p>
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
        <Navbar title="Kelola Akun Asesi" icon={<User size={20} />} />

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
              <span className="text-[#000000]">Akun Asesi</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Kelola Akun Asesi</h1>
          </div>

          {/* Main Content Card - This is the box container like in Figma */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header with full border line */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[26px] font-semibold text-[#000000]">Akun Asesi</h2>
                <form
                  className="ml-4 flex items-center space-x-2"
                  onSubmit={e => {
                    e.preventDefault();
                    setSearchTerm(searchValue);
                  }}
                >
                  <input
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Cari nama, email, atau no. HP"
                    className="px-3 py-2 border rounded-md text-sm w-64"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                  >
                    Cari
                  </button>
                </form>
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
                      {['Nama Lengkap','NIK','Tanggal Lahir','Tempat Lahir','Nomor HP','Pendidikan'].map((label) => (
                        <th key={label} className="px-6 py-4 text-left text-sm font-semibold tracking-wide">
                          {label}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-sm font-semibold tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                          Tidak ada data asesi
                        </td>
                      </tr>
                    )}
                    {users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.identity_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.birth_date ? formatDate(user.birth_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.birth_location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.phone_no || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.educational_qualifications || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleView(user.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Menampilkan halaman {page} dari {totalPages} — total {total} data
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="ml-2 px-2 py-1 border rounded"
                    aria-label="Items per page"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>


      {/* Assessee Detail Modal (View only) */}
      <AssesseeModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSuccess={() => {}}
        assessee={selectedAssessee}
        mode="show"
      />


    </div>
  );
};

export default KelolaAkunAsesi;