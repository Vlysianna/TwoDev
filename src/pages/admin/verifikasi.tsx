import Navbar from '../../components/NavAdmin';
import Sidebar from '../../components/SideAdmin';
import { Eye, SquareCheck } from "lucide-react";
import { useEffect, useState, useCallback } from 'react';
import api from '@/helper/axios';
import { useToast } from '@/components/ui/useToast';

type ResultDoc = {
  id: number;
  result_id?: number;
  purpose?: string;
  school_report_card?: string | null;
  field_work_practice_certificate?: string | null;
  student_card?: string | null;
  family_card?: string | null;
  id_card?: string | null;
  approved?: boolean;
};

type ResultDetail = {
  id: number;
  assessee?: { user?: { full_name?: string; email?: string } } | null;
  assessor?: { user?: { full_name?: string; email?: string } } | null;
  docs?: ResultDoc[] | Record<string, string | null> | null;
  created_at?: string;
  approved?: boolean;
};

type PendingDoc = ResultDoc & { result?: ResultDetail };

export default function VerifikasiPage() {
  const [items, setItems] = useState<PendingDoc[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ResultDetail | null>(null);
  const toast = useToast();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
  const res = await api.get(`/assessments/verification/${filter === 'pending' ? 'pending' : 'approved'}`);
  if (res.data.success) setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void fetchPending(); }, [fetchPending]);

  const openDetail = async (resultId: number) => {
    try {
      const res = await api.get(`/assessments/verification/${resultId}`);
      if (res.data.success) setSelected(res.data.data);
    } catch (err) { console.error(err); }
  };

  const approve = async (resultId: number) => {
    try {
      const res = await api.post(`/assessments/verification/${resultId}/approve`);
      if (res.data.success) {
        // refresh
        fetchPending();
        setSelected(null);
  toast.show({ title: 'Berhasil', description: 'Verifikasi disetujui', type: 'success' });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <>

      <div className="flex min-h-screen bg-gray-50">

        <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md ">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0 md:ml-0">
          {/* Navbar - Sticky di atas */}
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <Navbar />
          </div>

          {/* Konten Utama */}
          <div className="p-6">
            <main>
              <div className="text-sm text-gray-500 mb-2">Dashboard / Verifikasi Approval</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Approval</h1>

              <div className="flex justify-end">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex rounded-md overflow-hidden border">
                    <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-sm ${filter === 'pending' ? 'bg-orange-500 text-white' : 'text-orange-600 bg-white'}`}>Pending</button>
                    <button onClick={() => setFilter('approved')} className={`px-3 py-1 text-sm ${filter === 'approved' ? 'bg-orange-500 text-white' : 'text-orange-600 bg-white'}`}>Approved</button>
                  </div>
                  <button onClick={fetchPending} className="flex items-center px-4 text-sm font-medium text-orange-600 border border-orange-500 rounded hover:bg-orange-100 transition">
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto text-left">
                  <thead>
                    <tr className="bg-orange-500 text-white text-sm">
                      <th className="px-6 py-3">Asesi</th>
                      <th className="px-6 py-3">Bukti Upload</th>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                      {loading ? (
                      <tr><td colSpan={4} className="p-6 text-center">Memuat...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={4} className="p-6 text-center">Tidak ada verifikasi</td></tr>
                    ) : (
                      items.map((row) => (
                        <tr key={row.id} className={` ${row.id % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">{row.result?.assessee?.user?.full_name || row.result?.assessee?.user?.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{row.purpose || 'Bukti APL1'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(row.result?.created_at || '').toLocaleString()}</td>
                          <td className="px-6 py-4 text-center space-x-3">
                            <button onClick={() => { const id = row.result_id || row.result?.id; if (id) openDetail(id); }} className="text-orange-500 hover:text-orange-700" title="Lihat">
                              <Eye size={18} />
                            </button>
                            {filter === 'pending' ? (
                              <button onClick={() => { const id = row.result_id || row.result?.id; if (id) approve(id); }} className="text-orange-500 hover:text-orange-700" title="Setujui">
                                <SquareCheck size={18} />
                              </button>
                            ) : (
                              <span className="text-green-600 font-medium">Terverifikasi</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detail Modal */}
              {selected && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/5 z-50">
                  <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold">Detail Verifikasi</h2>
                      <button onClick={() => setSelected(null)} className="text-gray-500">Tutup</button>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium">Asesi: {selected?.assessee?.user?.full_name}</p>
                      <p className="text-sm text-gray-600">Email: {selected?.assessee?.user?.email}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {selected?.docs && (
                          // docs can be array or object
                          Array.isArray(selected.docs) ? (
                            (selected.docs as ResultDoc[]).map((d) => (
                              <div key={d.id}>
                                <p className="text-sm font-medium">{d.purpose || 'Dokumen'}</p>
                                {/* try common fields */}
                                {d.school_report_card && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${d.school_report_card}`} alt="school_report_card" className="max-h-48 object-contain" />}
                                {d.field_work_practice_certificate && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${d.field_work_practice_certificate}`} alt="field_work_practice_certificate" className="max-h-48 object-contain" />}
                                {d.student_card && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${d.student_card}`} alt="student_card" className="max-h-48 object-contain" />}
                                {d.family_card && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${d.family_card}`} alt="family_card" className="max-h-48 object-contain" />}
                                {d.id_card && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${d.id_card}`} alt="id_card" className="max-h-48 object-contain" />}
                              </div>
                            ))
                          ) : (
                            Object.entries(selected.docs as Record<string, string>).map(([k, v]) => (
                              k !== 'id' && k !== 'result_id' && k !== 'purpose' && k !== 'approved' && v ? (
                                <div key={k}>
                                  <p className="text-sm font-medium">{k}</p>
                                  <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${v}`} alt={k} className="max-h-48 object-contain" />
                                </div>
                              ) : null
                            ))
                          )
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button onClick={() => selected && approve(selected.id)} className="bg-[#E77D35] text-white px-4 py-2 rounded">Approve</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>

      </div>
    </>
  );
}
