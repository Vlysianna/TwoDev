import React, { useState, useEffect } from 'react';
import { Edit3, Eye, Trash2, AlertCircle, File } from 'lucide-react';
import useToast from '@/components/ui/useToast';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { Link } from 'react-router-dom';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import ApprovalConfirmModal from '@/components/ApprovalConfirmModal';
import JadwalViewModal from '@/components/JadwalViewModal';
import JadwalEditModal from '@/components/JadwalEditModal';
import paths from '@/routes/paths';
import axiosInstance from '@/helper/axios';
import { formatDate } from "@/helper/format-date";

// Backend response interfaces matching the actual API
interface BackendScheduleResponse {
  id: number;
  start_date: string | Date;
  end_date: string | Date;
  assessment: {
    id: number;
    code: string;
    occupation: {
      id: number;
      name: string;
      scheme: {
        id: number;
        code: string;
        name: string;
      };
    };
  };
  schedule_details: any[];
}

// Frontend interfaces for internal use
interface Schedule {
  id: number;
  start_date?: string | null;
  end_date?: string | null;
  assessment: {
    id: number;
    occupation: {
      id: number;
      name: string;
      scheme: {
        id: number;
        name: string;
      };
    };
  };
}

const KelolaJadwal: React.FC = () => {
  const [searchQuery] = useState<string>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<{ approver_admin_id: number; second_approver_admin_id: number; comment: string } | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<Schedule | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const filtered = schedules.filter(schedule =>
      schedule.assessment.occupation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.assessment.occupation.scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [schedules, searchQuery]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/schedules');

      if (response.data.success) {
        const backendItems = response.data.data as BackendScheduleResponse[];
        const transformedSchedules: Schedule[] = backendItems.map((item) => ({
          id: item.id,
          start_date: item.start_date ? (item.start_date instanceof Date ? item.start_date.toISOString() : item.start_date) : null,
          end_date: item.end_date ? (item.end_date instanceof Date ? item.end_date.toISOString() : item.end_date) : null,
          assessment: {
            id: item.assessment.id,
            occupation: {
              id: item.assessment.occupation.id,
              name: item.assessment.occupation.name,
              scheme: {
                id: item.assessment.occupation.scheme.id,
                name: item.assessment.occupation.scheme.name,
              },
            },
          },
        }));
        setSchedules(transformedSchedules);
      } else {
        setError('Gagal memuat data jadwal');
        toast.show({ title: 'Gagal', description: 'Gagal memuat data jadwal', type: 'error' });
      }
    } catch (error: unknown) {
      console.error('Error fetching schedules:', error);
      setError('Gagal memuat data jadwal');
      toast.show({ title: 'Gagal', description: 'Gagal memuat data jadwal', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const jadwal = schedules.find(s => s.id === id) || null;
    setSelectedJadwal(jadwal);
    setShowEditModal(true);
  };

  const handleView = (id: number) => {
    const jadwal = schedules.find(s => s.id === id) || null;
    setSelectedJadwal(jadwal);
    setShowViewModal(true);
  };
  const handleEditSave = async (data: { start_date: string; end_date: string }) => {
    if (!selectedJadwal) return;
    try {
      setEditLoading(true);
      setError(null);
      setSuccess(null);
      const res = await axiosInstance.put(`/schedules/${selectedJadwal.id}`, {
        start_date: data.start_date,
        end_date: data.end_date
      });
      if (res.data?.success) {
        toast.show({ title: 'Berhasil', description: 'Jadwal berhasil diupdate', type: 'success' });
        await fetchSchedules();
        setShowEditModal(false);
        setSelectedJadwal(null);
      } else {
        const msg = res.data?.message || 'Gagal update jadwal';
        setError(msg);
        toast.show({ title: 'Gagal', description: msg, type: 'error' });
      }
    } catch (err) {
      setError('Gagal update jadwal');
      toast.show({ title: 'Gagal', description: 'Gagal update jadwal', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (forcedId?: number, approvalOverride?: { approver_admin_id: number; second_approver_admin_id: number; comment: string }) => {
    const id = forcedId ?? deleteId;
    if (!id) return;
    try {
      setDeleteLoading(true);
      setError(null);
      setSuccess(null);
      const effectiveApproval = approvalOverride ?? approvalData;
      if (!effectiveApproval) { setApprovalOpen(true); return; }
      const res = await axiosInstance.delete(`/schedules/${id}`, {
        headers: {
          'x-approver-admin-id': effectiveApproval.approver_admin_id,
          'x-second-approver-admin-id': effectiveApproval.second_approver_admin_id,
          'x-approval-comment': effectiveApproval.comment || 'hapus jadwal',
        }
      });
      if (res.data?.success) {
        toast.show({ title: 'Berhasil', description: 'Permintaan penghapusan dikirim untuk persetujuan', type: 'success' });
        await fetchSchedules();
      } else {
        const msg = res.data?.message || 'Gagal menghapus jadwal';
        setError(msg);
        toast.show({ title: 'Gagal', description: msg, type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError('Gagal menghapus jadwal');
      toast.show({ title: 'Gagal', description: 'Gagal menghapus jadwal', type: 'error' });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setDeleteId(null);
      setApprovalData(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleExport = async () => {
    try {
      setError(null);
      toast.show({ title: 'Memproses', description: 'Memproses ekspor...', type: 'info' });

      const response = await axiosInstance.get('/schedules/export/excel', {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jadwal-asesmen-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.show({ title: 'Berhasil', description: 'Ekspor berhasil. File Excel telah diunduh.', type: 'success' });
    } catch (error) {
      console.error('Error exporting schedules:', error);
      setError('Gagal mengekspor data jadwal');
      toast.show({ title: 'Gagal', description: 'Gagal mengekspor data jadwal', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar title="Kelola Jadwal" icon={<File size={20} />} />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E77D35] mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data jadwal...</p>
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
        <Navbar title="Kelola Jadwal" icon={<File size={20} />} />
        <main className="flex-1 overflow-auto p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
              <svg className="w-5 h-5 text-green-600 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-[#000000]">Kelola Jadwal</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-4">Kelola Jadwal Asesmen</h1>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Link to={paths.admin.tambahJadwal}>
                <button
                  className="w-[191px] h-[41px] bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                >
                  Tambah Jadwal
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
                  Daftar Jadwal Asesmen
                </h2>
                <div className="flex flex-wrap gap-3 sm:space-x-3">
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
                  <thead >
                    <tr className="bg-[#E77D35] text-white">
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Skema
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Nama Okupasi
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Tanggal Mulai
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                        Tanggal Selesai
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">

                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchedules.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                          Tidak ada data jadwal
                        </td>
                      </tr>
                    )}
                    {filteredSchedules.map((schedule, index) => (
                      <tr
                        key={schedule.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {schedule.assessment.occupation.scheme.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {schedule.assessment.occupation.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {schedule.start_date ? formatDate(schedule.start_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {schedule.end_date ? formatDate(schedule.end_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(schedule.id)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleView(schedule.id)}
                              className="p-2 text-orange-600 hover:bg-gray-100 rounded-md transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            {/* Modal View Jadwal */}
                            <JadwalViewModal
                              isOpen={showViewModal}
                              onClose={() => { setShowViewModal(false); setSelectedJadwal(null); }}
                              jadwal={selectedJadwal as any}
                            />
                            {/* Modal Edit Jadwal */}
                            <JadwalEditModal
                              isOpen={showEditModal}
                              onClose={() => { setShowEditModal(false); setSelectedJadwal(null); }}
                              jadwal={selectedJadwal as any}
                              onSave={handleEditSave}
                              loading={editLoading}
                            />
                            <button
                              onClick={() => {
                                setDeleteId(schedule.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-orange-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* Modals moved to page-level to avoid layout/z-index issues */}
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
      {/* Confirm Delete Modal (page-level) */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => { if (!deleteLoading) { setShowDeleteModal(false); setDeleteId(null); } }}
        onConfirm={() => { setShowDeleteModal(false); setApprovalOpen(true); }}
        loading={deleteLoading}
        title="Hapus Jadwal?"
        message="Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan."
      />
      {approvalOpen && (
        <ApprovalConfirmModal
          isOpen={approvalOpen}
          onClose={() => { if (!deleteLoading) { setApprovalOpen(false); setApprovalData(null); } }}
          onConfirm={(data) => { const idSnapshot = deleteId; setApprovalOpen(false); if (idSnapshot) { void handleDelete(idSnapshot, data); } }}
          title={'Persetujuan Penghapusan Jadwal'}
          subtitle="Pilih 2 admin untuk menyetujui penghapusan ini."
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default KelolaJadwal;