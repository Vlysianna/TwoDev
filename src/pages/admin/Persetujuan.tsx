import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { ListCheck, AlertCircle, RefreshCw, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
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
    approver_admin_id?: number;
    second_approver_admin_id?: number;
    status?: string;
    approved_by_first?: boolean;
    approved_by_second?: boolean;
    approved_at?: string;
};


const PersetujuanAdmin: React.FC = () => {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [allItems, setAllItems] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);
    const toast = useToast();
    const [targetLabels, setTargetLabels] = useState<Record<string, string>>({});
    const [requesterLabels, setRequesterLabels] = useState<Record<number, string>>({});
    const { user } = useAuth();
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-requests' | 'my-approvals'>('all');

    const fetchApprovals = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/approval/requests/scope/all`, { params: { page: 1, limit: 100 } });
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
                    approver_admin_id: Number(it?.approver_admin_id ?? it?.approverAdminId ?? 0) || undefined,
                    second_approver_admin_id: Number(it?.second_approver_admin_id ?? it?.secondApproverAdminId ?? 0) || undefined,
                    status: it?.status,
                    approved_by_first: Boolean(it?.approved_by_first),
                    approved_by_second: Boolean(it?.approved_by_second),
                    approved_at: it?.approved_at ?? it?.approvedAt ?? undefined,
                } as ApprovalItem;
            });

            setAllItems(list);
            applyFilters(list);
            void resolveTargets(list);
            void resolveRequesters(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Gagal memuat daftar persetujuan');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (list: ApprovalItem[]) => {
        let filtered = [...list];

        if (selectedFilter === 'my-requests') {
            filtered = filtered.filter(item => item.requester_admin_id === currentAdminId);
        } else if (selectedFilter === 'my-approvals') {
            filtered = filtered.filter(item =>
                item.approver_admin_id === currentAdminId ||
                item.second_approver_admin_id === currentAdminId
            );
        }

        filtered.sort((a, b) => {
            if (selectedFilter === 'my-approvals') {
                const aInScope = a.approver_admin_id === currentAdminId || a.second_approver_admin_id === currentAdminId;
                const bInScope = b.approver_admin_id === currentAdminId || b.second_approver_admin_id === currentAdminId;
                if (aInScope !== bInScope) {
                    return aInScope ? -1 : 1;
                }
            }

            const aStatus = String(a.status || '').toLowerCase();
            const bStatus = String(b.status || '').toLowerCase();

            const getStatusOrder = (status: string) => {
                if (status === 'pending') return 1;
                if (status === 'approved') return 2;
                if (status === 'rejected') return 3;
                return 4;
            };

            const aOrder = getStatusOrder(aStatus);
            const bOrder = getStatusOrder(bStatus);

            if (aOrder !== bOrder) {
                return aOrder - bOrder;
            }

            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        });

        setItems(filtered);
    };

    useEffect(() => { void fetchApprovals(); }, []);

    useEffect(() => { applyFilters(allItems); }, [selectedFilter, allItems, currentAdminId]);

    const fetchCurrentAdmin = async () => {
        try {
            const res = await api.get('/admins', { params: { page: 1, limit: 1000 } });
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];

            const found = list.find((a: any) => Number(a?.user?.id ?? a?.user_id) === Number(user?.id));
            if (found) {
                setCurrentAdminId(Number(found.id));
            }
        } catch {
            setCurrentAdminId(null);
        }
    };

    useEffect(() => {
        void fetchCurrentAdmin();
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
                const tableName = tbl.toLowerCase();
                
                const tableNameMap: Record<string, string> = {
                    'occupation': 'okupasi',
                    'schedule': 'jadwal asesmen',
                    'assessment': 'asesmen',
                    'user': 'pengguna',
                    'schema': 'jurusan',
                };
                
                const displayName = tableNameMap[tableName] || tableName;
                updates[k] = displayName;
            } catch (error) {
                console.error(`Error resolving ${tbl} ${id}:`, error);
                updates[k] = tbl.toLowerCase();
            }
        }));

        setTargetLabels(prev => ({ ...prev, ...updates }));
    };

    const resolveRequesters = async (list: ApprovalItem[]) => {
        const ids = Array.from(new Set(list.map(it => it.requester_admin_id).filter(Boolean))) as number[];
        const need = ids.filter((id) => requesterLabels[id] === undefined);
        if (need.length === 0) return;
        const updates: Record<number, string> = {};
        
        const adminData: Record<number, any> = {};
        await Promise.all(need.map(async (id) => {
            try {
                const res = await api.get(`/admins/${id}`);
                adminData[id] = res?.data?.data || res?.data;
            } catch (error) {
                console.log(`Admin ${id} API error:`, error);
            }
        }));
        
        const userIds = [...new Set(Object.values(adminData).map((a: any) => a?.user_id).filter(Boolean))];
        
        const userDetails: Record<number, any> = {};
        await Promise.all(userIds.map(async (userId: unknown) => {
            try {
                const userIdNum = Number(userId);
                const userRes = await api.get(`/user/${userIdNum}`);
                const userData = userRes?.data?.data || userRes?.data;
                userDetails[userIdNum] = userData;
            } catch (error) {
                console.log(`Failed to fetch user ${userId}:`, error);
            }
        }));
        
        need.forEach((id) => {
            const admin = adminData[id];
            const userId = Number(admin?.user_id ?? 0);
            const userData = userDetails[userId] || {};
            const displayName = userData?.full_name || userData?.name || userData?.email || `Admin #${id}`;
            updates[id] = displayName;
            console.log(`Admin ${id} (user_id: ${userId}) resolved to:`, displayName);
        });
        
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

    const getStatusDisplay = (item: ApprovalItem) => {
        const status = String(item.status || '').toLowerCase();
        if (status === 'approved') {
            return {
                text: 'Approved',
                className: 'bg-green-100 text-green-700',
                icon: <CheckCircle size={12} className="mr-1" />
            };
        } else if (status === 'rejected') {
            return {
                text: 'Rejected',
                className: 'bg-red-100 text-red-700',
                icon: <XCircle size={12} className="mr-1" />
            };
        } else {
            return {
                text: 'Pending',
                className: 'bg-orange-100 text-orange-700',
                icon: <Clock size={12} className="mr-1" />
            };
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

                    {/* Controls (filter + refresh) */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Filter size={16} className="text-gray-600" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'my-requests' | 'my-approvals')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                >
                                    <option value="all">Semua</option>
                                    <option value="my-requests">Request Saya</option>
                                    <option value="my-approvals">Butuh Persetujuan Saya</option>
                                </select>
                            </div>
                            <button
                                onClick={() => void fetchApprovals()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all shadow-sm"
                            >
                                <RefreshCw size={16} />
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
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 text-center font-medium">Setujui</th>
                                        <th className="px-2 py-3 sm:px-4 lg:px-6 text-center font-medium rounded-tr-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-center">Memuat...</td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-center">Tidak ada persetujuan</td>
                                        </tr>
                                    ) : (
                                        items.map((it) => {
                                            const statusDisplay = getStatusDisplay(it);
                                            const isPending = String(it.status || '').toLowerCase() !== 'approved' && String(it.status || '').toLowerCase() !== 'rejected';

                                            const isCurrentAdminApprover = currentAdminId !== null &&
                                                (it.approver_admin_id === currentAdminId || it.second_approver_admin_id === currentAdminId);

                                            const canApprove = isPending && isCurrentAdminApprover &&
                                                Number(it.requester_admin_id) !== currentAdminId;

                                            return (
                                                <tr key={it.id} className={`group transition-colors ${it.id % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-orange-50/50`}>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">
                                                        <div className="flex items-center gap-2">
                                                            <span>{requesterLabels[it.requester_admin_id || 0] || it.requester?.full_name || it.requester?.email || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6">{(it.action || '').toLowerCase() === 'update' ? 'Edit' : (it.action || '').toLowerCase() === 'delete' ? 'Hapus' : (it.action || '-')}</td>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">
                                                        {targetLabels[`${it.target_table || ''}:${it.target_id || ''}`] || it.resource || '-'}
                                                    </td>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">{it.comment || '-'}</td>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6">{formatDateIndo(it.created_at)}</td>
                                                    <td className="px-4 py-4 lg:px-6 text-center">
                                                        {canApprove ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => void act(it.id, 'approve')}
                                                                    disabled={actingId === it.id}
                                                                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                                    title="Setujui"
                                                                >
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => void act(it.id, 'reject')}
                                                                    disabled={actingId === it.id}
                                                                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                    title="Tolak"
                                                                >
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-3 sm:px-4 lg:px-6 text-center">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusDisplay.className}`}>
                                                            {statusDisplay.icon}
                                                            {statusDisplay.text}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
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


