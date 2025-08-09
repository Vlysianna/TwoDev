import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import Sidebar from '@/components/ui/SideAdmin';
import Navbar from '@/components/ui/NavAdmin';

interface FormData {
  nama: string;
  noKTPNIKPasport: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  kewarganegaraan: string;
  provinsi: string;
  noTeleponRumah: string;
  kota: string;
  noHP: string;
  noTeleponKantor: string;
  alamat: string;
  kodePos: string;
  namaInstansiPerusahaan: string;
  noTeleponInstansi: string;
  bidangPekerjaan: string;
  jabatan: string;
  noTeleponBidang: string;
  alamatKantor: string;
  kodePosKantor: string;
  email: string;
  jenjangPendidikan: string;
  instansi: string;
  tahunLulus: string;
}

const EditAsesor: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    noKTPNIKPasport: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    kewarganegaraan: '',
    provinsi: '',
    noTeleponRumah: '',
    kota: '',
    noHP: '',
    noTeleponKantor: '',
    alamat: '',
    kodePos: '',
    namaInstansiPerusahaan: '',
    noTeleponInstansi: '',
    bidangPekerjaan: '',
    jabatan: '',
    noTeleponBidang: '',
    alamatKantor: '',
    kodePosKantor: '',
    email: '',
    jenjangPendidikan: '',
    instansi: '',
    tahunLulus: '',
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
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Akun Asesor</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Edit Asesor</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-[26px] font-semibold text-gray-900">Edit Akun Asesor</h1>
          </div>

          <div className="space-y-8">
            {/* Main Content Box */}
            <div className="bg-white rounded-lg p-6 space-y-8">
              {/* Akun Asesor Section */}
              <div>
                <h2 className="text-[26px] font-medium text-gray-900 mb-2">Akun Asesor</h2>
              </div>

              <hr className='text-gray-300' />

              {/* Data Pribadi Section */}
              <div>
                <h2 className="text-[26px] font-medium text-gray-900 mb-2">Data Pribadi</h2>
              <br></br>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  {/* Nama */}
                  <div className="md:col-span-4">
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

                  {/* No. KTP/NIK/Pasport */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. KTP/NIK/Pasport
                    </label>
                    <input
                      type="text"
                      name="noKTPNIKPasport"
                      value={formData.noKTPNIKPasport}
                      onChange={handleInputChange}
                      placeholder="Masukkan nomor identitas anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Tempat lahir */}
                  <div className="md:col-span-3">
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

                  {/* Tanggal lahir */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal lahir
                    </label>
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Jenis kelamin */}
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telp Kantor
                    </label>
                    <input
                      type="tel"
                      name="noTeleponRumah"
                      value={formData.noTeleponRumah}
                      onChange={handleInputChange}
                      placeholder="Masukkan no. telp kantor anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Kota */}
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telp Rumah
                    </label>
                    <input
                      type="tel"
                      name="noTeleponKantor"
                      value={formData.noTeleponKantor}
                      onChange={handleInputChange}
                      placeholder="Masukkan no. telp rumah anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Alamat */}
                  <div className="md:col-span-4">
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
                  <div className="md:col-span-2">
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
                </div>
              </div>

              <hr className='text-gray-300' />

              {/* Data Pekerjaan Section */}
              <div>
                <h2 className="text-[26px] font-medium text-gray-900 mb-2">Data Pekerjaan</h2>
              <br></br>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  {/* Nama instansi / Perusahaan */}
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Institusi / Perusahaan
                    </label>
                    <input
                      type="text"
                      name="namaInstansiPerusahaan"
                      value={formData.namaInstansiPerusahaan}
                      onChange={handleInputChange}
                      placeholder="Masukkan institusi atau perusahaan anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* No. Telp Rumah */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telp Rumah
                    </label>
                    <input
                      type="tel"
                      name="noTeleponInstansi"
                      value={formData.noTeleponInstansi}
                      onChange={handleInputChange}
                      placeholder="Masukkan no. telp rumah anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Bidang pekerjaan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bidang pekerjaan
                    </label>
                    <select
                      name="bidangPekerjaan"
                      value={formData.bidangPekerjaan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Masukkan bidang anda</option>
                      <option value="Teknologi Informasi">Teknologi Informasi</option>
                      <option value="Keuangan">Keuangan</option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Manufaktur">Manufaktur</option>
                    </select>
                  </div>

                  {/* Jabatan */}
                  <div className="md:col-span-2">
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

                  {/* No. Telp Kantor */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Telp Kantor
                    </label>
                    <input
                      type="tel"
                      name="noTeleponBidang"
                      value={formData.noTeleponBidang}
                      onChange={handleInputChange}
                      placeholder="Masukkan no. telp kantor anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Alamat Kantor */}
                  <div className="md:col-span-3">
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

                  {/* Kode pos */}
                  <div className="md:col-span-1">
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

                  {/* Email */}
                  <div className="md:col-span-2">
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
                </div>
              </div>

              <hr className='text-gray-300' />

              {/* Kualifikasi Pendidikan Section */}
              <div>
                <h2 className="text-[26px] font-medium text-gray-900 mb-2">Kualifikasi Pendidikan</h2>
              <br></br>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  {/* Jenjang Pendidikan */}
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenjang Pendidikan
                    </label>
                    <select
                      name="jenjangPendidikan"
                      value={formData.jenjangPendidikan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Jenjang Pendidikan</option>
                      <option value="SMP">SMP</option>
                      <option value="SMASederajat">SMA/Sederajat</option>
                      <option value="S1">S1</option>
                    </select>
                  </div>

                  {/* Instansi */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instansi
                    </label>
                    <input
                      type="text"
                      name="instansi"
                      value={formData.instansi}
                      onChange={handleInputChange}
                      placeholder="Masukkan instansi anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Tahun Lulus */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Lulus
                    </label>
                    <input
                      type="text"
                      name="tahunLulus"
                      value={formData.tahunLulus}
                      onChange={handleInputChange}
                      placeholder="Masukkan tahun lulus anda"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#E77D35] hover:bg-orange-500 text-white font-normal w-[168px] h-[41px] rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditAsesor;