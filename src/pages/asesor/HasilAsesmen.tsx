import React, { useState, useRef } from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import NavbarAsesor from '../../components/NavAsesor';

// Main Component
export default function HasilAsesmen() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const [assesseeName, setAssesseeName] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  
  // Umpan Balik states
  const [feedbackResult, setFeedbackResult] = useState<string>("");
  const [unitField, setUnitField] = useState("");
  const [elementField, setElementField] = useState("");
  const [kukField, setKukField] = useState("");
  const [asesiName, setAsesiName] = useState("Ananda Keizha Oktavian");
  const [asesiDate, setAsesiDate] = useState("2025-10-24");
  const [asesorName, setAsesorName] = useState("Eva Yeprilisanti, S.Kom");
  const [asesorId, setAsesorId] = useState("24102025");
  const [asesorDate, setAsesorDate] = useState("2025-10-24");
  
  const asesiDateRef = useRef<HTMLInputElement>(null);
  const asesorDateRef = useRef<HTMLInputElement>(null);

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

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleFeedbackRadioChange = (value: string) => {
    setFeedbackResult(value);
  };

  const options = [
    { key: "assesment1", label: "Semua Tercapai" },
    { key: "assesment3", label: "Tidak Tercapai" },
  ];

  const feedbackOptions = [
    { key: "tercapai", label: "Tercapai" },
    { key: "belum-tercapai", label: "Belum Tercapai" },
  ];

  const handleSubmit = () => {
    // console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white">
        <NavbarAsesor title="Hasil assesment" icon={<ChevronLeft size={20} />} />
      </div>

      {/* Content */}
      <div className="max-w-[1450px] mx-auto py-6">
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
              <div>
                <div className="flex gap-6">
                  {options.map((option) => (
                    <label
                      key={option.key}
                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition 
                        ${selectedValue === option.key ? "bg-orange-100" : ""}`}
                    >
                      <input
                        type="radio"
                        name="assesment"
                        value={option.key}
                        className="hidden"
                        checked={selectedValue === option.key}
                        onChange={() => handleRadioChange(option.key)}
                      />
                      <span
                        className={`w-5 aspect-square flex items-center justify-center rounded-full border-2 
                          ${selectedValue === option.key ? "bg-orange-500 border-orange-500" : "border-orange-400"}`}
                      >
                        {selectedValue === option.key && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`${selectedValue === option.key ? "text-gray-900" : "text-gray-500"} whitespace-nowrap`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex items-center space-x-3 ml-70">
                {/* Teks Asesmen Awal */}
                <span className="text-sm font-medium text-gray-400">
                  Asesmen awal: 10 / 10
                </span>
                
                {/* Progress Bar */}
                <div className="w-1/2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                
                {/* Persen */}
                <span className="text-sm font-medium text-orange-600">100%</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-0 text-[16px]">
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b border-gray-200 w-12">No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b border-gray-200">Soal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b border-gray-200 w-48">Jawaban</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-40">Pencapaian</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-center border-b border-gray-200">{q.id}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-700">{q.question}</td>
                    <td className="px-4 py-4 border-b border-gray-200 text-gray-700">{q.answer}</td>
                    <td className="px-4 py-4 text-center border-b border-gray-200">
                      <div className="flex justify-center gap-6">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="hidden"
                            defaultChecked={q.achievement === "Ya"}
                          />
                          <span
                            className={`w-4 aspect-square flex items-center justify-center rounded-full ${
                              q.achievement === "Ya"
                                ? "bg-orange-500 border border-orange-500"
                                : "border border-gray-300"
                            }`}
                          >
                            {q.achievement === "Ya" && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
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

        {/* Umpan Balik Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10 lg:p-10 w-full mt-6">
          <div className="bg-gray-50 p-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left Section: Umpan Balik */}
              <div className="lg:col-span-6 order-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 lg:mb-6">
                  Umpan Balik
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Aspek pengetahuan seluruh unit kompetensi yang diujikan
                </p>

                {/* Radio Buttons untuk Tercapai/Belum Tercapai */}
                <div className="mb-6">
                  <div className="flex gap-6">
                    {feedbackOptions.map((option) => (
                      <label
                        key={option.key}
                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition 
                          ${feedbackResult === option.key ? "bg-orange-100" : ""}`}
                      >
                        <input
                          type="radio"
                          name="feedbackResult"
                          value={option.key}
                          className="hidden"
                          checked={feedbackResult === option.key}
                          onChange={() => handleFeedbackRadioChange(option.key)}
                        />
                        <span
                          className={`w-5 aspect-square flex items-center justify-center rounded-full border-2 
                            ${feedbackResult === option.key ? "bg-orange-500 border-orange-500" : "border-orange-400"}`}
                        >
                          {feedbackResult === option.key && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`${feedbackResult === option.key ? "text-gray-900" : "text-gray-500"} whitespace-nowrap`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tuliskan unit/elemen/KUK jika belum tercapai */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Tuliskan unit/elemen/KUK jika belum tercapai:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={unitField}
                        onChange={(e) => setUnitField(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Elemen</label>
                      <input
                        type="text"
                        value={elementField}
                        onChange={(e) => setElementField(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">KUK</label>
                    <input
                      type="text"
                      value={kukField}
                      onChange={(e) => setKukField(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Middle Section: Asesi and Asesor */}
              <div className="lg:col-span-4 order-2 lg:order-2">
                {/* Asesi Section */}
                <div className="mb-8 lg:mb-15">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3">
                    Asesi
                  </h3>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={asesiName}
                      onChange={(e) => setAsesiName(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100"
                      placeholder="Nama Asesi"
                      disabled
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        ref={asesiDateRef}
                        type="date"
                        value={asesiDate}
                        onChange={(e) => setAsesiDate(e.target.value)}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 cursor-pointer"
                        disabled
                      />
                    </div>
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center bg-gray-100 flex-shrink-0 cursor-pointer"
                      onClick={() => asesiDateRef.current?.showPicker()}
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Asesor Section */}
                <div className="mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3">
                    Asesor
                  </h3>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={asesorName}
                      onChange={(e) => setAsesorName(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100"
                      placeholder="Nama Asesor"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={asesorId}
                      onChange={(e) => setAsesorId(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100"
                      placeholder="ID Asesor"
                      disabled
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        ref={asesorDateRef}
                        type="date"
                        value={asesorDate}
                        onChange={(e) => setAsesorDate(e.target.value)}
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 cursor-pointer"
                        disabled
                      />
                    </div>
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center bg-gray-100 flex-shrink-0 cursor-pointer"
                      onClick={() => asesorDateRef.current?.showPicker()}
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: QR and Generate Button */}
              <div className="lg:col-span-2 order-3 flex flex-col items-center space-y-6 lg:space-y-10">
                {/* QR Code */}
                <div className="w-32 h-24 sm:w-36 sm:h-28 lg:w-45 lg:h-30 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 bg-black flex items-center justify-center">
                    <div className="text-white text-xs">QR</div>
                  </div>
                </div>

                {/* Empty space for signature */}
                <div className="w-32 h-24 sm:w-36 sm:h-28 lg:w-45 lg:h-30 border-4 border-gray-300 rounded bg-gray-50"></div>

                {/* Generate QR Button */}
                <button className="bg-[#E77D35] hover:bg-[#E77D35] text-white text-xs sm:text-sm px-6 sm:px-8 lg:px-12 py-2 rounded-md transition-colors duration-200 whitespace-nowrap">
                  Generate QR
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Lanjut Button */}
          <div className="flex justify-end mt-6 lg:mt-8">
            <button
              onClick={handleSubmit}
              className="bg-[#E77D35] hover:bg-[#E77D35] text-white text-xs sm:text-sm font-medium px-8 sm:px-12 lg:px-45 py-2 sm:py-3 rounded-md transition-colors duration-200"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}