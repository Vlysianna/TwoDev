import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../../components/NavAdmin"
import Sidebar from "../../components/SideAdmin"
import axiosInstance from '@/helper/axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SchemeData {
  code: string;
  name: string;
}

export default function TambahSkema() {
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
      {/* Sidebar - Fixed width dan fixed position */}
      <div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 md:ml-0">
        {/* Navbar - Sticky di atas */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Konten Utama */}
        <div className="p-6">
          <form
            className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-2xl font-bold">Tambah Skema</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Skema</label>
                <input {...register("code", { required: true })} className="w-full border rounded px-3 py-2" />
                {errors.code && <span className="text-red-500 text-xs">Nomor Skema wajib diisi</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Judul Skema</label>
                <input {...register("name", { required: true })} className="w-full border rounded px-3 py-2" />
                {errors.name && <span className="text-red-500 text-xs">Judul Skema wajib diisi</span>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">File Unit</label>
              <div className="flex w-full max-w-md">
                <label className="flex items-center px-4 py-2 bg-[#E77D35] text-white rounded-l cursor-not-allowed opacity-60">
                  Pilih File
                  <input
                    type="file"
                    accept=".docx"
                    disabled
                    className="hidden"
                  />
                </label>
                <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-r text-sm">
                  (Fitur upload file unit belum tersedia)
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="flex items-center bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-2">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center bg-green-50 border border-green-200 text-green-800 rounded p-3 mb-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{success}</span>
              </div>
            )}
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="w-full text-white px-4 py-2 rounded"
                style={{ backgroundColor: "#E77D35" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#cf6e2f")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#E77D35")}
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Skema'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}