import { useState } from "react";
import NavbarAsesi from "@/components/ui/NavbarAsesi";
import NavbarAsesor from "@/components/NavAsesor";
import { FileText } from "lucide-react";

export default function AssessmentRecord() {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, boolean>
  >({});
  const [assesseeName, setAssesseeName] = useState<string>("");
  const [assessorName, setAssessorName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [assessmentResult, setAssessmentResult] = useState<string>("");
  const [followUp, setFollowUp] = useState<string>("");
  const [assessorComments, setAssessorComments] = useState<string>("");
  const [assesseeDate, setAssesseeDate] = useState<string>("");
  const [assessorDate, setAssessorDate] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [finalAssesseeName, setFinalAssesseeName] = useState<string>("");
  const [finalAssessorName, setFinalAssessorName] = useState<string>("");

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
    console.log("Assessment Record submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAsesor title="Rekaman Asesmen Kompetensi - FR.AK.02" 
      icon={<FileText size={20} />}
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
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <polyline points="12,6 12,12 16,14" strokeWidth="2"></polyline>
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

            <div className="grid grid-cols-4 gap-4">
              <div>
                <select
                  value={assesseeName}
                  onChange={(e) => setAssesseeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 bg-white text-sm"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                >
                  <option value="">Nama Asesi</option>
                  <option value="asesi1">Asesi 1</option>
                  <option value="asesi2">Asesi 2</option>
                </select>
              </div>

              <div>
                <select
                  value={assessorName}
                  onChange={(e) => setAssessorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 bg-white text-sm"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                >
                  <option value="">Nama Asesor</option>
                  <option value="asesor1">Asesor 1</option>
                  <option value="asesor2">Asesor 2</option>
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Pilih tanggal mulai"
                  className="w-full sm:w-[68%] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 text-sm sm:ml-42"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Pilih tanggal selesai"
                  className="w-full sm:w-[70%] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 text-sm sm:ml-21"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                />
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

          {/* Bottom Section with Rekomendasi and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Section: Rekomendasi Hasil Asesmen */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Rekomendasi Hasil Asesmen
              </h2>

              <div className="mb-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="assessmentResult"
                      value="kompeten"
                      checked={assessmentResult === "kompeten"}
                      onChange={(e) =>
                        setAssessmentResult(e.target.checked ? "kompeten" : "")
                      }
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">Kompeten</span>
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
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Belum Kompeten
                    </span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tindak lanjut yang dibutuhkan
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  (Masukkan pekerjaan tambahan dan asesmen yang diperlukan untuk
                  mencapai kompetensi)
                </p>
                <textarea
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                  placeholder="Masukkan tindak lanjut yang dibutuhkan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Komentar/ Observasi oleh asesor
                </label>
                <textarea
                  value={assessorComments}
                  onChange={(e) => setAssessorComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": "#FF7601" } as React.CSSProperties
                  }
                  placeholder="Masukkan komentar atau observasi..."
                />
              </div>
            </div>

            {/* Right Section: Asesi and Asesor Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                {/* Asesi Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Asesi
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Asesi
                      </label>
                      <select
                        value={finalAssesseeName}
                        onChange={(e) => setFinalAssesseeName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Pilih Asesi</option>
                        <option value="asesi1">Asesi 1</option>
                        <option value="asesi2">Asesi 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih tanggal
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={assesseeDate}
                          onChange={(e) => setAssesseeDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asesor Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Asesor
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Asesor
                      </label>
                      <select
                        value={finalAssessorName}
                        onChange={(e) => setFinalAssessorName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Pilih Asesor</option>
                        <option value="asesor1">Asesor 1</option>
                        <option value="asesor2">Asesor 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih tanggal
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={assessorDate}
                          onChange={(e) => setAssessorDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Reg
                    </label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="Masukkan nomor reg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSubmit}
                      className="text-white font-medium py-3 px-16 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 w-full"
                      style={{ backgroundColor: "#FF7601" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e65a00")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF7601")
                      }
                    >
                      Submit
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
}
