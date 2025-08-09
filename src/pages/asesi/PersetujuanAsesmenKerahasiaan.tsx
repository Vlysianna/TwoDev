import React, { useState } from 'react';
import { FileCheck2, ChevronLeft, X } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';

export default function PersetujuanAsesmenKerahasiaan() {
    const [selectedAsesi, setSelectedAsesi] = useState('');
    const [selectedAsesor, setSelectedAsesor] = useState('');
    const [selectedTUK, setSelectedTUK] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [waktu, setWaktu] = useState('');
    const [showModal, setShowModal] = useState(false);

    type CheckedItemKey =
        | 'verifikasiPortofolio'
        | 'reviewProduk'
        | 'observasiLangsung'
        | 'kegiatanTerstruktur'
        | 'pertanyaanLisan'
        | 'pertanyaanTertulis'
        | 'pertanyaanWawancara'
        | 'lainnya';

    const [checkedItems, setCheckedItems] = useState<Record<CheckedItemKey, boolean>>({
        verifikasiPortofolio: false,
        reviewProduk: false,
        observasiLangsung: false,
        kegiatanTerstruktur: false,
        pertanyaanLisan: false,
        pertanyaanTertulis: false,
        pertanyaanWawancara: false,
        lainnya: false
    });

    const checkboxOptions: { key: CheckedItemKey; label: string }[] = [
        { key: 'verifikasiPortofolio', label: 'Verifikasi Portofolio' },
        { key: 'reviewProduk', label: 'Review Produk' },
        { key: 'observasiLangsung', label: 'Observasi Langsung' },
        { key: 'kegiatanTerstruktur', label: 'Kegiatan Terstruktur' },
        { key: 'pertanyaanLisan', label: 'Pertanyaan Lisan' },
        { key: 'pertanyaanTertulis', label: 'Pertanyaan Tertulis' },
        { key: 'pertanyaanWawancara', label: 'Pertanyaan Wawancara' },
        { key: 'lainnya', label: 'Lainnya' }
    ];


    const handleCheckboxChange = (key: CheckedItemKey) => {
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi
                        title='Persetujuan Asesmen dan Kerahasiaan'
                        icon={
                            <Link to="/data-sertifikasi" className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>
                <div className="px-6 pb-7">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Header Section */}
                        <div className="mb-4 border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2">
                                <FileCheck2 className="text-black-500" size={20} />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Persetujuan Asesmen dan Kerahasiaan
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                                Persetujuan Asesmen ini untuk menjamin bahwa Asesi telah diberi arahan secara rinci tentang perencanaan dan proses asesmen
                            </p>
                        </div>

                        <div className="pt-6">
                            {/* Top grid 2 columns */}
                            <div className="grid grid-cols-12 gap-8">
                                {/* Left column */}
                                <div className="col-span-7">
                                    <h2 className="font-semibold text-gray-800 mb-3">Skema Sertifikasi (KKNI/Okupasi/Klaster)</h2>
                                    <div className="text-sm mb-7 flex items-center gap-2">
                                        <span className="text-gray-700">Pemrogram Junior (Junior Coder)</span>
                                        <span className="bg-orange-100 text-[#E77D35] text-xs rounded px-2 py-1 select-none">
                                            SKM.RPL.PJ/LSPSMK24/2023
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <select
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                            value={selectedAsesi}
                                            onChange={(e) => setSelectedAsesi(e.target.value)}
                                        >
                                            <option value="">Pilih Asesi</option>
                                            <option value="asesi1">Asesi 1</option>
                                            <option value="asesi2">Asesi 2</option>
                                        </select>
                                        <select
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                            value={selectedAsesor}
                                            onChange={(e) => setSelectedAsesor(e.target.value)}
                                        >
                                            <option value="">Pilih Asesor</option>
                                            <option value="asesor1">Asesor 1</option>
                                            <option value="asesor2">Asesor 2</option>
                                        </select>
                                    </div>

                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Pelaksanaan asesmen disepakati pada:
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                            value={tanggal}
                                            onChange={(e) => setTanggal(e.target.value)}
                                            placeholder="Pilih tanggal"
                                        />
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                            value={waktu}
                                            onChange={(e) => setWaktu(e.target.value)}
                                            placeholder="Waktu"
                                        />
                                        <select
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                                            value={selectedTUK}
                                            onChange={(e) => setSelectedTUK(e.target.value)}
                                        >
                                            <option value="">TUK</option>
                                            <option value="tuk1">TUK 1</option>
                                            <option value="tuk2">TUK 2</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="col-span-5">
                                    <h2 className="font-semibold text-gray-800 mb-3">Bukti yang akan dikumpulkan</h2>
                                    <div className="grid grid-cols-2 gap-y-6 gap-x-6 text-sm mt-4">
                                        {checkboxOptions.map(option => {
                                            const checked = checkedItems[option.key];
                                            return (
                                                <label
                                                    key={option.key}
                                                    className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
                                                                ${checked ? "bg-orange-100 " : ""}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={checked}
                                                        onChange={() => handleCheckboxChange(option.key)}
                                                    />
                                                    <span
                                                        className={`w-4 h-4 flex items-center justify-center rounded-xs border-2
                                                                ${checked ? "bg-orange-500 border-orange-500" : "border-orange-400"}`}
                                                    >
                                                        {checked && (
                                                            <svg
                                                                className="w-3 h-3 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <span className={checked ? "text-gray-900" : "text-gray-500"}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Declaration Sections */}
                            <div className="mt-8 border-t border-gray-200 pt-6 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Bahwa saya telah mendapatkan penjelasan terkait hak dan prosedur banding asesmen dari asesor.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Asesor :</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Menyatakan tidak akan membuka hasil pekerjaan yang saya peroleh karena penugasan saya sebagai Asesor dalam pekerjaan Asesmen kepada siapapun atau organisasi apapun selain kepada pihak yang berwenang sehubungan dengan kewajiban saya sebagai Asesor yang ditugaskan oleh LSP.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Saya setuju mengikuti asesmen dengan pemahaman bahwa informasi yang dikumpulkan hanya digunakan untuk pengembangan profesional dan hanya dapat diakses oleh orang tertentu saja.
                                    </p>
                                </div>
                            </div>

                            {/* QR Scan Button */}
                            <div className="mt-10 border-t border-gray-200 pt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-[#E77D35] hover:bg-orange-600 text-white py-3 px-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    QR Scan
                                </button>
                            </div>

                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg p-6 max-w-sm w-full relative text-center">
                                        {/* Tombol close */}
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-black hover:cursor-pointer"
                                        >
                                            <X size={20} />
                                        </button>

                                        <h2 className="text-lg font-semibold mb-2">Tanda tangan Asesor</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Silakan scan QR Code yang tersedia untuk melakukan tanda tangan
                                            dan melanjutkan ke tahap berikutnya.
                                        </p>

                                        {/* Gambar QR */}

                                        <div className="flex justify-center items-center p-10">
                                            <img
                                                src="public/img/cthbarkod.svg" // ganti dengan path QR code kamu
                                                alt="QR Code"
                                                className="w-[200px] h-[200px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}