import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Edit3,
    Eye,
    Trash2,
    Grid3X3,
    FileText,
    Users,
    UserCheck,
    AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import axiosInstance from '@/helper/axios';

interface Occupation {
  id: number;
  name: string;
  scheme: {
    id: number;
    name: string;
  };
}

interface Schedule {
  id: number;
  start_date: string;
  end_date: string;
  assessment: {
    id: number;
    occupation: Occupation;
  };
}

type AssessmentRaw = {
  id: number;
  start_date?: string;
  end_date?: string;
  assessment: {
    id: number;
    occupation: Occupation;
  };
};

const KelolaJadwal: React.FC = () => {
  const [searchQuery] = useState<string>('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
          // map backend response to local Schedule[] shape
          const items = response.data.data as AssessmentRaw[];
          setSchedules(items.map((s) => ({
            id: s.id,
            start_date: s.start_date,
            end_date: s.end_date,
            assessment: s.assessment,
          })));
        } else {
          setError('Gagal memuat data jadwal');
        }
  } catch (error: unknown) {
  console.error('Error fetching schedules:', error);
  setError('Gagal memuat data jadwal');
      } finally {
        setLoading(false);
      }
    };
   
     const handleEdit = (id: number) => console.log('Edit user:', id);
     const handleView = (id: number) => console.log('View user:', id);
     const handleDelete = (id: number) => console.log('Delete user:', id);
     const handleFilter = () => console.log('Filter clicked');
     const handleExport = () => console.log('Export to Excel clicked');

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
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Filter
                    <Filter size={16} className="text-[#E77D35]" />
                  </button>
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
                          {new Date(schedule.start_date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(schedule.end_date).toLocaleDateString('id-ID')}
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
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-2 text-orange-500 hover:bg-red-50 rounded-md transition-colors"
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
    </div>
  );
};

export default KelolaJadwal;