import React, { useState, useEffect } from 'react';
import { Monitor, ChevronLeft, ChevronRight, AlertCircle, Save, QrCode } from 'lucide-react';
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
    const [qrProcessing, setQrProcessing] = useState(false);
    const [saveProcessing, setSaveProcessing] = useState(false);
    const [processError, setProcessError] = useState<string | null>(null);
    const [processSuccess, setProcessSuccess] = useState<string | null>(null);

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

    const handleGenerateQR = async () => {
        setQrProcessing(true);
        setProcessError(null);
        setProcessSuccess(null);

        try {
            console.log("Generate QR...");
            const qrResponse = await api.put(
                `/assessments/apl-02/result/assessor/${id_result}/approve`
            );

            if (!qrResponse.data.success) {
                throw new Error(qrResponse.data.message || "Gagal generate QR");
            }

            console.log("✅ QR berhasil digenerate");

            // Update state dengan data terbaru dari server
            setResultData(prev => ({
                ...prev,
                apl02_header: {
                    ...prev.apl02_header,
                    approved_assessor: true
                }
            }));

            setProcessSuccess("QR Code berhasil digenerate");
            setTimeout(() => setProcessSuccess(null), 3000);

        } catch (error: any) {
            console.error("Error generating QR:", error);
            if (error.response) {
                setProcessError(`Error: ${error.response.data.message || "Gagal generate QR"}`);
            } else {
                setProcessError(error.message || "Gagal generate QR");
            }
        } finally {
            setQrProcessing(false);
        }
    };

    const handleSaveRecommendation = async () => {
        if (!recommendation) {
            setProcessError("Silakan pilih rekomendasi terlebih dahulu");
            return;
        }

        setSaveProcessing(true);
        setProcessError(null);
        setProcessSuccess(null);

        try {
            console.log("Simpan rekomendasi:", recommendation === 'continue');
            const saveResponse = await api.post(
                `/assessments/apl-02/result/send-header`,
                {
                    result_id: id_result,
                    is_continue: recommendation === 'continue'
                }
            );

            if (!saveResponse.data.success) {
                throw new Error(saveResponse.data.message || "Gagal menyimpan rekomendasi");
            }

            console.log("✅ Rekomendasi berhasil disimpan");

            // Update state dengan data terbaru dari server
            setResultData(prev => ({
                ...prev,
                apl02_header: {
                    ...prev.apl02_header,
                    is_continue: recommendation === 'continue'
                }
            }));

            setProcessSuccess("Rekomendasi berhasil disimpan");
            setTimeout(() => setProcessSuccess(null), 3000);

        } catch (error: any) {
            console.error("Error saving recommendation:", error);
            if (error.response) {
                setProcessError(`Error: ${error.response.data.message || "Gagal menyimpan rekomendasi"}`);
            } else {
                setProcessError(error.message || "Gagal menyimpan rekomendasi");
            }
        } finally {
            setSaveProcessing(false);
        }
    };

    const handleRecommendationChange = (value: 'continue' | 'stop') => {
        setRecommendation(value);
        setProcessError(null);
        setProcessSuccess(null);
        console.log("Rekomendasi dipilih:", value);
    };

    // Cek apakah QR sudah digenerate
    const isQrGenerated = resultData?.apl02_header?.approved_assessor;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <NavbarAsesor
                        title='Asesmen Mandiri - Review APL-02'
                        icon={
                            <Link to={paths.asesor.assessment.dashboardAsesmenMandiri(id_assessment)} className="text-gray-500 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </Link>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mx-4 pb-7 items-stretch">
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
                                                    <label
                                                        className={`flex items-start space-x-3 cursor-pointer ${isQrGenerated ? "opacity-70" : ""
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="recommendation"
                                                            checked={recommendation === "continue"}
                                                            onChange={() => handleRecommendationChange("continue")}
                                                            disabled={isQrGenerated}
                                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                                                        />
                                                        <span
                                                            className={`text-sm leading-relaxed ${recommendation === "stop" || recommendation === undefined || recommendation === null
                                                                    ? "line-through opacity-50"
                                                                    : ""
                                                                }`}
                                                        >
                                                            Assessment <strong>dapat dilanjutkan</strong>
                                                        </span>
                                                    </label>

                                                    <label
                                                        className={`flex items-start space-x-3 cursor-pointer ${isQrGenerated ? "opacity-70" : ""
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="recommendation"
                                                            checked={recommendation === "stop"}
                                                            onChange={() => handleRecommendationChange("stop")}
                                                            disabled={isQrGenerated}
                                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                                                        />
                                                        <span
                                                            className={`text-sm leading-relaxed ${recommendation === "continue" || recommendation === undefined || recommendation === null
                                                                    ? "line-through opacity-50"
                                                                    : ""
                                                                }`}
                                                        >
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
                                            {resultData?.apl02_header?.approved_assessee ? (
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
                                                        Klik tombol "Generate QR" di bawah
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* TOMBOL SIMPAN REKOMENDASI */}
                                    <div className="mb-4">
                                        <div className="text-gray-500 text-xs mb-2 text-center">
                                            {!recommendation
                                                ? "Pilih rekomendasi terlebih dahulu"
                                                : isQrGenerated
                                                    ? "Setelah generate QR, rekomendasi tidak dapat diubah"
                                                    : "Simpan rekomendasi sebelum generate QR"}
                                        </div>
                                        <button
                                            onClick={handleSaveRecommendation}
                                            disabled={saveProcessing || !recommendation || isQrGenerated}
                                            className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${saveProcessing || !recommendation || isQrGenerated
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-green-700 cursor-pointer"
                                                }`}
                                        >
                                            {saveProcessing ? (
                                                "Menyimpan..."
                                            ) : (
                                                <>
                                                    <Save size={18} className="mr-2" />
                                                    Simpan Rekomendasi
                                                </>
                                            )}
                                        </button>
                                        {processError && (
                                            <div className="text-red-500 text-xs mt-2 text-center">{processError}</div>
                                        )}
                                        {processSuccess && (
                                            <div className="text-green-500 text-xs mt-2 text-center">
                                                ✅ {processSuccess}
                                            </div>
                                        )}
                                    </div>

                                    {/* TOMBOL GENERATE QR */}
                                    <div className="mb-6">
                                        <button
                                            onClick={handleGenerateQR}
                                            disabled={qrProcessing || isQrGenerated}
                                            className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${qrProcessing || isQrGenerated
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-orange-600 cursor-pointer"
                                                }`}
                                        >
                                            {qrProcessing ? (
                                                "Memproses..."
                                            ) : (
                                                <>
                                                    <QrCode size={18} className="mr-2" />
                                                    {isQrGenerated ? "QR Sudah Digenerate" : "Generate QR"}
                                                </>
                                            )}
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