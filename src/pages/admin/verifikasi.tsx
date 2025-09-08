import Navbar from '../../components/NavAdmin';
import Sidebar from '../../components/SideAdmin';
import { Eye, SquareCheck, Download, X, Menu } from "lucide-react";
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
  created_at?: string;
  updated_at?: string;
};

type ResultDetail = {
  id: number;
  assessee?: { user?: { full_name?: string; email?: string } } | null;
  assessor?: { user?: { full_name?: string; email?: string } } | null;
  docs?: ResultDoc | null;
  created_at?: string;
  approved?: boolean;
};

type PendingDoc = ResultDoc & { result?: ResultDetail };

export default function VerifikasiPage() {
  const [items, setItems] = useState<PendingDoc[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ResultDetail | null>(null);
  const [docDetails, setDocDetails] = useState<ResultDoc | any>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/assessments/verification/${filter === 'pending' ? 'pending' : 'approved'}`);
      if (res.data.success) setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', description: 'Gagal memuat data verifikasi', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => { void fetchPending(); }, [fetchPending]);

  const openDetail = async (resultId: number) => {
    try {
      // Reset error state
      setImageErrors(new Set());

      // Fetch data detail
      const res = await api.get(`/assessments/apl-01/result/docs/${resultId}`);
      if (res.data.success) {
        setDocDetails(res.data.data);

        // Find the corresponding result data from items
        const resultData = items.find(item =>
          (item.result_id === resultId) || (item.result?.id === resultId)
        )?.result;

        setSelected(resultData || { id: resultId });
      }
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', description: 'Gagal mengambil detail dokumen', type: 'error' });
    }
  };

  const approve = async (resultId: number) => {
    try {
      const res = await api.post(`/assessments/verification/${resultId}/approve`);
      if (res.data.success) {
        fetchPending();
        setSelected(null);
        setDocDetails(null);
        toast.show({ title: 'Berhasil', description: 'Verifikasi disetujui', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      toast.show({ title: 'Error', description: 'Gagal menyetujui verifikasi', type: 'error' });
    }
  };

  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url));
  };

  // Daftar field dokumen yang akan ditampilkan
  const documentFields = [
    { key: 'school_report_card', label: 'Rapor Sekolah' },
    { key: 'field_work_practice_certificate', label: 'Sertifikat Praktik Kerja Lapangan' },
    { key: 'student_card', label: 'Kartu Pelajar' },
    { key: 'family_card', label: 'Kartu Keluarga' },
    { key: 'id_card', label: 'KTP' },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar with responsive behavior */}
        <div className={`fixed inset-y-0 left-0 z-20 lg:w-64 md:w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          {/* Navbar - Sticky di atas */}
          <div className="sticky top-0 z-10 bg-white shadow-sm flex items-center">
            <button
              className="lg:hidden ml-4 p-2 text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="w-full">
              <Navbar />
            </div>
          </div>

          {/* Konten Utama */}
          <div className="p-4 lg:p-6">
            <main>
              <div className="text-sm text-gray-500 mb-2">Dashboard / Verifikasi Approval</div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Verifikasi Approval</h1>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div className="flex items-center space-x-2">
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
                      <th className="px-4 py-3 lg:px-6">Asesi</th>
                      <th className="px-4 py-3 lg:px-6 hidden sm:table-cell">Bukti Upload</th>
                      <th className="px-4 py-3 lg:px-6 hidden md:table-cell">Tanggal</th>
                      <th className="px-4 py-3 lg:px-6 text-center">Aksi</th>
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
                          <td className="px-4 py-4 lg:px-6 whitespace-nowrap">{row.result?.assessee?.user?.full_name || row.result?.assessee?.user?.email || 'Tidak tersedia'}</td>
                          <td className="px-4 py-4 lg:px-6 whitespace-nowrap hidden sm:table-cell">{row.purpose || 'Bukti APL1'}</td>
                          <td className="px-4 py-4 lg:px-6 whitespace-nowrap hidden md:table-cell">{new Date(row.result?.created_at || '').toLocaleString()}</td>
                          <td className="px-4 py-4 lg:px-6 text-center space-x-3">
                            <button onClick={() => { const id = row.result_id || row.result?.id; if (id) openDetail(id); }} className="text-orange-500 hover:text-orange-700" title="Lihat">
                              <Eye size={18} />
                            </button>
                            {filter === 'pending' ? (
                              <button onClick={() => { const id = row.result_id || row.result?.id; if (id) approve(id); }} className="text-orange-500 hover:text-orange-700" title="Setujui">
                                <SquareCheck size={18} />
                              </button>
                            ) : (
                              <span className="text-green-600 font-medium text-xs lg:text-sm">Terverifikasi</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detail Modal */}
              {(selected && docDetails) && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50 p-2 lg:p-4">
                  <div className="bg-white p-4 lg:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold">Detail Verifikasi</h2>
                      <button
                        onClick={() => {
                          setSelected(null);
                          setDocDetails(null);
                          setImageErrors(new Set());
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium">Asesi: {selected?.assessee?.user?.full_name || 'Tidak tersedia'}</p>
                      <p className="text-sm text-gray-600">Email: {selected?.assessee?.user?.email || 'Tidak tersedia'}</p>
                      <p className="text-sm text-gray-600 mt-2">Tujuan: {docDetails.purpose || 'Tidak tersedia'}</p>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Dokumen Verifikasi</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                          {documentFields.map((field) => (
                            docDetails[field.key] ? (
                              <div key={field.key} className="border rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-medium">{field.label}</p>
                                  <a
                                    href={docDetails[field.key]}
                                    download
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Download"
                                  >
                                    <Download size={16} />
                                  </a>
                                </div>
                                <div className="w-full h-40 lg:h-48 bg-gray-100 flex items-center justify-center border rounded">
                                  {imageErrors.has(docDetails[field.key]!) ? (
                                    <div className="text-center text-gray-500 p-4">
                                      <p className="text-sm">Gambar tidak dapat dimuat</p>
                                      <p className="text-xs mt-1 truncate">URL: {docDetails[field.key]?.substring(0, 30)}...</p>
                                    </div>
                                  ) : (
                                    <img
                                      src={docDetails[field.key]!}
                                      alt={field.label}
                                      className="w-full h-full object-contain"
                                      onError={() => handleImageError(docDetails[field.key]!)}
                                    />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div key={field.key} className="border rounded-md p-3 bg-gray-50">
                                <p className="text-sm font-medium text-gray-500">{field.label}</p>
                                <p className="text-xs text-gray-400 mt-2">Dokumen tidak tersedia</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      {filter === 'pending' && (
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => selected && approve(selected.id)}
                            className="bg-[#E77D35] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                          >
                            Approve
                          </button>
                        </div>
                      )}
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