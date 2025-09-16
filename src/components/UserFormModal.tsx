import React, { useState, useEffect } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/helper/axios';

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  role: Role;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  user?: UserData | null;
  roles: Role[];
  onSuccess: () => void;
}

interface FormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id: number | '';
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  user,
  roles,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
        password: '',
        confirmPassword: '',
        role_id: user.role.id
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: ''
      });
    }
    setError(null);
  }, [mode, user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role_id' ? (value ? Number(value) : '') : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setError('Nama lengkap harus diisi');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    
    if (!formData.role_id) {
      setError('Role harus dipilih');
      return false;
    }

    if (mode === 'create') {
      if (!formData.password) {
        setError('Password harus diisi');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password minimal 6 karakter');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok');
        return false;
      }
    }

    if (mode === 'edit' && formData.password) {
      if (formData.password.length < 6) {
        setError('Password minimal 6 karakter');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Password dan konfirmasi password tidak cocok');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const submitData: any = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        role_id: formData.role_id
      };

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }

      let response;
      if (mode === 'create') {
        response = await api.post('/user', submitData);
      } else {
        response = await api.put(`/user/${user?.id}`, submitData);
      }

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || `Gagal ${mode === 'create' ? 'menambah' : 'mengupdate'} pengguna`);
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err?.response?.data?.message || `Gagal ${mode === 'create' ? 'menambah' : 'mengupdate'} pengguna`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'Admin': 'Administrator',
      'Assessor': 'Asesor',
      'Assessee': 'Asesi'
    };
    return roleMap[roleName] || roleName;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              placeholder="Masukkan nama lengkap"
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              placeholder="Masukkan email"
              disabled={loading}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">Pilih Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {getRoleDisplayName(role.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {mode === 'create' && <span className="text-red-500">*</span>}
              {mode === 'edit' && <span className="text-gray-500">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
                placeholder="Masukkan password"
                disabled={loading}
                required={mode === 'create'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {(mode === 'create' || formData.password) && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
                  placeholder="Konfirmasi password"
                  disabled={loading}
                  required={mode === 'create' || !!formData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#E77D35] hover:bg-orange-600 rounded-md transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'create' ? 'Tambah Pengguna' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;