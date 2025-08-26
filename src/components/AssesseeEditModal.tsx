import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@/helper/axios';

interface AssesseeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assesseeId: number | null;
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

const AssesseeEditModal: React.FC<AssesseeEditModalProps> = ({ isOpen, onClose, onSuccess, assesseeId }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && assesseeId) {
      fetchAssessee();
    } else {
      setForm(initialForm);
      setError(null);
    }
    // eslint-disable-next-line
  }, [isOpen, assesseeId]);

  const fetchAssessee = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/user/${assesseeId}`);
      if (res?.data?.success) {
        const user = res.data.data;
        setForm({
          ...initialForm,
          ...user.assessee,
          email: user.email || '',
          full_name: user.full_name || user.assessee?.full_name || '',
        });
      } else {
        setError(res?.data?.message || 'Gagal memuat data asesi');
      }
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal memuat data asesi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.put(`/user/assessee/${assesseeId}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} widthClass="max-w-lg w-full">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="bg-[#E77D35] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Edit Akun Asesi</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Nama Lengkap</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} readOnly required className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">No. HP</label>
              <input name="phone_no" value={form.phone_no} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">NIK</label>
              <input name="identity_number" value={form.identity_number} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Tanggal Lahir</label>
              <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Tempat Lahir</label>
              <input name="birth_location" value={form.birth_location} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Jenis Kelamin</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="input input-bordered w-full">
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Kewarganegaraan</label>
              <input name="nationality" value={form.nationality} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">No. Telp Rumah</label>
              <input name="house_phone_no" value={form.house_phone_no} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">No. Telp Kantor</label>
              <input name="office_phone_no" value={form.office_phone_no} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-gray-700">Alamat</label>
              <input name="address" value={form.address} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Kode Pos</label>
              <input name="postal_code" value={form.postal_code} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Pendidikan</label>
              <input name="educational_qualifications" value={form.educational_qualifications} onChange={handleChange} className="input input-bordered w-full" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">Tutup</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default AssesseeEditModal;
