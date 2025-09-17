import React, { useState, useEffect } from 'react';
import {
    Edit3,
    Eye,
    Trash2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import api from '@/helper/axios';
import { useToast } from '@/components/ui/useToast';
import { useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import { getAssetPath } from '@/utils/assetPath';

interface DashboardStats {
    totalSchemes: number;
    totalAssessments: number;
    totalAssessors: number;
    totalAssesses: number;
}

interface ScheduleData {
    id: number;
    assessment: {
        id: number;
        code?: string;
        occupation: {
            id?: number;
            name: string;
            scheme: {
                id?: number;
                name: string;
            };
        };
    };
    start_date: string;
    end_date: string;
}

interface VerificationData {
    id: number;
    username: string;
    buktiUpload: string;
    tanggalKirim: string;
}

type ScheduleResponseRaw = {
    id: number;
    assessment: {
        id: number;
        code?: string;
        occupation: {
            id?: number;
            name: string;
            scheme: { id?: number; name: string };
        };
    };
    start_date: string;
    end_date: string;
};

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalSchemes: 0,
        totalAssessments: 0,
        totalAssessors: 0,
        totalAssesses: 0
    });
    const [schedules, setSchedules] = useState<ScheduleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; action?: 'delete' | 'approve' | 'reject'; id?: number; message?: string }>({ open: false });

    const [verificationData, setVerificationData] = useState<VerificationData[]>([]);

    interface PendingDoc {
        id: number;
        purpose: string;
        created_at: string;
        assessee: {
            id: number;
            user_id: number;
            name: string;
            email: string;
        };
    }

    const loadPendingVerifications = React.useCallback(async () => {
        try {
            const res = await api.get('/assessments/apl-01/results/unapproved');
            if (res.data && res.data.success) {
                const docs = res.data.data as PendingDoc[];
                const mapped = docs.map((d) => ({
                    id: d.id,
                    username: d.assessee.name || d.assessee.email || 'Unknown',
                    buktiUpload: d.purpose || 'Bukti Upload',
                    tanggalKirim: new Date(d.created_at || '').toLocaleString('id-ID'),
                }));
                setVerificationData(mapped);
            }
        } catch (err) {
            console.error('Failed to fetch verification pending', err);
        }
    }, []);

    useEffect(() => {
        void fetchDashboardData();
        void loadPendingVerifications();
    }, [loadPendingVerifications]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch dashboard statistics (backend endpoint: /api/dashboard/admin/)
            const dashboardResponse = await api.get('/dashboard/admin/');
            if (dashboardResponse.data && dashboardResponse.data.success) {
                const summary = dashboardResponse.data.data.summary;
                setStats({
                    totalSchemes: summary.totalSchemes ?? 0,
                    totalAssessments: summary.totalAssessments ?? 0,
                    totalAssessors: summary.totalAssessors ?? 0,
                    totalAssesses: summary.totalAssessees ?? 0,
                });

                // populate schedules if present
                const schedulesData = dashboardResponse.data.data.schedules;
                if (Array.isArray(schedulesData)) {
                    type ServerScheduleRow = { id: number; assessment_id: number; occupation_name: string; schema_name: string; start_date: string; end_date: string };
                    const arr = schedulesData as ServerScheduleRow[];
                    setSchedules(arr.slice(0, 5).map((row) => ({
                        id: row.id,
                        assessment: {
                            id: row.assessment_id,
                            occupation: { name: row.occupation_name, scheme: { name: row.schema_name } },
                        },
                        start_date: row.start_date,
                        end_date: row.end_date,
                    })));
                }
            }

            // Fetch schedules (backend exposes /api/schedules)
            const schedulesResponse = await api.get('/schedules');
            if (schedulesResponse.data.success) {
                // backend returns schedules with assessment -> occupation -> scheme
                const items = schedulesResponse.data.data as unknown;
                if (Array.isArray(items)) {
                    const arr = items as ScheduleResponseRaw[];
                    setSchedules(arr.slice(0, 5).map((s) => ({
                        id: s.id,
                        assessment: s.assessment,
                        start_date: s.start_date,
                        end_date: s.end_date,
                    })));
                }
            }

        } catch (error: unknown) {
            console.error('Failed to fetch dashboard data:', error);
            setError('Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const navigate = useNavigate();

    const handleEdit = (id: number) => {
        // navigate to Kelola Jadwal and attach id as query param (detail/edit handled there)
        navigate(`${paths.admin.kelolaJadwal}?id=${id}`);
    };

    const handleView = (id: number) => {
        navigate(`${paths.admin.kelolaJadwal}?id=${id}`);
    };

    const handleDelete = async (id: number) => {
        setConfirmModal({ open: true, action: 'delete', id, message: 'Yakin ingin menghapus jadwal ini?' });
    };
    const toast = useToast();

    const handleApprove = async (id: number) => {
        setConfirmModal({ open: true, action: 'approve', id, message: 'Setujui verifikasi ini?' });
    };

    const handleReject = (id: number) => {
        setConfirmModal({ open: true, action: 'reject', id, message: 'Tolak verifikasi ini? Anda akan diarahkan ke halaman detail untuk tindakan lanjutan.' });
    };

    const handleViewBukti = (id: number) => {
        navigate(`${paths.admin.verifikasi}?id=${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7FAFC] flex">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />
                    <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#E77D35]" />
                            <p className="text-gray-600">Memuat data dashboard...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex">
            {/* Confirmation Modal */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/5">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-2">Konfirmasi</h3>
                        <p className="text-sm text-gray-600 mb-4">{confirmModal.message}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmModal({ open: false })} className="px-4 py-2 border rounded">Batal</button>
                            <button
                                onClick={async () => {
                                    const id = confirmModal.id;
                                    const act = confirmModal.action;
                                    setConfirmModal({ open: false });
                                    if (!id || !act) return;
                                    try {
                                        if (act === 'delete') {
                                            const res = await api.delete(`/schedules/${id}`);
                                            if (res.data && res.data.success) {
                                                setSchedules((prev) => prev.filter((s) => s.id !== id));
                                                toast.show({ title: 'Berhasil', description: 'Jadwal dihapus', type: 'success' });
                                            } else {
                                                setError('Gagal menghapus jadwal');
                                                toast.show({ title: 'Gagal', description: 'Gagal menghapus jadwal', type: 'error' });
                                            }
                                        } else if (act === 'approve') {
                                            const res = await api.post(`/approval/apl01`, { docId: id });
                                            if (res.data && res.data.success) {
                                                await loadPendingVerifications();
                                                toast.show({ title: 'Berhasil', description: 'Verifikasi disetujui', type: 'success' });
                                            } else {
                                                toast.show({ title: 'Gagal', description: 'Gagal menyetujui verifikasi', type: 'error' });
                                            }
                                        } else if (act === 'reject') {
                                            // navigate to detail page for manual reject handling
                                            navigate(`${paths.admin.verifikasi}?id=${id}`);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        toast.show({ title: 'Error', description: 'Terjadi error', type: 'error' });
                                    }
                                }}
                                className="px-4 py-2 bg-[#E77D35] text-white rounded"
                            >
                                Ya
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Jurusan Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                    <img src={getAssetPath('/skema.svg')} alt="skema" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">{stats.totalSchemes}</p>
                                    <p className="text-sm text-gray-600">Jurusan</p>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <button onClick={() => navigate(paths.admin.kelolaJurusan)} className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                                Lihat Detail
                                <span>→</span>
                            </button>
                        </div>

                        {/* Assasmen Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                    <img src={getAssetPath('/assesmen.svg')} alt="assesmen" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">{stats.totalAssessments}</p>
                                    <p className="text-sm text-gray-600">MUK</p>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <button onClick={() => navigate(paths.admin.muk.root)} className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                                Lihat Detail
                                <span>→</span>
                            </button>
                        </div>

                        {/* Assesor Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                    <img src={getAssetPath('/asesor.svg')} alt="asesor" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">{stats.totalAssessors}</p>
                                    <p className="text-sm text-gray-600">Assesor</p>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <button onClick={() => navigate(paths.admin.kelolaAkunAsesor)} className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                                Lihat Detail
                                <span>→</span>
                            </button>
                        </div>

                        {/* Asesi Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                    <img src={getAssetPath('/asesi.svg')} alt="asesi" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">{stats.totalAssesses}</p>
                                    <p className="text-sm text-gray-600">Asesi</p>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <button onClick={() => navigate(paths.admin.kelolaAkunAsesi)} className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                                Lihat Detail
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* Jadwal Assasmen Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Jadwal Assasmen</h2>
                                <button onClick={() => navigate(paths.admin.kelolaJadwal)} className="text-sm text-gray-500 hover:text-[#E77D35]">
                                    Lihat Semua &gt;&gt;
                                </button>
                            </div>
                            <div className="border-b border-gray-200"></div>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
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
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {schedules.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada jadwal assessment
                                                </td>
                                            </tr>
                                        ) : (
                                            schedules.map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.assessment.occupation.scheme.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {item.assessment.occupation.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {formatDate(item.start_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {formatDate(item.end_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(item.id)}
                                                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleView(item.id)}
                                                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                                                title="View"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                                                title="Delete"
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

                    {/* Verifikasi Approval Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Verifikasi Approval</h2>
                                <button onClick={() => navigate(paths.admin.verifikasi)} className="text-sm text-gray-500 hover:text-[#E77D35]">
                                    Lihat Semua &gt;&gt;
                                </button>
                            </div>
                            <div className="border-b border-gray-200"></div>
                        </div>

                        <div className="px-6 pb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#E77D35] text-white">
                                            <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                                                Username
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                                                Bukti Upload
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                                                Tanggal Kirim
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {verificationData.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleViewBukti(item.id)}
                                                        className="text-[#E77D35] hover:text-orange-600 underline"
                                                    >
                                                        {item.buktiUpload}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.tanggalKirim}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(item.id)}
                                                            className="w-8 h-8 border-2 border-[#E77D35] text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors flex items-center justify-center"
                                                            title="Approve"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewBukti(item.id)}
                                                            className="p-2 text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(item.id)}
                                                            className="w-8 h-8 border-2 border-[#E77D35] text-[#E77D35] hover:bg-orange-50 rounded-md transition-colors flex items-center justify-center"
                                                            title="Reject"
                                                        >
                                                            ✕
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

export default Dashboard;