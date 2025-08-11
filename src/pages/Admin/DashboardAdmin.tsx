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

interface DashboardStats {
    totalSchemes: number;
    totalAssessments: number;
    totalAssessors: number;
    totalAssesses: number;
}

interface ScheduleData {    
    id: number;
    occupation: {
        name: string;
        scheme: {
            name: string;
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

    // Mock verification data (as there's no verification endpoint yet)
    const verificationData: VerificationData[] = [
        {
            id: 1,
            username: 'Salmah Nadya',
            buktiUpload: 'Lihat Bukti',
            tanggalKirim: '31/07/2025 02.23'
        },
        {
            id: 2,
            username: 'Ahmad Rizki',
            buktiUpload: 'Lihat Bukti', 
            tanggalKirim: '30/07/2025 14.15'
        },
        {
            id: 3,
            username: 'Dewi Sari',
            buktiUpload: 'Lihat Bukti',
            tanggalKirim: '29/07/2025 09.30'
        }
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch dashboard statistics
            const dashboardResponse = await api.get('/dashboard');
            if (dashboardResponse.data.success) {
                setStats({
                    totalSchemes: dashboardResponse.data.data.totalSchemes,
                    totalAssessments: dashboardResponse.data.data.totalAssessments,
                    totalAssessors: dashboardResponse.data.data.totalAssessors,
                    totalAssesses: dashboardResponse.data.data.totalAssesses
                });
            }

            // Fetch schedules
            const schedulesResponse = await api.get('/schedule');
            if (schedulesResponse.data.success) {
                setSchedules(schedulesResponse.data.data.slice(0, 5)); // Show only first 5 schedules
            }

        } catch (error: any) {
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

  const handleEdit = (id: number) => console.log('Edit:', id);
  const handleView = (id: number) => console.log('View:', id);
  const handleDelete = (id: number) => console.log('Delete:', id);
  const handleApprove = (id: number) => console.log('Approve:', id);
  const handleReject = (id: number) => console.log('Reject:', id);
  const handleViewBukti = (id: number) => console.log('View bukti:', id);

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
                {/* Skema Sertifikasi Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                <img src="/skema.svg" alt="skema" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{stats.totalSchemes}</p>
                                <p className="text-sm text-gray-600">Skema Sertifikasi</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <button className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                            Lihat Detail
                            <span>→</span>
                        </button>
                    </div>

                    {/* Assasmen Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                <img src="/assesmen.svg" alt="assesmen" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{stats.totalAssessments}</p>
                                <p className="text-sm text-gray-600">Assasmen</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <button className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                            Lihat Detail
                            <span>→</span>
                        </button>
                    </div>

                    {/* Assesor Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                <img src="/asesor.svg" alt="asesor" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{stats.totalAssessors}</p>
                                <p className="text-sm text-gray-600">Assesor</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <button className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
                            Lihat Detail
                            <span>→</span>
                        </button>
                    </div>

                    {/* Asesi Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#E77D35] rounded-lg flex items-center justify-center">
                                <img src="/asesi.svg" alt="asesi" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{stats.totalAssesses}</p>
                                <p className="text-sm text-gray-600">Asesi</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <button className="text-sm text-gray-500 hover:text-[#E77D35] flex items-center justify-between w-full">
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
                            <button className="text-sm text-gray-500 hover:text-[#E77D35]">
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
                                              {item.occupation.scheme.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                              {item.occupation.name}
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
                            <button className="text-sm text-gray-500 hover:text-[#E77D35]">
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
                                                    onClick={() => handleView(item.id)}
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