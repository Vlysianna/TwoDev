import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavAdmin";
import Sidebar from "../../components/SideAdmin";
import axiosInstance from '@/helper/axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SchemeData {
  code: string;
  name: string;
}

export default function TambahSkemaSimple() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchemeData>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: SchemeData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

  const response = await axiosInstance.post('/schemes', data);
      
      if (response.data.success) {
        setSuccess('Skema berhasil ditambahkan!');
        reset();
        // Redirect to list after 2 seconds
        setTimeout(() => {
          navigate('/admin/kelola-skema');
        }, 2000);
      } else {
        setError(response.data.message || 'Gagal menambahkan skema');
      }
    } catch (error: unknown) {
      console.error('Error creating scheme:', error);
      setError('Gagal menambahkan skema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span>Kelola Skema</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Tambah Skema</span>
            </nav>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">{success}</span>
            </div>
          )}

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <form
              className="p-6 bg-white rounded-lg shadow space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Tambah Skema Baru</h1>
                <p className="text-gray-600 mt-1">Masukkan informasi skema sertifikasi baru</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kode Skema <span className="text-red-500">*</span>
                  </label>
                  <input 
                    {...register("code", { 
                      required: "Kode skema wajib diisi",
                      pattern: {
                        value: /^[A-Z0-9-]+$/,
                        message: "Kode skema hanya boleh berisi huruf kapital, angka, dan tanda hubung"
                      }
                    })} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                    placeholder="Contoh: RPL-2024"
                  />
                  {errors.code && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.code.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nama Skema <span className="text-red-500">*</span>
                  </label>
                  <input 
                    {...register("name", { 
                      required: "Nama skema wajib diisi",
                      minLength: {
                        value: 3,
                        message: "Nama skema minimal 3 karakter"
                      }
                    })} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none"
                    placeholder="Contoh: Rekayasa Perangkat Lunak"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#E77D35] text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Skema'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/kelola-skema')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
