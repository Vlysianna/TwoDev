import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import { formatDate } from "@/helper/format-date";
import { Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import api from '@/helper/axios';

interface JadwalViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jadwal?: {
    id: number;
    start_date?: string | null;
    end_date?: string | null;
      assessment: {
      id: number;
      code?: string | null;
      occupation: {
        id: number;
        name: string;
        scheme: { id: number; code?: string | null; name: string };
      };
    };
    schedule_details?: Array<{
      id: number;
      assessor?: { id: number; full_name: string; phone_no?: string } | null;
      location?: string | null;
      on_going?: any;
    }>;
  };
}

const JadwalViewModal: React.FC<JadwalViewModalProps> = ({ isOpen, onClose, jadwal }) => {
  const [detail, setDetail] = useState<typeof jadwal | null>(jadwal || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!jadwal) return;
      // only fetch when modal is open
      if (!isOpen) return;
      // if schedule_details already present, use as-is
      if (jadwal.schedule_details && jadwal.schedule_details.length > 0) {
        setDetail(jadwal);
        return;
      }

      // otherwise fetch full detail by id
      try {
        setLoading(true);
        setError(null);
        const resp = await api.get(`/schedules/${jadwal.id}`);
        if (!mounted) return;
        if (resp.data && resp.data.success) {
          // resp.data.data may be object or array; handle both
          const data = Array.isArray(resp.data.data) ? resp.data.data[0] : resp.data.data;
          setDetail(data);
        } else {
          setError(resp.data?.message || 'Gagal mengambil detail jadwal');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Gagal mengambil detail jadwal');
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [jadwal, isOpen]);

  if (!jadwal && !detail) return null;
  const display = detail ?? jadwal;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} widthClass="lg:max-w-lg xl:max-w-3xl w-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="bg-[#E77D35] px-14 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Detail Jadwal Asesmen</h2>
              <div className="text-base md:text-lg text-orange-100/90 mt-1">{display?.assessment.occupation.scheme.name} {display?.assessment.occupation.scheme?.code ? `(${display.assessment.occupation.scheme.code})` : ''}</div>
            </div>
            <div className="text-right text-sm text-orange-100">
              {display?.assessment.code && <div className="font-medium">{display.assessment.code}</div>}
              <div className="flex items-center gap-2 text-sm md:text-base mt-1"><Calendar size={16} /> <span>{display?.start_date ? formatDate(display.start_date) : '-'}</span></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <div className="font-medium">Okupasi</div>
              <div className="text-gray-600 font-medium">{display?.assessment.occupation.name}</div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Calendar size={16} className="text-gray-500" />
              <div className="text-gray-600 text-sm md:text-base">{display?.start_date ? formatDate(display.start_date) : '-'} — {display?.end_date ? formatDate(display.end_date) : '-'}</div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 size={16} className="animate-spin" /> Mengambil rincian jadwal...
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (detail && detail.schedule_details && detail.schedule_details.length > 0) ? (
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3">Rincian Ruang & Asesor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-h-120 overflow-auto">
                {detail.schedule_details.map((d) => (
                  <div key={d.id} className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50 shadow-sm md:flex-col">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border">
                      <div className="text-base md:text-lg font-bold text-gray-700">{(d.assessor?.full_name || 'T').split(' ').map((s: string) => s[0]).slice(0,2).join('')}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base md:text-lg font-semibold text-gray-800 break-words whitespace-normal">{d.assessor?.full_name || 'Tanpa Asesor'}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 flex-wrap">
                        <a className="inline-flex items-center text-sm text-orange-600 hover:underline mt-2" href={d.assessor?.phone_no ? `tel:${d.assessor.phone_no}` : '#'} onClick={(e) => { if(!d.assessor?.phone_no) e.preventDefault(); }}>
                          <Phone size={14} />
                          <span className="font-medium ml-1">{d.assessor?.phone_no || 'Tidak ada nomor'}</span>
                        </a>
                        <div className="inline-flex items-center text-sm mt-1">
                          <MapPin size={14} />
                          <span className="ml-1 text-gray-700">{d.location || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Tidak ada rincian ruang/asesor untuk jadwal ini.</div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default JadwalViewModal;
