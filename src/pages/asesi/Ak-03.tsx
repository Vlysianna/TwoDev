import React, { useState } from 'react';
import { Monitor, ChevronLeft, Search, X } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';

export default function Ak03() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKompeten, setFilterKompeten] = useState('all');
    const [hasil, setHasil] = useState<{ [key: number]: string }>({});
    const [catatan, setCatatan] = useState<{ [key: number]: string }>({});
    const [showModalBarcode, setShowModalBarcode] = useState(false);
    const [showModalConfrimAsesment, setShowModalConfrimAsesment] = useState(false);


    const data = [
        {
            id: 1,
            komponen: "Saya mendapatkan penjelasan yang cukup memadai mengenai proses asesmen/uji kompetensi",
        },
        {
            id: 2,
            komponen: "Saya diberikan kesempatan untuk mempelajari standar kompetensi yang akan diuji dan menilai diri sendiri terhadap pencapaiannya",
        },
        {
            id: 3,
            komponen: "Asesor memberikan kesempatan untuk mendiskusikan/menegosiasikan metoda, instrumen dan sumber asesmen serta jadwal asesmen",
        },
        {
            id: 4,
            komponen: "Asesor berusaha menggali seluruh bukti pendukung yang sesuai dengan latar belakang pelatihan dan pengalaman yang saya miliki",
        },
        {
            id: 5,
            komponen: "Saya sepenuhnya diberikan kesempatan untuk mendemonstrasikan kompetensi yang saya miliki selama asesmen",
        },
        {
            id: 6,
            komponen: "Saya mendapatkan penjelasan yang memadai mengenai keputusan asesmen",
        },
        {
            id: 7,
            komponen: "Asesor memberikan umpan balik yang mendukung setelah asesmen serta tindak lanjutnya",
        },
        {
            id: 8,
            komponen: "Asesor bersama saya mempelajari semua dokumen asesmen serta menandatanganinya",
        },
        {
            id: 9,
            komponen: "Saya mendapatkan jaminan kerahasiaan hasil asesmen serta penjelasan penanganan dokumen asesmen",
        },
        {
            id: 10,
            komponen: "Asesor menggunakan keterampilan komunikasi yang efektif selama asesmen",
        },
    ];


    const handleHasilChange = (id: number, value: string) => {
        setHasil(prev => ({
            ...prev,
            [id]: value
        }));
        setFilterKompeten('all'); // Reset filter saat mengubah manual
    };

    const handleCatatanChange = (id: number, value: string) => {
        setCatatan(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFilterChange = (value: string) => {
        setFilterKompeten(value);

        if (value === 'kompeten' || value === 'belum') {
            setHasil(prev => {
                const newHasil = { ...prev };
                data.forEach(item => {
                    newHasil[item.id] = value;
                });
                return newHasil;
            });
        }
    };

    const filteredData = data.filter(item => {
        const matchesSearch = item.komponen.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterKompeten === 'all' ||
            (filterKompeten === 'kompeten' && hasil[item.id] === 'kompeten') ||
            (filterKompeten === 'belum' && hasil[item.id] === 'belum');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi
                        title='Umpan balik dan catatan asesmen'
                        icon={
                            <Link to={"#"} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>
                <div className="m-10">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 space-y-4">
                        {/* Baris 1 */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="block text-sm font-medium text-gray-800">
                                Skema Sertifikasi ( Okupasi )
                            </span>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-800">
                                    Okupasi Junior Coder
                                </span>
                                <span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
                                    SKM.RPL.PJ/LSPSMK24/2023
                                </span>
                            </div>
                        </div>

                        {/* Baris 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Asesi</label>
                                <select className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>Pilih Asesi</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Asesor</label>
                                <select className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>Pilih Asesor</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">TUK</label>
                                <select className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>TUK</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm px-5 py-7">
                        {/* Header with search and filter */}
                        <div className="pb-7">
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center w-full gap-4 md:gap-6">
                                {/* Search */}
                                <div className="relative w-full sm:flex-1 min-w-[200px]">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                </div>

                                {/* Filter Kompeten with Select All options */}
                                <div className="flex flex-wrap items-center gap-3 md:gap-6 sm:flex-none">
                                    {[
                                        { value: "kompeten", label: "Semua Kompeten" },
                                        { value: "belum", label: "Semua Belum Kompeten" }
                                    ].map(opt => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
          ${filterKompeten === opt.value ? "bg-[#E77D3533]" : ""}`}
                                        >
                                            <input
                                                type="radio"
                                                name="filter"
                                                value={opt.value}
                                                checked={filterKompeten === opt.value}
                                                onChange={(e) => handleFilterChange(e.target.value)}
                                                className="hidden"
                                            />
                                            <span
                                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
            ${filterKompeten === opt.value ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
                                            >
                                                {filterKompeten === opt.value && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="white"
                                                        className="w-3 h-3"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className={filterKompeten === opt.value ? "text-gray-900" : "text-gray-500"}>
                                                {opt.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="w-full overflow-x-auto border border-gray-200 rounded-sm">
                            <div className="max-h-96 overflow-y-auto">
                                <table className="w-full min-w-[600px] lg:min-w-[800px] table-auto border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="w-[5%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
                                                No
                                            </th>
                                            <th className="w-[40%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
                                                Komponen
                                            </th>
                                            <th className="w-[25%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
                                                Hasil
                                            </th>
                                            <th className="w-[30%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
                                                Catatan/Komentar Asesi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item) => (
                                            <tr key={item.id} className="border-t border-gray-200">
                                                <td className="px-2 py-2 text-xs sm:text-sm text-gray-900 text-center">
                                                    {item.id}
                                                </td>
                                                <td className="px-2 py-2 text-xs sm:text-sm text-gray-900 break-words">
                                                    {item.komponen}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 sm:gap-4">
                                                        {/* Radio Kompeten */}
                                                        <label
                                                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm
                  ${hasil[item.id] === 'kompeten' ? "bg-[#E77D3533]" : ""}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`hasil-${item.id}`}
                                                                value="kompeten"
                                                                checked={hasil[item.id] === 'kompeten'}
                                                                onChange={(e) => handleHasilChange(item.id, e.target.value)}
                                                                className="hidden"
                                                            />
                                                            <span
                                                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                    ${hasil[item.id] === 'kompeten' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
                                                            >
                                                                {hasil[item.id] === 'kompeten' && (
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 20 20"
                                                                        fill="white"
                                                                        className="w-3 h-3">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span className={hasil[item.id] === 'kompeten' ? "text-gray-900" : "text-gray-500"}>
                                                                Kompeten
                                                            </span>
                                                        </label>

                                                        {/* Radio Belum Kompeten */}
                                                        <label
                                                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm
                  ${hasil[item.id] === 'belum' ? "bg-[#E77D3533]" : ""}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`hasil-${item.id}`}
                                                                value="belum"
                                                                checked={hasil[item.id] === 'belum'}
                                                                onChange={(e) => handleHasilChange(item.id, e.target.value)}
                                                                className="hidden"
                                                            />
                                                            <span
                                                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                    ${hasil[item.id] === 'belum' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
                                                            >
                                                                {hasil[item.id] === 'belum' && (
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 20 20"
                                                                        fill="white"
                                                                        className="w-3 h-3">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span className={hasil[item.id] === 'belum' ? "text-gray-900" : "text-gray-500"}>
                                                                Belum Kompeten
                                                            </span>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <textarea
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                        value={catatan[item.id] || ""}
                                                        onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                                                        placeholder="Masukkan catatan..."
                                                        rows={3}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan/komentar lainnya (apabila ada) :
                            </label>

                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] text-sm"
                                placeholder="Catatan"
                                rows={4}
                            />

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 w-full">
                                <button
                                    type="button"
                                    onClick={() => setShowModalBarcode(true)}
                                    className="w-full sm:w-auto px-30 py-2 border border-[#E77D35] text-sm text-[#E77D35] rounded hover:bg-[#E77D3533] transition cursor-pointer"
                                >
                                    Barcode
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModalConfrimAsesment(true)}
                                    className="w-full sm:w-auto px-30 py-2 bg-[#E77D35] text-sm text-white rounded hover:bg-orange-600 transition cursor-pointer"
                                >
                                    Lanjut
                                </button>
                            </div>
                        </div>
                    </div>
                    {showModalBarcode && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg shadow-lg relative">
                                {/* Tombol X pakai lucide-react */}
                                <button
                                    onClick={() => setShowModalBarcode(false)}
                                    className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
                                >
                                    <X size={20} />
                                </button>

                                {/* QR Code wrapper */}
                                <div className="flex items-center justify-center">
                                    <div className="p-10 rounded-md">
                                        <img
                                            src="/img/cthbarkod.svg"
                                            alt="QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModalConfrimAsesment && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-[999]">
                            <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
                                <div className="mb-4 flex justify-center">
                                    <img src="/img/confirm-asesmen.svg" alt="Pria Sigma" />
                                </div>

                                <h2 className="font-bold text-lg mb-2">Konfirmasi: Anda akan memasuki sesi asesmen.</h2>
                                <p className="text-gray-500 text-sm mb-10">
                                    Setelah dimulai, sesi tidak dapat dijeda atau dibatalkan. Mohon pastikan Anda siap sebelum melanjutkan.
                                </p>

                                <div className="flex justify-between gap-2">
                                    <button
                                        onClick={() => setShowModalConfrimAsesment(false)}
                                        className="flex-1 border border-[#E77D35] text-[#E77D35] py-2 rounded hover:bg-orange-50 cursor-pointer"
                                    >
                                        Batalkan
                                    </button>
                                    <Link
                                        to={paths.asesi.ia05}
                                        className="flex-1 bg-[#E77D35] text-white py-2 rounded hover:bg-orange-600 cursor-pointer text-center"
                                    >
                                        Lanjut
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}