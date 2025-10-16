import React from 'react';
import BaseModal from './BaseModal';
import { Download, Eye, FileText, X } from 'lucide-react';
import api from '@/helper/axios';

interface AssessorDocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessorDetail: any;
}

const AssessorDocumentsModal: React.FC<AssessorDocumentsModalProps> = ({
    isOpen,
    onClose,
    assessorDetail
}) => {
    const [error, setError] = React.useState<string | null>(null);

    const downloadFile = async (url: string, filename: string) => {
        try {
            const response = await api.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
            setError('Gagal mengunduh file');
        }
    };

    const viewFile = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Gagal fetch file");

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch (error) {
            console.error("Error viewing file:", error);
            setError("Gagal membuka file");
        }
    };

    const renderDocuments = () => {
        if (!assessorDetail) return null;

        const documentTypes = [
            { key: 'tax_id_number', label: 'NPWP' },
            { key: 'bank_book_cover', label: 'Cover Buku Tabungan' },
            { key: 'certificate', label: 'Sertifikat Asesor' },
            { key: 'id_card', label: 'Pas Foto' },
            { key: 'national_id', label: 'KTP/KK' }
        ];

        return (
            <div className="mt-4">
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}

                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                    {documentTypes.map((doc) => {
                        const url = import.meta.env.VITE_API_URL + '/' + assessorDetail[doc.key];
                        if (!url) return null;

                        const filename = url.split('/').pop() || doc.label;
                        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

                        return (
                            <div key={doc.key} className="border rounded-lg p-3 md:p-4 shadow-sm">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                                    {/* Preview Gambar / PDF */}
                                    <div className="w-full sm:w-32 flex-shrink-0">
                                        {isImage ? (
                                            <img
                                                src={url}
                                                alt={doc.label}
                                                className="w-full h-32 object-contain border rounded"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                                                }}
                                            />
                                        ) : null}
                                        {!isImage || !url ? (
                                            <div className={`w-full h-32 flex flex-col items-center justify-center bg-gray-100 border rounded ${isImage && url ? 'hidden' : ''}`}>
                                                <FileText className="w-8 h-8 text-gray-400" />
                                                <p className="text-xs text-gray-500 mt-1">Dokumen PDF</p>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Label + Buttons */}
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <p className="font-medium text-sm md:text-base">{doc.label}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => viewFile(url)}
                                                    className="flex items-center text-white py-1.5 px-3 rounded cursor-pointer bg-blue-500 hover:bg-blue-700 text-xs md:text-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                                                    Lihat
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => downloadFile(url, filename)}
                                                    className="flex items-center text-white py-1.5 px-3 rounded cursor-pointer bg-green-600 hover:bg-green-800 text-xs md:text-sm"
                                                >
                                                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-2xl w-11/12 mx-auto">
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="bg-[#E77D35] px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
                    <h2 className="text-lg md:text-xl font-semibold text-white">Dokumen Asesor</h2>
                </div>
                <div className="p-4 md:p-6">
                    {renderDocuments()}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm md:text-base cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AssessorDocumentsModal;