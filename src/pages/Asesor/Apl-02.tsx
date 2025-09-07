import React, { useState, useEffect } from 'react';
import { Monitor, ChevronLeft, ChevronRight, AlertCircle, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import NavbarAsesor from '@/components/NavAsesor';
import { QRCodeCanvas } from 'qrcode.react';
import { getAssessorUrl, getAssesseeUrl } from '@/lib/hashids';
import { useAssessmentParams } from '@/components/AssessmentAsesorProvider';

export default function CekApl02() {
    const { id_assessment, id_asesor, id_result, id_asesi } = useAssessmentParams();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [assessments, setAssessments] = useState<any>();
    const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
    const [completedUnits, setCompletedUnits] = useState<number>(0);
    const [recommendation, setRecommendation] = useState<'continue' | 'stop' | null>(null);
    const [resultData, setResultData] = useState<any>(null);
    const [generatingQr, setGeneratingQr] = useState(false);
    const [saving, setSaving] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchAssessment();
        fetchUnitCompetencies();
        fetchResultData();
    }, [user]);

    useEffect(() => {
        if (unitCompetencies) {
            const completed = unitCompetencies.filter((unit: any) => unit.finished);
            setCompletedUnits(completed.length);
        }
    }, [unitCompetencies]);

    const fetchAssessment = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/assessments/${id_assessment}`);
            if (response.data.success) {
                setAssessments(response.data.data);
            }
        } catch (error: any) {
            setError('Gagal memuat data asesmen');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnitCompetencies = async () => {
        try {
            const response = await api.get(`/assessments/apl-02/units/${id_result}`);
            if (response.data.success) {
                setUnitCompetencies(response.data.data);
            }
        } catch (error: any) {
            console.log('Error fetching unit competencies:', error);
        }
    };

    const fetchResultData = async () => {
        if (!id_result) return;
        try {
            const response = await api.get(`/assessments/apl-02/result/${id_result}`);
            if (response.data.success) {
                const result = response.data.data;
                setResultData(result);

                // Sync recommendation state dengan data dari API
                if (result.apl02_header && typeof result.apl02_header.is_continue === 'boolean') {
                    setRecommendation(result.apl02_header.is_continue ? 'continue' : 'stop');
                } else {
                    setRecommendation(null);
                }
            }
        } catch (error) {
            console.error("fetchResultData error:", error);
        }
    };

    const handleGenerateQRCode = async () => {
        if (!recommendation) {
            setQrError("Silakan pilih rekomendasi terlebih dahulu");
            return;
        }

        if (!resultData?.apl02_header?.approved_assessee) {
            setQrError("Asesi harus menyetujui terlebih dahulu sebelum asesor dapat generate QR");
            return;
        }

        setGeneratingQr(true);
        setQrError(null);

        try {
            console.log("Generate QR dengan rekomendasi sementara:", recommendation === 'continue');

            // ENDPOINT 1: Generate QR (approve asesor)
            const response = await api.put(
                `/assessments/apl-02/result/assessor/${id_result}/approve`,
                { is_continue: recommendation === 'continue' }
            );

            console.log("Response dari server:", response.data);

            if (response.data.success && response.data.data) {
                console.log("✅ QR berhasil digenerate");

                // Update state dengan data terbaru dari server
                setResultData(prev => ({
                    ...prev,
                    apl02_header: {
                        ...prev.apl02_header,
                        approved_assessor: true,
                        is_continue: response.data.data.is_continue
                    }
                }));
            } else {
                setQrError(response.data.message || "Gagal generate QR");
            }
        } catch (error: any) {
            console.error("Error generating QR code:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
                setQrError(`Error: ${error.response.data.message || "Gagal generate QR code"}`);
            } else {
                setQrError("Gagal generate QR code");
            }
        } finally {
            setGeneratingQr(false);
        }
    };

    const handleSaveRecommendation = async () => {
        if (!recommendation) {
            setSaveError("Silakan pilih rekomendasi terlebih dahulu");
            return;
        }

        if (!resultData?.apl02_header?.approved_assessor) {
            setSaveError("Generate QR terlebih dahulu sebelum menyimpan rekomendasi");
            return;
        }

        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            console.log("Menyimpan rekomendasi:", recommendation === 'continue');

            // ENDPOINT 2: Simpan rekomendasi (is_continue)
            const response = await api.post(
                `/assessments/apl-02/result/send-header`,
                {
                    result_id: id_result,
                    is_continue: recommendation === 'continue'
                }
            );

            console.log("Response dari server:", response.data);

            if (response.data.success) {
                console.log("✅ Rekomendasi berhasil disimpan");

                // Update state dengan data terbaru
                setResultData(prev => ({
                    ...prev,
                    apl02_header: {
                        ...prev.apl02_header,
                        is_continue: recommendation === 'continue'
                    }
                }));

                setSaveSuccess(true);

                // Reset status sukses setelah 3 detik
                setTimeout(() => setSaveSuccess(false), 3000);

            } else {
                setSaveError(response.data.message || "Gagal menyimpan rekomendasi");
            }
        } catch (error: any) {
            console.error("Error saving recommendation:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
                setSaveError(`Error: ${error.response.data.message || "Gagal menyimpan rekomendasi"}`);
            } else {
                setSaveError("Gagal menyimpan rekomendasi");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleRecommendationChange = (value: 'continue' | 'stop') => {
        setRecommendation(value);
        setQrError(null);
        setSaveError(null);
        setSaveSuccess(false);
        console.log("Rekomendasi dipilih:", value);
    };

    // Cek apakah QR sudah digenerate
    const isQrGenerated = resultData?.apl02_header?.approved_assessor;

    // Cek apakah asesi sudah menyetujui
    const isAssesseeApproved = resultData?.apl02_header?.approved_assessee;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Asesmen Mandiri - Review APL-02'
                        icon={
                            <Link to={paths.asesor.dashboardAsesor} className="text-gray-500 hover:text-gray-600">
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
                                                    {assessments?.occupation?.name || 'Pelayanan Hotel'}
                                                </h3>
                                                <span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
                                                    {assessments?.code || 'SKM.PH.HDR/LSPSMK24/2024'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Competency Units Grid */}
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {unitCompetencies.map((unit) => (
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

                                                    <h5 className="font-medium text-gray-800 mb-2 text-md leading-tight">
                                                        {unit.title}
                                                    </h5>

                                                    <p className="text-xs text-gray-500 mb-4">
                                                        {unit.unit_code}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        {unit.finished ? (
                                                            <span className="px-3 py-1 bg-[#E77D3533] text-[#E77D35] text-xs rounded">
                                                                Finished
                                                            </span>
                                                        ) : (
                                                            <div></div>
                                                        )}

                                                        <Link
                                                            to={paths.asesor.assessment.cekApl02Detail(
                                                                id_assessment,
                                                                id_result || '',
                                                                id_asesi || '',
                                                                unit.id
                                                            )}
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
                                        <h3 className="text-xl font-medium text-gray-900 mb-4">Progress Asesmen</h3>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Completion
                                            </span>
                                            <span className="text-sm font-medium text-[#E77D35]">
                                                {completedUnits > 0 && unitCompetencies.length > 0
                                                    ? `${Math.round((completedUnits / unitCompetencies.length) * 100)}%`
                                                    : "0%"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-[#E77D35] h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width: completedUnits > 0 && unitCompetencies.length > 0
                                                        ? `${(completedUnits / unitCompetencies.length) * 100}%`
                                                        : "0%",
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Recommendation Section */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
                                        <div className="space-y-3">
                                            {!resultData ? (
                                                <div className="text-gray-500">Memuat rekomendasi...</div>
                                            ) : (
                                                <>
                                                    <label className={`flex items-start space-x-3 cursor-pointer ${recommendation !== 'continue' && recommendation !== null ? 'line-through text-gray-400' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            name="recommendation"
                                                            checked={recommendation === 'continue'}
                                                            onChange={() => handleRecommendationChange('continue')}
                                                            disabled={isQrGenerated}
                                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                                                        />
                                                        <span className={`text-sm leading-relaxed ${isQrGenerated ? 'opacity-70' : ''}`}>
                                                            Assessment <strong>dapat dilanjutkan</strong>
                                                        </span>
                                                    </label>
                                                    <label className={`flex items-start space-x-3 cursor-pointer ${recommendation !== 'stop' && recommendation !== null ? 'line-through text-gray-400' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            name="recommendation"
                                                            checked={recommendation === 'stop'}
                                                            onChange={() => handleRecommendationChange('stop')}
                                                            disabled={isQrGenerated}
                                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                                                        />
                                                        <span className={`text-sm leading-relaxed ${isQrGenerated ? 'opacity-70' : ''}`}>
                                                            Assessment <strong>tidak dapat dilanjutkan</strong>
                                                        </span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* QR Code Section */}
                                    <div className="mb-6 flex justify-center gap-4 flex-col md:flex-row">
                                        {/* QR Code Asesi */}
                                        <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
                                            <h4 className="text-sm font-semibold text-gray-800">QR Code Asesi</h4>
                                            {isAssesseeApproved ? (
                                                <>
                                                    <QRCodeCanvas
                                                        value={getAssesseeUrl(Number(id_asesi))}
                                                        size={100}
                                                        className="w-32 h-32 object-contain"
                                                    />
                                                    <div className="text-green-600 font-semibold text-xs">
                                                        Sudah disetujui Asesi
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs text-center">
                                                        Menunggu persetujuan asesi
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* QR Code Asesor */}
                                        <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
                                            <h4 className="text-sm font-semibold text-gray-800">QR Code Asesor</h4>
                                            {isQrGenerated ? (
                                                <>
                                                    <QRCodeCanvas
                                                        value={getAssessorUrl(Number(id_asesor))}
                                                        size={100}
                                                        className="w-32 h-32 object-contain"
                                                    />
                                                    <div className="text-green-600 font-semibold text-xs">
                                                        Sebagai Asesor, Anda sudah setuju
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center flex-col">
                                                    <span className="text-gray-400 text-xs text-center mb-2">
                                                        QR Code Asesor
                                                    </span>
                                                    <span className="text-gray-400 text-xs text-center">
                                                        Klik generate untuk membuat QR Code
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleGenerateQRCode}
                                                disabled={isQrGenerated || generatingQr || !recommendation || !isAssesseeApproved}
                                                className={`block text-center bg-[#E77D35] text-white font-medium py-2 px-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm ${isQrGenerated || generatingQr || !recommendation || !isAssesseeApproved
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "hover:bg-orange-600 cursor-pointer"
                                                    }`}
                                            >
                                                {generatingQr
                                                    ? "Generating..."
                                                    : isQrGenerated
                                                        ? "Telah Digenerate"
                                                        : "Generate QR"}
                                            </button>
                                            {qrError && (
                                                <div className="text-red-500 text-xs mt-1 text-center">{qrError}</div>
                                            )}
                                            {!recommendation && !isQrGenerated && (
                                                <div className="text-red-500 text-xs mt-1 text-center">
                                                    Pilih rekomendasi terlebih dahulu
                                                </div>
                                            )}
                                            {!isAssesseeApproved && !isQrGenerated && (
                                                <div className="text-red-500 text-xs mt-1 text-center">
                                                    Menunggu persetujuan asesi
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* TOMBOL SIMPAN REKOMENDASI - SELALU TAMPIL TAPI DISABLE JIKA BELUM GENERATE QR */}
                                    <div className="mb-6">
                                        <button
                                            onClick={handleSaveRecommendation}
                                            disabled={saving || !recommendation || !isQrGenerated}
                                            className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${saving || !recommendation || !isQrGenerated
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-orange-600 cursor-pointer"
                                                }`}
                                        >
                                            {saving ? (
                                                "Menyimpan..."
                                            ) : (
                                                <>
                                                    <Save size={18} className="mr-2" />
                                                    Simpan Rekomendasi
                                                </>
                                            )}
                                        </button>
                                        {saveError && (
                                            <div className="text-red-500 text-xs mt-2 text-center">{saveError}</div>
                                        )}
                                        {saveSuccess && (
                                            <div className="text-green-500 text-xs mt-2 text-center">
                                                ✅ Rekomendasi berhasil disimpan
                                            </div>
                                        )}
                                        <div className="text-gray-500 text-xs mt-2 text-center">
                                            {!isQrGenerated
                                                ? "Generate QR terlebih dahulu sebelum menyimpan"
                                                : "Klik simpan untuk menyimpan rekomendasi"}
                                        </div>
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