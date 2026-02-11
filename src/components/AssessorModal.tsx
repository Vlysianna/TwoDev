import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@/helper/axios';
import type { Scheme } from '@/lib/types';
import AssessorDocumentsModal from './AssesorDocModal';
import { Download, Eye, FileText } from 'lucide-react';

interface AssessorData {
  id?: number;
  email?: string;
  full_name?: string; // Add this for user.full_name
  assessor?: {
    id?: number;
    full_name?: string;
    phone_no?: string;
    identity_number?: string;
    birth_date?: string;
    birth_location?: string;
    gender?: string;
    nationality?: string;
    house_phone_no?: string;
    office_phone_no?: string;
    address?: string;
    postal_code?: string;
    educational_qualifications?: string;
    scheme_id?: number;
  };
}

interface AssessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assessor: AssessorData | null;
  mode: 'create' | 'edit' | 'show';
}

const initialForm = {
  full_name: '',
  phone_no: '',
  identity_number: '',
  birth_date: '',
  birth_location: '',
  gender: '',
  nationality: '',
  house_phone_no: '',
  office_phone_no: '',
  address: '',
  postal_code: '',
  educational_qualifications: '',
  email: '',
  scheme: {
    id: 0,
    code: '',
    name: '',
  },
  no_reg_met: '',
  institution: '',
  documents: undefined,
};

const AssessorModal: React.FC<AssessorModalProps> = ({ isOpen, onClose, onSuccess, assessor, mode }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessorDetail, setAssessorDetail] = useState<any>(null);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);


  useEffect(() => {
    // When modal opens in edit/show mode, try to populate the form.
    // The parent may pass: a full user object with nested `assessor`, a partial assessor object
    // or only an id. To be robust we will fetch missing pieces from the API:
    // - try `/assessor/:id` and `/assessor-detail/:id` when we have an assessor id
    // - fallback to using provided data
    let cancelled = false;

    const load = async () => {
      setError(null);
      if (!assessor || (mode !== 'edit' && mode !== 'show')) {
        setForm(initialForm);
        setAssessorDetail(null);
        return;
      }

      setLoading(true);
      try {
        // start from nested assessor if present, otherwise from top-level assessor prop
        let nested: any = (assessor as any).assessor ? (assessor as any).assessor : assessor;

        // If nested is missing or has no assessor id, attempt to resolve using user id
        let assessorId: number | undefined = nested?.id;
        if (!assessorId) {
          const userId = (assessor as any).id;
          if (userId) {
            try {
              const res = await api.get(`/assessor/user/${userId}`);
              if (res?.data?.success) {
                nested = res.data.data;
                assessorId = nested?.id;
                if (nested.detail) {
                  setAssessorDetail(nested.detail);
                }
              }
            } catch (e) {
              // ignore and continue with whatever data we have
            }
          }
        }

        // If we have an assessor id, fetch base and detail records to enrich data
        if (assessorId) {
          try {
            const res = await api.get(`/assessor/${assessorId}`);
            if (res?.data?.success) {
              nested = res.data.data;
              // Set assessor detail
              if (nested.detail) {
                setAssessorDetail(nested.detail);
              }
            }
          } catch (e) {
            console.error('Error fetching assessor details:', e);
          }
        }

        const rawBirth = nested?.birth_date || '';
        const birth_date = rawBirth ? new Date(rawBirth).toISOString().split('T')[0] : '';

        // normalize gender for display
        let genderVal = nested?.gender || '';
        if (typeof genderVal === 'string') {
          const gv = genderVal.toLowerCase();
          if (gv === 'male' || gv === 'laki-laki' || gv.includes('laki')) genderVal = 'Laki-laki';
          else if (gv === 'female' || gv === 'perempuan' || gv.includes('perempuan')) genderVal = 'Perempuan';
        }

        if (!cancelled) {
          setForm({
            ...initialForm,
            ...nested,
            birth_date,
            gender: genderVal,
            full_name: (assessor as any).name || (assessor as any).full_name || nested.full_name || '',
            email: (assessor as any).email || nested.email || '',
            scheme_id: (assessor as any).scheme_id ? String((assessor as any).scheme_id) : (nested?.scheme_id ? String(nested.scheme_id) : ''),
            no_reg_met: (assessor as any).no_reg_met || nested?.no_reg_met || '',
            documents: (assessor as any).documents || nested?.documents || undefined,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError('Gagal memuat data asesor');
          setForm(initialForm);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [assessor, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { ...form };
      // map gender to API expected value
      if (payload.gender) {
        const g = String(payload.gender).toLowerCase();
        if (g.includes('laki')) payload.gender = 'male';
        else if (g.includes('perempuan')) payload.gender = 'female';
      }
      payload.scheme_id = Number(form.scheme.id);
      if (mode === 'create') {
        await api.post('/user/assessor', payload);
      } else if (mode === 'edit' && assessor) {
        await api.put(`/user/assessor/${assessor.id}`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'show';

  // Open document via authenticated request to avoid hitting JSON auth error responses
  const previewDocument = async (rawValue: any) => {
    if (!rawValue) return;
    setError(null);
    try {
      let url = '';
      const val = String(rawValue).trim();
      if (val.startsWith('http://') || val.startsWith('https://')) url = val;
      else if (val.startsWith('/')) url = `${import.meta.env.VITE_API_URL}${val}`;
      else url = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/uploads/${val}`;

      // Use axios to fetch with Authorization header and as blob
      const response = await api.get(url, { responseType: 'blob' });

      // If the server replied with JSON (e.g., auth error) the content-type may be application/json
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        // read blob as text and try to parse message
        const text = await response.data.text();
        let parsedMsg = 'Gagal memuat dokumen';
        try {
          const obj = JSON.parse(text);
          parsedMsg = obj?.message || JSON.stringify(obj);
        } catch (e) {
          parsedMsg = text;
        }
        setError(parsedMsg);
        return;
      }

      const blob = new Blob([response.data], { type: contentType || undefined });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      // optionally revoke after a timeout
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (err: any) {
      // If axios throws and provides response with JSON, try to surface its message
      const msg = err?.response?.data?.message || err?.message || 'Gagal memuat dokumen';
      setError(msg);
    }
  };


  // Add this function before your useEffect hooks
  const getSchemeName = () => {
    if (!form.scheme) return '-';
    return `${form.scheme.code} - ${form.scheme.name}`;
  };

  // Add this useEffect to fetch schemes data
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/schemes');
        if (response.data?.success) {
          setSchemes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-lg w-full">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="bg-[#E77D35] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {mode === 'create' && 'Buat Akun Asesor'}
              {mode === 'edit' && 'Edit Akun Asesor'}
              {mode === 'show' && 'Detail Akun Asesor'}
            </h2>
          </div>
          {mode === 'show' ? (
            <div className="p-6 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                  <div className="font-medium">{form.full_name || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="font-medium">{form.email || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">No. HP</div>
                  <div className="font-medium">{form.phone_no || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">No REG MET</div>
                  <div className="font-medium">{form.no_reg_met}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                  <div className="font-medium">{form.birth_location || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                  <div className="font-medium">{form.birth_date || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Kompetensi Keahlian</div>
                  <div className="font-medium">{getSchemeName()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Asal Institusi</div>
                  <div className="font-medium">{form.institution}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Alamat</div>
                  <div className="font-medium">{form.address || '-'}</div>
                </div>
              </div>
              {/* Tombol untuk membuka modal dokumen */}
              {assessorDetail && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowDocumentsModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Lihat Dokumen Asesor
                  </button>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="btn btn-ghost">Tutup</button>
              </div>
              {form.documents && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Dokumen</h3>
                  {(() => {
                    const entries = Object.entries(form.documents as Record<string, any>);
                    const filtered = entries.filter(([k, v]) => {
                      if (['id', 'assessor_id', 'created_at', 'updated_at'].includes(k)) return false;
                      if (v === null || v === undefined) return false;
                      if (typeof v === 'string' && v.trim() === '') return false;
                      return true;
                    });

                    if (filtered.length === 0) {
                      return <div className="text-sm text-gray-500">Tidak ada dokumen</div>;
                    }

                    return (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {filtered.map(([k, v]) => {
                          const label = k.replace(/_/g, ' ');
                          if (typeof v === 'string' && v.trim() !== '') {
                            const val = v.trim();
                            return (
                              <li key={k} className="flex items-center gap-2">
                                <span className="capitalize">{label}:</span>
                                <button type="button" onClick={() => previewDocument(val)} className="font-medium text-blue-600 underline">
                                  Preview
                                </button>
                                <span className="text-gray-500 text-xs">{`(${val.split('/').pop()})`}</span>
                              </li>
                            );
                          }

                          return (
                            <li key={k}>
                              <span className="capitalize">{label}:</span> <span className="font-medium">{String(v)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Nama Lengkap</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} readOnly={isReadOnly} required className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} readOnly={isReadOnly || mode === 'edit'} required className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">No. HP</label>
                  <input name="phone_no" value={form.phone_no} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">NIK</label>
                  <input name="identity_number" value={form.identity_number} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Tanggal Lahir</label>
                  <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Tempat Lahir</label>
                  <input name="birth_location" value={form.birth_location} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Jenis Kelamin</label>
                  <select name="gender" value={form.gender} onChange={handleChange} disabled={isReadOnly} className="input input-bordered w-full">
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Kewarganegaraan</label>
                  <input name="nationality" value={form.nationality} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">No. Telp Rumah</label>
                  <input name="house_phone_no" value={form.house_phone_no} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">No. Telp Kantor</label>
                  <input name="office_phone_no" value={form.office_phone_no} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1 text-gray-700">Alamat</label>
                  <input name="address" value={form.address} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Kode Pos</label>
                  <input name="postal_code" value={form.postal_code} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Pendidikan</label>
                  <input name="educational_qualifications" value={form.educational_qualifications} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Skema</label>
                  <input name="scheme_id" value={form.scheme.id} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" placeholder="ID Skema" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="btn btn-ghost">Tutup</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          )}
        </div>
      </BaseModal>
      <AssessorDocumentsModal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        assessorDetail={assessorDetail}
      />
    </>
  );
};

export default AssessorModal;
