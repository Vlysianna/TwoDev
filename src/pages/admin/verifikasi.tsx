import Navbar from '../../components/NavAdmin';
import Sidebar from '../../components/SideAdmin';
import { Eye, Filter, SquareCheck, SquareX } from "lucide-react";

export default function VerifikasiPage() {
    const dummyData = Array(8).fill({
    username: "Salmah Nadya",
    bukti: "Lihat Bukti",
    tanggal: "31/07/2025 02:23",
  });

  return (
    <>
    
    <div className="flex min-h-screen bg-gray-50">

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
          {/* Konten Utama ya buyunggggggggggggggggggggggggg */}
      {/* Konten utama */}
       <main className=" ">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          Dashboard / Verifikasi Approval
        </div>

        {/* Judul Halaman */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Approval</h1>

        {/* Tombol Filter */}
        <div className="flex justify-end">
          <button className="flex items-center px-4 text-sm font-medium text-orange-600 border border-orange-500 rounded hover:bg-orange-100 transition mb-6">
            Filter
             <Filter size={18} className="ml-2 text-orange-500" />
          </button>
        </div>

        {/* Tabel Verifikasi */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead>
              <tr className="bg-orange-500 text-white text-sm">
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Bukti Upload</th>
                <th className="px-6 py-3">Tanggal Kirim</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {dummyData.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-orange-500 hover:underline">{item.bukti}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button className="text-orange-500 hover:text-orange-700" title="Lihat">
                      <Eye size={18} />
                    </button>
                    <button className="text-orange-500 hover:text-orange-700" title="Setujui">
                      <SquareCheck size={18} />
                    </button>
                    <button className="text-orange-600 hover:text-orange-700" title="Tolak">
                      <SquareX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
        </div>
      </div>

    </div>
    </>
  );
}
