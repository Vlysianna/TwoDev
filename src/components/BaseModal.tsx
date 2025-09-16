import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, widthClass }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/10">
      <div className={`bg-[#E77D35] rounded-lg shadow-xl mx-4 ${widthClass || 'max-w-lg w-full'} relative`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded hover:bg-white/20 text-white"
          aria-label="Tutup Modal"
        >
          <span aria-hidden>×</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
