import React, { useState, useEffect } from 'react';
import {
  Filter,
  Search,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  Download,
  UserPlus
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import UserFormModal from '@/components/UserFormModal';
import UserDetailModal from '@/components/UserDetailModal';
import { useNavigate } from 'react-router-dom';
import api from '@/helper/axios';

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
  updated_at: string;
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
  assessor?: {
    id: number;
    full_name: string;
    phone_no: string;
    scheme_id: number;
    address: string;
    birth_date: string;
  };
  admin?: {
    id: number;
    address: string;
    phone_no: string;
    birth_date: string;
  };
}

interface FilterState {
  role: string;
  search: string;
}

const KelolaUser: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    role: '',
    search: ''
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users using existing endpoint
      const usersResponse = await api.get('/user');

      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data);
        
        // Extract unique roles from users data
        const uniqueRoles = Array.from(
          new Map(
            usersResponse.data.data
              .map((user: UserData) => user.role)
              .map((role: Role) => [role.id, role])
          ).values()
        );
        setRoles(uniqueRoles);
      } else {
        setError(usersResponse.data.message || 'Gagal memuat data pengguna');
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Filter by role
    if (filters.role) {
      filtered = filtered.filter(user => user.role.name === filters.role);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, role: e.target.value }));
  };

  const handleCreateUser = () => {
    setFormMode('create');
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setFormMode('edit');
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      await api.delete(`/user/${userToDelete.id}`);
      await fetchData(); // Refresh the list
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.response?.data?.message || 'Gagal menghapus pengguna';
      setError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
    fetchData(); // Refresh the list
  };

  const handleExport = () => {
    console.log('Export to Excel clicked');
    // TODO: Implement export functionality
  };

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'Admin': 'Administrator',
      'Assessor': 'Asesor',
      'Assessee': 'Asesi'
    };
    return roleMap[roleName] || roleName;
  };

  const getUserDisplayName = (user: UserData) => {
    // Priority: assessee > assessor > admin > user.full_name
    if (user.assessee?.full_name) return user.assessee.full_name;
    if (user.assessor?.full_name) return user.assessor.full_name;
    return user.full_name;
  };

  const getVerificationStatus = (user: UserData) => {
    // TODO: Implement verification status logic based on business rules
    return 'Verified'; // Placeholder
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Kelola Pengguna" icon={<UserPlus size={24} />} />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E77D35]" />
              <p className="text-gray-600">Memuat data pengguna...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Kelola Pengguna" icon={<UserPlus size={24} />} />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-[#E77D35] text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Coba Lagi
              </button>
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
        <Navbar title="Kelola Pengguna" icon={<UserPlus size={24} />} />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Manajemen Pengguna
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Kelola semua pengguna sistem (Admin, Asesor, Asesi)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCreateUser}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={16} />
                    Tambah Pengguna
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} className="text-[#E77D35]" />
                    Export ke Excel
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, email..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent text-sm"
                  />
                </div>
                
                {/* Role Filter */}
                <div className="relative">
                  <select
                    value={filters.role}
                    onChange={handleRoleFilterChange}
                    className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent text-sm"
                  >
                    <option value="">Semua Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>
                        {getRoleDisplayName(role.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(filters.search || filters.role) && (
                  <button
                    onClick={() => setFilters({ role: '', search: '' })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Pengguna</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Admin</p>
                  <p className="text-2xl font-semibold text-red-700">
                    {users.filter(u => u.role.name === 'Admin').length}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Asesor</p>
                  <p className="text-2xl font-semibold text-blue-700">
                    {users.filter(u => u.role.name === 'Assessor').length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Asesi</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {users.filter(u => u.role.name === 'Assessee').length}
                  </p>
                </div>
              </div>

              {/* Full width border line */}
              <div className="border-b border-gray-200"></div>
            </div>

            {/* Table Container */}
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
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Terdaftar
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          {filters.search || filters.role ? 'Tidak ada pengguna yang sesuai dengan filter' : 'Belum ada data pengguna'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-[#E77D35] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                {getUserDisplayName(user).charAt(0).toUpperCase()}
                              </div>
                              {getUserDisplayName(user)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role.name === 'Admin' 
                                ? 'bg-red-100 text-red-800'
                                : user.role.name === 'Assessor'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {getRoleDisplayName(user.role.name)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {getVerificationStatus(user)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                title="Lihat Detail"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isFormModalOpen && (
        <UserFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          mode={formMode}
          user={selectedUser}
          roles={roles}
          onSuccess={handleFormSuccess}
        />
      )}

      {isDetailModalOpen && selectedUser && (
        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          user={selectedUser}
        />
      )}

      {isDeleteModalOpen && userToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          title="Hapus Pengguna"
          message={`Apakah Anda yakin ingin menghapus pengguna "${getUserDisplayName(userToDelete)}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      )}
    </div>
  );
};

export default KelolaUser;