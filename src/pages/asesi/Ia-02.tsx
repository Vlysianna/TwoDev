import { ChevronLeft, Clock, AlertCircle, CheckCircle, Monitor, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';

export default function Ia02() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    const petunjukList = [
        "Baca dan pelajari setiap instruksi kerja di bawah ini dengan cermat sebelum melaksanakan praktek",
        "Klarifikasi kepada assessor kompetensi apabila ada hal-hal yang belum jelas",
        "Laksanakan pekerjaan sesuai dengan urutan proses yang sudah ditetapkan",
        "Seluruh proses kerja mengacu kepada SOP/WI yang dipersyaratkan (Jika Ada)",
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

    const keteranganList = [
        "Persiapan ruang kerja/kitchen",
        "Persiapan alat",
        "Persiapan bahan",
        "Pemilihan bahan baku yang sesuai",
        "Pengelompokan bahan sesuai menu",
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-5">
                    <NavbarAsesi
                        title='Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR.IA.02'
                        icon={
                            <Link to={'#'} className="text-gray-500 hover:text-gray-600">
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
                                    <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
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
                            <h3 className="text-sm font-medium text-gray-800 mb-2">A. Petunjuk</h3>
                            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                                {petunjukList.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Skenario Tugas Praktik Demonstrasi */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        <h3 className="text-sm font-medium text-gray-800 mb-6">B. Skenario Tugas Praktik Demonstrasi</h3>

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
                                            to={paths.asesi.assessment.apl02DetailPattern}
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

                    {/* Keterangan */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        <div className="pt-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Skenario Tugas Praktik Demonstrasi</h3>
                            <p className='text-sm text-gray-700'>
                                Dalam rangka mencapai kualifikasi food product, anda diharapkan mampu mengolah makanan secara profesional untuk mendukung pencapaian hasil sesuai dengan spesifikasi yang telah ditentukan. Oleh karena itu anda akan diperlengkapi dengan peralatan kitchen utensil dan kitchen equipment sesuai dengan lembar kerja dan SOP/IK terkait. Dalam kelompok 1 anda dapat melakukan …
                            </p>
                            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 my-2">
                                {keteranganList.map((item, index) => (
                                    <li key={index}><span className='ml-5'>{item}</span></li>
                                ))}
                            </ol>
                            <p className='text-sm text-gray-700'>
                                Dalam penerapannya Anda juga diminta untuk menggunakan alat pelindung diri (APD) yang sesuai serta perlengkapan keselamatan lainnya selama proses pengolahan makanan berlangsung.
                            </p>
                            <p className="text-sm text-gray-700">
                                Perlengkapan dan Peralatan: baju masak, apron, necktie, serbet, bowl, pisau, cutting board, dll.
                            </p>
                            <h3 className="text-xl font-semibold text-gray-800 my-3">Durasi Waktu : 20 Menit</h3>
                        </div>
                    </div>

                    {/* Validasi anjay */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">

                            {/* Bagian kiri (2 kolom) */}
                            <div className="lg:col-span-5 space-y-4">
                                {/* Asesi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asesi
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder='Nama Asesi'
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="date"
                                            placeholder='Tanggal'
                                            className="w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Asesor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asesor
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder='Nama Asesor'
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="date"
                                            placeholder='Tanggal'
                                            className="w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Kode */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Kode'
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Bagian kanan (QR Code) */}
                            <div className="h-full flex">
                                <div className="border border-gray-200 rounded-lg p-3 w-full flex items-center justify-center">
                                    <img
                                        src="/img/cthbarkod.svg"
                                        alt="QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
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