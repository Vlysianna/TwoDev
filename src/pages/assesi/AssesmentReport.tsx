import React, { useState } from "react";
import NavbarAssesor from "../../components/ui/NavbarAssesor";
import { NotepadText } from "lucide-react";

export default function LaporanAsesmen() {
  const [assesseeName, setAssesseeName] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [date, setDate] = useState("");
  const [recommendations, setRecommendations] = useState<
    Record<number, string>
  >({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [positiveNegative, setPositiveNegative] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [catatan, setCatatan] = useState("");
  const [asesor, setAsesor] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [noReg, setNoReg] = useState("");
    const asesorList = [
        { id: 1, name: "Asesor 1" },
        { id: 2, name: "Asesor 2" },
        { id: 3, name: "Asesor 3" },
    ];
    const [finalAssessee, setFinalAssessee] = useState("");

  const [finalAssessor, setFinalAssessor] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [regNumber, setRegNumber] = useState("");

  const asesiList = [
    { id: 1, name: "Adelia Tri Ramadhani", ket: "Sangat Baik" },
    { id: 2, name: "Ahmad Akmal Fauzan", ket: "" },
    { id: 3, name: "Ahmad Zaqi", ket: "Sangat Baik" },
    { id: 4, name: "Aisha Sakar Puri", ket: "" },
  ];

  const handleSubmit = () => {
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavbarAssesor
        title="Laporan Asesmen - FR.AK.05"
        icon={<NotepadText className="w-6 h-6" />}
      />

      {/* Main Content */}
      <div className="pt-20 px-6 pb-6 max-w-7xl mx-auto">
        {/* Header Info */}
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
                SKM.RPL.PJ/LSPSMK24/2023
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select
              value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              style={{ "--tw-ring-color": "#FF7601" } as React.CSSProperties}
            >
              <option value="">Nama Asesor</option>
              <option value="Asesor 1">Asesor 1</option>
              <option value="Asesor 2">Asesor 2</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)} placeholder="Pilih Tanggal"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1"
              style={{ "--tw-ring-color": "#FF7601" } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Table */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
  <table className="w-full text-sm border border-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="border px-3 py-3 w-12 text-center">No.</th>
        <th className="border px-3 py-3 w-1/3">Nama Asesi</th>
        <th className="border px-3 py-3 w-1/3 text-center">Rekomendasi</th>
        <th className="border px-3 py-3 w-1/3 text-center">Keterangan</th>
      </tr>
    </thead>
    <tbody>
      {asesiList.map((a) => (
        <tr key={a.id} className="hover:bg-gray-50 align-top">
          <td className="border px-3 py-4 text-center">{a.id}</td>
          <td className="border px-3 py-4">{a.name}</td>
          <td className="border px-3 py-4">
            <div className="flex flex-row gap-24 items-center ">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`rek-${a.id}`}
                  checked={recommendations[a.id] === "Kompeten"}
                  onChange={() =>
                    setRecommendations({
                      ...recommendations,
                      [a.id]: "Kompeten",
                    })
                  }
                />
                Kompeten
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`rek-${a.id}`}
                  checked={recommendations[a.id] === "Belum Kompeten"}
                  onChange={() =>
                    setRecommendations({
                      ...recommendations,
                      [a.id]: "Belum Kompeten",
                    })
                  }
                />
                Belum Kompeten
              </label>
            </div>
          </td>
          <td className="border px-3 py-4">
            <input
              type="text"
              value={notes[a.id] || ""}
              onChange={(e) =>
                setNotes({ ...notes, [a.id]: e.target.value })
              }
              placeholder={a.ket}
              className="w-full border-gray-300 rounded-md text-sm px-2 py-1"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Kolom kiri */}
    <div>
      <p className="text-xs text-gray-500 mb-4">
        ** Tuliskan Kode dan Judul Unit Kompetensi yang dinyatakan BK bila mengases satu skema
      </p>

      <label className="block text-sm mb-1 font-medium">
        Aspek Negatif dan Positif dalam Asesmen
      </label>
      <textarea
        value={positiveNegative}
        onChange={(e) => setPositiveNegative(e.target.value)}
        className="w-full border rounded-md p-2 mb-4"
      />

      <label className="block text-sm mb-1 font-medium">
        Pencatatan Penolakan Hasil Asesmen
      </label>
      <textarea
        value={rejectionNotes}
        onChange={(e) => setRejectionNotes(e.target.value)}
        className="w-full border rounded-md p-2 mb-4"
      />

      <label className="block text-sm mb-1 font-medium">
        Saran Perbaikan : (Asesor/Personil Terkait)
      </label>
      <textarea
        value={suggestions}
        onChange={(e) => setSuggestions(e.target.value)}
        className="w-full border rounded-md p-2"
      />
    </div>

    {/* Kolom kanan */}
    <div>
    
      <textarea
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        className="w-full border rounded-md p-2 mb-4 mt-14" placeholder="Catatan"
      />

      <label className="block text-sm mb-1 font-medium">Asesor</label>
      <div className="flex gap-2 mb-4">
        <select
          value={asesor}
          onChange={(e) => setAsesor(e.target.value)}
          className="w-1/2 border rounded-md p-2"
        >
          <option value="">Pilih Asesor</option>
          {asesorList.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="w-1/2 border rounded-md p-2"
        />
      </div>

      <label className="block text-sm  font-medium mt-12">No. Reg</label>
      <input
        type="text"
        value={noReg}
        onChange={(e) => setNoReg(e.target.value)}
        placeholder="Masukkan nomor reg"
        className="w-full border rounded-md p-2 mb-4 mt-2"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium mt-8"
      >
        Submit
      </button> 
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
