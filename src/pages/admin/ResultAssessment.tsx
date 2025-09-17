import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { Link, useNavigate } from 'react-router-dom';
import paths from "@/routes/paths";
import api from '@/helper/axios';
import { FileText, Loader2, RefreshCcw, ChevronDown, ChevronRight, User, Mail, Phone, MapPin, Calendar, ArrowRight } from 'lucide-react';

// Types & helpers (tetap sama)
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
  scheduleId: number;
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

  const toggleRowExpansion = (assessmentId: number, scheduleId: number) => {
    const isExpanded = expandedRows.some(row =>
      row.assessmentId === assessmentId && row.scheduleId === scheduleId
    );

    if (isExpanded) {
      setExpandedRows(expandedRows.filter(row =>
        !(row.assessmentId === assessmentId && row.scheduleId === scheduleId)
      ));
    } else {
      setExpandedRows([...expandedRows, { assessmentId, scheduleId }]);
    }
  };

  const isRowExpanded = (assessmentId: number, scheduleId: number) => {
    return expandedRows.some(row =>
      row.assessmentId === assessmentId && row.scheduleId === scheduleId
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Hasil Assessment" icon={<FileText size={20} />} />
        <main className="flex-1 overflow-auto p-6">
          <nav className="flex text-sm text-gray-500">
            <span>Hasil Asesmen</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hasil Assessment</h1>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Update: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => void loadData()}
                disabled={loading}
                className="px-3 py-2 bg-white border border-gray-300 text-sm rounded flex items-center gap-2 hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Reload
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#E77D35]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Kode Assessment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Skema & Okupasi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Periode
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((assessment) => (
                    <React.Fragment key={assessment.id}>
                      {assessment.schedule_details.map((schedule) => {
                        const isExpanded = isRowExpanded(assessment.id, schedule.id);

                        return (
                          <React.Fragment key={schedule.id}>
                            <tr
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleRowExpansion(assessment.id, schedule.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {assessment.assessment.code}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <span className="font-semibold">{assessment.assessment.occupation.scheme.name}</span>
                                  <br />
                                  <span>{assessment.assessment.occupation.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(assessment.start_date)} - {formatDate(assessment.end_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assessment.status === 'Selesai'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {assessment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {schedule.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-gray-100">
                                <td colSpan={6} className="px-2">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3 ml-5">
                                      <User size={18} className="text-gray-600" />
                                      <span className="font-medium">{schedule.assessor.full_name}</span>
                                    </div>
                                    <div className="flex flex-col p-2 gap-2">
                                      <button
                                        className="px-2 text-[#E77D35] rounded hover:text-orange-600 transition-colors text-sm cursor-pointer flex items-center gap-2"
                                        onClick={() =>
                                          navigate(paths.admin.detailAssessmentAdmin(assessment.id, String(schedule.assessor.id)))
                                        }
                                      >
                                        Lihat Detail Asesmen <ArrowRight size={16} />
                                      </button>

                                      <button
                                        className="px-2 text-blue-400 rounded hover:text-blue-800 transition-colors text-sm cursor-pointer flex items-center gap-2"
                                        onClick={() =>
                                          navigate(paths.admin.recapAssessmentAdmin(schedule.id, String(schedule.assessor.id)))
                                        }
                                      >
                                        Lihat Berita Acara <ArrowRight size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResultAssessment;