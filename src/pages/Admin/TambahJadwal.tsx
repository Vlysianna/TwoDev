import React, { useState } from "react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { Calendar, Plus, Trash2 } from "lucide-react";

const TambahJadwal: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span>Kelola Jadwal</span>
              <span className="mx-2">/</span>
              <span className="text-black">Tambah Jadwal</span>
            </nav>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6">
              <h2 className="text-[20px] sm:text-[26px] font-semibold text-black">
                Tambah Jadwal Asesmen
              </h2>
              <div className="border-b border-gray-200 mt-4"></div>
            </div>

            {/* Form Content */}
            <div className="px-6 pb-6 mb-15">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Asesmen */}
                <div>
                  <h3 className="text-lg font-medium text-black-500 mb-4">
                    Data Asesmen
                  </h3>
                  <div className="space-y-4">
                    {/* Pilih Skema */}
                    <div>
                      <label className="text-sm text-gray-700">
                        Pilih Asesor 1
                      </label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                        <option>Pilih Skema</option>
                      </select>
                    </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Tanggal Mulai */}
  <div>
    <label className="text-sm text-gray-700">Tanggal Mulai</label>
    <div className="relative mt-1">
      <input
        type="text"
        placeholder="Pilih tanggal"
        className="w-full border rounded-md px-3 py-2 text-sm pr-10"
      />
      <Calendar
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  </div>

  {/* Tanggal Selesai */}
  <div>
    <label className="text-sm text-gray-700">Tanggal Selesai</label>
    <div className="relative mt-1">
      <input
        type="text"
        placeholder="Pilih tanggal"
        className="w-full border rounded-md px-3 py-2 text-sm pr-10"
      />
      <Calendar
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  </div>
</div>


                    {/* TUK */}
                    <div>
                      <label className="text-sm text-gray-700">TUK</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                        <option>TUK</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Asesor */}
                <div>
                  <h3 className="text-lg font-medium text-black-500 mb-4">
                    Data Asesor
                  </h3>
                  <div className="space-y-4">
                    {/* Pilih Asesor */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-sm text-gray-700">
                          Pilih Asesor 1
                        </label>
                        <select className="w-full border rounded-md px-3 py-2 text-sm mt-1">
                          <option>Pilih Asesor</option>
                        </select>
                      </div>
                      <button className="bg-[#E77D35] p-2 rounded-md text-white">
                        <Plus size={18} />
                      </button>
                      <button className="bg-[#E77D35] p-2 rounded-md text-white">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Lokasi */}
                    <div>
                      <label className="text-sm text-gray-700">Lokasi</label>
                      <input
                        type="text"
                        placeholder="Masukkan lokasi"
                        className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                      />
                    </div>

                    {/* Tombol Tambah Okupasi */}
                    <div>
                      <button className="w-full bg-[#E77D35] text-white rounded-md py-2">
                        Tambah Okupasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TambahJadwal;
