import React, { useState } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import NavbarAsesi from '../../components/NavbarAsesi';

export default function AplZeroOne() {
  const [formData, setFormData] = useState({
    // Data Pribadi
    nama: '',
    noKTPNIK: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    kewarganegaraan: '',
    provinsi: '',
    noTelpKantor: '',
    kota: '',
    noHP: '',
    noTelpRumah: '',
    alamat: '',
    kodePos: '',

    // Data Pekerjaan
    namaInstitusi: '',
    noTelpRumahPekerjaan: '',
    bidangPekerjaan: '',
    jabatan: '',
    noTelpKantorPekerjaan: '',
    alamatKantor: '',
    kodePosKantor: '',
    email: '',

    // Data Kualfikasi Pendidikan
    kualifikasiPendidikan: '',
    instansi: '',
    tahunLulus: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form berhasil disubmit! Check console untuk melihat data.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <NavbarAsesi title='Permohonan Sertifikasi Kompetensi' icon={<FileText size={20} />} />
        </div>

        <div className="space-y-8 px-4 sm:px-6 lg:px-8 xl:px-40 py-4 sm:py-8 ">
          {/* Data Pribadi Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">Data Pribadi</h2>
            <p className="text-gray-600 text-sm mb-6">
              Isi biodata Anda dengan akurat untuk memastikan proses sertifikasi yang lancar.
              Semua informasi akan digunakan semata-mata untuk keperluan administrasi dan
              verifikasi Uji Sertifikasi Kompetensi (USK).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Nama */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* No. KTP/NIK/Paspor */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. KTP/NIK/Paspor
                </label>
                <input
                  type="text"
                  name="noKTPNIK"
                  value={formData.noKTPNIK}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor identitas anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tempat lahir */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat lahir
                </label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleInputChange}
                  placeholder="Masukkan tempat lahir anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Select date */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal lahir
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Jenis kelamin */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis kelamin
                </label>
                <div className="flex gap-4 align-middle">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Laki-laki"
                      checked={formData.jenisKelamin === 'Laki-laki'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Laki - Laki</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="Perempuan"
                      checked={formData.jenisKelamin === 'Perempuan'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Kewarganegaraan */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kewarganegaraan
                </label>
                <select
                  name="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Masukkan negara anda</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Thailand">Thailand</option>
                </select>
              </div>

              {/* Provinsi */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi
                </label>
                <select
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Masukkan provinsi anda</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                </select>
              </div>

              {/* No. Telp Kantor */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telp Kantor
                </label>
                <input
                  type="tel"
                  name="noTelpKantor"
                  value={formData.noTelpKantor}
                  onChange={handleInputChange}
                  placeholder="Masukkan no. telp kantor anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kota */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota
                </label>
                <select
                  name="kota"
                  value={formData.kota}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Masukkan kota anda</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Medan">Medan</option>
                </select>
              </div>

              {/* No. HP */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. HP
                </label>
                <input
                  type="tel"
                  name="noHP"
                  value={formData.noHP}
                  onChange={handleInputChange}
                  placeholder="Masukkan no. telp anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* No. Telp Rumah */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telp Rumah
                </label>
                <input
                  type="tel"
                  name="noTelpRumah"
                  value={formData.noTelpRumah}
                  onChange={handleInputChange}
                  placeholder="Masukkan no. telp rumah anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Alamat */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat anda"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kode pos */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode pos
                </label>
                <input
                  type="text"
                  name="kodePos"
                  value={formData.kodePos}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode pos anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className='sm:col-span-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kualifikasi Pendidikan
                </label>
                <select
                  name="kualifikasiPendidikan"
                  value={formData.kualifikasiPendidikan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Kualifikasi Pendidikan</option>
                  <option value="SMP">SMP</option>
                  <option value="SMASederajat">SMA/Sederajat</option>
                  <option value="S1">S1</option>
                </select>
              </div>
            </div>
          </div>

          <hr className='text-gray-300' />

          {/* Data Pekerjaan Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Pekerjaan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Informasi ini penting untuk mencocokkan profil Anda dengan skema Uji Sertifikasi
              Kompetensi (USK) dan tim penilai yang tepat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Nama Institusi / Perusahaan */}
              <div className='sm:col-span-2'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Institusi / Perusahaan
                </label>
                <input
                  type="text"
                  name="namaInstitusi"
                  value={formData.namaInstitusi}
                  onChange={handleInputChange}
                  placeholder="Masukkan institusi atau perusahaan anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className='sm:col-span-1'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Jabatan */}
              <div className='sm:col-span-1'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  placeholder="Masukkan jabatan anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kode pos */}
              <div className='sm:col-span-1'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode pos
                </label>
                <input
                  type="text"
                  name="kodePosKantor"
                  value={formData.kodePosKantor}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode pos anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* No. Telp Kantor */}
              <div className='sm:col-span-1'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telp Kantor
                </label>
                <input
                  type="tel"
                  name="noTelpKantorPekerjaan"
                  value={formData.noTelpKantorPekerjaan}
                  onChange={handleInputChange}
                  placeholder="Masukkan no. telp kantor anda"
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Alamat Kantor */}
              <div className='sm:col-span-2 lg:col-span-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Kantor
                </label>
                <textarea
                  name="alamatKantor"
                  value={formData.alamatKantor}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat kantor anda"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

            </div>
          </div>

          <hr className='text-gray-300' />

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#E77D35] hover:bg-orange-600 text-white font-normal py-2 px-8 sm:px-16 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}