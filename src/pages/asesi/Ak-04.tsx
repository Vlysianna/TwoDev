import React, { useState } from 'react';
import { Monitor, ChevronLeft, Search, X, ChevronUp, ChevronDown, Calendar, Replace } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';

export default function Ak04() {
    const [selectedCertificates, setSelectedCertificates] = useState([
        'J.620100.004.02',
        'J.620100.009.01',
        'J.620100.010.01'
    ]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [reason, setReason] = useState('');
    type QuestionKey = `question${number}`;
    const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
        question1: '',
        question2: '',
        question3: ''
    });

    const availableRoles = [
        { id: 'J.620100.004.02', selected: true },
        { id: 'J.620100.009.01', selected: true },
        { id: 'J.620100.010.01', selected: true },
        { id: 'J.620100.016.01', selected: false },
        { id: 'J.620100.023.02', selected: false },
        { id: 'J.620100.025.02', selected: false },
        { id: 'J.620100.029.02', selected: false },
        { id: 'J.620100.033.02', selected: false }
    ];

    const questions = [
        'Apakah Proses banding telah dijelaskan kepada anda?',
        'Apakah Anda telah mendiskusikan Banding dengan asesor?',
        'Apakah Anda mau melibatkan "orang lain" membantu Anda dalam Proses Banding?'
    ];

    const removeCertificate = (certId: string) => {
        setSelectedCertificates(prev => prev.filter(id => id !== certId));
    };

    const toggleRole = (roleId: string) => {
        const role = availableRoles.find(r => r.id === roleId);
        if (!role) return;
        if (selectedCertificates.includes(roleId)) {
            setSelectedCertificates(prev => prev.filter(id => id !== roleId));
        } else {
            setSelectedCertificates(prev => [...prev, roleId]);
        }
    };

    const handleAnswerChange = (questionKey: QuestionKey, value: string) => {
        setAnswers(prev => ({ ...prev, [questionKey]: value }));
    };

    const handleSubmit = () => {
        console.log('Form submitted with:', { selectedCertificates, reason, answers });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-5">
                    <NavbarAsesi
                        title='Umpan balik dan catatan asesmen'
                        icon={
                            <Link to={paths.asesi.dashboard} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>
                <div className="m-5">
                    {/* MAIN CONTENT */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 space-y-4">
                        {/* Baris 1 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Replace size={20} />
                            <span className="block text-lg font-bold text-gray-800">
                                Banding Asesmen
                            </span>
                        </div>

                        {/* Baris 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                            <div className="flex flex-col">
                                <select className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>Pilih Asesi</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <select className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>Pilih Asesor</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Questions */}
                        <div className="bg-white rounded-lg shadow-sm py-6 px-10">
                            <h3 className="font-medium text-gray-900 mb-6">
                                Jawablah dengan Ya atau Tidak pertanyaan-pertanyaan berikut ini
                            </h3>

                            <div className="space-y-6">
                                {questions.map((question, index) => (
                                    <div key={index} className="flex items-center justify-between gap-6">
                                        {/* Pertanyaan */}
                                        <p className="text-gray-700 text-sm leading-relaxed flex-1">
                                            {question}
                                        </p>

                                        {/* Pilihan Ya / Tidak */}
                                        <div className="flex gap-4">
                                            {/* YA */}
                                            <label
                                                className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm
            ${answers[`question${index + 1}`] === 'ya' ? "bg-[#E77D3533]" : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value="ya"
                                                    checked={answers[`question${index + 1}`] === 'ya'}
                                                    onChange={() => handleAnswerChange(`question${index + 1}`, 'ya')}
                                                    className="hidden"
                                                />
                                                <span
                                                    className={`w-4 h-4 flex items-center justify-center rounded-full border-2
              ${answers[`question${index + 1}`] === 'ya'
                                                            ? "bg-[#E77D35] border-[#E77D35]"
                                                            : "border-[#E77D35]"}`}
                                                >
                                                    {answers[`question${index + 1}`] === 'ya' && (
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
                                                <span
                                                    className={
                                                        answers[`question${index + 1}`] === 'ya'
                                                            ? "text-gray-900"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Ya
                                                </span>
                                            </label>

                                            {/* TIDAK */}
                                            <label
                                                className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm
            ${answers[`question${index + 1}`] === 'tidak' ? "bg-[#E77D3533]" : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value="tidak"
                                                    checked={answers[`question${index + 1}`] === 'tidak'}
                                                    onChange={() => handleAnswerChange(`question${index + 1}`, 'tidak')}
                                                    className="hidden"
                                                />
                                                <span
                                                    className={`w-4 h-4 flex items-center justify-center rounded-full border-2
              ${answers[`question${index + 1}`] === 'tidak'
                                                            ? "bg-[#E77D35] border-[#E77D35]"
                                                            : "border-[#E77D35]"}`}
                                                >
                                                    {answers[`question${index + 1}`] === 'tidak' && (
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
                                                <span
                                                    className={
                                                        answers[`question${index + 1}`] === 'tidak'
                                                            ? "text-gray-900"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Tidak
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Certificate Selection */}
                        <div className='bg-white rounded-lg shadow-sm py-6 px-10'>
                            <h3 className="font-medium text-gray-900 mb-4">
                                Banding ini diajukan atas keputusan asesmen yang dibuat terhadap Skema Sertifikasi ( Kualifikasi / Klaster / Okupasi ) berikut :
                            </h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    <span className="font-medium">Skema Sertifikasi :</span> Pemrogram Junior (Junior Coder)
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">No. Skema Sertifikasi</p>

                                <div className="relative">
                                    {/* Area klik utama */}
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="border border-[#E77D35] rounded p-3 min-h-[100px] bg-white cursor-pointer"
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCertificates.map((cert) => (
                                                <span
                                                    key={cert}
                                                    className="inline-flex items-center gap-2 bg-[#E77D3533] text-black-600 px-3 py-1 rounded-sm text-sm"
                                                >
                                                    {cert}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // biar klik X tidak ikut toggle dropdown
                                                            removeCertificate(cert);
                                                        }}
                                                        className="text-[#E77D35] hover:text-orange-600 ml-1 cursor-pointer"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Icon toggle di kanan */}
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                                            {showDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {showDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            <div className="p-2">
                                                <h4 className="font-medium text-gray-700 mb-2 text-sm">Available roles</h4>
                                                {availableRoles.map((role) => (
                                                    <label
                                                        key={role.id}
                                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
                                                        onClick={(e) => e.stopPropagation()} // biar klik di dalam dropdown tidak menutup
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCertificates.includes(role.id)}
                                                            onChange={() => toggleRole(role.id)}
                                                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{role.id}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-4 pt-6 border-t border-gray-200 bg-white rounded-lg shadow-sm p-5 space-y-4">
                        {/* Baris 1 */}
                        <p className="text-sm text-gray-700 font-medium">
                            Banding ini diajukan atas alasan sebagai berikut :
                        </p>

                        {/* Baris 2 - Catatan & QR Code */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Catatan */}
                            <div className="md:col-span-2">
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Catatan"
                                    className="w-full h-full p-3 border border-gray-300 rounded-md resize-none 
                 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-h-[150px]"
                                    rows={6}
                                />
                            </div>

                            {/* QR Code */}
                            <div className="flex items-center justify-center">
                                <div className="w-full h-full border border-gray-300 rounded-md flex items-center justify-center p-4">
                                    <img
                                        src="/img/cthbarkod.svg"
                                        alt="QR Code"
                                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Baris 3 - Keterangan + Tombol */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Anda mempunyai hak mengajukan banding jika Anda menilai Proses Asesmen tidak sesuai SOP dan tidak memenuhi Prinsip Asesmen.
                            </p>
                        </div>

                        <hr className="border-t border-gray-200" />

                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-30 py-2 bg-[#E77D35] text-white rounded-md 
               hover:bg-orange-600 focus:outline-none focus:ring-2 
               focus:ring-[#E77D35] focus:ring-offset-2 font-medium cursor-pointer"
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