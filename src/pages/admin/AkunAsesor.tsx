import React, { useState, useEffect } from 'react';
import {
  Eye,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import AssessorModal from '@/components/AssessorModal';
import api from '@/helper/axios';

interface Assessor {
  id: number;
  full_name: string;
  phone_no: string;
  scheme_id: number;
  address: string;
  birth_date: string;
  identity_number?: string;
  birth_location?: string;
  gender?: string;
  nationality?: string;
  house_phone_no?: string;
  office_phone_no?: string;
  postal_code?: string;
  educational_qualifications?: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
  assessor?: Assessor;
}

const KelolaAkunAsesor: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail modal state (for view only)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssessor, setSelectedAssessor] = useState<User | null>(null);
  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  


  useEffect(() => {
    fetchUsers(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchUsers = async (p = 1, l = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/assessor/user/status', { params: { page: p, limit: l } });
      if (response?.data?.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setUsers(data);
        const meta = response.data.meta || {};
        setTotal(meta.total || data.length);
        setTotalPages(meta.total_pages || 1);
        setPage(meta.current_page || p);
        setLimit(meta.limit || l);
      } else {
        setError(response?.data?.message || 'Gagal memuat data pengguna');
      }
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.response?.data?.message || 'Gagal memuat data pengguna';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };




  const handleView = (id: number) => {
    (async () => {
      try {
        // Find user data from the already loaded users array
        const userData = users.find(user => user.id === id);
        if (!userData) {
          console.error('User not found');
          return;
        }

        // Create user object with the basic info
        const userWithFullData: User = {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status
        };

        // If user has complete assessor data, get detailed assessor info
        if (userData.status === 'Lengkap') {
          try {
            const assessorRes = await api.get(`/assessor/user/${id}`);
            if (assessorRes?.data?.success) {
              const assessorData = assessorRes.data.data;
              
              // Get assessor detail if assessor exists
              try {
                const detailRes = await api.get(`/assessor-detail/${assessorData.id}`);
                if (detailRes?.data?.success) {
                  const detailData = detailRes.data.data;
                  
                  // Merge all data in the format expected by AssessorModal
                  userWithFullData.assessor = {
                    id: assessorData.id,
                    full_name: assessorData.full_name,
                    phone_no: assessorData.phone_no || detailData.phone_no,
                    identity_number: detailData.tax_id_number,
                    birth_date: assessorData.birth_date || detailData.birth_date,
                    birth_location: detailData.birth_place,
                    gender: detailData.gender,
                    nationality: detailData.nationality,
                    house_phone_no: detailData.house_phone_no,
                    office_phone_no: detailData.office_phone_no,
                    address: assessorData.address || detailData.address,
                    postal_code: detailData.postal_code,
                    educational_qualifications: detailData.educational_qualifications,
                    scheme_id: assessorData.scheme_id,
                  };
                } else {
                  // Just use assessor data without detail
                  userWithFullData.assessor = {
                    id: assessorData.id,
                    full_name: assessorData.full_name,
                    phone_no: assessorData.phone_no,
                    identity_number: '',
                    birth_date: assessorData.birth_date,
                    birth_location: '',
                    gender: '',
                    nationality: '',
                    house_phone_no: '',
                    office_phone_no: '',
                    address: assessorData.address,
                    postal_code: '',
                    educational_qualifications: '',
                    scheme_id: assessorData.scheme_id,
                  };
                }
              } catch {
                // Assessor detail might not exist, use basic assessor data
                userWithFullData.assessor = {
                  id: assessorData.id,
                  full_name: assessorData.full_name,
                  phone_no: assessorData.phone_no,
                  identity_number: '',
                  birth_date: assessorData.birth_date,
                  birth_location: '',
                  gender: '',
                  nationality: '',
                  house_phone_no: '',
                  office_phone_no: '',
                  address: assessorData.address,
                  postal_code: '',
                  educational_qualifications: '',
                  scheme_id: assessorData.scheme_id,
                };
              }
            }
          } catch {
            // Assessor might not exist, create empty assessor structure
            userWithFullData.assessor = {
              id: 0,
              full_name: userData.full_name || '',
              phone_no: '',
              identity_number: '',
              birth_date: '',
              birth_location: '',
              gender: '',
              nationality: '',
              house_phone_no: '',
              office_phone_no: '',
              address: '',
              postal_code: '',
              educational_qualifications: '',
              scheme_id: 0,
            };
          }
        }
          
        setSelectedAssessor(userWithFullData);
        setIsDetailModalOpen(true);
      } catch (err) {
        console.error('Failed to fetch user detail:', err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((err as any)?.response?.data?.message || 'Gagal memuat detail pengguna');
      }
    })();
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Kelola Akun Asesor" icon={<UserCheck size={20} />} />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E77D35] mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data asesor...</p>
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
        <Navbar title="Kelola Akun Asesor" icon={<UserCheck size={20} />} />

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
              <span className="text-gray-900">Akun Asessor</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Kelola Akun Asessor</h1>
          </div>

          {/* Main Content Card - This is the box container like in Figma */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header with full border line */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Akun Asessor</h2>
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
                        Nama Lengkap
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Lengkap' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleView(user.id)}
                              className="p-2 text-[#E77D35] hover:bg-orange-100 rounded-md transition-colors"
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


      {/* Assessor Detail Modal (View only) */}
      <AssessorModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSuccess={() => {}}
        assessor={selectedAssessor}
        mode="show"
      />


    </div>
  );
};

export default KelolaAkunAsesor;