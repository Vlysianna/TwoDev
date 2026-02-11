import React from 'react';

interface SignatureDisplayProps {
  signatureUrl?: string | null;
  userName?: string;
  isApproved?: boolean;
  loadingText?: string;
  placeholderText?: string;
  approvedText?: string;
}

const SignatureDisplay: React.FC<SignatureDisplayProps> = ({
  signatureUrl,
  userName = '-',
  isApproved = false,
  loadingText = 'Tanda tangan akan muncul di sini',
  placeholderText = 'Menunggu persetujuan',
  approvedText = 'Sudah disetujui',
}) => {
  const getSignatureImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/twodev/api').replace(/\/$/, '');
    const path = url.startsWith('/') ? url.slice(1) : url;
    return `${baseUrl}/${path}`;
  };

  const imageUrl = getSignatureImageUrl(signatureUrl);

  return (
    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
      {imageUrl ? (
        <div className="w-40 h-40 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
          <img
            src={imageUrl}
            alt="Tanda Tangan"
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = '<span class="text-gray-400 text-sm text-center">Gambar tidak ditemukan</span>';
              }
            }}
          />
        </div>
      ) : (
        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
          <span className="text-gray-400 text-sm text-center px-2">
            {isApproved ? loadingText : placeholderText}
          </span>
        </div>
      )}

      <span className="text-sm font-semibold text-gray-800">
        {userName}
      </span>

      {isApproved && imageUrl && (
        <span className="text-green-600 font-semibold text-sm mt-2">
          {approvedText}
        </span>
      )}
    </div>
  );
};

export default SignatureDisplay;

