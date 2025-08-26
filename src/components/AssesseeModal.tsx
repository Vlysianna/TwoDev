import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@/helper/axios';

interface AssesseeData {
  id?: number;
  email?: string;
  full_name?: string; // Add this for user.full_name
  assessee?: {
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
  };
}

interface AssesseeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assessee: AssesseeData | null;
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
};

const AssesseeModal: React.FC<AssesseeModalProps> = ({ isOpen, onClose, onSuccess, assessee, mode }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessee && (mode === 'edit' || mode === 'show')) {
      setForm({
        ...initialForm,
        ...assessee.assessee,
        full_name: assessee.full_name || '',
        email: assessee.email || '',
      });
    } else {
      setForm(initialForm);
    }
    setError(null);
  }, [assessee, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'create') {
        await api.post('/user/assessee', form);
      } else if (mode === 'edit' && assessee) {
        await api.put(`/user/assessee/${assessee.id}`, form);
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
            {mode === 'create' && 'Buat Akun Asesi'}
            {mode === 'edit' && 'Edit Akun Asesi'}
            {mode === 'show' && 'Detail Akun Asesi'}
          </h2>
        </div>
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
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">Tutup</button>
            {mode !== 'show' && (
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default AssesseeModal;
