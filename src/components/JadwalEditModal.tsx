import React, { useState } from 'react';
import BaseModal from './BaseModal';

interface JadwalEditModalProps {
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
  onSave: (data: { start_date: string; end_date: string }) => void;
  loading: boolean;
}

const JadwalEditModal: React.FC<JadwalEditModalProps> = ({ isOpen, onClose, jadwal, onSave, loading }) => {
  const [startDate, setStartDate] = useState(jadwal?.start_date ? jadwal.start_date.slice(0, 10) : '');
  const [endDate, setEndDate] = useState(jadwal?.end_date ? jadwal.end_date.slice(0, 10) : '');

  React.useEffect(() => {
    setStartDate(jadwal?.start_date ? jadwal.start_date.slice(0, 10) : '');
    setEndDate(jadwal?.end_date ? jadwal.end_date.slice(0, 10) : '');
  }, [jadwal]);

  if (!jadwal) return null;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-md w-full">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="bg-[#E77D35] px-6 py-4">
          <h2 className="text-xl font-semibold text-white mb-0">Edit Jadwal Asesmen</h2>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            onSave({ start_date: startDate, end_date: endDate });
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Mulai</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Selesai</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default JadwalEditModal;
