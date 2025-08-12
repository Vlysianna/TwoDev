import React, { useState, useEffect } from 'react';
import { Upload, X, Eye, Monitor, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAsesi from '@/components/NavbarAsesi';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

export default function AssassmentMandiri() {
    const { user } = useAuth();
    const [selectedAssessor, setSelectedAssessor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [recommendation, setRecommendation] = useState('can-continue');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assessments, setAssessments] = useState<any[]>([]);
    const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
    const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
    const [availableAssessors, setAvailableAssessors] = useState<any[]>([]);

    useEffect(() => {
        fetchAvailableAssessments();
        fetchAvailableAssessors();
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

    const competencyUnits = unitCompetencies.map((unit, index) => ({
        id: unit.id,
        title: unit.title,
        code: unit.unit_code,
        status: index === 0 ? 'Finished' : 'pending' // Mock status for now
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesi
                        title='Banding Asesmen'
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
                                <div className="bg-white rounded-lg p-6">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start flex-wrap gap-5">
                                            {/* Kiri */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800 mb-1">Skema Sertifikasi</h2>
                                                <p className="text-sm text-gray-600">Okupasi</p>
                                            </div>

                                            {/* Kanan */}
                                            <div className="lg:text-right sm:text-start">
                                                <h3 className="font-medium text-gray-800 mb-1">
                                                    {selectedAssessment?.occupation?.name || 'Pemrogram Junior ( Junior Coder )'}
                                                </h3>
                                                <span className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-sm">
                                                    {selectedAssessment?.code || 'SKMLRPLPJR/LSPSMK24/2023'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Competency Units Grid */}
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {competencyUnits.map((unit, index) => (
                                        <div
                                            key={unit.id}
                                            className="bg-gray-50 rounded-lg p-4 border"
                                        >
                                            <div className="flex items-start mb-3">
                                                <div className="bg-orange-100 rounded p-2 mr-3">
                                                    <Monitor size={20} className="text-orange-500" />
                                                </div>
                                                <h4 className="font-medium text-gray-800 flex-1">
                                                    Unit kompetensi {unit.id}
                                                </h4>
                                            </div>

                                            <h5 className="font-medium text-gray-800 mb-2 text-sm leading-tight">
                                                {unit.title}
                                            </h5>

                                            <p className="text-xs text-gray-500 mb-4">{unit.code}</p>

                                            <div className="flex items-center justify-between">
                                                {unit.status === "Finished" ? (
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-500 text-xs rounded-sm">
                                                        Finished
                                                    </span>
                                                ) : (
                                                    <div></div>
                                                )}

                                                <Link to={paths.asesi.asesmenMandiriDetail} className="text-orange-500 hover:text-orange-600 text-sm flex items-center hover:underline hover:cursor-pointer">
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
                        <div className="bg-white rounded-lg p-6">
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Completion</span>
                                    <span className="text-sm font-medium text-orange-500">35%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Ditinjau oleh Asesor</h3>

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6'>
                                {/* Assessor Selection */}
                                <div className="mb-4 col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih Asesor
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                <div className="mb-6 col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih tanggal
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Rekomendasi</h4>
                                <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="col-span-1">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recommendation"
                                                value="can-continue"
                                                checked={recommendation === 'can-continue'}
                                                onChange={(e) => setRecommendation(e.target.value)}
                                                className="mr-3 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">Asesmen dapat dilanjutkan</span>
                                        </label>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recommendation"
                                                value="need-improvement"
                                                checked={recommendation === 'need-improvement'}
                                                onChange={(e) => setRecommendation(e.target.value)}
                                                className="mr-3 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">Perlu perbaikan</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* QR Scan Button */}
                            <div className="w-full">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full block text-center bg-[#E77D35] hover:bg-orange-600 text-white font-normal py-2 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer"
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
                                                src="/img/cthbarkod.svg" // ganti dengan path QR code kamu
                                                alt="QR Code"
                                                className="w-[200px] h-[200px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}