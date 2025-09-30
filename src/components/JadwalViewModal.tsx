import React from 'react';
import BaseModal from './BaseModal';
import { formatDate } from "@/helper/format-date";

interface JadwalViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jadwal?: {
    id: number;
    start_date?: string | null;
    end_date?: string | null;
    assessment: {
      id: number;
      occupation: {
        id: number;
        name: string;
        scheme: { id: number; name: string };
      };
    };
  };
}

const JadwalViewModal: React.FC<JadwalViewModalProps> = ({ isOpen, onClose, jadwal }) => {
  if (!jadwal) return null;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-md w-full">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="bg-[#E77D35] px-6 py-4">
          <h2 className="text-xl font-semibold text-white mb-0">Detail Jadwal Asesmen</h2>
        </div>
        <div className="p-6">
          <div className="space-y-2 text-sm text-gray-700">
            <div><b>Skema:</b> {jadwal.assessment.occupation.scheme.name}</div>
            <div><b>Okupasi:</b> {jadwal.assessment.occupation.name}</div>
            <div><b>Tanggal Mulai:</b> {jadwal.start_date ? formatDate(jadwal.start_date) : '-'}</div>
            <div><b>Tanggal Selesai:</b> {jadwal.end_date ? formatDate(jadwal.end_date) : '-'}</div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default JadwalViewModal;
