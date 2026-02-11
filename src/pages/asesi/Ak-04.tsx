import React, { useEffect, useState } from 'react';
import { Monitor, ChevronLeft, Search, X, ChevronUp, ChevronDown, Calendar, Replace, AlertCircle, Check, House } from 'lucide-react';
import NavbarAsesi from '@/components/NavbarAsesi';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAssessmentParams } from '@/components/AssessmentAsesiProvider';
import api from '@/helper/axios';
import { QRCodeCanvas } from 'qrcode.react';
import { getAssesseeUrl } from '@/lib/hashids';
import ConfirmModal from '@/components/ConfirmModal';
import { formatDateJakartaUS24 } from "@/helper/format-date";

export default function Ak04() {
    // Menggunakan default empty object jika useAssessmentParams undefined
    const { id_schedule: id_assessment, id_asesor, id_result, id_asesi, mutateNavigation } = useAssessmentParams();
    const [resultData, setResultData] = useState<any>(null);
    const [valueQr, setValueQr] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [reason, setReason] = useState('');
    type QuestionKey = `question${number}`;
    const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
        question1: '',
        question2: '',
        question3: ''
    });

    // State untuk menandai apakah data sudah tersimpan
    const [isSaved, setIsSaved] = useState(false);

    const questions = [
        'Apakah Proses banding telah dijelaskan kepada anda?',
        'Apakah Anda telah mendiskusikan Banding dengan asesor?',
        'Apakah Anda mau melibatkan "orang lain" membantu Anda dalam Proses Banding?'
    ];

    const fetchResultData = async () => {
        // Jika id_result tidak tersedia, set error
        if (!id_result) {
            setError('ID hasil asesmen tidak tersedia');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/assessments/ak-04/${id_result}`);
            // console.log('fetchResultData response:', response.data);

            if (response.data.success) {
                setResultData(response.data.data);
                mutateNavigation();

                // PERBAIKAN: Pastikan path yang benar untuk mengakses data
                const ak04Data = response.data.data.result_ak04 || response.data.data.ak04_assessee;

                // Jika sudah ada data persetujuan, isi form dengan data yang ada
                if (ak04Data) {
                    const { q1_yes, q2_yes, q3_yes, reason, approved_assessee } = ak04Data;

                    // PERBAIKAN: Pastikan tidak ada nilai "tidak" yang terisi secara default
                    setAnswers({
                        question1: q1_yes === true || q1_yes === 1 ? 'ya' : 'tidak',
                        question2: q2_yes === true || q2_yes === 1 ? 'ya' : 'tidak',
                        question3: q3_yes === true || q3_yes === 1 ? 'ya' : 'tidak'
                    });

                    setReason(reason || '');
                    setIsSaved(true); // Tandai bahwa data sudah tersimpan

                    if (approved_assessee) {
                        setValueQr(getAssesseeUrl(Number(id_asesi)));
                    }
                } else {
                    // PERBAIKAN: Pastikan state answers tetap kosong jika tidak ada data
                    setAnswers({
                        question1: '',
                        question2: '',
                        question3: ''
                    });
                    setIsSaved(false); // Pastikan state direset jika tidak ada data
                }
            } else {
                setError('Gagal mengambil data hasil asesmen: ' + response.data.message);
            }
        } catch (error: any) {
            console.error("fetchResultData error:", error);
            setError('Terjadi kesalahan saat mengambil data: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionKey: QuestionKey, value: string) => {
        // Jangan izinkan perubahan jika data sudah tersimpan
        if (isSaved) return;

        setAnswers(prev => ({ ...prev, [questionKey]: value }));
        // Hapus error untuk pertanyaan ini jika diisi
        if (formErrors[questionKey]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionKey];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        // Validasi pertanyaan
        questions.forEach((_, index) => {
            const questionKey = `question${index + 1}` as QuestionKey;
            if (!answers[questionKey]) {
                errors[questionKey] = 'Pertanyaan ini harus diisi';
            }
        });

        // Validasi catatan
        if (!reason.trim()) {
            errors.reason = 'Alasan banding harus diisi';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setError('Harap isi semua pertanyaan dan alasan banding terlebih dahulu');
            return;
        }
        if (!id_result) return;

        setSubmitting(true);
        setError(null);

        try {
            // 1. Simpan jawaban
            const payload = {
                result_id: Number(id_result),
                q1_yes: answers.question1 === 'ya',
                q2_yes: answers.question2 === 'ya',
                q3_yes: answers.question3 === 'ya',
                reason: reason
            };

            const saveResponse = await api.post('/assessments/ak-04', payload);

            if (!saveResponse.data.success) {
                throw new Error(saveResponse.data.message || 'Gagal menyimpan jawaban');
            }

            // 2. Approve jawaban
            const approveResponse = await api.put(
                `/assessments/ak-04/result/assessee/${id_result}/approve`,
                { approved_assessee: true }
            );

            if (!approveResponse.data.success) {
                throw new Error(approveResponse.data.message || 'Gagal approve data');
            }

            // 3. Set QR code dan tandai sebagai tersimpan
            setValueQr(getAssesseeUrl(Number(id_asesi)));
            setIsSaved(true);

        } catch (e: any) {
            console.error("Error submit:", e);
            setError('Gagal menyimpan data: ' + (e.response?.data?.message || e.message));
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchResultData();
    }, [id_result]);

    // Cek apakah semua pertanyaan sudah dijawab dan alasan sudah diisi
    const isFormComplete = Object.values(answers).every(answer => answer !== '') && reason.trim() !== '';
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();

    // Tampilkan loading indicator saat data sedang dimuat
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data asesmen...</p>
                </div>
            </div>
        );
    }

    // Tampilkan pesan error jika terjadi kesalahan
    if (error && !formErrors) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm mb-5">
                    <NavbarAsesi
                        title='Umpan balik dan catatan asesmen'
                        icon={
                            <Link to={paths.asesi.dashboard} onClick={(e) => {
                                e.preventDefault(); // cegah auto navigasi
                                setIsConfirmOpen(true);
                            }}
                                className="text-gray-500 hover:text-gray-600"
                            >
                                <House size={20} />
                            </Link>
                        }
                    />
                    <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => {
                            setIsConfirmOpen(false);
                            navigate(paths.asesi.dashboard); // manual navigate setelah confirm
                        }}
                        title="Konfirmasi"
                        message="Apakah Anda yakin ingin kembali ke Dashboard?"
                        confirmText="Ya, kembali"
                        cancelText="Batal"
                        type="warning"
                    />
                </div>
                <div className="m-5">
                    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
                        <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-600 mb-4 text-center">{error}</p>
                        <button
                            onClick={fetchResultData}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <NavbarAsesi
                        title='Umpan balik dan catatan asesmen'
                        icon={
                            <Link to={paths.asesi.dashboard} onClick={(e) => {
                                e.preventDefault(); // cegah auto navigasi
                                setIsConfirmOpen(true);
                            }}
                                className="text-gray-500 hover:text-gray-600"
                            >
                                <House size={20} />
                            </Link>
                        }
                    />
                    <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => {
                            setIsConfirmOpen(false);
                            navigate(paths.asesi.dashboard); // manual navigate setelah confirm
                        }}
                        title="Konfirmasi"
                        message="Apakah Anda yakin ingin kembali ke Dashboard?"
                        confirmText="Ya, kembali"
                        cancelText="Batal"
                        type="warning"
                    />
                </div>

                <main className='m-4'>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                            <AlertCircle size={20} className="mr-2" />
                            {error}
                        </div>
                    )}

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
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={resultData?.assessee?.name || 'Pilih Asesi'}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={resultData?.assessor?.name || 'Pilih Asesor'}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={
                                        resultData?.created_at ? formatDateJakartaUS24(resultData.created_at) : ''
                                    }
                                    readOnly
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
                                {questions.map((question, index) => {
                                    const questionKey = `question${index + 1}` as QuestionKey;
                                    const hasError = !!formErrors[questionKey];

                                    return (
                                        <div key={index} className="flex items-center justify-between gap-6">
                                            {/* Pertanyaan */}
                                            <p className="text-gray-700 text-sm leading-relaxed flex-1">
                                                {question}
                                                {hasError && (
                                                    <span className="text-red-500 text-xs block mt-1">
                                                        {formErrors[questionKey]}
                                                    </span>
                                                )}
                                            </p>

                                            {/* Pilihan Ya / Tidak */}
                                            <div className="flex gap-4">
                                                {/* YA */}
                                                <label
                                                    className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm
                                                        ${answers[questionKey] === 'ya' ? "bg-[#E77D3533]" : ""}
                                                        ${hasError ? "border border-red-500" : ""}
                                                        ${isSaved ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value="ya"
                                                        checked={answers[questionKey] === 'ya'}
                                                        onChange={() => handleAnswerChange(questionKey, 'ya')}
                                                        className="hidden"
                                                        disabled={isSaved}
                                                    />
                                                    <span
                                                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                                            ${answers[questionKey] === 'ya'
                                                                ? "bg-[#E77D35] border-[#E77D35]"
                                                                : "border-gray-300"}`}
                                                    >
                                                        {answers[questionKey] === 'ya' && (
                                                            <Check className="w-4 h-4 text-white" />
                                                        )}
                                                    </span>
                                                    <span
                                                        className={
                                                            answers[questionKey] === 'ya'
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
                                                        ${answers[questionKey] === 'tidak' ? "bg-[#E77D3533]" : ""}
                                                        ${hasError ? "border border-red-500" : ""}
                                                        ${isSaved ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value="tidak"
                                                        checked={answers[questionKey] === 'tidak'}
                                                        onChange={() => handleAnswerChange(questionKey, 'tidak')}
                                                        className="hidden"
                                                        disabled={isSaved}
                                                    />
                                                    <span
                                                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                                            ${answers[questionKey] === 'tidak'
                                                                ? "bg-[#E77D35] border-[#E77D35]"
                                                                : "border-gray-300"}`}
                                                    >
                                                        {answers[questionKey] === 'tidak' && (
                                                            <Check className="w-4 h-4 text-white" />
                                                        )}
                                                    </span>
                                                    <span
                                                        className={
                                                            answers[questionKey] === 'tidak'
                                                                ? "text-gray-900"
                                                                : "text-gray-500"
                                                        }
                                                    >
                                                        Tidak
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column - Certificate Selection */}
                        <div className="bg-white rounded-lg shadow-sm py-6 px-4 sm:px-10">
                            <h3 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">
                                Banding ini diajukan atas keputusan asesmen yang dibuat terhadap Skema Sertifikasi ( Kualifikasi / Klaster / Okupasi ) berikut :
                            </h3>

                            <div className="space-y-3">
                                {/* Skema Sertifikasi */}
                                <div className="grid grid-cols-1 sm:grid-cols-[auto_min-content_1fr] text-sm text-gray-600 gap-x-2 gap-y-1">
                                    <span className="font-medium sm:w-36">Skema Sertifikasi</span>
                                    <span className="hidden sm:block text-right">:</span>
                                    <span>{resultData?.assessment?.occupation?.scheme?.name || '-'}</span>
                                </div>

                                {/* No Skema Sertifikasi */}
                                <div className="grid grid-cols-1 sm:grid-cols-[auto_min-content_1fr] text-sm text-gray-600 gap-x-2 gap-y-1">
                                    <span className="font-medium sm:w-36">No Skema Sertifikasi</span>
                                    <span className="hidden sm:block text-right">:</span>
                                    <span>{resultData?.assessment?.code || '-'}</span>
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
                                    onChange={(e) => {
                                        if (isSaved) return;
                                        setReason(e.target.value);
                                        // Hapus error untuk reason jika diisi
                                        if (formErrors.reason) {
                                            setFormErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.reason;
                                                return newErrors;
                                            });
                                        }
                                    }}
                                    placeholder="Catatan"
                                    className={`w-full h-full p-3 border rounded-md resize-none 
                                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-h-[150px]
                                        ${formErrors.reason ? 'border-red-500' : 'border-gray-300'}
                                        ${isSaved ? 'cursor-not-allowed opacity-70 bg-gray-100' : ''}`}
                                    rows={6}
                                    readOnly={isSaved}
                                />
                                {formErrors.reason && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>
                                )}
                            </div>

                            {/* QR Code Section */}
                            <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                                {valueQr ? (
                                    <>
                                        <QRCodeCanvas
                                            value={valueQr}
                                            size={100}
                                            className="w-40 h-40 object-contain"
                                        />
                                        <span className="text-sm font-semibold text-gray-800">
                                            {resultData?.assessee?.name || '-'}
                                        </span>
                                        <span className="text-green-600 font-semibold text-sm mt-2">
                                            Data telah tersimpan dan QR Code telah digenerate
                                        </span>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center mb-4">
                                            <span className="text-gray-400 text-sm">QR Code akan muncul di sini setelah disimpan</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {resultData?.assessee?.name || '-'}
                                        </span>
                                        <span className="text-gray-500 text-xs mt-2 text-center">
                                            Klik tombol Simpan untuk generate QR Code
                                        </span>
                                    </div>
                                )}
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
                                disabled={submitting || !!valueQr || !isFormComplete || isSaved}
                                className={`w-full sm:w-auto px-30 py-2 bg-[#E77D35] text-white rounded-md 
                                    hover:bg-orange-600 focus:outline-none focus:ring-2 
                                    focus:ring-[#E77D35] focus:ring-offset-2 font-medium
                                    ${submitting || valueQr || !isFormComplete || isSaved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {submitting ? "Menyimpan..." : valueQr || isSaved ? "Tersimpan" : "Simpan"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}