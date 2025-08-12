import FootLanding from "../../components/FootLanding";
import NavLanding from "../../components/NavLanding";
import { Search } from 'lucide-react';


function TempatUji() {
  const skemaData = [
    { id: 1, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 2, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 3, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 4, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 5, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 6, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 7, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 8, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 9, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 10, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 11, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 12, nama: "Lab 1 Rekayasa Perangkat Lunak" },
    { id: 13, nama: "Lab 1 Rekayasa Perangkat Lunak" },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavLanding />
        <div className="mt-16"></div>

        <main className="flex-grow bg-gray-50">
          {/* Section Hero dengan background */}
          <img
            src="/bgsklh.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 z-0 "
          />
          <div className="relative min-h-screen">
            <section id="hero-section">
              <div className="relative z-10 flex items-center justify-center text-center px-4 sm:px-10 mt-22 md:px-20 sm:py-40 h-full">
                <div className="text-white max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                    Skema Sertifikasi
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl leading-tight">
                    Lembaga Sertifikasi Profesi SMK Negeri 24 Jakarta
                  </p>
                </div>
              </div>
            </section>

            <section id="list-skema" className="relative z-10 my-55 px-4 sm:px-10 md:px-20">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm text-gray-600">
                        Show
                        <select className="mx-2 px-2 py-1 border border-gray-300 rounded text-sm">
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select>
                        entries
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Search:</label>
                      <div className="relative w-full max-w-xs">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400" />
                        </span>
                        <input
                          type="text"
                          className="pl-9 pr-3 py-1 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          placeholder="Cari..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-medium font-bold text-black-500 border-b">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-medium font-bold text-black-500 border-b">
                          Tempat Uji Kompetensi
                        </th>
                        <th className="px-6 py-3 text-center text-medium font-bold text-black-500 border-b">
                          Lihat Detail
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {skemaData.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.nama}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <a href="" className="text-[#00A6FB] hover:text-blue-700 flex items-center justify-center underline">
                              Detail
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing 1 to 13 of 13 entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50">
                        First
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm text-white bg-blue-500 border border-blue-500 rounded">
                        1
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50">
                        Next
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50">
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <FootLanding />
      </div>
    </>
  );
}

export default TempatUji;