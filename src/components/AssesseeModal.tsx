import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '@/helper/axios';

interface AssesseeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assessee?: {
    id: number;
    email: string;
    assessee?: {
      id: number;
      full_name: string;
      identity_number: string;
      birth_date: string;
      birth_location: string;
      gender: string;
      nationality: string;
      phone_no: string;
      house_phone_no?: string;
      office_phone_no?: string;
      address: string;
      postal_code?: string;
      educational_qualifications: string;
    };
  } | null;
  mode: 'create' | 'edit';
}

const AssesseeModal: React.FC<AssesseeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assessee,
  mode
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    identity_number: '',
    birth_date: '',
    birth_location: '',
    gender: '',
    nationality: '',
    phone_no: '',
    house_phone_no: '',
    office_phone_no: '',
    address: '',
    postal_code: '',
    educational_qualifications: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && assessee) {
        setFormData({
          email: assessee.email,
          password: '',
          full_name: assessee.assessee?.full_name || '',
          identity_number: assessee.assessee?.identity_number || '',
          birth_date: assessee.assessee?.birth_date ? assessee.assessee.birth_date.split('T')[0] : '',
          birth_location: assessee.assessee?.birth_location || '',
          gender: assessee.assessee?.gender || '',
          nationality: assessee.assessee?.nationality || '',
          phone_no: assessee.assessee?.phone_no || '',
          house_phone_no: assessee.assessee?.house_phone_no || '',
          office_phone_no: assessee.assessee?.office_phone_no || '',
          address: assessee.assessee?.address || '',
          postal_code: assessee.assessee?.postal_code || '',
          educational_qualifications: assessee.assessee?.educational_qualifications || ''
        });
      } else {
        setFormData({
          email: '',
          password: '',
          full_name: '',
          identity_number: '',
          birth_date: '',
          birth_location: '',
          gender: '',
          nationality: '',
          phone_no: '',
          house_phone_no: '',
          office_phone_no: '',
          address: '',
          postal_code: '',
          educational_qualifications: ''
        });
      }
    }
  }, [isOpen, mode, assessee]);

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
        const response = await api.post('/user/assessee', formData);
        if (response.data.success) {
          onSuccess();
          onClose();
        }
      } else {
        // For edit mode, update user and assessee separately
        const userUpdateData: any = { email: formData.email };
        if (formData.password) {
          userUpdateData.password = formData.password;
        }

        await api.put(`/user/${assessee?.id}`, userUpdateData);
        
        if (assessee?.assessee) {
          const assesseeUpdateData = {
            full_name: formData.full_name,
            identity_number: formData.identity_number,
            birth_date: formData.birth_date,
            birth_location: formData.birth_location,
            gender: formData.gender,
            nationality: formData.nationality,
            phone_no: formData.phone_no,
            house_phone_no: formData.house_phone_no,
            office_phone_no: formData.office_phone_no,
            address: formData.address,
            postal_code: formData.postal_code,
            educational_qualifications: formData.educational_qualifications
          };
          await api.put(`/assessee/${assessee.assessee.id}`, assesseeUpdateData);
        }
        
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error saving assessee:', error);
      setError(error.response?.data?.message || 'Failed to save assessee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Buat Akun Asesi' : 'Edit Akun Asesi'}
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
            <div>
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

            {/* Identity Number */}
            <div>
              <label htmlFor="identity_number" className="block text-sm font-medium text-gray-700 mb-2">
                NIK *
              </label>
              <input
                type="text"
                id="identity_number"
                name="identity_number"
                value={formData.identity_number}
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

            {/* Birth Location */}
            <div>
              <label htmlFor="birth_location" className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Lahir *
              </label>
              <input
                type="text"
                id="birth_location"
                name="birth_location"
                value={formData.birth_location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                Kewarganegaraan *
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
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

            {/* House Phone */}
            <div>
              <label htmlFor="house_phone_no" className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon Rumah
              </label>
              <input
                type="tel"
                id="house_phone_no"
                name="house_phone_no"
                value={formData.house_phone_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Office Phone */}
            <div>
              <label htmlFor="office_phone_no" className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon Kantor
              </label>
              <input
                type="tel"
                id="office_phone_no"
                name="office_phone_no"
                value={formData.office_phone_no}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-transparent"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Pos
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
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

            {/* Educational Qualifications */}
            <div className="md:col-span-2">
              <label htmlFor="educational_qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                Kualifikasi Pendidikan *
              </label>
              <input
                type="text"
                id="educational_qualifications"
                name="educational_qualifications"
                value={formData.educational_qualifications}
                onChange={handleInputChange}
                required
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

export default AssesseeModal;
