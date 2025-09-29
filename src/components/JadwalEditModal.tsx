import React, { useState, useEffect } from 'react';
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
  // datetime-local values (YYYY-MM-DDTHH:MM:SS) - always used
  const [startDateTime, setStartDateTime] = useState<string>(() => isoToLocalDatetime(jadwal?.start_date));
  const [endDateTime, setEndDateTime] = useState<string>(() => isoToLocalDatetime(jadwal?.end_date));

  useEffect(() => {
    setStartDateTime(isoToLocalDatetime(jadwal?.start_date));
    setEndDateTime(isoToLocalDatetime(jadwal?.end_date));
  }, [jadwal]);

  function isoToLocalDatetime(iso?: string | null): string {
    if (!iso) return '';
    try {
      const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T');
      const d = new Date(normalized as string);
      if (Number.isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      const sec = pad(d.getSeconds());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}`;
    } catch (e) {
      return '';
    }
  }

  function localDatetimeToISOString(localDateTime: string): string {
    // localDateTime is like YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS (no timezone)
    const d = new Date(localDateTime);
    return d.toISOString();
  }

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
            // Always send ISO strings (UTC Z) using the datetime-local values
            const startIso = localDatetimeToISOString(startDateTime);
            const endIso = localDatetimeToISOString(endDateTime);
            onSave({ start_date: startIso, end_date: endIso });
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Mulai</label>
            <input
              type="datetime-local"
              step={1}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={startDateTime}
              onChange={e => setStartDateTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Selesai</label>
            <input
              type="datetime-local"
              step={1}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={endDateTime}
              onChange={e => setEndDateTime(e.target.value)}
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
