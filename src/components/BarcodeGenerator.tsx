import React, { useState } from 'react';
import SignatureDisplay from './SignatureDisplay';
import ConfirmModal from './ConfirmModal';
import StatusModal from './StatusModal';

interface BarcodeGeneratorProps {
  qrValue?: string;
  signatureUrl?: string | null;
  userName?: string;
  isApproved?: boolean;
  onGenerate: () => Promise<void>;
  loadingText?: string;
  placeholderText?: string;
  buttonText?: string;
  approvedText?: string;
  userRole?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  qrValue,
  signatureUrl,
  userName = '-',
  isApproved = false,
  onGenerate,
  loadingText = 'Tanda tangan akan muncul di sini',
  placeholderText = 'Menunggu persetujuan',
  buttonText = 'Generate Tanda Tangan',
  approvedText = 'Sudah disetujui',
  userRole = 'User',
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [statusMessage, setStatusMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirmModal(false);
    setIsGenerating(true);

    try {
      await onGenerate();
      setStatusType('success');
      setStatusMessage('Tanda tangan berhasil dibuat! Sekarang Anda dapat menggunakan tanda tangan untuk verifikasi.');
      setShowStatusModal(true);
    } catch {
      setStatusType('error');
      setStatusMessage('Gagal membuat tanda tangan. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.');
      setShowStatusModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
        {/* Signature Display */}
        <SignatureDisplay
          signatureUrl={signatureUrl}
          userName={userName}
          isApproved={isApproved}
          loadingText={loadingText}
          placeholderText={placeholderText}
          approvedText={approvedText}
        />

        {/* Status or Button */}
        {isApproved && !signatureUrl && (
          <button
            disabled={isGenerating}
            onClick={handleGenerateClick}
            className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
              !isGenerating
                ? "hover:bg-orange-600 cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              buttonText
            )}
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmGenerate}
        title="Konfirmasi Generate Tanda Tangan"
        message={`Apakah Anda yakin ingin membuat tanda tangan untuk ${userRole.toLowerCase()} ${userName}? Tanda tangan ini akan digunakan untuk verifikasi dan akses sistem.`}
        confirmText="Ya, Generate"
        cancelText="Batalkan"
        type="info"
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        type={statusType}
        title={statusType === 'success' ? 'Tanda Tangan Berhasil Dibuat!' : 'Gagal Membuat Tanda Tangan'}
        message={statusMessage}
        confirmText="OK"
      />
    </>
  );
};

export default BarcodeGenerator;