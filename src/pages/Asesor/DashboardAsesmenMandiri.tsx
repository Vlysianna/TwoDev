import { Search, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarAsesor from '@/components/SideAsesor';
import NavAsesor from '@/components/NavAsesor';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/helper/axios';
import BaseModal from '@/components/BaseModal';
import Ia01Detail from './Ia-01-Detail';
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import paths from '@/routes/paths';

interface Assessee {
  id: number;
  user_id?: number;
  full_name?: string;
  user?: { full_name?: string };
}

type RawAssessee = {
  id: number;
  user_id?: number;
  user?: { full_name?: string };
  full_name?: string;
  [k: string]: unknown;
};

type UserResp = { id: number; full_name?: string };

// Data siswa sesuai dengan gambar
const siswaData = [
  { id: 1, nama: "Addis Tri Ramadhavi" },
  { id: 2, nama: "Ahmad Ahmad Fazzan" },
  { id: 3, nama: "Ahmad Zaqi" },
  { id: 4, nama: "Alsha Solar Arha Purit" },
  { id: 5, nama: "Alfine Korrecul Aah" },
  { id: 6, nama: "Amelia" },
  { id: 7, nama: "Amanda Koizhe Oikekan" },
  { id: 8, nama: "Archiha Dani Naswidigja" },
  { id: 9, nama: "Ari Rokamayah" },
  { id: 10, nama: "Darin Baha Romil" },
  { id: 11, nama: "Eru Nur Ali Kehir" },
  { id: 12, nama: "Fajti Damawan" },
  { id: 13, nama: "Iftikhar Azhar Chaudhry" },
];

export default function DashboardAsesmenMandiri() {
  const { params, setParams } = useAssessmentParams();
  const navigate = useNavigate();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const [assessees, setAssessees] = useState<Assessee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  type Tab = 'apl-02' | 'ia-01' | 'ia-02' | 'ia-03' | 'ia-05' | 'ak-01' | 'ak-02' | 'ak-05';
  const [selectedTab, setSelectedTab] = useState<Tab>('apl-02');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await api.get('/assessee');
        if (resp.data && resp.data.success && Array.isArray(resp.data.data)) {
          let mapped: Assessee[] = resp.data.data.map((r: RawAssessee) => ({
            id: r.id,
            user_id: r.user_id,
            full_name: r.full_name,
            user: r.user,
          }));

          const needFill = mapped.some(m => !m.full_name && m.user_id);
          if (needFill) {
            try {
              const usersResp = await api.get('/user');
              if (usersResp?.data?.success && Array.isArray(usersResp.data.data)) {
                const usersArr = usersResp.data.data as Array<UserResp>;
                const userMap = new Map<number, string>();
                usersArr.forEach((u: UserResp) => { if (u && u.id) userMap.set(u.id, u.full_name ?? ''); });
                mapped = mapped.map(m => ({
                  ...m,
                  full_name: m.full_name ?? (m.user_id ? userMap.get(m.user_id) : undefined),
                }));
              }
            } catch (e) {
              console.error('Failed to fetch users for name fill:', e);
            }
          }

          setAssessees(mapped);
        } else {
          setAssessees(siswaData.map(s => ({ id: s.id, full_name: s.nama })));
        }
      } catch (err) {
        console.error(err);
        setAssessees(siswaData.map(s => ({ id: s.id, full_name: s.nama })));
        setError('Gagal memuat data peserta, menggunakan data contoh');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    if (tabsContainerRef.current) {
      tabsContainerRef.current.addEventListener('scroll', checkScroll);
      checkScroll(); // Check initial state
    }

    return () => {
      if (tabsContainerRef.current) {
        tabsContainerRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const visibleAssessees = assessees.filter(a => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const name = (a.user?.full_name || a.full_name || '').toString().toLowerCase();
    return name.includes(q);
  });

  const handleAPL02 = (assesseeId: number) => {
    setParams({ ...params, id_asesi: String(assesseeId) });
    navigate(paths.asesor.assessment.cekApl02(params.id_assessment, assesseeId));
  }

  const handleAK01 = (assesseeId: number) => {
    setParams({ ...params, id_asesi: String(assesseeId) });
    navigate(paths.asesor.assessment.ak01(params.id_assessment, assesseeId));
  }

  const handleGenerateAll = () => {
    if (selectedTab === 'ia-01') {
      if (visibleAssessees.length > 0) openIa01Modal();
      return;
    }

    visibleAssessees.forEach(a => {
      const id = a.id;
      let url = '';
      switch (selectedTab) {
        case 'apl-02':
          url = `/apl-02/${id}`;
          break;
        case 'ia-02':
          url = `/asesor/ia-02/${id}`;
          break;
        case 'ia-03':
          url = `/asesor/ia-03/${id}`;
          break;
        case 'ia-05':
          url = `/asesor/ia-05/${id}`;
          break;
        case 'ak-01':
          url = `/asesor/ak-01/${id}`;
          break;
        case 'ak-02':
          url = `/asesor/ak-02/${id}`;
          break;
        case 'ak-05':
          url = `/asesor/ak-05/${id}`;
          break;    
      }
      if (url) window.open(url, '_blank');
    });
  };

  const openIa01Modal = () => {
    setModalOpen(true);
  };

  const closeIa01Modal = () => {
    setModalOpen(false);
  };

  const getActionText = () => {
    switch(selectedTab) {
      case 'apl-02': return 'Cek APL-02 >';
      case 'ia-01': return 'Cek IA-01 >';
      case 'ia-02': return 'Cek IA-02 >';
      case 'ia-03': return 'Cek IA-03 >';
      case 'ia-05': return 'Cek IA-05 >';
      case 'ak-01': return 'Cek AK-01 >';
      case 'ak-02': return 'Cek AK-02 >';
      case 'ak-05': return 'Cek AK-05 >';
      default: return 'Cek >';
    }
  };

  const handleActionClick = (assesseeId: number) => {
    switch(selectedTab) {
      case 'apl-02':
        handleAPL02(assesseeId);
        break;
      case 'ia-01':
        openIa01Modal();
        break;
      case 'ia-02':
        window.open(`/asesor/ia-02/${assesseeId}`, '_self');
        break;
      case 'ia-03':
        window.open(`/asesor/ia-03/${assesseeId}`, '_self');
        break;
      case 'ia-05':
        window.open(`/asesor/ia-05/${assesseeId}`, '_self');
        break;
      case 'ak-01':
        handleAK01(assesseeId);
        break;
      case 'ak-02':
        window.open(`/asesor/ak-02/${assesseeId}`, '_self');
        break;
      case 'ak-05':
        window.open(`/asesor/ak-05/${assesseeId}`, '_self');
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
        <SidebarAsesor />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <NavAsesor title="Asesmen Mandiri" icon={<LayoutDashboard size={25} />}/>
        </div>

        {/* Breadcrumb + Content */}
        <div className="p-4 md:p-6">
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/asesor" className="hover:underline">Asesor</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Asesmen Mandiri</span>
          </div>

          {/* Tab Buttons dengan Scroll Horizontal */}
          <div className="relative mb-6">
            {/* Scroll buttons */}
            {showLeftScroll && (
              <button 
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            {showRightScroll && (
              <button 
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            )}
            
            {/* Container tab dengan scroll horizontal */}
            <div 
              ref={tabsContainerRef}
              className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {(['apl-02','ia-01','ia-02','ia-03','ia-05','ak-01','ak-02', 'ak-05'] as Tab[]).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setSelectedTab(tab)} 
                  className={`flex-shrink-0 px-4 py-2 rounded-md ${selectedTab === tab ? 'bg-[#E77D35] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search + Generate */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerateAll} 
              className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:bg-orange-600 whitespace-nowrap"
            >
              {selectedTab === 'ia-01' ? 'Open IA-01' : 'Open All'}
            </button>
          </div>

          {/* Tabel Responsif - Fixed Container */}
          <div className="bg-white rounded-md shadow">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[60px]">No</th>
                    <th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[200px]">Nama Asesi</th>
                    <th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : visibleAssessees.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    visibleAssessees.map((asesi, index) => (
                      <tr key={asesi.id} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {asesi.user?.full_name ?? asesi.full_name ?? '— tidak tersediaadbasuhdbshbdashubduashbdhuasdhasbdhuasbdhabdhasvdhuav —'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleActionClick(asesi.id)}
                            className="text-[#E77D35] underline text-sm hover:text-orange-600"
                          >
                            {getActionText()}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* IA-01 modal */}
        <BaseModal isOpen={modalOpen} onClose={closeIa01Modal} widthClass="max-w-4xl w-full">
          <div className="bg-white rounded-lg p-4">
            <Ia01Detail />
          </div>
        </BaseModal>
      </div>
    </div>
  );
}

// Tambahkan style untuk menyembunyikan scrollbar
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);