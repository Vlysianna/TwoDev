


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
// import NavbarAsesor from '@/components/NavbarAsesor';
import { useBiodataAdminCheck } from '@/hooks/useBiodataAdminCheck';

const BioDataAdmin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCheckingBiodata, biodataComplete, refreshBiodataCheck } = useBiodataAdminCheck();
  const [formData, setFormData] = useState({
    address: '',
    phone_no: '',
    birth_date: '',
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  useEffect(() => {
    // If biodata already complete, redirect away and don't load form
    if (!isCheckingBiodata && biodataComplete === true) {
      navigate('/admin', { replace: true });
      return;
    }

    const load = async () => {
      if (!user) return;
      try {
        const resp = await api.get('/admins');
        if (resp.data?.success) {
          const list = resp.data.data;
          let admin: any = null;
          if (Array.isArray(list)) {
            admin = list.find((a: any) => String(a.user_id) === String(user.id) || (a.user && String(a.user.id) === String(user.id)));
          } else {
            const d = resp.data.data;
            if (d && (String(d.user_id) === String(user.id) || (d.user && String(d.user.id) === String(user.id)))) {
              admin = d;
            }
          }
          if (admin) {
            setFormData({
              address: admin.address || '',
              phone_no: admin.phone_no || '',
              birth_date: admin.birth_date ? admin.birth_date.split('T')[0] : '',
            });
          }
        }
      } catch (error) {
        // New user, keep form empty
      }
    };
    load();
  }, [user]);

  // If check in progress, optionally render a loading state (handled in return)

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setRedirectMessage((location.state as any).message);
      const timer = setTimeout(() => {
        setRedirectMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isCheckingBiodata && biodataComplete) {
      navigate('/admin', { replace: true });
    }
  }, [isCheckingBiodata, biodataComplete, navigate]);

  const isFormValid = () => {
    return (
      formData.address.trim() !== '' &&
      formData.phone_no.trim() !== '' &&
      formData.birth_date.trim() !== ''
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!isFormValid()) {
      setErrorMessage('Mohon lengkapi semua kolom yang wajib diisi.');
      setSaving(false);
      return;
    }
      try {
        const payload = {
          address: formData.address,
          phone_no: formData.phone_no,
          birth_date: formData.birth_date,
        };
        // Backend expects user_id in the create payload for /admins
        const response = await api.post('/admins', {
          ...payload,
          user_id: user.id,
        });
      if (response.data?.success) {
        setSuccessMessage('Biodata berhasil disimpan');
        await refreshBiodataCheck();
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setErrorMessage('Gagal menyimpan biodata');
      }
    } catch (error) {
      setErrorMessage('Gagal menyimpan biodata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="p-4 font-bold text-lg flex items-center gap-2">
            <FileText size={25} /> Biodata Admin
          </div>
        </div>
        <main className="p-4 max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Lengkapi Biodata Admin</h2>
          {redirectMessage && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
              {redirectMessage}
            </div>
          )}
          {isCheckingBiodata && (
            <div className="mb-4 p-4 bg-gray-100 rounded text-gray-700">Memeriksa biodata...</div>
          )}
          {biodataComplete === true && !isCheckingBiodata && (
            <div className="mb-4 p-4 bg-green-50 rounded text-green-700">Biodata sudah terisi. Mengalihkan...</div>
          )}
          {biodataComplete === false && !isCheckingBiodata && (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alamat <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Lahir <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-600 text-sm">{successMessage}</div>
            )}
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Biodata'}
            </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default BioDataAdmin;