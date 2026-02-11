import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/SideAsesor';
import api from '@/helper/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import useToast from '@/components/ui/useToast';

const Profile: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

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
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messageShownRef = useRef<string | null>(null);
  useEffect(() => {
    if (location.state?.message && messageShownRef.current !== location.state.message) {
      messageShownRef.current = location.state.message;
      toast.show({
        description: location.state.message,
        type: 'info',
      });
    }
  }, [location.state?.message]);

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
          if (data.signature) {
            setExistingSignature(data.signature);
            setSignaturePreview(null);
          } else {
            setExistingSignature(null);
          }
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

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const previewUrl = URL.createObjectURL(file);
      setSignaturePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('address', form.address);
      formData.append('phone_no', form.phone_no);
      formData.append('birth_date', form.birth_date);
      formData.append('institution', form.institution);
      formData.append('birth_location', form.birth_location);
      formData.append('no_reg_met', form.no_reg_met);
      if (form.password && form.password.trim() !== '') {
        formData.append('password', form.password);
      }
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      // server mounts assessor routes under /twodev/api/assessor
      const resp = await api.put('/assessor/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (resp.data?.success) {
        setSuccessMessage('Profil berhasil diperbarui');
        try { 
          await checkAuth();
          await new Promise(resolve => setTimeout(resolve, 500));
          const maxRetries = 5;
          for (let i = 0; i < maxRetries; i++) {
            const verifyResponse = await api.get(`/auth/me?t=${Date.now()}`);
            if (verifyResponse.data?.success && verifyResponse.data.data?.signature) {
              const signature = verifyResponse.data.data.signature;
              if (signature && typeof signature === 'string' && signature.trim().length > 0) {
                await checkAuth();
                break;
              }
            }
            if (i < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, 400));
            }
          }
          
          const redirectTo = location.state?.from || '/asesor';
          await new Promise(resolve => setTimeout(resolve, 200));
          navigate(redirectTo);
        } catch (e) {
          setTimeout(() => {
            const redirectTo = location.state?.from || '/asesor';
            navigate(redirectTo);
          }, 1500);
        }
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
            <div>
              <label className="block text-sm font-medium mb-1">Tanda Tangan <span className="text-red-500">*</span></label>
              <input 
                type="file" 
                accept="image/png,image/jpeg,image/jpg" 
                onChange={handleSignatureChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {(signaturePreview || existingSignature) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <div className="w-40 h-40 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
                    <img
                      src={signaturePreview || (() => {
                        if (!existingSignature) return '';
                        if (existingSignature.startsWith('http://') || existingSignature.startsWith('https://')) {
                          return existingSignature;
                        }
                        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/twodev/api').replace(/\/$/, '');
                        const path = existingSignature.startsWith('/') ? existingSignature.slice(1) : existingSignature;
                        return `${baseUrl}/${path}`;
                      })()}
                      alt="Tanda Tangan"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.error('Error loading signature image:', existingSignature);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
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
