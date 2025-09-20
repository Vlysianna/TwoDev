import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { Link, useNavigate } from 'react-router-dom';
import paths from "@/routes/paths";
import api from '@/helper/axios';
import { FileText, Loader2, RefreshCcw, ChevronDown, ChevronRight, User, Mail, Phone, MapPin, Calendar, ArrowRight, Users } from 'lucide-react';

// Types & helpers
interface Assessor {
  id: number;
  full_name: string;
  phone_no: string;
}

interface ScheduleDetail {
  id: number;
  location: string;
  assessor: Assessor;
}

interface Assessment {
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
}

interface AssessmentResult {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  assessment: Assessment;
  schedule_details: ScheduleDetail[];
}

interface ExpandedRow {
  assessmentId: number;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const formatDateTime = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const ResultAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedRows, setExpandedRows] = useState<ExpandedRow[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/assessments/results/status/admin');

      if (response.data.success) {
        setData(response.data.data);
        setLastUpdated(new Date());
      } else {
        setError('Gagal memuat data hasil assessment');
      }
    } catch (e: unknown) {
      console.error('Gagal memuat data result assessment', e);
      const errorMessage = (e as any)?.response?.data?.message || 'Gagal memuat data hasil assessment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const toggleRowExpansion = (assessmentId: number) => {
    const isExpanded = expandedRows.some(row => row.assessmentId === assessmentId);

    if (isExpanded) {
      setExpandedRows(expandedRows.filter(row => row.assessmentId !== assessmentId));
    } else {
      setExpandedRows([...expandedRows, { assessmentId }]);
    }
  };

  const isRowExpanded = (assessmentId: number) => {
    return expandedRows.some(row => row.assessmentId === assessmentId);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Hasil Assessment" icon={<FileText size={20} />} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <nav className="flex text-sm text-gray-500 mb-4">
            <span>Hasil Asesmen</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Hasil Assessment</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Update: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => void loadData()}
                disabled={loading}
                className="px-3 py-2 bg-white border border-gray-300 text-sm rounded flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Reload</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-[#E77D35] text-white rounded hover:bg-orange-600 transition-colors text-sm"
              >
                Kembali
              </button>
            </div>
          </div>

          {loading && (
            <div className="py-16 text-center text-gray-600 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#E77D35]" />
              <span>Memuat data...</span>
            </div>
          )}

          {error && !loading && (
            <div className="py-12 text-center text-red-600 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-gray-500 text-center py-12">Belum ada hasil assessment</div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#E77D35]">
                    <tr>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Kode Assessment
                      </th>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Skema & Okupasi
                      </th>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Periode
                      </th>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Jumlah Asesor
                      </th>
                      <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((assessment) => {
                      const isExpanded = isRowExpanded(assessment.id);

                      return (
                        <React.Fragment key={assessment.id}>
                          <tr
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleRowExpansion(assessment.id)}
                          >
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {assessment.assessment.code}
                            </td>
                            <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                              <div>
                                <span className="font-semibold">{assessment.assessment.occupation.scheme.name}</span>
                                <br />
                                <span>{assessment.assessment.occupation.name}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(assessment.start_date)} - {formatDate(assessment.end_date)}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assessment.status === 'Selesai'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {assessment.status}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>{assessment.schedule_details.length} Asesor</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </td>
                          </tr>

                          {isExpanded && (
                            <>
                              {assessment.schedule_details.map((schedule) => (
                                <tr key={schedule.id} className="bg-gray-50">
                                  <td colSpan={6} className="px-4 lg:px-6 py-1">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
                                      <div className="flex items-center gap-3 flex-wrap">
                                        <MapPin size={16} className="text-gray-600" />
                                        <span className="font-medium">{schedule.location}</span>
                                        <span className="text-gray-400 hidden md:inline">|</span>
                                        <User size={16} className="text-gray-600" />
                                        <span>{schedule.assessor.full_name}</span>
                                      </div>
                                      <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                                        <button
                                          className="px-2 text-[#E77D35] rounded hover:text-orange-600 transition-colors text-sm cursor-pointer flex items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(paths.admin.resultAssessment.dashboard(assessment.id, String(schedule.assessor.id)));
                                          }}
                                        >
                                          Lihat Detail Asesmen <ArrowRight size={16} />
                                        </button>
                                        
                                        <button
                                          className="px-2 text-green-600 rounded hover:text-green-800 transition-colors text-sm cursor-pointer flex items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`${paths.admin.verifikasi}?assessor=${encodeURIComponent(String(schedule.assessor.id))}&schedule=${encodeURIComponent(String(schedule.id))}`);
                                          }}
                                        >
                                          Verifikasi Assesi <ArrowRight size={16} />
                                        </button>
                                        <button
                                          className="px-2 text-blue-500 rounded hover:text-blue-700 transition-colors text-sm cursor-pointer flex items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(paths.admin.recapAssessmentAdmin(schedule.id, String(schedule.assessor.id)));
                                          }}
                                        >
                                          Lihat Berita Acara <ArrowRight size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                {data.map((assessment) => {
                  const isExpanded = isRowExpanded(assessment.id);

                  return (
                    <div key={assessment.id} className="border-b border-gray-200">
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleRowExpansion(assessment.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {assessment.assessment.code}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              <div className="font-semibold">{assessment.assessment.occupation.scheme.name}</div>
                              <div>{assessment.assessment.occupation.name}</div>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              {formatDate(assessment.start_date)} - {formatDate(assessment.end_date)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assessment.status === 'Selesai'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {assessment.status}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users size={16} />
                                <span>{assessment.schedule_details.length} Asesor</span>
                              </div>
                            </div>
                          </div>
                          <div className="pl-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-gray-50">
                          {assessment.schedule_details.map((schedule) => (
                            <div key={schedule.id} className="last:mb-0 border-b border-t border-gray-400 py-2 text-sm">
                              {/* <hr className='my-4 border-gray-400' /> */}
                              <div className="flex items-start gap-2 mb-2 px-4">
                                <MapPin size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                <span className="font-medium">{schedule.location}</span>
                                <span className="text-gray-400">|</span>
                                <User size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                <span>{schedule.assessor.full_name}</span>
                              </div>
                              <div className="flex flex-row justify-between gap-2 px-4">
                                <button
                                  className="text-[#E77D35] text-sm cursor-pointer flex items-center gap-2 py-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(paths.admin.resultAssessment.dashboard(assessment.id, String(schedule.assessor.id)));
                                  }}
                                >
                                  Lihat Detail Asesmen <ArrowRight size={16} />
                                </button>
                                
                                <button
                                  className="text-green-600 text-sm cursor-pointer flex items-center gap-2 py-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`${paths.admin.verifikasi}?assessor=${encodeURIComponent(String(schedule.assessor.id))}&schedule=${encodeURIComponent(String(schedule.id))}`);
                                  }}
                                >
                                  Verifikasi Per Jadwal <ArrowRight size={16} />
                                </button>
                                <button
                                  className="text-blue-500 text-sm cursor-pointer flex items-center gap-2 py-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(paths.admin.recapAssessmentAdmin(schedule.id, String(schedule.assessor.id)));
                                  }}
                                >
                                  Lihat Berita Acara <ArrowRight size={16} />
                                </button>
                              </div>
                              {/* <hr className='my-4 border-gray-400'/> */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResultAssessment;