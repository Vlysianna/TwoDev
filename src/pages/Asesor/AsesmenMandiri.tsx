import { Search, LayoutDashboard } from "lucide-react";
import { Link } from 'react-router-dom';
import SidebarAsesor from '@/components/SideAsesor';
import NavAsesor from '@/components/NavAsesor';
import { useEffect, useState } from 'react';
import api from '@/helper/axios';

interface Assessee {
    id: number;
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

export default function TemplateAsesor() {
    const [assessees, setAssessees] = useState<Assessee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await api.get('/assessee');
                if (!mounted) return;
                console.log('API /assessee response:', res.data);
                if (res.data && (res.data.success || res.data.data)) {
                    const raw: RawAssessee[] = (res.data.data || []) as RawAssessee[];
                    // find assessees missing user/full_name and fetch user by user_id when available
                    const missing = raw.filter(a => !(a.user?.full_name) && !a.full_name && a.user_id);
                    if (missing.length > 0) {
                        // fetch users in parallel
                        const userPromises = missing.map(m => api.get(`/users/${m.user_id}`).then(r => ({ id: m.id, user: r.data?.data || null })).catch(() => ({ id: m.id, user: null })));
                        const users = await Promise.all(userPromises);
                        const userMap = new Map(users.map(u => [u.id, u.user]));
                        const merged = raw.map(ritem => ({ ...ritem, user: ritem.user || userMap.get(ritem.id) }));
                        setAssessees(merged as Assessee[]);
                    } else {
                        setAssessees(raw as Assessee[]);
                    }
                } else {
                    setAssessees([]);
                }
            } catch (err: unknown) {
                let msg = String(err);
                try {
                    const parsed = JSON.parse(JSON.stringify(err || {}));
                    if (parsed && parsed.response?.data?.message) {
                        msg = parsed.response.data.message;
                    } else if (parsed && parsed.message) {
                        msg = parsed.message;
                    }
                } catch {
                    // keep String(err)
                }
                setError(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => { mounted = false };
    }, []);

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
                        <button className="px-4 py-2 rounded-md bg-[#E77D35] text-white font-medium">
                            Asesmen Mandiri
                        </button>
                        <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                            Persetujuan & Kerahasiaan
                        </button>
                        <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                            Lembar Jawaban
                        </button>
                    </div>

                    {/* Search + Generate */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-5xl mr-6">
                            <input
                                type="text"
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
                                    {assessees.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Tidak ada data</td>
                                        </tr>
                                    )}
                                    {assessees.map((siswa, index) => (
                                        <tr key={siswa.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 border-b text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-4 py-4 border-b text-sm text-gray-900">
                                                {siswa.user?.full_name
                                                    || siswa.full_name
                                                    || JSON.stringify(siswa)}
                                            </td>
                                            <td className="px-4 py-4 border-b text-center">
                                                <Link to={`/apl-02/${siswa.id}`} className="text-orange-500 underline text-xs">
                                                    Cek APL 02 &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
