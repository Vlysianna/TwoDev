import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/SideAdmin';
import Navbar from '@/components/NavAdmin';
import { ListCheck, AlertCircle, RefreshCw, Clock, CheckCircle, XCircle, Filter, ChevronDown, Calendar } from 'lucide-react';
import { formatDateJakartaUS24 } from '@/helper/format-date';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/helper/axios';
import useToast from '@/components/ui/useToast';
import { useAuth } from '@/contexts/AuthContext';

type ApprovalItem = {
    id: number;
    action: string;
    resource: string;
    target_name?: string;
    requester?: { id: number; full_name?: string; email?: string };
    created_at?: string;
    target_table?: string;
    target_id?: number;
    comment?: string | null;
    requester_admin_id?: number;
    approver_admin_id?: number;
    backup_admin_id?: number;
    approved_by?: number;
    second_approver_admin_id?: number;
    status?: string;
    approved_by_first?: boolean;
    approved_by_second?: boolean;
    approved_at?: string;
};


const PersetujuanAdmin: React.FC = () => {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [allItems, setAllItems] = useState<ApprovalItem[]>([]);
    // approvalsLoaded removed
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actingId, setActingId] = useState<number | null>(null);
    const toast = useToast();
    const [targetLabels, setTargetLabels] = useState<Record<string, string>>({});
    const [requesterLabels, setRequesterLabels] = useState<Record<number, string>>({});
    const [approverLabels, setApproverLabels] = useState<Record<number, string>>({});
    const { user } = useAuth();
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-requests' | 'my-approvals' | 'backup-approvals'>('all');
    const [canApprove, setCanApprove] = useState<boolean | null>(null);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    // const [refreshing, setRefreshing] = useState<boolean>(false);
    const [confirmState, setConfirmState] = useState<{ id: number | null; action: 'approve' | 'reject' | null }>( { id: null, action: null } );

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
                    target_name: it?.target_name ?? it?.targetName ?? undefined,
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
                    backup_admin_id: Number(it?.backup_admin_id ?? it?.backupAdminId ?? 0) || undefined,
                    approved_by: Number(it?.approved_by ?? it?.approvedBy ?? 0) || undefined,
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
            void resolveApprovers(list);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Gagal memuat daftar persetujuan');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (list: ApprovalItem[]) => {
        let effectiveFilter: 'all' | 'my-requests' | 'my-approvals' | 'backup-approvals' = selectedFilter;
        if (canApprove === false) {
            effectiveFilter = 'my-requests';
        }

        let filtered = [...list];

        if (effectiveFilter === 'my-requests') {
            filtered = filtered.filter(item => item.requester_admin_id === currentAdminId);
        } else if (effectiveFilter === 'my-approvals') {
            filtered = filtered.filter(item => item.approver_admin_id === currentAdminId);
        } else if (effectiveFilter === 'backup-approvals') {
            filtered = filtered.filter(item => item.backup_admin_id === currentAdminId);
        } else if (effectiveFilter === 'all') {
            filtered = filtered.filter(item => 
                item.requester_admin_id === currentAdminId || 
                item.approver_admin_id === currentAdminId
            );
        }

        filtered.sort((a, b) => {
            if (effectiveFilter === 'my-approvals') {
                const aInScope = a.approver_admin_id === currentAdminId;
                const bInScope = b.approver_admin_id === currentAdminId;
                if (aInScope !== bInScope) {
                    return aInScope ? -1 : 1;
                }
            } else if (effectiveFilter === 'backup-approvals') {
                const aInScope = a.backup_admin_id === currentAdminId;
                const bInScope = b.backup_admin_id === currentAdminId;
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

    useEffect(() => { applyFilters(allItems); }, [selectedFilter, allItems, currentAdminId, canApprove]);

    const fetchCurrentAdmin = async () => {
        try {
            const res = await api.get('/admins', { params: { page: 1, limit: 1000 } });
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];

            const found = list.find((a: any) => Number(a?.user?.id ?? a?.user_id) === Number(user?.id));
            if (found) {
                setCurrentAdminId(Number(found.id));
                const can = (found?.can_approve === true) || (found?.canApprove === true) || (Number(found?.can_approve) === 1) || (Number(found?.canApprove) === 1);
                setCanApprove(Boolean(can));
            }
        } catch {
            setCurrentAdminId(null);
            setCanApprove(null);
        }
    };

    useEffect(() => {
        void fetchCurrentAdmin();
    }, [user?.id]);

    const initializedFilterRef = useRef<boolean>(false);
    useEffect(() => {
        if (initializedFilterRef.current) return;
        if (canApprove === null) return;
        if (canApprove === true) {
            setSelectedFilter('all');
        } else {
            setSelectedFilter('my-requests');
        }
        initializedFilterRef.current = true;
    }, [canApprove]);

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
                    'scheme': 'jurusan',
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
                // console.log(`Admin ${id} API error:`, error);
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
                // console.log(`Failed to fetch user ${userId}:`, error);
            }
        }));

        need.forEach((id) => {
            const admin = adminData[id];
            const userId = Number(admin?.user_id ?? 0);
            const userData = userDetails[userId] || {};
            const displayName = userData?.full_name || userData?.name || userData?.email || `Admin #${id}`;
            updates[id] = displayName;
            // console.log(`Admin ${id} (user_id: ${userId}) resolved to:`, displayName);
        });

        setRequesterLabels(prev => ({ ...prev, ...updates }));
    };

    const resolveApprovers = async (list: ApprovalItem[]) => {
        const ids = Array.from(new Set([
            ...list.map(it => it.approver_admin_id).filter(Boolean),
            ...list.map(it => it.backup_admin_id).filter(Boolean),
            ...list.map(it => it.approved_by).filter(Boolean)
        ])) as number[];
        const need = ids.filter((id) => approverLabels[id] === undefined);
        if (need.length === 0) return;
        const updates: Record<number, string> = {};

        const adminData: Record<number, any> = {};
        await Promise.all(need.map(async (id) => {
            try {
                const res = await api.get(`/admins/${id}`);
                adminData[id] = res?.data?.data || res?.data;
            } catch (error) {
                // console.log(`Admin ${id} API error:`, error);
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
                // console.log(`Failed to fetch user ${userId}:`, error);
            }
        }));

        need.forEach((id) => {
            const admin = adminData[id];
            const userId = Number(admin?.user_id ?? 0);
            const userData = userDetails[userId] || {};
            const displayName = userData?.full_name || userData?.name || userData?.email || `Admin #${id}`;
            updates[id] = displayName;
        });

        setApproverLabels(prev => ({ ...prev, ...updates }));
    };

    const toggleExpanded = (id: number) => {
        setExpandedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

    const requestConfirm = (id: number, type: 'approve' | 'reject') => {
        setConfirmState({ id, action: type });
    };

    const closeConfirm = () => setConfirmState({ id: null, action: null });

    const confirmProceed = async () => {
        if (!confirmState.id || !confirmState.action) return closeConfirm();
        const id = confirmState.id;
        const action = confirmState.action;
        closeConfirm();
        await act(id, action);
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

    const formatDateIndo = (input?: string) => formatDateJakartaUS24(input || '');

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar title="Persetujuan" icon={<ListCheck size={20} />} />
                <main className="flex-1 overflow-auto p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    <div className="text-sm text-gray-500 mb-2">Dashboard / Persetujuan Penghapusan</div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Persetujuan Penghapusan</h1>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Filter size={16} className="text-gray-600" />
                                <select
                                    value={canApprove === false ? 'my-requests' : selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'my-requests' | 'my-approvals' | 'backup-approvals')}
                                    disabled={canApprove === false}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {canApprove !== false && <option value="all">Semua</option>}
                                    <option value="my-requests">Request Saya</option>
                                    {canApprove !== false && <option value="my-approvals">Butuh Persetujuan Saya</option>}
                                    {canApprove !== false && <option value="backup-approvals">Backup Persetujuan</option>}
                                </select>
                            </div>
                            <button
                                onClick={() => { void fetchApprovals(); }}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all shadow-sm"
                                aria-label="Refresh"
                                title="Refresh"
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
                                            <td colSpan={6} className="p-6 text-center">Memuat...</td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center">Tidak ada persetujuan</td>
                                        </tr>
                                    ) : (
                                        items.map((it) => {
                                            const statusDisplay = getStatusDisplay(it);
                                            const isPending = String(it.status || '').toLowerCase() !== 'approved' && String(it.status || '').toLowerCase() !== 'rejected';

                                            const isCurrentAdminApprover = currentAdminId !== null &&
                                                (it.approver_admin_id === currentAdminId || it.backup_admin_id === currentAdminId);

                                            const canApproveRow = isPending && isCurrentAdminApprover && (
                                                Number(it.requester_admin_id) !== currentAdminId || selectedFilter === 'backup-approvals'
                                            );

                                            return (
                                                <React.Fragment key={it.id}>
                                                    <tr className={`group transition-colors ${it.id % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-orange-50/50 cursor-pointer`} onClick={() => toggleExpanded(it.id)}>
                                                        <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">
                                                            <div className="flex items-center gap-2">
                                                                <ChevronDown size={14} className={`transition-transform ${expandedIds.includes(it.id) ? 'rotate-180' : ''}`} />
                                                                <span>{requesterLabels[it.requester_admin_id || 0] || it.requester?.full_name || it.requester?.email || '-'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">
                                                            {(() => {
                                                                const map: Record<string, string> = {
                                                                    'occupation': 'okupasi',
                                                                    'schedule': 'jadwal asesmen',
                                                                    'assessment': 'muk',
                                                                    'user': 'pengguna',
                                                                    'scheme': 'jurusan',
                                                                };
                                                                const key = String(it.target_table || '').toLowerCase();
                                                                const label = map[key] || key;
                                                                return `${label}${it.target_name ? ` (${it.target_name})` : ''}`;
                                                            })()}
                                                        </td>
                                                        <td className="px-2 py-3 sm:px-4 lg:px-6 break-words whitespace-normal">{it.comment || '-'}</td>
                                                        <td className="px-2 py-3 sm:px-4 lg:px-6">
                                                            <div className="flex items-center text-gray-500 text-sm">
                                                                <Calendar size={14} className="mr-2" />
                                                                {formatDateIndo(it.created_at)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 lg:px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                            {canApproveRow ? (
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <button
                                                                        onClick={() => requestConfirm(it.id, 'approve')}
                                                                        disabled={actingId === it.id}
                                                                        className="p-1 rounded-full text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
                                                                        title="Setujui"
                                                                        aria-label="Setujui"
                                                                    >
                                                                        <CheckCircle size={20} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => requestConfirm(it.id, 'reject')}
                                                                        disabled={actingId === it.id}
                                                                        className="p-1 rounded-full text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                                                                        title="Tolak"
                                                                        aria-label="Tolak"
                                                                    >
                                                                        <XCircle size={20} />
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
                                                    {expandedIds.includes(it.id) && (
                                                        <tr className={`${it.id % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                                                            <td colSpan={6} className="px-4 lg:px-6 py-3 text-sm">
                                                                {String(it.status || '').toLowerCase() === 'approved' ? (
                                                                    <div className="rounded-md border border-green-200 bg-green-50 text-green-800 px-3 py-2 inline-flex items-center gap-2">
                                                                        <CheckCircle size={16} />
                                                                        <span className="font-semibold">Disetujui oleh:</span>
                                                                        <span className="font-medium">{approverLabels[it.approved_by || 0] || '-'}</span>
                                                                    </div>
                                                                ) : String(it.status || '').toLowerCase() === 'rejected' ? (
                                                                    <div className="rounded-md border border-red-200 bg-red-50 text-red-800 px-3 py-2 inline-flex items-center gap-2">
                                                                        <XCircle size={16} />
                                                                        <span className="font-semibold">Ditolak oleh:</span>
                                                                        <span className="font-medium">{approverLabels[it.approved_by || 0] || '-'}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="rounded-md border border-orange-200 bg-orange-50 text-orange-800 px-3 py-2 inline-flex items-center gap-2">
                                                                        <Clock size={16} />
                                                                        <span className="font-semibold">Disetujui oleh:</span>
                                                                        <span className="font-medium">- (pending)</span>
                                                                        <span className="ml-2 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pending</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            {Boolean(confirmState.id && confirmState.action) && (
                <ConfirmModal
                    isOpen={true}
                    onClose={closeConfirm}
                    onConfirm={confirmProceed}
                    title={confirmState.action === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
                    message={confirmState.action === 'approve' ? 'Apakah Anda yakin ingin menyetujui permintaan ini?' : 'Apakah Anda yakin ingin menolak permintaan ini?'}
                    type={confirmState.action === 'approve' ? 'success' : 'danger'}
                    confirmText={confirmState.action === 'approve' ? 'Setujui' : 'Tolak'}
                    cancelText={'Batal'}
                />
            )}
        </div>
    );
};

export default PersetujuanAdmin;


