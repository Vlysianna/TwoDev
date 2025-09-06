import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { useNavigate } from 'react-router-dom';
import api from '@/helper/axios';
import { Loader2, RefreshCcw } from 'lucide-react';

// Types & helpers
interface AssesseeRow { id: number; name: string; email: string; status: string; }
interface ScheduleRow { id: number; start_date: string; end_date: string; scheme: string; occupation: string; assessees: AssesseeRow[]; }
interface AssessmentBlock { assessmentId: number; assessmentName: string; schedules: ScheduleRow[]; }
interface RawAssessment { id: number; code?: string; occupation?: { name: string; scheme?: { name: string; code?: string } } }
interface RawSchedule { id: number; assessment: RawAssessment & { occupation: { name: string; scheme: { name: string; code?: string } } }; start_date: string; end_date: string; }
interface RawAPL01ResultDoc { id: number; purpose?: string; result?: { id: number; assessment_id: number; is_competent?: boolean | null; assessee?: { user?: { full_name?: string; email?: string } } } }

const mapStatus = (is_competent: boolean | null | undefined): string => {
  if (is_competent === true) return 'Lulus';
  if (is_competent === false) return 'Tidak Lulus';
  return 'Belum Dinilai';
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

const ResultAssessment: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<AssessmentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assessmentsRes, schedulesRes, apl01Res] = await Promise.all([
        api.get('/assessments'),
        api.get('/schedules'),
        api.get('/assessments/apl-01/results').catch(() => ({ data: { success: false } }))
      ]);

      const assessments: RawAssessment[] = assessmentsRes.data?.data || [];
      const schedules: RawSchedule[] = schedulesRes.data?.data || [];
      const apl01Docs: RawAPL01ResultDoc[] = apl01Res.data?.data || [];

      const assesseeMap = new Map<number, AssesseeRow[]>();
      apl01Docs.forEach(doc => {
        const result = doc.result;
        if (!result || !result.assessment_id) return;
        const assesseeName = result.assessee?.user?.full_name || result.assessee?.user?.email || 'Asesi';
        const email = result.assessee?.user?.email || '-';
        const arr = assesseeMap.get(result.assessment_id) || [];
        if (!arr.find(a => a.email === email)) {
          arr.push({
            id: result.id,
            name: assesseeName,
            email: email,
            status: mapStatus(result.is_competent)
          });
          assesseeMap.set(result.assessment_id, arr);
        }
      });

      const schedulesByAssessment = new Map<number, ScheduleRow[]>();
      schedules.forEach(s => {
        const assessId = s.assessment.id;
        const list = schedulesByAssessment.get(assessId) || [];
        list.push({
          id: s.id,
          start_date: s.start_date,
          end_date: s.end_date,
          scheme: s.assessment.occupation.scheme?.name || s.assessment.occupation.scheme?.code || 'Skema',
          occupation: s.assessment.occupation.name,
          assessees: assesseeMap.get(assessId) || []
        });
        schedulesByAssessment.set(assessId, list);
      });

      const mapped: AssessmentBlock[] = assessments.map(a => {
        const nameParts = [a.code, a.occupation?.scheme?.name, a.occupation?.name].filter(Boolean);
        return {
          assessmentId: a.id,
          assessmentName: nameParts.join(' - ') || `Assessment ${a.id}`,
          schedules: schedulesByAssessment.get(a.id) || []
        };
      }).filter(block => block.schedules.length > 0);

      setData(mapped);
      setLastUpdated(new Date());
    } catch (e: unknown) {
      console.error('Gagal memuat data result assessment', e);
      type MaybeAxiosError = { response?: { data?: { message?: string } } };
      const maybe = e as MaybeAxiosError;
      const message = maybe?.response?.data?.message || (e instanceof Error ? e.message : 'Gagal memuat data');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Result Assessment</h1>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-500 hidden sm:inline">Update: {lastUpdated.toLocaleTimeString()}</span>
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
            <div className="space-y-8">
              {data.map(block => (
                <div key={block.assessmentId} className="border rounded-lg">
                  <div className="bg-[#E77D35] text-white px-4 py-2 rounded-t-lg font-semibold">
                    {block.assessmentName}
                  </div>
                  <div className="p-4">
                    {block.schedules.length === 0 ? (
                      <div className="text-gray-500">Tidak ada jadwal</div>
                    ) : (
                      <div className="space-y-6">
                        {block.schedules.map(sch => (
                          <div key={sch.id} className="border border-gray-200 rounded-lg">
                            <div className="flex flex-wrap items-center justify-between bg-gray-50 px-4 py-2 rounded-t-lg">
                              <div>
                                <span className="font-medium text-gray-800">{sch.scheme}</span> - <span className="text-gray-600">{sch.occupation}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(sch.start_date)} - {formatDate(sch.end_date)}
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-[#E77D35] text-white">
                                    <th className="px-4 py-2 text-left text-sm font-medium">Nama Asesi</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {sch.assessees.length === 0 ? (
                                    <tr>
                                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">Belum ada asesi</td>
                                    </tr>
                                  ) : (
                                    sch.assessees.map(as => (
                                      <tr key={as.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{as.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{as.email}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${as.status === 'Lulus' ? 'bg-green-100 text-green-700' : as.status === 'Tidak Lulus' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{as.status}</span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default ResultAssessment;
