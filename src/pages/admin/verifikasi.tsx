import Navbar from '../../components/NavAdmin';
import Sidebar from '../../components/SideAdmin';
import { 
  Eye, 
  SquareCheck, 
  Download, 
  X, 
  Menu, 
  Bell, 
  Check,
  Clock,
  CheckCircle,
  Calendar,
  RefreshCw,
  FileText,
  FileX
} from "lucide-react";
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
              <Navbar title="Verifikasi" icon={<Check size={20} />} />
            </div>
          </div>

          {/* Konten Utama */}
          <div className="p-4 lg:p-6">
            <main>
              <div className="text-sm text-gray-500 mb-2">Dashboard / Verifikasi Approval</div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Verifikasi Approval</h1>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex p-1 rounded-lg bg-gray-100/80 shadow-sm">
                    <button 
                      onClick={() => setFilter('pending')} 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'pending' 
                        ? 'bg-white text-orange-600 shadow-sm ring-1 ring-orange-100' 
                        : 'text-gray-600 hover:text-orange-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Pending</span>
                        {filter === 'pending' && items.length > 0 && (
                          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </button>
                    <button 
                      onClick={() => setFilter('approved')} 
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'approved' 
                        ? 'bg-white text-orange-600 shadow-sm ring-1 ring-orange-100' 
                        : 'text-gray-600 hover:text-orange-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Approved</span>
                        {filter === 'approved' && items.length > 0 && (
                          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                  <button 
                    onClick={fetchPending} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all shadow-sm"
                  >
                    <RefreshCw size={16} className="animate-spin" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-hidden bg-white shadow-md rounded-xl border border-gray-200">
                <table className="min-w-full table-auto text-left">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                      <th className="px-4 py-4 lg:px-6 font-medium">Asesi</th>
                      <th className="px-4 py-4 lg:px-6 hidden sm:table-cell font-medium">Bukti Upload</th>
                      <th className="px-4 py-4 lg:px-6 hidden md:table-cell font-medium">Tanggal</th>
                      <th className="px-4 py-4 lg:px-6 text-center font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {loading ? (
                      <tr><td colSpan={4} className="p-6 text-center">Memuat...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={4} className="p-6 text-center">Tidak ada verifikasi</td></tr>
                    ) : (
                      items.map((row) => (
                        <tr key={row.id} className={`group transition-colors ${row.id % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-orange-50/50`}>
                          <td className="px-4 py-4 lg:px-6">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                {(row.result?.assessee?.user?.full_name || '?')[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{row.result?.assessee?.user?.full_name || 'Tidak tersedia'}</span>
                                <span className="text-xs text-gray-500">{row.result?.assessee?.user?.email || 'Email tidak tersedia'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 lg:px-6 hidden sm:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {row.purpose || 'Bukti APL1'}
                            </span>
                          </td>
                          <td className="px-4 py-4 lg:px-6 hidden md:table-cell">
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar size={14} className="mr-2" />
                              {new Date(row.result?.created_at || '').toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 lg:px-6">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                onClick={() => { const id = row.result_id || row.result?.id; if (id) openDetail(id); }} 
                                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" 
                                title="Lihat Detail"
                              >
                                <Eye size={18} />
                              </button>
                              {filter === 'pending' ? (
                                <button 
                                  onClick={() => { const id = row.result_id || row.result?.id; if (id) approve(id); }} 
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                                  title="Setujui Verifikasi"
                                >
                                  <SquareCheck size={18} />
                                </button>
                              ) : (
                                <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle size={14} className="mr-1" />
                                  Terverifikasi
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detail Modal */}
              {(selected && docDetails) && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-black/60 z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="p-6 border-b bg-gray-50/80">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Detail Verifikasi</h2>
                          <p className="text-sm text-gray-500 mt-1">Review dokumen dan informasi asesi</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelected(null);
                            setDocDetails(null);
                            setImageErrors(new Set());
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Asesi Info Card */}
                      <div className="mt-4 flex items-center bg-white p-4 rounded-lg border space-x-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-lg">
                          {(selected?.assessee?.user?.full_name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{selected?.assessee?.user?.full_name || 'Tidak tersedia'}</h3>
                          <p className="text-sm text-gray-500">{selected?.assessee?.user?.email || 'Email tidak tersedia'}</p>
                          <div className="flex items-center mt-2">
                            <FileText size={14} className="text-orange-500 mr-2" />
                            <span className="text-sm text-gray-600">{docDetails.purpose || 'Tidak tersedia'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Body - Scrollable Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        {documentFields.map((field) => (
                          docDetails[field.key] ? (
                            <div key={field.key} className="group bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                                <div className="flex items-center space-x-2">
                                  <FileText size={16} className="text-orange-500" />
                                  <p className="text-sm font-medium text-gray-700">{field.label}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a
                                    href={docDetails[field.key]}
                                    download
                                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Download"
                                  >
                                    <Download size={16} />
                                  </a>
                                </div>
                              </div>
                              <div className="relative aspect-[4/3] bg-gray-100">
                                {imageErrors.has(docDetails[field.key]!) ? (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-4">
                                    <FileX size={24} className="mb-2" />
                                    <p className="text-sm font-medium">Gambar tidak dapat dimuat</p>
                                    <p className="text-xs mt-1 truncate max-w-[200px]">{docDetails[field.key]}</p>
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
                            <div key={field.key} className="bg-gray-50 border rounded-xl p-4 flex items-center justify-center">
                              <div className="text-center">
                                <FileX size={24} className="text-gray-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-500">{field.label}</p>
                                <p className="text-xs text-gray-400 mt-1">Dokumen tidak tersedia</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    {filter === 'pending' && (
                      <div className="p-6 border-t bg-gray-50/80">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">Pastikan semua dokumen telah diperiksa sebelum melakukan verifikasi</p>
                          <button
                            onClick={() => selected && approve(selected.id)}
                            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
                          >
                            <CheckCircle size={18} className="mr-2" />
                            Verifikasi Sekarang
                          </button>
                        </div>
                      </div>
                    )}
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