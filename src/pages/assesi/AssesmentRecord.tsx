import { ChevronDown, Clipboard, NotepadText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import NavbarAssesor from "../../components/ui/NavbarAssesor";
import { getAssetPath } from '@/utils/assetPath';

export default function AssessmentRecord() {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});
  const [assesseeName, setAssesseeName] = useState<string>("");
  const [assessorName, setAssessorName] = useState<string>("");
  const [startDate, setStartDate] = useState(""); // <- state untuk tanggal mulai
  const [endDate, setEndDate] = useState("");  // <- state untuk tanggal selesai
  const [assessmentResult, setAssessmentResult] = useState<string>("");
  const [followUp, setFollowUp] = useState<string>("");
  const [assessorComments, setAssessorComments] = useState<string>("");
  const [asesiName, setAsesiName] = useState("");
  const [asesiDate, setAsesiDate] = useState("");
  const [asesorName, setAsesorName] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [asesorDate, setAsesorDate] = useState("");

  const asesiDateRef = useRef<HTMLInputElement>(null);
  const asesorDateRef = useRef<HTMLInputElement>(null);

  const competencyUnits = [
    "Menggunakan Struktur Data",
    "Menggunakan Spesifikasi Program",
    "Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia",
    "Menulis Kode Dengan Prinsip Sesuai Guidelines dan Best Practices",
    "Mengimplementasikan Pemrograman Terstruktur",
    "Membuat Dokumen Kode Program",
    "Melakukan Debugging",
    "Melaksanakan Pengujian Unit Program",
  ];

  const evidenceTypes = [
    "Observasi Demonstrasi",
    "Portofolio",
    "Pernyataan Pihak Ketiga Pernyataan Wawancara",
    "Pertanyaan Lisan",
    "Pertanyaan Tertulis",
    "Proyek Kerja",
    "Lainnya",
  ];

  const handleCheckboxChange = (unitIndex: number, evidenceIndex: number) => {
    const key = `${unitIndex}-${evidenceIndex}`;
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isChecked = (unitIndex: number, evidenceIndex: number): boolean => {
    const key = `${unitIndex}-${evidenceIndex}`;
    return !!selectedOptions[key];
  };

  const handleSubmit = () => {
    // console.log("Assessment Record submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAssesor
        title="Rekaman Asesmen Kompetensi - FR.AK.02"
        icon={<NotepadText className="w-6 h-6" />}
      />

      <div className="pt-20 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Skema Sertifikasi Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Kiri */}
            <div className="flex items-center space-x-3 flex-wrap">
              <h2 className="text-sm font-medium text-gray-800">
                Skema Sertifikasi (Okupasi)
              </h2>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <polyline
                    points="12,6 12,12 16,14"
                    strokeWidth="2"
                  ></polyline>
                </svg>
                <span className="text-sm text-gray-600">Sewaktu</span>
              </div>
            </div>

            {/* Kanan */}
            <div className="flex flex-wrap items-center space-x-2">
              <div className="text-sm text-gray-700">
                Pemrogram Junior (Junior Coder)
              </div>
              <div className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] ml-5">
                SMK.RPL.PJ/LSPSMK24/2023
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-2 text-sm text-gray-600">
            {/* Asesi */}
            <div className="flex">
              <span className="font-semibold mr-1">Asesi:</span>
              <span>Ananda Keizra Oktavian</span>
            </div>

            {/* Asesor */}
            <div className="flex">
              <span className="font-semibold mr-1">Asesor:</span>
              <span>Eva Yeprilianti, S.Kom</span>
            </div>
          

            {/* Kanan */}
            <div className="flex items-center space-x-2 text-gray-600 text-sm ml-auto">
              <span>24 Oktober 2025 | 07:00 – 15:00</span>
              <span>-</span>
              <span>24 Oktober 2025 | 07:00 – 15:00</span>
            </div>
          </div>
        </div>


          {/* Unit Kompetensi Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <p className="text-gray-700">
                Beri tanda centang (✓) di kolom yang sesuai untuk mencerminkan
                bukti yang sesuai untuk setiap Unit Kompetensi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-64">
                      Unit Kompetensi
                    </th>
                    {evidenceTypes.map((evidence, index) => (
                      <th
                        key={index}
                        className="text-center py-4 px-3 font-semibold text-gray-700 min-w-24 text-xs"
                      >
                        {evidence}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {competencyUnits.map((unit, unitIndex) => (
                    <tr
                      key={unitIndex}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">
                        {unit}
                      </td>
                      {evidenceTypes.map((_, evidenceIndex) => (
                        <td
                          key={evidenceIndex}
                          className="py-4 px-3 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked(unitIndex, evidenceIndex)}
                            onChange={() =>
                              handleCheckboxChange(unitIndex, evidenceIndex)
                            }
                            className="w-4 h-4 rounded border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            style={{
                              accentColor: "#FF7601",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Section: Rekomendasi Hasil Asesmen */}
          <div className="lg:col-span-6 order-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 lg:mb-6">
              Rekomendasi Hasil Asesmen
            </h2>

            {/* Checkboxes */}
            <div className="mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="assessmentResult"
                    value="kompeten"
                    checked={assessmentResult === "kompeten"}
                    onChange={(e) =>
                      setAssessmentResult(
                        e.target.checked ? "kompeten" : ""
                      )
                    }
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">Kompeten</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="assessmentResult"
                    value="belum-kompeten"
                    checked={assessmentResult === "belum-kompeten"}
                    onChange={(e) =>
                      setAssessmentResult(
                        e.target.checked ? "belum-kompeten" : ""
                      )
                    }
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    Belum Kompeten
                  </span>
                </label>
              </div>
            </div>

            {/* Tindak Lanjut */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Tindak lanjut yang dibutuhkan
              </label>
              <p className="text-xs text-gray-500 mb-2">
                (Masukkan pekerjaan tambahan dan asesmen yang diperlukan
                untuk mencapai kompetensi)
              </p>
              <div className="border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500">
                <textarea
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full resize-none border-none outline-none text-xs sm:text-sm"
                  rows={3}
                  placeholder=""
                />
              </div>
            </div>

            {/* Komentar Asesor */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Komentar/ Observasi oleh asesor
              </label>
              <div className="border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500">
                <textarea
                  value={assessorComments}
                  onChange={(e) => setAssessorComments(e.target.value)}
                  className="w-full resize-none border-none outline-none text-xs sm:text-sm"
                  rows={3}
                  placeholder=""
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
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-white"
                  placeholder="Nama Asesi"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    ref={asesiDateRef}
                    type="date"
                    value={asesiDate}
                    onChange={(e) => setAsesiDate(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-white cursor-pointer"
                  />
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center bg-gray-100 flex-shrink-0 cursor-pointer"
                     onClick={() => asesiDateRef.current?.showPicker()}>
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
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-white"
                  placeholder="Nama Asesor"
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={asesorId}
                  onChange={(e) => setAsesorId(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-white"
                  placeholder="ID Asesor"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    ref={asesorDateRef}
                    type="date"
                    value={asesorDate}
                    onChange={(e) => setAsesorDate(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-white cursor-pointer"
                  />
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded flex items-center justify-center bg-gray-100 flex-shrink-0 cursor-pointer"
                     onClick={() => asesorDateRef.current?.showPicker()}>
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
              <img 
                src={getAssetPath('/images/qrcode.png')} 
                alt="QR Code" 
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30 object-contain"
              />
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
      <div className="flex justify-end mt-6 lg:mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
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
  </div>
  );
}
