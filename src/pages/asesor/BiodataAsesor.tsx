import React, { useState } from 'react';
import { ArrowLeft, Menu, Calendar, Upload, FileText } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';

export default function BiodataAsesor() {
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    tempatLahir: '',
    tanggalLahir: '',
    email: '',
    noRegMET: '',
    noTelp: '',
    catatan: ''
  });

  const [files, setFiles] = useState({
    npwp: null,
    coverBuku: null,
    sertifikatAsesor: null,
    pasFoto: null,
    ktp: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (fileType) => (e) => {
    const file = e.target.files[0];
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData, files);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAsesor 
        title="Biodata Asesor" 
        icon={<ArrowLeft size={20} />}
      />
      
      <div className="px-4 py-6">
        {/* Biodata Asesor Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Biodata Asesor</h2>
            <p className="text-gray-600 text-sm mb-6">
              Isi biodata Anda dengan akurat untuk memastikan proses sertifikasi yang lancar. Semua informasi akan
              digunakan semata-mata untuk keperluan administrasi dan verifikasi Uji Sertifikasi Kompetensi (USK).
            </p>

            {/* Form Grid - 2 Rows */}
            <div className="space-y-6">
              {/* First Row - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Second Row - Custom grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Tempat lahir - spans 4 columns */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tempat lahir</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    placeholder="Masukkan tempat lahir anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Pilih tanggal - spans 2 columns (shorter) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih tanggal</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      placeholder="Pilih tanggal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Email - spans 6 columns */}
                <div className="md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan email anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Third Row - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* No. Reg. MET */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. Reg. MET</label>
                  <input
                    type="text"
                    name="noRegMET"
                    value={formData.noRegMET}
                    onChange={handleInputChange}
                    placeholder="Masukkan no. reg anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* No. Telp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. Telp</label>
                  <input
                    type="tel"
                    name="noTelp"
                    value={formData.noTelp}
                    onChange={handleInputChange}
                    placeholder="Masukkan no. telp anda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bukti Administratif Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Bukti Administratif</h3>

              {/* Nomor Pokok Wajib Pajak (NPWP) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nomor Pokok Wajib Pajak (NPWP)
                </label>
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Browse File
                  </button>
                </div>
              </div>

              {/* Cover Buku Tabungan */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cover Buku Tabungan
                </label>
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Browse File
                  </button>
                </div>
              </div>

              {/* Sertifikat Asesor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sertifikat Asesor
                </label>
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Browse File
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kelengkapan Bukti Administratif Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Kelengkapan Bukti Administratif</h3>

              {/* Pas foto 3 x 4 latar belakang merah */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pas foto 3 x 4 latar belakang merah
                </label>
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Browse File
                  </button>
                </div>
              </div>

              {/* Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kartu Tanda Penduduk (KTP)/ Kartu keluarga (KK)
                </label>
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Upload className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Browse File
                  </button>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Catatan</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Catatan"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}