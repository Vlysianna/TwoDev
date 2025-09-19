import {
  ChevronLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  House,
} from "lucide-react";
import { useState, useEffect } from "react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link, useNavigate } from "react-router-dom";
import { getAssetPath } from '@/utils/assetPath';
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import api from "@/helper/axios";
import ConfirmModal from "@/components/ConfirmModal";

export default function Ia05() {
  const { id_asesor, id_result, id_assessment } = useAssessmentParams();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModalConfirmSubmit, setShowModalConfirmSubmit] = useState(false);
  const [answersSubmitted, setAnswersSubmitted] = useState(false)

  // ----- TYPES (API) -----
  interface IA05Option {
    id: number;
    option: string;
  }
  interface IA05Question {
    id: number;
    order: number;
    question: string;
    options: IA05Option[];
  }
  interface Result {
    id: number;
    assessment: Assessment;
    assessee: Assessee;
    assessor: Assessor;
    tuk: string;
    is_competent: boolean;
    created_at: string;
  }
  interface Assessment {
    id: number;
    code: string;
    occupation: Occupation;
  }
  interface Occupation {
    id: number;
    name: string;
    scheme: Scheme;
  }
  interface Scheme {
    id: number;
    code: string;
    name: string;
  }
  interface Assessee {
    id: number;
    name: string;
    email: string;
  }
  interface Assessor {
    id: number;
    name: string;
    email: string;
    no_reg_met: string;
  }

  // ----- Dynamic Data from API -----
  const [questions, setQuestions] = useState<IA05Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // Answers: questionId -> optionId (number as string for convenience)
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Fetch Questions
  useEffect(() => {
    if (!id_assessment) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingQuestions(true);
        setError(null);
        const res = await api.get(
          `/assessments/ia-05/questions/${id_assessment}`
        );
        if (!cancelled) {
          const data: IA05Question[] = res.data?.data || [];
          setQuestions(data);
          // initialize answer map
          const init: Record<number, number | null> = {};
          data.forEach((q) => {
            init[q.id] = null;
          });
          setAnswers(init);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          let message = "Gagal memuat pertanyaan";
          if (typeof e === "object" && e && "response" in e) {
            const resp = (e as { response?: { data?: { message?: string } } })
              .response;
            message = resp?.data?.message || message;
          }
          setError(message);
        }
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id_assessment]);

  useEffect(() => {
    fetchResult();
  }, [id_result]);

  const fetchResult = async () => {
    if (!id_result) return;
    try {
      const res = await api.get(`/assessments/ia-05/result/${id_result}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (e) {
      console.log("Gagal memuat data result:", e);
    }
  };

  const handleSubmit = async () => {
    if (!id_result) {
      setError("Result ID tidak ditemukan.");
      return;
    }
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(
        `Semua soal harus dijawab. Masih ada ${unanswered.length} soal belum terjawab.`
      );
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const payload = {
        result_id: id_result,
        answers: questions.map((q) => ({ option_id: answers[q.id]! })),
      };

      await api.post("/assessments/ia-05/result/assessee/send", payload);
      setSuccess("Jawaban berhasil dikirimkan.");
      navigate(paths.asesi.assessment.Ia05CAssessee(id_assessment, id_asesor));
    } catch (error: unknown) {
      let message = "Gagal menyimpan jawaban. Silakan coba lagi.";
      if (typeof error === "object" && error && "response" in error) {
        const resp = (error as { response?: { data?: { message?: string } } })
          .response;
        message = resp?.data?.message || message;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const checkAnswerStatus = async () => {
    if (!id_result) return;

    try {
      const res = await api.get(`/assessments/ia-05/result/answers/${id_result}`);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        // Jika sudah ada jawaban, set state dan redirect
        setAnswersSubmitted(true);
        navigate(paths.asesi.assessment.Ia05CAssessee(id_assessment, id_asesor));
      }
    } catch (error) {
      console.log("Belum ada jawaban atau error:", error);
    }
  };

  // Panggil fungsi pengecekan saat komponen dimuat
  useEffect(() => {
    checkAnswerStatus();
  }, [id_result]);

  if (answersSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Mengarahkan ke hasil assessment...</p>
        </div>
      </div>
    );
  }

  // Hitung progress
  const totalQuestions = questions.length;
  const answeredCount = Object.values(answers).filter(
    (ans) => ans !== null
  ).length;
  const progressPercent = Math.round(
    (answeredCount / (totalQuestions || 1)) * 100
  );
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <NavbarAsesi
            title="Lembar Jawaban Pilihan Ganda"
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
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Kiri */}
                <div className="flex-1">
                  <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    Skema Sertifikasi ( Okupasi )
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock size={14} />
                      {result?.tuk || "Sewaktu"}
                    </span>
                  </h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="block sm:inline">
                      Asesi:{" "}
                      <span className="text-gray-800">
                        {user?.full_name || "Asesi"}
                      </span>
                    </span>
                    <span className="hidden sm:inline">
                      {" "}
                      &nbsp;|&nbsp; Asesor:{" "}
                      <span className="text-gray-800">
                        {result?.assessor.name || "N/A"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Kanan */}
                <div className="flex-1 text-left sm:text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                    <p className="text-sm text-gray-800 font-medium">
                      {result?.assessment.occupation.name ?? "Okupasi"}
                    </p>
                    <p className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded w-fit">
                      {result?.assessment.code ?? "Kode Skema"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-2 w-full">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      Assesmen awal: {answeredCount} / {totalQuestions}
                    </span>
                    <div className="flex-1 sm:w-28 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {loadingQuestions && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Memuat
                  pertanyaan...
                </div>
              )}
              {!loadingQuestions && questions.length === 0 && !error && (
                <div className="text-sm text-gray-500">
                  Tidak ada pertanyaan.
                </div>
              )}
              {!loadingQuestions &&
                questions.map((question) => (
                  <div
                    key={question.id}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <h3 className="font-semibold text-gray-800">
                      Soal {question.order}
                    </h3>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                      {question.question}
                    </p>
                    <div className="border border-gray-200 rounded-lg p-4 w-full md:w-[40rem]">
                      <div className="space-y-3">
                        {question.options.map((option, oIdx) => {
                          const selected = answers[question.id] === option.id;
                          const letter = String.fromCharCode(65 + oIdx); // A, B, C, D ...
                          return (
                            <label
                              key={option.id}
                              className="flex items-center cursor-pointer"
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name={`q-${question.id}`}
                                  value={option.id}
                                  checked={selected}
                                  onChange={() =>
                                    handleAnswerChange(question.id, option.id)
                                  }
                                  className="sr-only"
                                />
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selected
                                      ? "border-orange-500 bg-orange-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selected && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                              </div>
                              <span
                                className={`ml-3 text-sm px-3 py-2 rounded flex-1 ${
                                  selected
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <span className="font-semibold mr-2">
                                  {letter}.
                                </span>{" "}
                                {option.option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModalConfirmSubmit(true)}
                  disabled={
                    submitting ||
                    loadingQuestions ||
                    questions.length === 0 ||
                    !allAnswered
                  }
                  className="w-full lg:w-auto bg-[#E77D35] hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white lg:px-20 py-2 rounded transition-colors cursor-pointer"
                >
                  {submitting
                    ? "Mengirim..."
                    : allAnswered
                    ? "Kirim"
                    : "Jawab Semua Soal"}
                </button>
              </div>
            </div>
            {showModalConfirmSubmit && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-[999]">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
                  <div className="mb-4 flex justify-center">
                    <img src={getAssetPath('/img/confirm-submit.svg')} alt="Pria Sigma" />
                  </div>

                  <h2 className="font-bold text-lg mb-2">
                    Konfirmasi Pengiriman Jawaban
                  </h2>
                  <p className="text-gray-500 text-sm mb-10">
                    Anda tidak dapat mengubah atau menambah jawaban. Pastikan
                    seluruh soal telah dijawab dan diperiksa dengan cermat
                    sebelum melanjutkan.
                  </p>

                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => setShowModalConfirmSubmit(false)}
                      className="flex-1 border border-[#E77D35] text-[#E77D35] py-2 rounded hover:bg-orange-50 cursor-pointer"
                    >
                      Batalkan
                    </button>
                    <button
                      onClick={() => {
                        setShowModalConfirmSubmit(false);
                        handleSubmit();
                      }}
                      className="flex-1 bg-[#E77D35] text-white py-2 rounded hover:bg-orange-600 cursor-pointer text-center disabled:bg-gray-400"
                      disabled={submitting}
                    >
                      {submitting ? "Mengirim..." : "Lanjut"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
