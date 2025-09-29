import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { ListCheck, AlertCircle, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import api from '@/helper/axios';
import useToast from '@/components/ui/useToast';
import { useAuth } from '@/contexts/AuthContext';

type ApprovalItem = {
    id: number;
    action: string;
    resource: string;
    requester?: { id: number; full_name?: string; email?: string };
    created_at?: string;
    target_table?: string;
    target_id?: number;
    comment?: string | null;
    requester_admin_id?: number;
};

const PersetujuanAdmin: React.FC = () => {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);
    const toast = useToast();
    const [targetLabels, setTargetLabels] = useState<Record<string, string>>({});
    const [requesterLabels, setRequesterLabels] = useState<Record<number, string>>({});
    const { user } = useAuth();
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);

    const fetchApprovals = async () => {
        try {
            setLoading(true);
            setError(null);
            const scope = filter === 'pending' ? 'to-approve' : 'all';
            const res = await api.get(`/approval/requests/scope/${scope}`, { params: { page: 1, limit: 50 } });
            const raw = res?.data ?? {};
            if (raw?.success === false) {
                throw new Error(raw?.message || 'Gagal memuat daftar persetujuan');
            }
            const container =
                (Array.isArray(raw?.data?.data) && raw.data.data) ||
                (Array.isArray(raw?.data?.items) && raw.data.items) ||
                (Array.isArray(raw?.data) && raw.data) ||
                (Array.isArray(raw?.items) && raw.items) ||
                (Array.isArray(raw?.approvals) && raw.approvals) ||
                (Array.isArray(raw?.results) && raw.results) ||
                (Array.isArray(raw?.records) && raw.records) ||
                (Array.isArray(raw) && raw) ||
                [];

            const list: ApprovalItem[] = (container as any[]).map((it: any) => {
                const requester = it?.requester || it?.requested_by || it?.user || it?.created_by || {};
                const fallbackResource = `${String(it?.target_table ?? it?.targetTable ?? '')}${it?.target_id || it?.targetId ? `#${it?.target_id ?? it?.targetId}` : ''}`.trim();
                return {
                    id: Number(it?.id ?? it?.approval_id ?? it?.approvalId ?? 0),
                    action: String(it?.action ?? it?.type ?? it?.operation ?? it?.verb ?? ''),
                    resource: String(it?.resource ?? it?.target ?? it?.entity ?? it?.subject ?? fallbackResource),
                    requester: requester ? {
                        id: Number(requester?.id ?? 0),
                        full_name: requester?.full_name ?? requester?.name ?? undefined,
                        email: requester?.email ?? undefined,
                    } : undefined,
                    created_at: it?.created_at ?? it?.createdAt ?? undefined,
                    target_table: it?.target_table ?? it?.targetTable ?? undefined,
                    target_id: Number(it?.target_id ?? it?.targetId ?? 0) || undefined,
                    comment: it?.comment ?? null,
                    requester_admin_id: Number(it?.requester_admin_id ?? it?.requesterAdminId ?? requester?.admin_id ?? 0) || undefined,
                    status: it?.status,
                    approved_by_first: Boolean(it?.approved_by_first),
                    approved_by_second: Boolean(it?.approved_by_second),
                    approved_at: it?.approved_at ?? it?.approvedAt ?? undefined,
                } as ApprovalItem;
            });

            const normalizedStatus = (s: any) => String(s || '').toLowerCase();
            const filtered = filter === 'approved'
                ? list.filter((r: any) => normalizedStatus(r?.status) === 'approved')
                : list.filter((r: any) => normalizedStatus(r?.status) !== 'approved');

            setItems(filtered);
            void resolveTargets(list);
            void resolveRequesters(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Gagal memuat daftar persetujuan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void fetchApprovals(); }, [filter]);

    useEffect(() => {
        const resolveCurrentAdmin = async () => {
            try {
                const res = await api.get('/admins', { params: { page: 1, limit: 1000 } });
                const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
                const found = list.find((a: any) => Number(a?.user?.id ?? a?.user_id) === Number(user?.id));
                if (found) setCurrentAdminId(Number(found.id));
            } catch {
                setCurrentAdminId(null);
            }
        };
        void resolveCurrentAdmin();
    }, [user?.id]);

    const resolveTargets = async (list: ApprovalItem[]) => {
        const keys = Array.from(new Set(list.map(it => `${it.target_table || ''}:${it.target_id || ''}`)));
        const need = keys.filter(k => !!k && !targetLabels[k]);
        if (need.length === 0) return;
        const updates: Record<string, string> = {};
        await Promise.all(need.map(async (k) => {
            const [tbl, idStr] = k.split(':');
            const id = Number(idStr);
            if (!tbl || !id) return;
            try {
                if (tbl.toLowerCase() === 'user') {
                    const res = await api.get(`/user/${id}`);
                    const u = res?.data?.data || res?.data;
                    updates[k] = u?.full_name || u?.email || `user #${id}`;
                    return;
                }
                updates[k] = `${tbl} #${id}`;
            } catch {
                updates[k] = `${tbl} #${id}`;
            }
        }));
        setTargetLabels(prev => ({ ...prev, ...updates }));
    };

    const resolveRequesters = async (list: ApprovalItem[]) => {
        const ids = Array.from(new Set(list.map(it => it.requester_admin_id).filter(Boolean))) as number[];
        const need = ids.filter((id) => requesterLabels[id] === undefined);
        if (need.length === 0) return;
        const updates: Record<number, string> = {};
        await Promise.all(need.map(async (id) => {
            try {
                const res = await api.get(`/admins/${id}`);
                const a = res?.data?.data || res?.data;
                const user = a?.user || a?.User || {};
                updates[id] = user?.full_name || user?.name || user?.email || `admin #${id}`;
            } catch {
                updates[id] = `admin #${id}`;
            }
        }));
        setRequesterLabels(prev => ({ ...prev, ...updates }));
    };

    const act = async (id: number, type: 'approve' | 'reject') => {
        try {
            setActingId(id);
            setError(null);
            const res = await api.post(`/approval/${id}/${type}`);
            if (res?.data?.success !== false) {
                toast.show({ title: 'Berhasil', description: type === 'approve' ? 'Permintaan disetujui' : 'Permintaan ditolak', type: 'success' });
                await fetchApprovals();
            } else {
                const msg = res?.data?.message || 'Aksi gagal';
                toast.show({ title: 'Gagal', description: msg, type: 'error' });
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Aksi gagal';
            setError(msg);
            toast.show({ title: 'Gagal', description: msg, type: 'error' });
        } finally {
            setActingId(null);
        }
    };

    const formatDateIndo = (input?: string) => {
        if (!input) return '-';
        const isoLike = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/.exec(input);
        if (isoLike) {
            const [, yyyyStr, mmStr, ddStr, HHStr, MMStr, SSStr] = isoLike;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const yyyy = Number(yyyyStr);
            const mmIndex = Math.max(1, Number(mmStr)) - 1;
            const dd = Number(ddStr);
            const HH = HHStr.padStart(2, '0');
            const MM = MMStr.padStart(2, '0');
            const SS = (SSStr || '00').padStart(2, '0');
            const monthLabel = months[Math.min(11, Math.max(0, mmIndex))];
            return `${dd.toString().padStart(2, '0')} ${monthLabel} ${yyyy}, ${HH}:${MM}:${SS}`;
        }
        if (/^\d{2}:\d{2}:\d{2}$/.test(input)) {
            return input;
        }
        const parts = input.split(':');
        if (parts.length >= 3) {
            const HH = parts[parts.length - 3];
            const mm = parts[parts.length - 2];
            const ss = parts[parts.length - 1];
            if (/^\d{2}$/.test(HH) && /^\d{2}$/.test(mm) && /^\d{2}$/.test(ss)) {
                if (parts[0] === '0000' || parts[1] === '00' || parts[2] === '00') {
                    return `${HH}:${mm}:${ss}`;
                }
                const yyyy = Number(parts[0]);
                const MM = Math.max(1, Number(parts[1] || '1')) - 1;
                const dd = Math.max(1, Number(parts[2] || '1'));
                const date = new Date(yyyy, MM, dd, Number(HH), Number(mm), Number(ss));
                if (!isNaN(date.getTime())) {
                    return date.toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                }
            }
        }
        return input;
    };

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar title="Persetujuan" icon={<ListCheck size={20} />} />
                <main className="flex-1 overflow-auto p-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Breadcrumb + Title */}
                    <div className="text-sm text-gray-500 mb-2">Dashboard / Persetujuan</div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Persetujuan</h1>

                    {/* Controls (tabs + refresh) */}
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
                                            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
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
                                            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
                                        )}
                                    </div>
                                </button>
                            </div>
                            <button
                                onClick={() => void fetchApprovals()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all shadow-sm"
                            >
                                <RefreshCw size={16} className="animate-spin" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm">
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 font-medium rounded-tl-xl text-left">Pemohon</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 font-medium text-left">Aksi</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 font-medium text-left">Target</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 font-medium text-left">Catatan</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 font-medium text-left">Tanggal</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 text-center font-medium rounded-tr-xl">Setujui</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center">Memuat...</td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center">Tidak ada persetujuan</td>
                                        </tr>
                                    ) : (
                                        items.map((it) => (
                                            <tr key={it.id} className={`group transition-colors ${it.id % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-orange-50/50`}>
                                                <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">
                                                    <div className="flex items-center gap-2">
                                                        <span>{filter === 'pending' ? '-' : (requesterLabels[it.requester_admin_id || 0] || it.requester?.full_name || it.requester?.email || '-')}</span>
                                                        {filter === 'pending' && (
                                                            <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">Pending</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 sm:px-4 lg:px-6">{(it.action || '').toLowerCase() === 'update' ? 'Edit' : (it.action || '').toLowerCase() === 'delete' ? 'Hapus' : (it.action || '-')}</td>
                                                <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">{targetLabels[`${it.target_table || ''}:${it.target_id || ''}`] || it.resource || '-'}</td>
                                                <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">{it.comment || '-'}</td>
                                                <td className="px-2 py-3 sm:px-4 lg:px-6">{formatDateIndo(it.created_at)}</td>
                                                <td className="px-4 py-4 lg:px-6 text-center">
                                                    {filter === 'pending' ? (
                                                        <button
                                                            onClick={() => void act(it.id, 'approve')}
                                                            disabled={actingId === it.id || (currentAdminId !== null && Number(it.requester_admin_id) === currentAdminId)}
                                                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Setujui"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                                                            <CheckCircle size={12} className="mr-1" />
                                                            Disetujui
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PersetujuanAdmin;


