import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

interface DetailRow {
  id?: number;
  assessor_id?: number | null;
  location?: string | null;
}

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
    schedule_details?: DetailRow[];
  };
  onSave: (data: { start_date: string; end_date: string; schedule_details: DetailRow[] }) => void;
  loading: boolean;
}

const JadwalEditModal: React.FC<JadwalEditModalProps> = ({ isOpen, onClose, jadwal, onSave, loading }) => {
  // datetime-local values (YYYY-MM-DDTHH:MM:SS) - always used
  const [startDateTime, setStartDateTime] = useState<string>(() => isoToLocalDatetime(jadwal?.start_date));
  const [endDateTime, setEndDateTime] = useState<string>(() => isoToLocalDatetime(jadwal?.end_date));
  const [details, setDetails] = useState<DetailRow[]>(() => (jadwal?.schedule_details ? jadwal.schedule_details.map(d => ({ ...d })) : []));

  useEffect(() => {
    setStartDateTime(isoToLocalDatetime(jadwal?.start_date));
    setEndDateTime(isoToLocalDatetime(jadwal?.end_date));
    setDetails(jadwal?.schedule_details ? jadwal.schedule_details.map(d => ({ ...d })) : []);
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

  const updateDetail = (index: number, patch: Partial<DetailRow>) => {
    setDetails(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
  };

  const addDetail = () => setDetails(prev => [...prev, { assessor_id: undefined, location: '' }]);
  const removeDetail = (index: number) => setDetails(prev => prev.filter((_, i) => i !== index));

  if (!jadwal) return null;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-lg w-full">
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
            // normalize details: convert assessor_id to number if present
            const normalized = details.map(d => ({
              ...(d.id ? { id: d.id } : {}),
              assessor_id: d.assessor_id ? Number(d.assessor_id) : undefined,
              location: d.location || ''
            }));
            onSave({ start_date: startIso, end_date: endIso, schedule_details: normalized });
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Rincian Jadwal (Ruang & Asesor)</label>
              <button type="button" onClick={addDetail} className="text-sm text-[#E77D35] hover:underline">+ Tambah Baris</button>
            </div>
            <div className="space-y-3">
              {details.length === 0 && <div className="text-sm text-gray-500">Belum ada rincian, tambahkan minimal satu baris jika diperlukan.</div>}
              {details.map((d, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <label className="text-xs text-gray-600">Assessor ID</label>
                    <input type="number" value={d.assessor_id ?? ''} onChange={e => updateDetail(idx, { assessor_id: e.target.value ? Number(e.target.value) : undefined })} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm" placeholder="Masukkan ID Assessor" />
                  </div>
                  <div className="col-span-6">
                    <label className="text-xs text-gray-600">Lokasi / Ruangan</label>
                    <input type="text" value={d.location ?? ''} onChange={e => updateDetail(idx, { location: e.target.value })} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm" placeholder="Contoh: Ruang 1" />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button type="button" onClick={() => removeDetail(idx)} className="text-sm text-red-600 hover:underline">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
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
