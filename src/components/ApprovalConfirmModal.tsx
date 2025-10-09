import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '@/helper/axios';
import { useAuth } from '@/contexts/AuthContext';

interface AdminOption {
    id: number;
    name: string;
}

interface ApprovalConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { approver_admin_id: number; backup_admin_id?: number; comment: string }) => void;
    loading?: boolean;
    title?: string;
    subtitle?: string;
}

const ApprovalConfirmModal: React.FC<ApprovalConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    title = 'Persetujuan Diperlukan',
    subtitle = 'Pilih 1 admin yang berwenang dan beri catatan (opsional).',
}) => {
    const { user } = useAuth();
    const [admins, setAdmins] = useState<AdminOption[]>([]);
    const [approver, setApprover] = useState<number | ''>('');
    const [comment, setComment] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
    const [currentAdminCanApprove, setCurrentAdminCanApprove] = useState<boolean>(false);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setError(null);
                const res = await api.get('/admins', { params: { page: 1, limit: 1000 } });
                const raw = res?.data;
                const list = Array.isArray(raw?.data)
                    ? raw.data
                    : Array.isArray(raw?.admins)
                        ? raw.admins
                        : Array.isArray(raw)
                            ? raw
                            : [];

                const currentUserId = Number(user?.id || 0);
                
                const userIds = [...new Set(list.map((a: any) => a?.user_id).filter(Boolean))];
                
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

                const options: AdminOption[] = list
                    .filter((a: any) => a?.can_approve === true || a?.canApprove === true)
                    .map((a: any) => {
                        const adminId = Number(a?.id ?? a?.admin_id ?? a?.id_admin ?? 0);
                        const userId = Number(a?.user_id ?? 0);
                        const userData = userDetails[userId] || {};
                        const name = userData?.full_name || userData?.name || userData?.email || `Admin ${adminId}`;
                        return { id: adminId, name, _userId: userId } as any;
                    })
                    .filter((opt: any) => Number(opt._userId) !== currentUserId)
                    .map((opt: any) => ({ id: Number(opt.id), name: String(opt.name) }));
                setAdmins(options);

                const me = (list as any[]).find((a: any) => Number(a?.user_id) === currentUserId);
                setCurrentAdminId(me ? Number(me?.id ?? me?.admin_id ?? me?.id_admin ?? 0) : null);
                const canApproveFlag = (me?.can_approve === true) || (me?.canApprove === true) || (Number(me?.can_approve) === 1) || (Number(me?.canApprove) === 1);
                setCurrentAdminCanApprove(Boolean(canApproveFlag));
            } catch (e) {
                setAdmins([]);
                setCurrentAdminId(null);
                setCurrentAdminCanApprove(false);
            }
        };
        if (isOpen) {
            void fetchAdmins();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setApprover('');
            setComment('');
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!approver) {
            setError('Pilih admin yang berwenang.');
            return;
        }
        setError(null);
        onConfirm({
            approver_admin_id: Number(approver),
            backup_admin_id: currentAdminCanApprove && currentAdminId ? currentAdminId : undefined,
            comment,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} disabled={loading} className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <p className="text-sm text-gray-600">{subtitle}</p>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Pilih Admin Penyetuju</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
                            value={approver}
                            onChange={(e) => setApprover(e.target.value ? Number(e.target.value) : '')}
                            disabled={loading}
                        >
                            <option value="">Pilih Admin</option>
                            {admins.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Catatan</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
                            placeholder="Contoh: update data user / hapus user"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#E77D35] hover:bg-orange-600 rounded-md transition-colors"
                        >
                            {loading ? 'Mengirim...' : 'Konfirmasi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalConfirmModal;


