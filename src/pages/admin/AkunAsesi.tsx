import React, { useState, useEffect } from 'react';
import {
  Filter,
  Edit3,
  Eye,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import AssesseeModal from '@/components/AssesseeModal';
import { useNavigate } from 'react-router-dom';
import api from '@/helper/axios';

interface UserData {
  id: number;
  email: string;
  full_name?: string;
  role: {
    id: number;
    name: string;
  };
  assessee?: {
    id: number;
    full_name: string;
    phone_no: string;
    identity_number: string;
    birth_date: string;
    birth_location: string;
    gender: string;
    nationality: string;
    house_phone_no?: string;
    office_phone_no?: string;
    address: string;
    postal_code?: string;
    educational_qualifications: string;
  };
}

const KelolaAkunAsesi: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail modal state (for view only)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssessee, setSelectedAssessee] = useState<UserData | null>(null);
  const navigate = useNavigate();
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [assesseeToDelete, setAssesseeToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    fetchAssessees();
  }, []);

  const fetchAssessees = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users and filter for assessees (role_id = 3)
      const response = await api.get('/user');
      if (response?.data?.success) {
        // Filter for assessee users only
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        const assesseeUsers = data.filter((user: UserData) => user.role && user.role.id === 3);
        setUsers(assesseeUsers);
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

  const handleCreate = () => {
    navigate('/admin/edit-asesi');
  };


  const handleEdit = (user: UserData) => {
    navigate(`/admin/edit-asesi/${user.id}`);
  };

  const handleView = async (id: number) => {
    try {
      const res = await api.get(`/user/${id}`);
      if (res?.data?.success) {
        setSelectedAssessee(res.data.data);
        setIsDetailModalOpen(true);
      } else {
        setError(res?.data?.message || 'Gagal memuat data pengguna');
      }
    } catch (err) {
      console.error('Failed to fetch user detail:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message || 'Gagal memuat detail pengguna');
    }
  };

  const handleDeleteClick = (user: UserData) => {
    setAssesseeToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assesseeToDelete) return;

    try {
      setDeleteLoading(true);
  await api.delete(`/user/${assesseeToDelete.id}`);
      await fetchAssessees(); // Refresh the list
      setIsDeleteModalOpen(false);
      setAssesseeToDelete(null);
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
          <Navbar />
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
              <span className="text-[#000000]">Akun Asesi</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Kelola Akun Asesi</h1>
            
            {/* Create Account Button */}
            <button
              onClick={handleCreate}
              className="w-[191px] h-[41px] bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
            >
              Buat Akun
            </button>
          </div>

          {/* Main Content Card - This is the box container like in Figma */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header with full border line */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[26px] font-semibold text-[#000000]">Akun Asesi</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Filter
                    <Filter size={16} className="text-[#E77D35]" />
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-[152px] h-[41px] bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
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
                        Nama Lengkap
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Role
                      </th>
                        <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                          Verifikasi
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
                          {user.assessee?.full_name || user.full_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.assessee?.phone_no || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.role.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {(() => {
                            type ResultDoc = { approved?: boolean };
                            type AssesseeResult = { docs?: ResultDoc[] };
                            const assessee = user.assessee as { results?: AssesseeResult[] } | undefined;
                            if (!assessee || !assessee.results || assessee.results.length === 0) return 'Belum';
                            const hasApproved = assessee.results.some((r) => Array.isArray(r.docs) && (r.docs as ResultDoc[]).some((d) => d.approved));
                            return hasApproved ? 'Terverifikasi' : 'Belum';
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
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
                              onClick={() => handleDeleteClick(user)}
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


      {/* Assessee Detail Modal (View only) */}
      <AssesseeModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSuccess={() => {}}
        assessee={selectedAssessee}
        mode="show"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Hapus Akun Asesi"
        message={`Apakah Anda yakin ingin menghapus akun asesi "${assesseeToDelete?.assessee?.full_name || assesseeToDelete?.email}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default KelolaAkunAsesi;