import { Search, LayoutDashboard } from "lucide-react";
import { Link } from 'react-router-dom';
import SidebarAsesor from '@/components/SideAsesor';
import NavAsesor from '@/components/NavAsesor';
import { useEffect, useState } from 'react';
import api from '@/helper/axios';

interface Assessee {
    id: number;
    full_name?: string;
}

type RawAssessee = { id: number; user?: { full_name?: string }; full_name?: string };

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

export default function DashboardPenilaian() {

    const [assessees, setAssessees] = useState<Assessee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const resp = await api.get('/assessee');
                if (resp?.data?.success && Array.isArray(resp.data.data)) {
                    const mapped: Assessee[] = resp.data.data.map((r: RawAssessee) => ({
                        id: r.id,
                        full_name: r.user?.full_name ?? r.full_name,
                    }));
                    setAssessees(mapped);
                } else {
                    setAssessees(siswaData.map(s => ({ id: s.id, full_name: s.nama })));
                }
            } catch (e) {
                console.error('Failed to fetch assessees', e);
                setAssessees(siswaData.map(s => ({ id: s.id, full_name: s.nama })));
                setError('Gagal memuat data peserta');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const visible = assessees.filter(a => {
        if (!searchTerm) return true;
        return (a.full_name ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    });

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
                    <NavAsesor title="Overview" icon={<LayoutDashboard size={25} />}/>
                </div>

                {/* Content */}
                <div className="p-6">

                    {/* Tab Buttons */}
                    <div className="flex items-center space-x-2 mb-6">
                        <button className="px-4 py-2 rounded-md bg-[#E77D35] text-white font-medium">
                            FR.IA.01
                        </button>
                        <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                            FR.IA.03
                        </button>
                        <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                            FR.AK.02
                        </button>
                        <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                            FR.AK.05
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
                        <button className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:bg-orange-6000">
                            Generate All
                        </button>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-x-auto bg-white rounded-md shadow">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-4 border-b text-left text-sm font-medium">No</th>
                                    <th className="px-4 py-4 border-b text-left text-sm font-medium">Nama Siswa</th>
                                    <th className="px-4 py-4 border-b text-center text-sm font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={3} className="p-6 text-center">Loading...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-red-500">{error}</td></tr>
                                ) : (
                                    visible.map((siswa, index) => (
                                        <tr key={siswa.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 border-b text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-4 py-4 border-b text-sm text-gray-900">{siswa.full_name}</td>
                                            <td className="px-4 py-4 border-b text-center">
                                                <Link
                                                    to={`/apl-02/${siswa.id}`}
                                                    className="text-orange-500 underline text-xs"
                                                >
                                                    Cek IA 01 &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
