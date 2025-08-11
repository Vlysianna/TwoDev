import { useState } from 'react';
import { Filter, Download, Edit, Eye, Trash2 } from 'lucide-react';
import Navbar from '@/components/NavAdmin';
import Sidebar from '@/components/SideAdmin';

const KelolaJurusan = () => {
  const [formData, setFormData] = useState({
    namaJurusan: '',
    deskripsi: ''
  });

  // Sample data untuk daftar jurusan
  const [jurusanList, setJurusanList] = useState([
    { id: 1, nama: 'RPL', deskripsi: 'Rekayasa Perangkat Lunak' },
    { id: 2, nama: 'TKJ', deskripsi: 'Teknik Komputer dan Jaringan' },
    { id: 3, nama: 'MM', deskripsi: 'Multimedia' },
    { id: 4, nama: 'TBSM', deskripsi: 'Teknik dan Bisnis Sepeda Motor' },
    { id: 5, nama: 'OTKP', deskripsi: 'Otomatisasi dan Tata Kelola Perkantoran' }
  ]);

  const handleAddJurusan = () => {
    if (formData.namaJurusan && formData.deskripsi) {
      const newJurusan = {
        id: jurusanList.length + 1,
        nama: formData.namaJurusan,
        deskripsi: formData.deskripsi
      };
      setJurusanList([...jurusanList, newJurusan]);
      setFormData({ namaJurusan: '', deskripsi: '' });
    }
  };

  const handleDelete = (id: number) => {
    setJurusanList(jurusanList.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component - Handles its own positioning and mobile menu */}
      <Sidebar />

      {/* Main Content Area - Adjusted for sidebar */}
      <div className="lg:ml-64">
        {/* Navbar - Sticky di atas */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <Navbar />
        </div>

        {/* Konten Utama */}
        <div className="p-4 lg:p-6 pt-20 lg:pt-6"> 
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-orange-600 font-medium">Kelola Jurusan</span>
          </div>

          {/* Page Title */}
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Kelola Jurusan</h1>

          {/* Add Form Section */}
          <div className="bg-white rounded-lg shadow-sm border mb-6 p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Tambah Jurusan</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Jurusan
                </label>
                <input
                  type="text"
                  value={formData.namaJurusan}
                  onChange={(e) => setFormData({...formData, namaJurusan: e.target.value})}
                  placeholder="Masukkan nama jurusan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  placeholder="Masukkan deskripsi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            {/* Button di bawah form fields */}
            <div className="mt-6">
              <button
                onClick={handleAddJurusan}
                className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Tambah Jurusan
              </button>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Table Header */}
            <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Jurusan</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Export to Excel
                  </button>
                </div>
              </div>
            </div>
            
            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">
                      Nama Jurusan
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-4 lg:px-6 py-4 text-center text-xs lg:text-sm font-semibold uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jurusanList.map((jurusan, index) => (
                    <tr key={jurusan.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{jurusan.nama}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm text-gray-600">{jurusan.deskripsi}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-1 lg:space-x-2">
                          <button 
                            className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(jurusan.id)}
                            className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{jurusanList.length}</span> dari <span className="font-medium">{jurusanList.length}</span> entri
                </div>
                <div className="text-sm text-gray-500">
                  Total: {jurusanList.length} jurusan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaJurusan;