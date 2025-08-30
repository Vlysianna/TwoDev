import { Search, LayoutDashboard } from "lucide-react";
// Link removed; modal will open IA-01 inline
import SidebarAsesor from '@/components/SideAsesor';
import NavAsesor from '@/components/NavAsesor';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/helper/axios';
import BaseModal from '@/components/BaseModal';
import Ia01Detail from './Ia-01-Detail';

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

// Contoh data siswa (fallback)
const siswaData = [
    { id: 1, nama: "Adelia Tri Ramadhani" },
    { id: 2, nama: "Ahmad Akmal Fauzan" },
    { id: 3, nama: "Ahmad Zaqi" },
    { id: 4, nama: "Aisha Sekar Arina Putri" },
    { id: 5, nama: "Alfina Komarul Asih" },
    { id: 6, nama: "Amelia" },
    { id: 7, nama: "Ananda Keizha Oktavian" },
    { id: 8, nama: "Andhika Dani Natawidjaja" },
    { id: 9, nama: "Ari Reivansyah" },
    { id: 10, nama: "Darin Fairuz Romli" },
    { id: 11, nama: "Eru Nur Al Kafini" },
    { id: 12, nama: "Fajri Darmawan" },
    { id: 13, nama: "Iftikhar Azhar Chaudhry" },
];

export default function DashboardAsesmenMandiri() {
    // component state

    const [assessees, setAssessees] = useState<Assessee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    type Tab = 'apl-02' | 'ia-01' | 'ia-02' | 'ia-03' | 'ia-05' | 'ak-01' | 'ak-02';
    const [selectedTab, setSelectedTab] = useState<Tab>('apl-02');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // try API first
                const resp = await api.get('/assessee');
                if (resp.data && resp.data.success && Array.isArray(resp.data.data)) {
                    // map to Assessee shape
                    let mapped: Assessee[] = resp.data.data.map((r: RawAssessee) => ({
                        id: r.id,
                        user_id: r.user_id,
                        full_name: r.full_name,
                        user: r.user,
                    }));

                    // if some assessees are missing full_name but have user_id, fetch users once and merge
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
                    // fallback to sample data (leave full_name empty to match requested view)
                    setAssessees(siswaData.map(s => ({ id: s.id })));
                }
            } catch (err) {
                // fallback to sample data on error (leave full_name empty)
                console.error(err);
                setAssessees(siswaData.map(s => ({ id: s.id })));
                setError('Gagal memuat data peserta, menggunakan data contoh');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const visibleAssessees = assessees.filter(a => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        const name = (a.user?.full_name || a.full_name || '').toString().toLowerCase();
        return name.includes(q);
    });

    const handleGenerateAll = () => {
        if (selectedTab === 'ia-01') {
            // open IA-01 modal for first item as best-effort
            if (visibleAssessees.length > 0) openIa01Modal();
            return;
        }

        // for other tabs, try to open each item's page in a new tab
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
                <SidebarAsesor />
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Navbar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm">
                    <NavAsesor title="Asesmen Mandiri" icon={<LayoutDashboard size={25} />}/>
                </div>

                {/* Breadcrumb + Content */}
                <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4">
                        <Link to="/asesor" className="hover:underline">Asesor</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">Asesmen Mandiri</span>
                    </div>

                    {/* Tab Buttons */}
                    <div className="flex items-center space-x-2 mb-6">
                        {(['apl-02','ia-01','ia-02','ia-03','ia-05','ak-01','ak-02'] as Tab[]).map(tab => (
                            <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-4 py-2 rounded-md ${selectedTab === tab ? 'bg-[#E77D35] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Search + Generate */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        {/* Search Bar */}
                                <div className="relative flex-1 mr-0 mb-3 sm:mr-6 sm:mb-0">
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
                        <button onClick={handleGenerateAll} className="w-full sm:w-auto px-6 py-2 bg-[#E77D35] text-white rounded-md hover:bg-orange-6000">
                            {selectedTab === 'ia-01' ? 'Open IA-01' : 'Open All'}
                        </button>
                    </div>

                    {/* Tabel */}
                    {/* Mobile list (stacked) */}
                    <div className="block md:hidden bg-white rounded-md shadow divide-y">
                        {loading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500">{error}</div>
                        ) : (
                            visibleAssessees.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">Tidak ada data</div>
                            ) : (
                                visibleAssessees.map((siswa, index) => (
                                    <div key={siswa.id} className="p-3 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-sm text-gray-700 font-medium">{index + 1}.</div>
                                            <div className="text-sm text-gray-900">{siswa.user?.full_name ?? siswa.full_name ?? '— tidak tersedia —'}</div>
                                        </div>
                                        <div className="text-right">
                                            {selectedTab === 'apl-02' && (
                                                <Link to={`/apl-02/${siswa.id}`} className="text-orange-500 underline text-xs">Buka APL-02 →</Link>
                                            )}
                                            {selectedTab === 'ia-01' && (
                                                <button onClick={() => openIa01Modal()} className="text-orange-500 underline text-xs">Cek IA-01 →</button>
                                            )}
                                            {selectedTab === 'ia-02' && (
                                                <button onClick={() => window.open(`/asesor/ia-02/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-02 →</button>
                                            )}
                                            {selectedTab === 'ia-03' && (
                                                <button onClick={() => window.open(`/asesor/ia-03/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-03 →</button>
                                            )}
                                            {selectedTab === 'ia-05' && (
                                                <button onClick={() => window.open(`/asesor/ia-05/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-05 →</button>
                                            )}
                                            {selectedTab === 'ak-01' && (
                                                <button onClick={() => window.open(`/asesor/ak-01/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka AK-01 →</button>
                                            )}
                                            {selectedTab === 'ak-02' && (
                                                <button onClick={() => window.open(`/asesor/ak-02/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka AK-02 →</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>

                    {/* Desktop table (hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-md shadow">
                        {loading ? (
                            <div className="p-6 text-center">Loading...</div>
                        ) : error ? (
                            <div className="p-6 text-center text-red-500">{error}</div>
                        ) : (
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-4 border-b text-left text-sm font-medium">No</th>
                                        <th className="px-4 py-4 border-b text-left text-sm font-medium">Nama Siswa</th>
                                        <th className="px-4 py-4 border-b text-center text-sm font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleAssessees.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Tidak ada data</td>
                                        </tr>
                                    )}

                                    {visibleAssessees.map((siswa, index) => (
                                        <tr key={siswa.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 border-b text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-4 py-4 border-b text-sm text-gray-900">
                                                { (siswa.user?.full_name ?? siswa.full_name ?? '— tidak tersedia —')}
                                            </td>
                                            <td className="px-4 py-4 border-b text-center">
                                                {/* Actions per tab */}
                                                {selectedTab === 'apl-02' && (
                                                    <Link to={`/apl-02/${siswa.id}`} className="text-orange-500 underline text-xs">Buka APL-02 →</Link>
                                                )}

                                                {selectedTab === 'ia-01' && (
                                                    <button onClick={() => openIa01Modal()} className="text-orange-500 underline text-xs">Cek IA-01 →</button>
                                                )}

                                                {selectedTab === 'ia-02' && (
                                                    <button onClick={() => window.open(`/asesor/ia-02/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-02 →</button>
                                                )}

                                                {selectedTab === 'ia-03' && (
                                                    <button onClick={() => window.open(`/asesor/ia-03/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-03 →</button>
                                                )}

                                                {selectedTab === 'ia-05' && (
                                                    <button onClick={() => window.open(`/asesor/ia-05/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka IA-05 →</button>
                                                )}

                                                {selectedTab === 'ak-01' && (
                                                    <button onClick={() => window.open(`/asesor/ak-01/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka AK-01 →</button>
                                                )}

                                                {selectedTab === 'ak-02' && (
                                                    <button onClick={() => window.open(`/asesor/ak-02/${siswa.id}`, '_self')} className="text-orange-500 underline text-xs">Buka AK-02 →</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
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
