import React, { useState } from 'react';
import { ChevronLeft, Clock, Check
 } from 'lucide-react';
import NavbarAsesor from '../../components/NavAsesor';

export default function Template2() {
  const [assesseeName, setAssesseeName] = useState("");
  const [assessorName, setAssessorName] = useState("");

  const questions = [
    { id: 1, question: "Bahasa pemrograman yang umum digunakan untuk membuat aplikasi Android adalah...", answer: "Java", achievement: "Ya" },
    { id: 2, question: "Dalam model SDLC, tahap awal yang dilakukan untuk mengumpulkan informasi kebutuhan pengguna adalah...", answer: "Implementasi", achievement: "Tidak" },
    { id: 3, question: "Fungsi utama CSS dalam pembuatan website adalah...", answer: "Mengatur tampilan dan gaya halaman", achievement: "Tidak" },
    { id: 4, question: "Istilah \"database\" mengacu pada...", answer: "Kumpulan data yang terorganisir", achievement: "Tidak" },
    { id: 5, question: "Perintah SQL DELETE FROM siswa WHERE id=1; digunakan untuk...", answer: "Menghapus data siswa dengan id=1", achievement: "Tidak" },
    { id: 6, question: "HTML termasuk ke dalam jenis bahasa...", answer: "Kumpulan data yang terorganisir", achievement: "Tidak" },
    { id: 7, question: "Bootstrap adalah...", answer: "Framework CSS", achievement: "Tidak" },
    { id: 8, question: "Dalam OOP (Object-Oriented Programming), \"class\" berfungsi sebagai...", answer: "Cetak biru (blueprint) untuk membuat objek", achievement: "Tidak" },
    { id: 9, question: "Salah satu metode pengujian perangkat lunak yang memeriksa fungsi aplikasi tanpa melihat kode sumber adalah...", answer: "Unit Testing", achievement: "Tidak" },
    { id: 10, question: "Git adalah salah satu...", answer: "Version Control System", achievement: "Tidak" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white">
        <NavbarAsesor title="Hasil assesment" icon={<ChevronLeft size={20} />} />
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto py-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Header Info & Progress */}
          <div className="p-6 border-b border-gray-200">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              {/* Left */}
              <div className="flex items-center space-x-3 flex-wrap">
                <h2 className="text-sm font-medium text-gray-800">Skema Sertifikasi (Okupasi)</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">Sewaktu</span>
                  <span className="text-gray-600 ml-5">24 Oktober 2025 | 07:00 - 15:00</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center space-x-2">
                <div className="text-sm text-gray-700">Pemrogram Junior (Junior Coder)</div>
                <div className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] ml-5">
                  SMK.RPL.PJ/LSPSMK24/2023
                </div>
              </div>
            </div>

            {/* Filter Row + Progress */}
            <div className="grid grid-cols-4 gap-4 items-center">
              <div>
                <select
                  value={assesseeName}
                  onChange={(e) => setAssesseeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 bg-white text-sm"
                  style={{ '--tw-ring-color': '#FF7601' } as React.CSSProperties}
                >
                  <option value="">Pilih Asesi</option>
                  <option value="asesi1">Asesi 1</option>
                  <option value="asesi2">Asesi 2</option>
                </select>
              </div>
              <div className="flex items-center hover:bg-[#E77D3533] rounded-md px-3 py-2 max-w-[150px]">
                <input type="radio" name="assesment" value="assesment1" className="accent-[#E77D35] outline-none" />
                <label className="ml-2 text-sm text-gray-700">Semua Tercapai</label>
              </div>
              <div className="col-span-2 flex items-center space-x-3">
                <div className="w-1/2 bg-gray-200 rounded-full h-2 ml-70">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <span className="text-sm font-medium text-orange-600">100%</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200 w-12">No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200">Soal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200 w-48">Jawaban</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 border-b border-gray-200 w-40">Pencapaian</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-center border-b border-gray-200">{q.id}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-700">{q.question}</td>
                    <td className="px-4 py-4 border-b border-gray-200 font-medium">{q.answer}</td>
                    <td className="px-4 py-4 text-center border-b border-gray-200">
                      <div className="flex justify-center gap-6">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name={`q-${q.id}`} className="hidden" defaultChecked={q.achievement === "Ya"} />
                          <span className={`w-3 h-3 rounded-full ${q.achievement === "Ya" ? "bg-orange-500" : "border border-gray-300"}`}></span>
                          <span>Ya</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name={`q-${q.id}`} className="hidden" defaultChecked={q.achievement === "Tidak"} />
                          <span className={`w-3 h-3 rounded-full ${q.achievement === "Tidak" ? "bg-orange-500" : "border border-gray-300"}`}></span>
                          <span>Tidak</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
