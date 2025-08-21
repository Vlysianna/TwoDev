import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@/helper/axios';

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
  scheme_id: '',
};

const AssessorModal: React.FC<AssessorModalProps> = ({ isOpen, onClose, onSuccess, assessor, mode }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessor && (mode === 'edit' || mode === 'show')) {
      setForm({
        ...initialForm,
        ...assessor.assessor,
        full_name: assessor.full_name || '',
        email: assessor.email || '',
        scheme_id: assessor.assessor?.scheme_id ? String(assessor.assessor.scheme_id) : '',
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [assessor, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'create') {
        await api.post('/user/assessor', { ...form, scheme_id: Number(form.scheme_id) });
      } else if (mode === 'edit' && assessor) {
        await api.put(`/user/assessor/${assessor.id}`, { ...form, scheme_id: Number(form.scheme_id) });
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

  return (
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
                <div className="text-xs text-gray-500 mb-1">NIK</div>
                <div className="font-medium">{form.identity_number || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                <div className="font-medium">{form.birth_date || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                <div className="font-medium">{form.birth_location || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Jenis Kelamin</div>
                <div className="font-medium">{form.gender || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                <div className="font-medium">{form.nationality || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">No. Telp Rumah</div>
                <div className="font-medium">{form.house_phone_no || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">No. Telp Kantor</div>
                <div className="font-medium">{form.office_phone_no || '-'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-gray-500 mb-1">Alamat</div>
                <div className="font-medium">{form.address || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Kode Pos</div>
                <div className="font-medium">{form.postal_code || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Pendidikan</div>
                <div className="font-medium">{form.educational_qualifications || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Skema</div>
                <div className="font-medium">{form.scheme_id || '-'}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn btn-ghost">Tutup</button>
            </div>
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
                <input name="email" value={form.email} onChange={handleChange} readOnly={isReadOnly || mode==='edit'} required className="input input-bordered w-full" />
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
                <input name="scheme_id" value={form.scheme_id} onChange={handleChange} readOnly={isReadOnly} className="input input-bordered w-full" placeholder="ID Skema" />
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
  );
};

export default AssessorModal;
