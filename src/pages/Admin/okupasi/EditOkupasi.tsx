import React, { useState, useEffect } from 'react';
import { Search, Save, Bell, Calendar, Plus } from 'lucide-react';
import Sidebar from '@/components/SideAdmin';
import { useParams, useNavigate } from 'react-router-dom';

interface FormData {
  pilihSkema: string;
  dataAsessor: string;
  namaOkupasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tempatKompetensi: string;
}

interface OkupasiData {
  id: number;
  namaOkupasi: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

const EditOkupasi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    pilihSkema: '',
    dataAsessor: '',
    namaOkupasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    tempatKompetensi: ''
  });

  // Mock data untuk okupasi (dalam aplikasi nyata, ini akan diambil dari API)
  const okupasiData: OkupasiData[] = [
    {
      id: 1,
      namaOkupasi: 'Pemrogram Junior',
      deskripsi: 'RPL',
      tanggalMulai: '2025-07-22',
      tanggalSelesai: '2025-07-23'
    },
    {
      id: 2,
      namaOkupasi: 'Network Administrator',
      deskripsi: 'TKJ',
      tanggalMulai: '2025-07-24',
      tanggalSelesai: '2025-07-25'
    },
    {
      id: 3,
      namaOkupasi: 'Multimedia Designer',
      deskripsi: 'Multimedia',
      tanggalMulai: '2025-07-26',
      tanggalSelesai: '2025-07-27'
    },
    {
      id: 4,
      namaOkupasi: 'Web Developer',
      deskripsi: 'RPL',
      tanggalMulai: '2025-07-28',
      tanggalSelesai: '2025-07-29'
    },
    {
      id: 5,
      namaOkupasi: 'System Analyst',
      deskripsi: 'TKJ',
      tanggalMulai: '2025-07-30',
      tanggalSelesai: '2025-07-31'
    },
    {
      id: 6,
      namaOkupasi: 'UI/UX Designer',
      deskripsi: 'Multimedia',
      tanggalMulai: '2025-08-01',
      tanggalSelesai: '2025-08-02'
    }
  ];

  useEffect(() => {
    // Load data okupasi berdasarkan ID
    if (id) {
      const okupasi = okupasiData.find(item => item.id === parseInt(id));
      if (okupasi) {
        setFormData({
          pilihSkema: okupasi.deskripsi.toLowerCase(),
          dataAsessor: 'asessor1', // Default atau data dari server
          namaOkupasi: okupasi.namaOkupasi,
          tanggalMulai: okupasi.tanggalMulai,
          tanggalSelesai: okupasi.tanggalSelesai,
          tempatKompetensi: 'Lab Komputer SMK Negeri 1' // Default atau data dari server
        });
      }
    }
  }, [id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form updated:', { id, ...formData });
    // Add form update logic here
    // Redirect back to kelola okupasi after successful update
    navigate('/okupasi');
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleAddAsessor = () => {
    console.log('Add new asessor clicked');
    // Add logic to handle adding new asessor
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 lg:px-6 lg:py-4 ml-0 lg:ml-0">
            <div className="flex items-center justify-end">
              <div className="ml-12 lg:ml-0 flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Notification Bell */}
                <button
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative"
                  title="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Admin User</span>
                    <span className="text-xs text-gray-500">admin@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Breadcrumb & Title */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>Kelola Okupasi</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Edit Okupasi</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Okupasi</h1>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Data Okupasi */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Okupasi</h2>
                  
                  {/* Pilih Skema */}
                  <div className="mb-6">
                    <label htmlFor="pilihSkema" className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Skema
                    </label>
                    <select
                      id="pilihSkema"
                      name="pilihSkema"
                      value={formData.pilihSkema}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Pilih Skema</option>
                      <option value="rpl">RPL (Rekayasa Perangkat Lunak)</option>
                      <option value="tkj">TKJ (Teknik Komputer Jaringan)</option>
                      <option value="multimedia">Multimedia</option>
                    </select>
                  </div>

                  {/* Nama Okupasi */}
                  <div className="mb-6">
                    <label htmlFor="namaOkupasi" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Okupasi
                    </label>
                    <input
                      type="text"
                      id="namaOkupasi"
                      name="namaOkupasi"
                      value={formData.namaOkupasi}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama okupasi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date Range - Tanggal Mulai and Tanggal Selesai */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Tanggal Mulai */}
                    <div>
                      <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Mulai
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="tanggalMulai"
                          name="tanggalMulai"
                          value={formData.tanggalMulai}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    {/* Tanggal Selesai */}
                    <div>
                      <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Selesai
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="tanggalSelesai"
                          name="tanggalSelesai"
                          value={formData.tanggalSelesai}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Tempat Uji Kompetensi */}
                  <div className="mb-6">
                    <label htmlFor="tempatKompetensi" className="block text-sm font-medium text-gray-700 mb-2">
                      Tempat Uji Kompetensi
                    </label>
                    <textarea
                      id="tempatKompetensi"
                      name="tempatKompetensi"
                      value={formData.tempatKompetensi}
                      onChange={handleInputChange}
                      placeholder="Masukkan tempat uji kompetensi"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Right Column - Data Asessor */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Asessor</h2>
                  
                  {/* Pilih Asessor with Add Button */}
                  <div className="mb-6">
                    <label htmlFor="dataAsessor" className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Asessor 1
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="dataAsessor"
                        name="dataAsessor"
                        value={formData.dataAsessor}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Data Asessor</option>
                        <option value="asessor1">John Doe - Senior Developer</option>
                        <option value="asessor2">Jane Smith - IT Specialist</option>
                        <option value="asessor3">Mike Johnson - System Analyst</option>
                      </select>
                      <button
                        onClick={handleAddAsessor}
                        className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                        title="Tambah Asessor"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Save size={20} />
                      <span>Update Okupasi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOkupasi;