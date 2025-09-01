import React, { useState, useRef } from 'react';
import { ChevronLeft, Clock, Menu, X } from 'lucide-react';
import NavbarAsesor from '../../components/NavAsesor';
import { useAssessmentParams } from '@/components/AssessmentAsesiProvider';
import { useAuth } from '@/contexts/AuthContext';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';

// Main Component
export default function Ia05CAssessee() {
  const { id_asesi, id_asesor, id_assessment, id_result } = useAssessmentParams(); 
  const { user } = useAuth();
  // Table row radio state: { [questionId]: 'Ya' | 'Tidak' }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [assesseeName, setAssesseeName] = useState("");
  const [assessorName, setAssessorName] = useState("");
  // Assessment summary radio: 'assesment1' = Semua Tercapai, 'assesment3' = Tidak Tercapai
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { id: 1, question: "Bahasa pemrograman yang umum digunakan untuk membuat aplikasi Android adalah...", answer: "Java", options: "A" },
    { id: 2, question: "Dalam model SDLC, tahap awal yang dilakukan untuk mengumpulkan informasi kebutuhan pengguna adalah...", answer: "Analisis", options: "B" },
    { id: 3, question: "Fungsi utama CSS dalam pembuatan website adalah...", answer: "Mengatur tampilan dan gaya halaman", options: "B" },
    { id: 4, question: "Istilah \"database\" mengacu pada...", answer: "Kumpulan data yang terorganisir", options: "C" },
    { id: 5, question: "Perintah SQL DELETE FROM siswa WHERE id=1; digunakan untuk...", answer: "Menghapus data siswa dengan id=1", options: "D" },
    { id: 6, question: "HTML termasuk ke dalam jenis bahasa...", answer: "Markup Language", options: "B" },
    { id: 7, question: "Bootstrap adalah...", answer: "Framework CSS", options: "B" },
    { id: 8, question: "Dalam OOP (Object-Oriented Programming), \"class\" berfungsi sebagai...", answer: "Cetak biru (blueprint) untuk membuat objek", options: "C" },
    { id: 9, question: "Salah satu metode pengujian perangkat lunak yang memeriksa fungsi aplikasi tanpa melihat kode sumber adalah...", answer: "Black Box Testing", options: "C" },
    { id: 10, question: "Git digunakan untuk...", answer: "Mengelola versi kode program", options: "B" }
  ];

  // Handle summary radio (Semua Tercapai/Tidak Tercapai)
  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    // If 'Semua Tercapai', set all answers to 'Ya'; if 'Tidak Tercapai', set all to 'Tidak'
    if (value === "assesment1") {
      const allYes: Record<number, string> = {};
      questions.forEach(q => { allYes[q.id] = "Ya"; });
      setSelectedAnswers(allYes);
    } else if (value === "assesment3") {
      const allNo: Record<number, string> = {};
      questions.forEach(q => { allNo[q.id] = "Tidak"; });
      setSelectedAnswers(allNo);
    }
  };

  // Handle per-question radio
  const handleTableRadioChange = (questionId: number, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
    // If user manually changes a row, unset the summary radio
    setSelectedValue("");
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
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white rounded-lg shadow-sm mb-5">
          <NavbarAsesi
            title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR.IA.02"
            icon={
              <Link
                to={paths.asesi.assessment.ak01(id_assessment, id_asesor)}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>

      {/* Content */}
      <div className="max-w-[1450px] mx-auto py-2 md:py-6 px-2 md:px-0">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden px-3 md:px-5 pb-3 md:pb-5">

          {/* Header Info & Progress */}
          <div className="py-4 md:py-6 border-gray-200">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
              {/* Left */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                <h2 className="text-sm font-medium text-gray-800">Skema Sertifikasi (Okupasi)</h2>
                <div className="flex items-center text-xs md:text-sm text-gray-500">
                  <Clock size={12} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">Sewaktu</span>
                  <span className="text-gray-600 ml-2 md:ml-5">24 Okt 2025 | 07:00-15:00</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <div className="text-sm text-gray-700">Pemrogram Junior (Junior Coder)</div>
                <div className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
                  SMK.RPL.PJ/LSPSMK24/2023
                </div>
              </div>
            </div>

            {/* Filter Row + Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center">
              <div className="col-span-1 md:col-span-1">
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
              <div className="col-span-1 md:col-span-1">
                <div className="flex flex-col md:flex-row md:gap-6 space-y-2 md:space-y-0">
                  {options.map((option) => (
                    <label
                      key={option.key}
                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition 
                        ${selectedValue === option.key ? "bg-[#E77D3533]" : ""}`}
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
                          ${selectedValue === option.key ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
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
                        className={`${selectedValue === option.key ? "text-gray-900" : "text-gray-500"} whitespace-nowrap text-sm`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
                {/* Teks Asesmen Awal */}
                <span className="text-sm font-medium text-gray-400">
                  Asesmen awal: 10 / 10
                </span>

                {/* Progress Bar */}
                <div className="w-full md:w-1/2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#E77D35] h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>

                {/* Persen */}
                <span className="text-sm font-medium text-[#E77D35]">100%</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-3 md:p-6 border border-gray-200 rounded-sm">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full text-sm md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-0 text-sm md:text-[16px]">
                      <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[10%]">
                        No
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                        Soal
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                        Jawaban
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                        Pencapaian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">{q.id}</td>
                        <td className="px-2 md:px-4 py-2 md:py-4 border-b border-gray-200 text-gray-700">{q.question}</td>
                        <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200 text-gray-700">
                          {q.options}. {q.answer}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">
                          <div className="flex justify-center gap-3 md:gap-6">
                            {["Ya", "Tidak"].map((option) => (
                              <label
                                key={option}
                                className={`flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-sm cursor-pointer transition ${selectedAnswers[q.id] === option ? "bg-[#E77D3533]" : ""}`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  value={option}
                                  className="hidden"
                                  checked={selectedAnswers[q.id] === option}
                                  onChange={() => handleTableRadioChange(q.id, option)}
                                />
                                <span
                                  className={`w-4 md:w-5 aspect-square flex items-center justify-center rounded-full border-2 ${selectedAnswers[q.id] === option ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
                                >
                                  {selectedAnswers[q.id] === option && (
                                    <svg
                                      className="w-2 h-2 md:w-3 md:h-3 text-white"
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
                                  className={`${selectedAnswers[q.id] === option ? "text-gray-900" : "text-gray-500"} whitespace-nowrap text-xs md:text-sm`}
                                >
                                  {option}
                                </span>
                              </label>
                            ))}
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

        {/* Umpan Balik Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full mt-4 md:mt-6">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Left Section: Umpan Balik */}
              <div className="lg:col-span-6 order-1">
                <h2 className="text-sm md:text-sm font-semibold text-gray-800 mb-3 md:mb-6">
                  Umpan Balik
                </h2>
                <p className="text-sm md:text-sm text-gray-600 mb-3 md:mb-4">
                  Aspek pengetahuan seluruh unit kompetensi yang diujikan
                </p>

                {/* Radio Buttons untuk Tercapai/Belum Tercapai */}
                <div className="mb-4 md:mb-6">
                  <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                    {feedbackOptions.map((option) => (
                      <label
                        key={option.key}
                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition 
                          ${feedbackResult === option.key ? "bg-[#E77D3533]" : ""}`}
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
                          className={`w-4 md:w-5 aspect-square flex items-center justify-center rounded-full border-2 
                            ${feedbackResult === option.key ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
                        >
                          {feedbackResult === option.key && (
                            <svg
                              className="w-2 h-2 md:w-3 md:h-3 text-white"
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
                          className={`${feedbackResult === option.key ? "text-gray-900" : "text-gray-500"} whitespace-nowrap text-sm md:text-sm`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tuliskan unit/elemen/KUK jika belum tercapai */}
                <div className="mb-4">
                  <p className="text-sm md:text-sm text-gray-700 mb-2 md:mb-3">
                    Tuliskan unit/elemen/KUK jika belum tercapai:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <label className="block text-sm md:text-sm text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={unitField}
                        onChange={(e) => setUnitField(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm md:text-sm text-gray-700 mb-1">Elemen</label>
                      <input
                        type="text"
                        value={elementField}
                        onChange={(e) => setElementField(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm md:text-sm text-gray-700 mb-1">KUK</label>
                    <input
                      type="text"
                      value={kukField}
                      onChange={(e) => setKukField(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Middle Section: Asesi and Asesor */}
              <div className="lg:col-span-4 order-2 lg:order-2">
                {/* Asesi Section */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-sm md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">
                    Asesi
                  </h3>

                  <div className="mb-2 md:mb-3">
                    <input
                      type="text"
                      value={asesiName}
                      onChange={(e) => setAsesiName(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-gray-100"
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
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-gray-100 cursor-pointer"
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
                <div className="mb-4 md:mb-6">
                  <h3 className="text-sm md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">
                    Asesor
                  </h3>

                  <div className="mb-2 md:mb-3">
                    <input
                      type="text"
                      value={asesorName}
                      onChange={(e) => setAsesorName(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-gray-100"
                      placeholder="Nama Asesor"
                      disabled
                    />
                  </div>

                  <div className="mb-2 md:mb-3">
                    <input
                      type="text"
                      value={asesorId}
                      onChange={(e) => setAsesorId(e.target.value)}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-gray-100"
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
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-sm md:text-sm bg-gray-100 cursor-pointer"
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
              <div className="lg:col-span-2 order-3 flex flex-col items-center space-y-5 mb-5 md:mb-0">
                {/* QR Code */}
                <div className="w-24 h-20 md:w-32 md:h-24 lg:w-45 lg:h-30 border-2 border-gray-300 rounded flex items-center justify-center bg-white">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-30 lg:h-30 bg-black flex items-center justify-center">
                    <div className="text-white text-sm">QR</div>
                  </div>
                </div>

                {/* Empty space for signature */}
                <div className="w-24 h-20 md:w-32 md:h-24 lg:w-45 lg:h-30 border-4 border-gray-300 rounded bg-gray-50"></div>

                {/* Generate QR Button */}
                <button className="bg-[#E77D35] hover:bg-[#E77D35] text-white text-sm md:text-sm px-4 md:px-6 lg:px-12 py-2 rounded-md transition-colors duration-200 whitespace-nowrap">
                  Generate QR
                </button>
              </div>
            </div>
            <hr className='border-gray-300' />
          </div>

          {/* Bottom Lanjut Button */}
          <div className="flex justify-center md:justify-end mt-4 md:mt-6 lg:mt-8">
            <button
              onClick={handleSubmit}
              className="bg-[#E77D35] hover:bg-[#E77D35] text-white text-sm md:text-sm font-medium px-8 md:px-12 lg:px-45 py-2 md:py-3 rounded-md transition-colors duration-200 w-full md:w-auto"
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}