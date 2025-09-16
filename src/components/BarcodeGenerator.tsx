import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import ConfirmModal from './ConfirmModal';
import StatusModal from './StatusModal';

interface BarcodeGeneratorProps {
  qrValue?: string;
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
  userName = '-',
  isApproved = false,
  onGenerate,
  loadingText = 'QR Code akan muncul di sini',
  placeholderText = 'Menunggu persetujuan',
  buttonText = 'Generate QR Code',
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
      setStatusMessage('QR Code berhasil dibuat! Sekarang Anda dapat menggunakan QR Code untuk akses selanjutnya.');
      setShowStatusModal(true);
    } catch {
      setStatusType('error');
      setStatusMessage('Gagal membuat QR Code. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.');
      setShowStatusModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
        {/* QR Code Display */}
        {qrValue ? (
          <QRCodeCanvas
            value={qrValue}
            size={100}
            className="w-40 h-40 object-contain"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm text-center">
              {isApproved ? loadingText : placeholderText}
            </span>
          </div>
        )}

        {/* User Name */}
        <span className="text-sm font-semibold text-gray-800">
          {userName}
        </span>

        {/* Status or Button */}
        {isApproved && !qrValue && (
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

        {/* Status Text */}
        {isApproved && qrValue && (
          <span className="text-green-600 font-semibold text-sm mt-2">
            {approvedText}
          </span>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmGenerate}
        title="Konfirmasi Generate QR Code"
        message={`Apakah Anda yakin ingin membuat QR Code untuk ${userRole.toLowerCase()} ${userName}? QR Code ini akan digunakan untuk verifikasi dan akses sistem.`}
        confirmText="Ya, Generate"
        cancelText="Batalkan"
        type="info"
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        type={statusType}
        title={statusType === 'success' ? 'QR Code Berhasil Dibuat!' : 'Gagal Membuat QR Code'}
        message={statusMessage}
        confirmText="OK"
      />
    </>
  );
};

export default BarcodeGenerator;