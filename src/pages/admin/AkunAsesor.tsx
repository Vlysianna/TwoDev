import React, { useState, useEffect } from 'react';
import {
  Filter,
  Download,
  Edit3,
  Eye,
  Trash2,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import AssessorModal from '@/components/AssessorModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import api from '@/helper/axios';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: number;
  name: string;
}

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
  email: string;
  full_name?: string;
  role: Role;
  assessor?: Assessor;
}

const KelolaAkunAsesor: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail modal state (for view only)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssessor, setSelectedAssessor] = useState<User | null>(null);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [assessorToDelete, setAssessorToDelete] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/user');
      if (response?.data?.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        // Filter for assessor users (role_id === 2)
        const assessorUsers = data.filter((user: User) => user.role && user.role.id === 2);
        setUsers(assessorUsers);
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


  // Navigation for create/edit
  const handleCreate = () => {
    navigate('/admin/asesor/create');
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/asesor/edit/${user.id}`);
  };

  const handleView = (id: number) => {
    (async () => {
      try {
        // Get user data
        const res = await api.get(`/user/${id}`);
        if (res?.data?.success) {
          const userData = res.data.data;
          
          // Get assessor data by user_id
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
                  userData.assessor = {
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
                  userData.assessor = {
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
                userData.assessor = {
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
            userData.assessor = {
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
          
          setSelectedAssessor(userData);
          setIsDetailModalOpen(true);
        } else {
          setError(res?.data?.message || 'Gagal memuat data pengguna');
        }
      } catch (err) {
        console.error('Failed to fetch user detail:', err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((err as any)?.response?.data?.message || 'Gagal memuat detail pengguna');
      }
    })();
  };

  const handleDeleteClick = (user: User) => {
    setAssessorToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assessorToDelete) return;

    try {
      setDeleteLoading(true);
      await api.delete(`/user/${assessorToDelete.id}`);
      await fetchUsers(); // Refresh the list
      setIsDeleteModalOpen(false);
      setAssessorToDelete(null);
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.response?.data?.message || 'Gagal menghapus pengguna';
      setError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  // No modal success needed for create/edit

  const handleFilter = () => console.log('Filter clicked');
  const handleExport = () => console.log('Export to Excel clicked');

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
            
            {/* Create Account Button */}
            <button
              onClick={handleCreate}
              className="px-14 py-2 bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Buat Akun
            </button>
          </div>

          {/* Main Content Card - This is the box container like in Figma */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header with full border line */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Akun Asessor</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Filter
                    <Filter size={16} className='text-[#E77D35]'/>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                  >
                    <Download size={16} />
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
                        Nama Lengkap
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Phone
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
                          {user.assessor?.full_name || user.full_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.assessor?.phone_no || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleView(user.id)}
                              className="p-2 text-[#E77D35] hover:bg-orange-100 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
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


      {/* Assessor Detail Modal (View only) */}
      <AssessorModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSuccess={() => {}}
        assessor={selectedAssessor}
        mode="show"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Hapus Akun Assessor"
        message={`Apakah Anda yakin ingin menghapus akun assessor "${assessorToDelete?.assessor?.full_name || assessorToDelete?.email}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default KelolaAkunAsesor;