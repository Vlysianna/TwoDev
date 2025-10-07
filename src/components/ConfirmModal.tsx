import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  icon?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batalkan',
  type = 'warning',
  icon,
}) => {
  if (!isOpen) return null;

  const getDefaultIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'info':
        return <AlertTriangle className="w-16 h-16 text-blue-500" />;
      case 'success':
        return <AlertTriangle className="w-16 h-16 text-green-500" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-[#E77D35] hover:bg-orange-600';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-[#E77D35] hover:bg-orange-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            {icon || getDefaultIcon()}
          </div>
          
          <h2 className="font-bold text-xl mb-3 text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${getButtonColor()} text-white py-2 px-4 rounded-lg transition-colors cursor-pointer`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;