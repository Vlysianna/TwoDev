import { ChevronLeft, Clock, AlertCircle, CheckCircle, Monitor, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import NavbarAsesor from '@/components/NavAsesor';

interface Question {
  id: number;
  text: string;
  pencapaian: string;
  tanggapan: string;
}

export default function FRIA03() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([
      { id: 1, text: '', pencapaian: '', tanggapan: '' },
    ]);

    const header = {
        asesi: "Ananda Keizha Oktavian",
        asesor: "Eva Yeprilianti, S.Kom",
        tanggalMulai: "24 Oktober 2025",
        waktuMulai: "07:00 - 15:00",
        tanggalSelesai: "24 Oktober 2025",
        waktuSelesai: "07:00 - 15:00",
        skema: "Pemrogram Junior ( Junior Coder )",
        kodeSkema: "SKM.RPL.PJ/LSPMK24/2023",
    };

    const panduanList = [
        "Formulir ini di isi oleh asesor kompetensi dapat sebelum, pada saat atau setelah melakukan asesmen dengan metode observasi demonstrasi.",
        "Pertanyaan dibuat dengan tujuan untuk menggali jawaban yang berkaitan dengan dimensi Kompetensi, batasan variabel dan aspek kritis yang relevan dengan skenario tugas dan praktik demonstrasi.",
        "Jika pertanyaan disampaikan sebelum asesi melakukan praktik demonstrasi, maka pertanyaan dibuat berkaitan dengan aspek K3, SOP, penggunaan peralatan dan perlengkapan.",
        "Jika setelah asesi melakukan praktik demonstrasi terdapat item pertanyaan pendukung observasi telah terpenuhi maka pertanyaan tersebut tidak perlu ditanyakan lagi dan cukup memberikan catatan bahwa sudah terpenuhi pada saat tugas praktik demonstrasi pada kolom tanggapan.",
        "Jika pada saat observasi ada hal yang perlu dikonfirmasi sedangkan di instrumen dasar pertanyaan pendukung observasi tidak ada, maka asesor dapat memberikan pertanyaan dengan catatan pertanyaan harus berkaitan dengan tugas praktik demonstrasi. Jika dilakukan, asesor harus mencatat dalam instrumen pertanyaan pendukung observasi.",
        "Tanggapan asesi ditulis pada kolom tanggapan."
    ];

    const tabs = [
        { id: 'all', label: 'All unit ( 8 )', active: true },
        { id: 'k1', label: 'K.Pekerjaan 1', active: false },
        { id: 'k2', label: 'K.Pekerjaan 2', active: false },
        { id: 'k3', label: 'K.Pekerjaan 3', active: false },
    ];

    const unitKompetensi = [
        {
            id: 1,
            title: "Menggunakan Struktur Data",
            code: "J.620100.004.02",
            status: "finished"
        },
        {
            id: 2,
            title: "Menggunakan Spesifikasi Program",
            code: "J.620100.009.01",
            status: null
        },
        {
            id: 3,
            title: "Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia",
            code: "J.620100.010.01",
            status: null
        },
        {
            id: 4,
            title: "Menulis Kode Dengan Prinsip Sesuai Guidelines dan Best Practices",
            code: "J.620100.016.01",
            status: null
        },
        {
            id: 5,
            title: "Mengimplementasikan Pemrograman Terstruktur",
            code: "J.620100.026.02",
            status: null
        },
        {
            id: 6,
            title: "Membuat Dokumen Kode Program",
            code: "J.620100.025.02",
            status: null
        },
        {
            id: 7,
            title: "Melakukan Debugging",
            code: "J.620100.025.02",
            status: null
        },
        {
            id: 8,
            title: "Melaksanakan Pengujian Unit Program",
            code: "J.620100.053.02",
            status: null
        }
    ];

    // Add new question
    const addQuestion = () => {
      const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      setQuestions([...questions, { id: newId, text: '', pencapaian: '', tanggapan: '' }]);
    };

    // Remove question
    const removeQuestion = (id: number) => {
      if (questions.length > 1) {
        setQuestions(questions.filter(q => q.id !== id));
      }
    };

    // Update question text
    const updateQuestionText = (id: number, text: string) => {
      setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
    };

    // Update pencapaian
    const updatePencapaian = (id: number, pencapaian: string) => {
      setQuestions(questions.map(q => q.id === id ? { ...q, pencapaian } : q));
    };

    // Update tanggapan
    const updateTanggapan = (id: number, tanggapan: string) => {
      setQuestions(questions.map(q => q.id === id ? { ...q, tanggapan } : q));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Pertanyaan Untuk Mendukung Observasi - FR.IA.03'
                        icon={
                            <Link to={paths.asesi.dataSertifikasi} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 pb-7">

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Success State */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-green-800">{success}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        {/* Header Info */}
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                {/* Kiri */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        Skema Sertifikasi ( Okupasi )
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <Clock size={14} />
                                            Sewaktu
                                        </span>
                                    </h2>

                                    {/* Asesi & Asesor */}
                                    <div className="text-sm text-gray-500 mt-1">
                                        Asesi: <span className="text-gray-800">{header.asesi}</span> &nbsp;|&nbsp;
                                        Asesor: <span className="text-gray-800">{header.asesor}</span>
                                    </div>
                                </div>

                                {/* Kanan */}
                                <div className="flex-1 text-left sm:text-right">
                                    <div className="flex flex-col sm:items-end gap-1">
                                        {/* Skema + kode */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                            <p className="text-sm text-gray-800 font-medium">{header.skema}</p>
                                            <p className="text-xs text-[#E77D35] bg-[#E77D3533] px-2 py-0.5 rounded w-fit">
                                                {header.kodeSkema}
                                            </p>
                                        </div>

                                        {/* Tanggal */}
                                        <p className="text-sm text-gray-500">
                                            {header.tanggalMulai} | {header.waktuMulai} - {header.tanggalSelesai} | {header.waktuSelesai}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Petunjuk */}
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Panduan Bagi Asesor</h3>
                            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                {panduanList.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Skenario Tugas Praktik Demonstrasi */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-2 rounded-sm text-sm font-medium cursor-pointer whitespace-nowrap ${tab.active
                                        ? 'bg-[#E77D35] text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Unit Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {unitKompetensi.map((unit, index) => (
                                <div
                                    key={unit.id}
                                    className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="rounded-lg mr-3 flex-shrink-0">
                                            <Monitor size={16} className="text-[#E77D35]" />
                                        </div>
                                        <h4 className="font-medium text-[#E77D35] text-sm">
                                            Unit kompetensi {unit.id}
                                        </h4>
                                    </div>

                                    <h5 className="font-medium text-gray-800 mb-2 text-sm leading-tight">
                                        {unit.title}
                                    </h5>

                                    <p className="text-xs text-gray-500 mb-4">{unit.code}</p>

                                    <div className="flex items-center justify-between">
                                        {unit.status === "finished" ? (
                                            <span className="px-3 py-1 bg-[#E77D3533] text-[#E77D35] text-xs rounded">
                                                Finished
                                            </span>
                                        ) : (
                                            <div></div>
                                        )}

                                        <Link
                                            to={"#"}
                                            className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
                                        >
                                            Lihat detail
                                            <ChevronRight size={14} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pertanyaan */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Pertanyaan Observasi</h3>
                            <button 
                                onClick={addQuestion}
                                className="flex items-center gap-1 bg-[#E77D35] hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm hover:cursor-pointer transition-colors"
                            >
                                <Plus size={16} />
                                Tambah Pertanyaan
                            </button>
                        </div>
                        
                        <div className="border border-gray-200 mb-4 rounded-sm overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="w-[5%] text-center text-gray-700 font-medium py-2 px-4">No</th>
                                        <th className="w-[40%] text-center text-gray-700 font-medium py-2 px-4">Pertanyaan</th>
                                        <th className="w-[30%] text-center text-gray-700 font-medium py-2 px-4">Pencapaian</th>
                                        <th className="w-[25%] text-center text-gray-700 font-medium py-2 px-4">Tanggapan</th>
                                        <th className="w-[5%] text-center text-gray-700 font-medium py-2 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question, index) => (
                                        <tr key={question.id} className="border-b">
                                            <td className="w-[5%] py-3 px-4 text-center">{index + 1}</td>
                                            <td className="w-[40%] py-3 px-4">
                                                <input
                                                    type="text"
                                                    value={question.text}
                                                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                                                    placeholder="Masukkan pertanyaan"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                />
                                            </td>
                                            <td className="w-[30%] py-3 px-4">
                                                <div className="flex justify-center items-center gap-4">
                                                    {/* Kompeten */}
                                                    <label
                                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm
                                                            ${question.pencapaian === "kompeten" ? "bg-[#E77D3533]" : ""}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`pencapaian-${question.id}`}
                                                            value="kompeten"
                                                            checked={question.pencapaian === "kompeten"}
                                                            onChange={(e) => updatePencapaian(question.id, e.target.value)}
                                                            className="hidden"
                                                        />
                                                        <span
                                                            className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                                                ${question.pencapaian === "kompeten"
                                                                    ? "bg-[#E77D35] border-[#E77D35]"
                                                                    : "border-[#E77D35]"
                                                                }`}
                                                        >
                                                            {question.pencapaian === "kompeten" && (
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
                                                            className={
                                                                question.pencapaian === "kompeten" ? "text-gray-900" : "text-gray-500"
                                                            }
                                                        >
                                                            Kompeten
                                                        </span>
                                                    </label>

                                                    {/* Belum Kompeten */}
                                                    <label
                                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm
                                                            ${question.pencapaian === "belum" ? "bg-[#E77D3533]" : ""}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`pencapaian-${question.id}`}
                                                            value="belum"
                                                            checked={question.pencapaian === "belum"}
                                                            onChange={(e) => updatePencapaian(question.id, e.target.value)}
                                                            className="hidden"
                                                        />
                                                        <span
                                                            className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                                                ${question.pencapaian === "belum"
                                                                    ? "bg-[#E77D35] border-[#E77D35]"
                                                                    : "border-[#E77D35]"
                                                                }`}
                                                        >
                                                            {question.pencapaian === "belum" && (
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
                                                            className={
                                                                question.pencapaian === "belum" ? "text-gray-900" : "text-gray-500"
                                                            }
                                                        >
                                                            Belum Kompeten
                                                        </span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="w-[25%] py-3 px-4">
                                                <textarea
                                                    value={question.tanggapan}
                                                    onChange={(e) => updateTanggapan(question.id, e.target.value)}
                                                    placeholder="Tanggapan"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                />
                                            </td>
                                            <td className="w-[5%] py-3 px-4 text-center">
                                                {questions.length > 1 && (
                                                    <button 
                                                        onClick={() => removeQuestion(question.id)}
                                                        className="text-red-500 hover:text-red-700 transition hover:cursor-pointer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Umpan Balik untuk asesi sigma */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-stretch">
                            {/* Kolom 1 */}
                            <div className="lg:col-span-3 flex flex-col h-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Umpan Balik Untuk Asesi
                                </label>
                                <textarea
                                    name="umpanBalik"
                                    placeholder='Catatan'
                                    className="flex-1 w-full min-h-[100px] px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Kolom 2 */}
                            <div className="lg:col-span-2 space-y-4 h-full flex flex-col">
                                {/* Asesi */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asesi
                                    </label>
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            placeholder="Nama Asesi"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Asesor */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asesor
                                    </label>
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            placeholder="Nama Asesor"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Kode"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Tanggal"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kolom 3 */}
                            <div className="lg:col-span-1 h-full flex flex-col space-y-4">
                                <div className="border border-gray-200 rounded-lg w-full h-30 flex items-center justify-center">
                                    <img
                                        src="/img/cthbarkod.svg"
                                        alt="QR Code"
                                        className="w-20 h-20 bject-contain"
                                    />
                                </div>
                                <div className="border border-gray-200 rounded-lg w-full h-30 flex items-center justify-center">
                                    {/* <img
                                        src="/img/cthbarkod.svg"
                                        alt="QR Code"
                                        className="w-32 h-32 object-contain"
                                    /> */}
                                </div>
                                <button className="bg-[#E77D35] hover:bg-orange-600 text-white font-medium rounded py-2 w-full sm:w-auto">
                                    Generate QR
                                </button>
                            </div>
                        </div>


                        {/* Tombol */}
                        <div className="flex justify-center sm:justify-end mt-6 border-t border-gray-200 pt-4">
                            <button className="bg-[#E77D35] hover:bg-orange-600 text-white font-medium rounded px-6 sm:px-30 py-2 w-full sm:w-auto">
                                Lanjut
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}