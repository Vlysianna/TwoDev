import React, { useState, useEffect } from 'react';
import { Upload, X, Eye, Monitor, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import NavbarAsesor from '@/components/NavAsesor';

export default function CekAsesmenMandiri() {
    const { user } = useAuth();
    const [selectedAssessor, setSelectedAssessor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [recommendation, setRecommendation] = useState('can-continue');
    const [loading, setLoading] = useState(false); // Changed to false for demo
    const [error, setError] = useState<string | null>(null);
    const [assessments, setAssessments] = useState<any[]>([]);
    const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
    const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
    const [availableAssessors, setAvailableAssessors] = useState<any[]>([]);

    // Dummy data for demonstration
    const dummyCompetencyUnits = [
        {
            id: 1,
            title: 'Menggunakan Struktur Data',
            code: 'J.620100.004.02',
            status: 'Finished'
        },
        {
            id: 2,
            title: 'Menggunakan Spesifikasi Program',
            code: 'J.620100.009.01',
            status: 'pending'
        },
        {
            id: 3,
            title: 'Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia',
            code: 'J.620100.010.01',
            status: 'pending'
        },
        {
            id: 4,
            title: 'Menulis Kode Dengan Prinsip Sesuai Guidelines dan Best Practices',
            code: 'J.620100.016.01',
            status: 'pending'
        },
        {
            id: 5,
            title: 'Mengimplementasikan Pemrograman Terstruktur',
            code: 'J.620100.023.02',
            status: 'pending'
        },
        {
            id: 6,
            title: 'Membuat Dokumen Kode Program',
            code: 'J.620100.025.02',
            status: 'pending'
        },
        {
            id: 7,
            title: 'Melakukan Debugging',
            code: 'J.620100.025.02',
            status: 'pending'
        },
        {
            id: 8,
            title: 'Melaksanakan Pengujian Unit Program',
            code: 'J.620100.033.02',
            status: 'pending'
        }
    ];

    const dummyAssessors = [
        { id: 1, full_name: 'Dr. Ahmad Wijaya, S.Kom., M.T.' },
        { id: 2, full_name: 'Prof. Siti Nurhaliza, S.T., M.Kom.' },
        { id: 3, full_name: 'Ir. Budi Santoso, M.T.' }
    ];

    useEffect(() => {
        // Simulate API calls with dummy data
        setAvailableAssessors(dummyAssessors);
        setSelectedAssessment({
            occupation: { name: 'Pemrogram Junior ( Junior Coder )' },
            code: 'SKMLRPLPJR/LSPSMK24/2023'
        });
    }, [user]);

    const fetchAvailableAssessments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/assessment/apl2');

            if (response.data.success && response.data.data.length > 0) {
                setAssessments(response.data.data);
                // Auto-select first assessment
                const firstAssessment = response.data.data[0];
                setSelectedAssessment(firstAssessment);
                fetchUnitCompetencies(firstAssessment.code);
            }
        } catch (error: any) {
            setError('Gagal memuat data asesmen');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnitCompetencies = async (assessmentCode: string) => {
        try {
            const response = await api.get(`/assessment/apl2/unit-competencies/${encodeURIComponent(assessmentCode)}`);

            if (response.data.success) {
                setUnitCompetencies(response.data.data);
            }
        } catch (error: any) {
            console.log('Error fetching unit competencies:', error);
        }
    };

    const fetchAvailableAssessors = async () => {
        try {
            const response = await api.get('/assessor');

            if (response.data.success) {
                setAvailableAssessors(response.data.data);
            }
        } catch (error: any) {
            console.log('Error fetching assessors:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Asesmen Mandiri'
                        icon={
                            <Link to={paths.asesi.dataSertifikasi} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 pb-7 items-stretch">
                    {/* Error notification */}
                    {error && (
                        <div className="lg:col-span-5 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="lg:col-span-5 flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            {/* Left Section - Certification Scheme */}
                            <div className="lg:col-span-3 h-full">
                                <div className="bg-white rounded-lg p-6 h-full">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start flex-wrap gap-5">
                                            {/* Left */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800 mb-1">Skema Sertifikasi</h2>
                                                <p className="text-sm text-gray-600">Okupasi</p>
                                            </div>

                                            {/* Right */}
                                            <div className="lg:text-right sm:text-start">
                                                <h3 className="font-medium text-gray-800 mb-2">
                                                    {selectedAssessment?.occupation?.name || 'Pemrogram Junior ( Junior Coder )'}
                                                </h3>
                                                <span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
                                                    {selectedAssessment?.code || 'SKMLRPLPJR/LSPSMK24/2023'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Competency Units Grid */}
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {dummyCompetencyUnits.map((unit, index) => (
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
                                                        {unit.status === "Finished" ? (
                                                            <span className="px-3 py-1 bg-[#E77D3533] text-[#E77D35] text-xs rounded">
                                                                Finished
                                                            </span>
                                                        ) : (
                                                            <div></div>
                                                        )}

                                                        <Link
                                                            to={paths.asesor.cekAsesmenMandiriDetail}
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
                                </div>
                            </div>

                            {/* Right Section - Assessment Review */}
                            <div className="lg:col-span-2 h-full">
                                <div className="bg-white rounded-lg p-6 h-full">
                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Completion</span>
                                            <span className="text-sm font-medium text-[#E77D35]">100%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div className="bg-[#E77D35] h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Ditinjau oleh Asesor</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Assessor Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pilih Asesor
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                                value={selectedAssessor}
                                                onChange={(e) => setSelectedAssessor(e.target.value)}
                                            >
                                                <option value="">Pilih asesor...</option>
                                                {availableAssessors.map((assessor) => (
                                                    <option key={assessor.id} value={assessor.id}>
                                                        {assessor.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Date Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pilih tanggal
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Rekomendasi</h4>
                                        <div className="flex space-x-6">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recommendation"
                                                    value="can-continue"
                                                    checked={recommendation === 'can-continue'}
                                                    onChange={(e) => setRecommendation(e.target.value)}
                                                    className="w-4 h-4 mr-2 rounded-full border-2 border-orange-500 text-orange-500 focus:ring-0"
                                                />
                                                <span className="text-sm text-gray-700">Asesmen dapat dilanjutkan</span>
                                            </label>

                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recommendation"
                                                    value="need-improvement"
                                                    checked={recommendation === 'need-improvement'}
                                                    onChange={(e) => setRecommendation(e.target.value)}
                                                    className="w-4 h-4 mr-2 rounded-full border-2 border-orange-500 text-orange-500 focus:ring-0"
                                                />
                                                <span className="text-sm text-gray-700">Tidak dapat dilanjutkan</span>
                                            </label>
                                        </div>
                                    </div>
                                    {/* QR Code Section */}
                                    <div className="mb-6 flex justify-center">
                                        <div className="p-4 bg-white border rounded-lg w-full h-50 flex justify-center">
                                            {/* <img
                                                src="/img/cthbarkod.svg"
                                                alt="QR Code"
                                                className="w-40 h-40 object-contain"
                                            /> */}
                                        </div>
                                    </div>


                                    {/* Submit Button */}
                                    <div className="w-full">
                                        <button
                                            className="w-full block text-center bg-[#E77D35] hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                                        >
                                            Generate QR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}