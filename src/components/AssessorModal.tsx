import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '@/helper/axios';

interface Scheme {
  id: number;
  code: string;
  name: string;
}

interface AssessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assessor?: {
    id: number;
    email: string;
    full_name?: string;
    assessor?: {
      id: number;
      full_name: string;
      scheme_id: number;
      address: string;
      phone_no: string;
      birth_date: string;
    };
  } | null;
  mode: 'create' | 'edit';
}

const AssessorModal: React.FC<AssessorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assessor,
  mode
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    scheme_id: '',
    address: '',
    phone_no: '',
    birth_date: ''
  });
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSchemes();
      if (mode === 'edit' && assessor) {
        setFormData({
          email: assessor.email,
          password: '',
          full_name: assessor.assessor?.full_name || (assessor.full_name as string) || '',
          scheme_id: assessor.assessor?.scheme_id?.toString() || '',
          address: assessor.assessor?.address || '',
          phone_no: assessor.assessor?.phone_no || '',
          birth_date: assessor.assessor?.birth_date ? assessor.assessor.birth_date.split('T')[0] : ''
        });
      } else {
        setFormData({
          email: '',
          password: '',
          full_name: '',
          scheme_id: '',
          address: '',
          phone_no: '',
          birth_date: ''
        });
      }
    }
  }, [isOpen, mode, assessor]);

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/scheme');
      if (response.data.success) {
        setSchemes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        const response = await api.post('/user/assessor', formData);
        if (response.data.success) {
          onSuccess();
          onClose();
        }
      } else {
  // For edit mode, update user and assessor separately
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userUpdateData: any = { email: formData.email };
        if (formData.password) {
          userUpdateData.password = formData.password;
        }

        await api.put(`/user/${assessor?.id}`, userUpdateData);
        
        if (assessor?.assessor) {
          const assessorUpdateData = {
            full_name: formData.full_name,
            scheme_id: parseInt(formData.scheme_id),
            address: formData.address,
            phone_no: formData.phone_no,
            birth_date: formData.birth_date
          };
          await api.put(`/assessor/${assessor.assessor.id}`, assessorUpdateData);
        }
        
        onSuccess();
        onClose();
      }
    } catch (error: unknown) {
      console.error('Error saving assessor:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((error as any)?.response?.data?.message || 'Failed to save assessor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/5">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Buat Akun Assessor' : 'Edit Akun Assessor'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password {mode === 'create' ? '*' : '(Leave empty to keep current)'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={mode === 'create'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Scheme */}
            <div>
              <label htmlFor="scheme_id" className="block text-sm font-medium text-gray-700 mb-2">
                Skema *
              </label>
              <select
                id="scheme_id"
                name="scheme_id"
                value={formData.scheme_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              >
                <option value="">Pilih Skema</option>
                {schemes.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.code} - {scheme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon *
              </label>
              <input
                type="tel"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#E77D35] text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessorModal;
