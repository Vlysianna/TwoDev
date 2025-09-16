import React, { useState, useEffect } from 'react';
import { FileCheck2, ChevronLeft, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import NavbarAsesor from '@/components/NavAsesor';
import { getAssetPath } from '@/utils/assetPath';

export default function FaktaIntegritas() {

    const integritasList = [
        "Berperan secara pro aktif dalam upaya pencegahan dan pemberantasan korupsi, kolusi dan neporisme serta tidak melibatkan diri dalam perbuatan tercela.",
        "Tidak meminta atau menerima memberikan secara langsung atau tidak langsung berupa suap, hadiah, bantuan atau bentuk lainnya yang tidak sesuai dengan ketentuan yang berlaku.",
        "Bersikap transparan, jujur, obyektif dan akuntabel dalam melaksanakan tugas",
        "Bebas dari kepentingan apapun dalam melaksanakan tugas assemen dengan tidak memiliki, tidak menghambat dan tidak diskriminatif.",
        "Akan menjaga kerahasiaan semua informasi yang diperoleh melalui komitmen terhadap perundang-undangan yang berlaku. Informasi tersebut tidak boleh diberikan kepada pihak yang tidak berwenang tanga persetujuan tertulis dari manajemen LSP SMKN 24 Jakarta.",
        "Akan menyampaikan informasi penyimpangan integritas di LSP SMKN 24 Jakarta, serta turut menjaga kerahasiaan saksi atas pelanggaran peraturan yang dilaporkan."
    ];


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Fakta Integritas'
                        icon={
                            <Link to={paths.asesi.dataSertifikasi} className="text-gray-500 hover:text-gray-600">
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
                                    Fakta Integritas
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                                Formulir ini digunakan untuk menyatakan komitmen pribadi dalam menjaga integritas, profesionalitas, dan kejujuran dalam melaksanakan tugas sesuai dengan ketentuan yang berlaku.
                            </p>
                        </div>

                        <div className="pt-6">
                            {/* Top grid responsive */}
                            <h2 className="font-semibold text-gray-800 mb-3">
                                Saya Yang Bertanda Tangan Di bawah Ini:
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-8">
                                <div className="lg:col-span-4">
                                    <label className="block text-sm font-sm text-gray-700 mb-2">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="nama"
                                        placeholder="Masukkan nama anda"
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-sm text-gray-700 mb-2">
                                        Alamat
                                    </label>
                                    <input
                                        type="text"
                                        name="alamat"
                                        placeholder="Masukkan alamat anda"
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-sm text-gray-700 mb-2">
                                        Tempat Lahir
                                    </label>
                                    <input
                                        type="text"
                                        name="tempatLahir"
                                        placeholder="Masukkan tempat lahir anda"
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih Tanggal
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="tanggal"
                                            className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-sm text-gray-700 mb-2">
                                        Jabatan
                                    </label>
                                    <input
                                        type="text"
                                        name="jabatan"
                                        placeholder="Masukkan jabatan anda"
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Declaration Sections */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* Kiri: isi teks */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Dengan ini menyatakan bahwa saya :</h3>
                                            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 my-4">
                                                {integritasList.map((item, index) => (
                                                    <li key={index}><span className='ml-2'>{item}</span></li>
                                                ))}
                                            </ol>
                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                Apabila saya melanggar hal-hal yang telah saya nyatakan dalam Fakta Integritas di atas, saya bersedia dikenakan sanksi sesuai dengan peraturan perundang-undangan , peraturan BNSP dan Panduan Mutu LSP SMKN 24 Jakarta.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kanan: QR Code */}
                                    <div className="flex flex-col items-center p-5 space-y-4">
                                        <div className="flex justify-center">
                                            <p className="text-sm text-gray-400">
                                                Jakarta, 24 Oktober 2025
                                            </p>
                                        </div>

                                        <div className="border rounded-md p-10 shadow-sm flex items-center w-60 h-60">
                                            {/* <img
                                                src="/img/cthbarkod.svg"
                                                alt="QR Code"
                                                className="w-40 h-40"
                                            /> */}
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-[#E77D35] hover:bg-orange-600 text-white py-2 rounded transition-colors cursor-pointer"
                                        >
                                            Generate QR
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-10 border-t border-gray-200 pt-6 flex justify-center sm:justify-end">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[#E77D35] hover:bg-orange-600 text-white py-2 px-30 rounded transition-colors cursor-pointer"
                                >
                                    Lanjut
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}