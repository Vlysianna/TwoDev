import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/SideAsesor';
import api from '@/helper/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    address: '',
    phone_no: '',
    birth_date: '',
    // assessor-specific
    institution: '',
    birth_location: '',
    no_reg_met: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, full_name: user.full_name || '', email: user.email || '' }));

    const load = async () => {
      try {
        const resp = await api.get('/assessor/user/' + user.id);
        if (resp.data?.success) {
          const data = resp.data.data;
          setForm((f) => ({
            ...f,
            address: data.address || '',
            phone_no: data.phone_no || '',
            birth_date: data.birth_date ? (data.birth_date.split ? data.birth_date.split('T')[0] : data.birth_date) : '',
            institution: data.institution || '',
            birth_location: data.birth_location || '',
            no_reg_met: data.no_reg_met || '',
          }));
        }
      } catch (err) {
        // ignore
      }
    };
    load();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: any = {
        full_name: form.full_name,
        email: form.email,
        address: form.address,
        phone_no: form.phone_no,
        birth_date: form.birth_date,
        institution: form.institution,
        birth_location: form.birth_location,
        no_reg_met: form.no_reg_met,
      };
      if (form.password && form.password.trim() !== '') payload.password = form.password;

      // server mounts assessor routes under /twodev/api/assessor
      const resp = await api.put('/assessor/profile/me', payload);
      if (resp.data?.success) {
        setSuccessMessage('Profil berhasil diperbarui');
        try { await checkAuth(); } catch (e) {}
        setTimeout(() => navigate('/asesor'), 800);
      } else {
        setErrorMessage(resp.data?.message || 'Gagal memperbarui profil');
      }
    } catch (err: any) {
      console.error('PUT /assessor/profile/me error', err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      setErrorMessage(data?.message ? `Error ${status}: ${data.message}` : `Request failed${status ? ` (status ${status})` : ''}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="p-4 font-bold text-lg flex items-center gap-2">
            <Settings size={22} /> Profil Asesor
          </div>
        </div>

        <main className="p-4 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Pengaturan Akun Asesor</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password (kosongkan jika tidak ingin mengubah)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input name="institution" value={form.institution} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
              <input name="birth_location" value={form.birth_location} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Reg MET</label>
              <input name="no_reg_met" value={form.no_reg_met} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon</label>
              <input name="phone_no" value={form.phone_no} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
              <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 text-sm">{successMessage}</div>}

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button type="button" onClick={() => navigate('/asesor')} className="px-4 py-2 border rounded">Batal</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
