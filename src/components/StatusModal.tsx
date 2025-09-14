import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Batalkan',
  showCancel = false,
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      case 'error':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'info':
        return {
          icon: <Info className="w-16 h-16 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          icon: <Info className="w-16 h-16 text-gray-500" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const { icon, bgColor, borderColor, buttonColor } = getIconAndColor();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${bgColor} border-2 ${borderColor}`}>
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            {icon}
          </div>
          
          <h2 className="font-bold text-xl mb-3 text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`${showCancel ? 'flex-1' : 'px-8'} ${buttonColor} text-white py-2 px-4 rounded-lg transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;