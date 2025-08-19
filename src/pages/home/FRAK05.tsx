import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { NotepadText } from "lucide-react";
import NavbarAsesor from "@/components/NavbarAsesor";



export default function FRAK05() {
  const [catatan, setCatatan] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavbarAsesor
        title="Laporan Asesmen - FR.AK.05"
        icon={<NotepadText className="w-6 h-6" />}
        
      />

      <main className="pt-4 px-4 sm:px-6 pb-10 max-w-7xl mx-auto space-y-8">
        {/* --- Skema Sertifikasi --- */}
        <section className="px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              {/* Header Skema */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
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
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <polyline points="12,6 12,12 16,14" strokeWidth="2" />
                    </svg>
                    <span className="text-sm text-gray-600">Sewaktu</span>
                  </div>
                </div>

                {/* Kanan */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                  <span className="text-sm text-gray-700">
                    Pemrogram Junior (Junior Coder)
                  </span>
                  <span className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] sm:ml-5">
                    SMK.RPL.PJ/LSPSMK24/2023
                  </span>
                </div>
              </div>

              {/* Detail Asesi - Asesor - Waktu */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
                {/* Asesi & Asesor */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <div className="flex flex-wrap">
                    <span className="xs-text mr-1">Asesi:</span>
                    <span>Ananda Keizra Oktavian</span>
                  </div>
                  <div className="flex flex-wrap">
                    <span className="xs-text mr-1">Asesor:</span>
                    <span>Eva Yeprilianti, S.Kom</span>
                  </div>
                </div>

                {/* Waktu */}
                <div className="flex flex-col xl:flex-row xl:items-center space-y-1 xl:space-y-0 xl:space-x-2 text-gray-600 text-sm lg:ml-auto">
                  <span className="whitespace-nowrap">
                    24 Oktober 2025 | 07:00 – 15:00
                  </span>
                  <span className="hidden xl:inline">-</span>
                  <span className="whitespace-nowrap">
                    24 Oktober 2025 | 07:00 – 15:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Tabel Asesi --- */}
        <section className="overflow-x-auto">
          <table className="w-full border rounded-xl bg-white text-sm min-w-[600px]">
            <thead>
              <tr>
                <th className="p-3 border text-center">No.</th>
                <th className="p- border text-center xs-text">Nama Asesi</th>
                <th className="p-3 border text-center">Rekomendasi</th>
                <th className="p-3 border text-center">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border text-center">1</td>
                <td className="p-3 border text-center">Adelia Tri Ramadani</td>
                <td className="p-3 border">
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="rekom" /> Kompeten
                    </label>
                    <label className="flex items-center gap-2 ">
                      <input type="radio" name="rekom" /> Belum Kompeten
                    </label>
                  </div>
                </td>
                <td className="p-3 border text-center">Sangat Bagus</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* --- Form & QR --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kiri: Form Catatan */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <p className="text-xs text-gray-500">
              ** Tuliskan Kode dan Judul Unit Kompetensi yang dinyatakan BK bila
              mengakses satu skema
            </p>

            {[
              "Aspek Negatif dan Positif dalam Asesmen",
              "Pencatatan Penolakan Hasil Asesmen",
              "Saran Perbaikan : (Asesor/Personil Terkait)",
            ].map((label, idx) => (
              <div key={idx}>
                <label className="block text-sm mb-1">{label}</label>
                <textarea className="w-full border rounded-lg p-2" rows={2} />
              </div>
            ))}

            <textarea
              className="w-full border rounded-lg p-2"
              rows={3}
              placeholder="Catatan..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          {/* Kanan: Asesor & QR */}
          <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium mb-3">Asesor</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value="Eva Yeprilianti, S.Kom"
                  disabled
                  className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500"
                />
                <input type="date" className="border rounded-lg p-2 text-sm" />
              </div>
              <input
                type="text"
                value="24102025"
                disabled
                className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
              />
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50 mb-3 h-40">
              <QRCodeCanvas value="FR.AK.05-24102025" size={100} />
              <p className="text-xs text-gray-400 mt-2">FR.AK.05-24102025</p>
            </div>

            {/* Buttons */}
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
              Generate QR
            </button>
          </div>
        </section>
        <hr className="border border-gray-200" />
        <div className="flex justify-end">
          <button className="w-full sm:w-100 bg-orange-500 text-white py-2  rounded-lg hover:bg-orange-600 mt-4 ">
            Selesai
          </button>
        </div>
      </main>
    </div>
  );
}
