import { Search, LayoutDashboard } from "lucide-react";
// Link removed; modal will open IA-01 inline
import SidebarAsesor from '@/components/SideAsesor';
import NavAsesor from '@/components/NavAsesor';
import { useEffect, useState } from 'react';
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
    const [selectedTab, setSelectedTab] = useState<'mandiri' | 'persetujuan' | 'lembar'>('mandiri');
    const [approvals, setApprovals] = useState<Record<number, boolean>>({});
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

    const handleToggleApproval = (id: number) => {
        setApprovals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleApproveAll = () => {
        const newMap: Record<number, boolean> = {};
        visibleAssessees.forEach(a => { newMap[a.id] = true; });
        setApprovals(newMap);
    };

    const handleDownload = (id: number) => {
        // best-effort download URL; adjust backend path if you have a proper endpoint
        const url = `/uploads/apl-01/${id}`;
        window.open(url, '_blank');
    };

    const handleGenerateAll = () => {
        if (selectedTab === 'persetujuan') {
            handleApproveAll();
            return;
        }

        if (selectedTab === 'lembar') {
            // trigger download for visible items (best-effort)
            visibleAssessees.forEach(a => handleDownload(a.id));
            return;
        }

        // default: mandiri generation (no-op / placeholder)
        console.log('Generate Asesmen Mandiri for', visibleAssessees.map(a => a.id));
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

                {/* Content */}
                <div className="p-6">

                    {/* Tab Buttons */}
                    <div className="flex items-center space-x-2 mb-6">
                        <button onClick={() => setSelectedTab('mandiri')} className={`px-4 py-2 rounded-md ${selectedTab === 'mandiri' ? 'bg-[#E77D35] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            Asesmen Mandiri
                        </button>
                        <button onClick={() => setSelectedTab('persetujuan')} className={`px-4 py-2 rounded-md ${selectedTab === 'persetujuan' ? 'bg-[#E77D35] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            Persetujuan & Kerahasiaan
                        </button>
                        <button onClick={() => setSelectedTab('lembar')} className={`px-4 py-2 rounded-md ${selectedTab === 'lembar' ? 'bg-[#E77D35] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            Lembar Jawaban
                        </button>
                    </div>

                    {/* Search + Generate */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Search Bar */}
                                <div className="relative flex-1 max-w-5xl mr-6">
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
                        <button onClick={handleGenerateAll} className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:bg-orange-6000">
                            {selectedTab === 'mandiri' ? 'Generate All' : selectedTab === 'persetujuan' ? 'Approve All' : 'Download All'}
                        </button>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-x-auto bg-white rounded-md shadow">
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
                                                                {selectedTab === 'mandiri'
                                                                    ? ''
                                                                    : (siswa.user?.full_name ?? siswa.full_name ?? '— tidak tersedia —')}
                                                            </td>
                                                            <td className="px-4 py-4 border-b text-center">
                                                                {selectedTab === 'mandiri' && (
                                                                    <button onClick={() => openIa01Modal()} className="text-orange-500 underline text-xs">
                                                                        Cek IA 01 &rarr;
                                                                    </button>
                                                                )}

                                                                {selectedTab === 'persetujuan' && (
                                                                    <div className="flex items-center justify-center space-x-2">
                                                                        <label className="flex items-center space-x-2">
                                                                            <input type="checkbox" checked={!!approvals[siswa.id]} onChange={() => handleToggleApproval(siswa.id)} />
                                                                            <span className="text-sm">Setuju</span>
                                                                        </label>
                                                                    </div>
                                                                )}

                                                                {selectedTab === 'lembar' && (
                                                                    <div className="flex items-center justify-center space-x-2">
                                                                        <button onClick={() => handleDownload(siswa.id)} className="text-blue-600 underline text-xs">Download</button>
                                                                    </div>
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
