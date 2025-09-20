import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, CircleAlert, Clock, FileCheck, Info, X } from "lucide-react";

export default function StatusDetailModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 relative">
                            <div className="flex items-center justify-between mb-4 text-sm">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                    Detail Status
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-slate-100"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Belum Tuntas */}
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 border rounded-lg">
                                    <CircleAlert className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="font-semibold">Belum Tuntas</p>
                                        <p className="text-slate-700 text-xs">Asesi belum menyelesaikan tahapan ini.</p>
                                    </div>
                                </div>

                                {/* Menunggu */}
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 border rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="font-semibold">Menunggu</p>
                                        <p className="text-slate-700 text-xs">Tahap ini sedang menunggu penilaian asesor.</p>
                                    </div>
                                </div>

                                {/* Butuh Persetujuan */}
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 border rounded-lg">
                                    <FileCheck className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <p className="font-semibold">Butuh Persetujuan</p>
                                        <p className="text-slate-700 text-xs">Perlu persetujuan anda sebelum lanjut.</p>
                                    </div>
                                </div>

                                {/* Tuntas */}
                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 border rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="font-semibold">Tuntas</p>
                                        <p className="text-slate-700 text-xs">Tahap ini sudah selesai dengan baik.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}