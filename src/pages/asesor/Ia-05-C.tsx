import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, Clock, QrCode, Save } from "lucide-react";
import NavbarAsesor from "../../components/NavAsesor";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import { useAuth } from "@/contexts/AuthContext";
import type { ResultIA05, AssesseeAnswer } from "@/model/ia05c-model";
import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import { QRCodeCanvas } from "qrcode.react";
import ConfirmModal from "@/components/ConfirmModal";
import { formatDateInputLocal } from "@/helper/format-date";

// Main Component
export default function Ia05C() {
  const { id_schedule: id_assessment, id_asesi, id_asesor, id_result } =
    useAssessmentParams();
  const { user } = useAuth();

  // Table row radio state: { [questionId]: 'Ya' | 'Tidak' }
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<ResultIA05 | null>(null);
  const [assesseeAnswers, setAssesseeAnswers] = useState<AssesseeAnswer[]>([]);
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  const [feedbackResult, setFeedbackResult] = useState<boolean>(false);
  const [unitField, setUnitField] = useState("");
  const [elementField, setElementField] = useState("");
  const [kukField, setKukField] = useState("");

  // Tambahkan state baru untuk proses simpan dan QR
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [qrProcessing, setQrProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState<string | null>(null);

  // State untuk modal konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValue, setPendingValue] = useState<string>("");
  const [showQRConfirmModal, setShowQRConfirmModal] = useState(false);

  // State untuk validasi form
  const [formErrors, setFormErrors] = useState({
    unit: false,
    element: false,
    kuk: false
  });

  // Format date for display
  const formattedDate = result?.schedule.end_date
    ? formatDateInputLocal(result.schedule.end_date) : "";

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both result and answers in parallel
      const [resultResponse, answersResponse] = await Promise.all([
        api.get(`/assessments/ia-05/result/${id_result}`),
        api.get(`/assessments/ia-05/result/answers/${id_result}`),
      ]);

      if (resultResponse.data.success) {
        const rawData: ResultIA05 = resultResponse.data.data;
        setResult(rawData);
        setFeedbackResult(rawData.ia05_header.is_achieved);
        setUnitField(rawData.ia05_header.unit || "");
        setElementField(rawData.ia05_header.element || "");
        setKukField(rawData.ia05_header.kuk || "");

        if (rawData.ia05_header.approved_assessee) {
          setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        }
        if (rawData.ia05_header.approved_assessor) {
          setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        }
      } else {
        setError("Gagal memuat data asesmen");
      }

      if (answersResponse.data.success) {
        setAssesseeAnswers(answersResponse.data.data);

        // Initialize selected answers based on fetched data
        const initialAnswers: Record<number, string> = {};
        answersResponse.data.data.forEach((answer: AssesseeAnswer) => {
          initialAnswers[answer.id] = answer.answers.approved ? "Ya" : "Tidak";
        });
        setSelectedAnswers(initialAnswers);
      } else {
        setError("Gagal memuat jawaban asesmen");
      }
    } catch (error) {
      setError("Gagal memuat data asesmen: " + error);
      console.error("fetchData error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi validasi form
  const validateForm = () => {
    const errors = {
      unit: false,
      element: false,
      kuk: false
    };

    let isValid = true;

    // Jika memilih "Belum Tercapai", validasi field unit, element, dan kuk
    if (!feedbackResult) {
      if (!unitField.trim()) {
        errors.unit = true;
        isValid = false;
      }
      if (!elementField.trim()) {
        errors.element = true;
        isValid = false;
      }
      if (!kukField.trim()) {
        errors.kuk = true;
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Ubah handleSubmit agar hanya simpan, tidak generate QR
  const handleSaveFeedback = async () => {
    // Validasi form sebelum menyimpan
    if (!validateForm()) {
      setProcessError("Harap isi semua field yang wajib diisi untuk status Belum Tercapai");
      return;
    }

    setSaveProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);
    try {
      const submissionData = {
        result_id: Number(id_result),
        is_achieved: feedbackResult,
        unit: feedbackResult ? "-" : unitField,
        element: feedbackResult ? "-" : elementField,
        kuk: feedbackResult ? "-" : kukField,
        results: assesseeAnswers.map((answer) => ({
          option_id: answer.answers.id,
          approved: selectedAnswers[answer.id] === "Ya",
        })),
      };
      const response = await api.post(
        `/assessments/ia-05/result/assessor/send`,
        submissionData
      );
      if (response.data.success) {
        setIsSaved(true);
        setProcessSuccess("Umpan balik berhasil disimpan");
        fetchData();
        setTimeout(() => setProcessSuccess(null), 3000);
      } else {
        setProcessError("Gagal menyimpan data: " + response.data.message);
        setIsSaved(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setProcessError(
        "Gagal menyimpan data: " +
        (error.response?.data?.message || error.message)
      );
      setIsSaved(false);
    } finally {
      setSaveProcessing(false);
    }
  };

  // Handler untuk membuka modal konfirmasi Generate QR
  const handleGenerateQRClick = () => {
    setShowQRConfirmModal(true);
  };

  // Handler konfirmasi Generate QR
  const handleConfirmGenerateQR = async () => {
    setShowQRConfirmModal(false);
    await handleGenerateQRCode();
  };

  // Ubah handleGenerateQRCode agar hanya bisa jika sudah simpan
  const handleGenerateQRCode = async () => {
    if (!isSaved) return;
    setQrProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);
    try {
      const response = await api.put(
        `/assessments/ia-05/result/assessor/${id_result}/approve`
      );
      if (response.data.success) {
        setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        setProcessSuccess("QR Code berhasil digenerate");
        fetchData();
        setTimeout(() => setProcessSuccess(null), 3000);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setProcessError("Gagal generate QR Code");
    } finally {
      setQrProcessing(false);
    }
  };
  
  // Handle per-question radio
  const handleTableRadioChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
    // If user manually changes a row, unset the summary radio
  };

  const handleFeedbackRadioChange = (value: string) => {
    const isAchieved = value === "tercapai";
    setFeedbackResult(isAchieved);

    // Clear validation errors when switching options
    if (isAchieved) {
      setFormErrors({ unit: false, element: false, kuk: false });

      // Set nilai default "-" ketika memilih "Tercapai"
      setUnitField("-");
      setElementField("-");
      setKukField("-");
    } else {
      // Kosongkan field jika memilih "Belum Tercapai"
      setUnitField("");
      setElementField("");
      setKukField("");
    }
  };

  const feedbackOptions = [
    { key: "tercapai", label: "Tercapai" },
    { key: "belum-tercapai", label: "Belum Tercapai" },
  ];

  // Handler tombol simpan: buka modal dulu
  const handleSaveFeedbackClick = () => {
    // Validasi form sebelum membuka modal
    if (!validateForm()) {
      setProcessError("Harap isi semua field yang wajib diisi untuk status Belum Tercapai");
      return;
    }

    setPendingValue(
      feedbackResult ? "Tercapai (Kompeten)" : "Belum Tercapai (Belum Kompeten)"
    );
    setShowConfirmModal(true);
  };

  // Handler konfirmasi modal
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    await handleSaveFeedback();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-[#E77D35] text-white px-4 py-2 rounded-md"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesor
            title="Jawaban Pilihan Ganda"
            icon={
              <Link
                to={paths.asesor.assessment.dashboardAsesmenMandiri(
                  id_assessment
                )}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>

        <main className="m-4">
          <div className="bg-white mb-4 rounded-lg shadow-sm border p-6">
            {/* Header Info & Progress */}
            <div className="border-gray-200 mb-6">
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
                {/* Left */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-800">
                    Skema Sertifikasi {result?.assessment?.occupation?.name}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">
                      {result?.tuk || "Sewaktu"}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  <div className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
                    {result?.assessment.code ?? "N/A"}
                  </div>
                </div>
              </div>

              {/* Filter Row + Progress */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-sm text-gray-500">
                    <span className="font-bold">Asesi:</span>{" "}
                    {result?.assessee?.name || "-"}
                  </span>
                  <span className="text-sm text-gray-500">
                    <span className="font-bold">Asesor:</span>{" "}
                    {result?.assessor?.name || "-"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto justify-end">
                  {/* Teks Asesmen Awal */}
                  <span className="text-sm font-medium text-gray-400">
                    Asesmen awal: {assesseeAnswers.length} /{" "}
                    {assesseeAnswers.length}
                  </span>
                  {/* Progress Bar */}
                  <div className="w-full md:w-48 bg-gray-200 rounded-full h-2 ml-0 md:ml-4">
                    <div
                      className="bg-[#E77D35] h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  {/* Persen */}
                  <span className="text-sm font-medium text-[#E77D35]">
                    100%
                  </span>
                </div>
              </div>
            </div>

            {/* Table - Readonly for assessee */}
            <div className="overflow-x-auto p-3 md:p-6 border border-gray-200 rounded-sm">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                  {assesseeAnswers.length > 0 ? (
                    <table className="w-full text-xs md:text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-0 text-sm md:text-[16px]">
                          <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[10%]">
                            No
                          </th>
                          <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                            Soal
                          </th>
                          <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                            Jawaban
                          </th>
                          <th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
                            Pencapaian
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assesseeAnswers.map((answer, index) => (
                          <tr key={answer.id} className="hover:bg-gray-50">
                            <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">
                              {index + 1}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-4 border-b border-gray-200 text-gray-700">
                              {answer.question}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200 text-gray-700">
                              {answer.answers.option}
                            </td>
                            <td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">
                              <div className="flex justify-center gap-3 md:gap-6">
                                {["Ya", "Tidak"].map((option) => (
                                  <label
                                    key={option}
                                    className={`flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-sm cursor-default transition ${selectedAnswers[answer.id] === option
                                      ? "bg-[#E77D3533]"
                                      : ""
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`q-${answer.id}`}
                                      value={option}
                                      className="w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                                      checked={
                                        selectedAnswers[answer.id] === option
                                      }
                                      onChange={() =>
                                        handleTableRadioChange(answer.id, option)
                                      }
                                      disabled // Disabled for assessee
                                    />
                                    <span
                                      className={`${selectedAnswers[answer.id] === option
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                        } whitespace-nowrap text-xs md:text-sm`}
                                    >
                                      {option}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-700">{result?.assessee.name} belum menyelesaikan IA-05</p>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Umpan Balik Section - IA-01 style */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col">
              {/* Radio buttons in one row */}
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Umpan Balik Untuk Asesi
              </h3>
              <div className="flex flex-col gap-4 mb-6">
                {feedbackOptions.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="feedbackResult"
                      checked={
                        (option.key === "tercapai" && feedbackResult === true) ||
                        (option.key === "belum-tercapai" && feedbackResult === false)
                      }
                      onChange={() => handleFeedbackRadioChange(option.key)}
                      className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                      disabled={!!assessorQrValue}
                    />
                    <span
                      className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
    ${(option.key === "tercapai" && feedbackResult === false) ||
                          (option.key === "belum-tercapai" && feedbackResult === true)
                          ? "line-through opacity-50"
                          : ""}`}
                    >
                      {option.key === "tercapai" ? (
                        <>
                          Asesi telah memenuhi seluruh aspek pengetahuan,{" "}
                          <strong>TERCAPAI</strong>
                        </>
                      ) : (
                        <>
                          Asesi belum memenuhi seluruh aspek pengetahuan,{" "}
                          <strong className="text-red-600">BELUM TERCAPAI</strong>
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              {/* Two columns section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column: Form inputs */}
                <div className="lg:col-span-1 h-full flex flex-col">
                  {/* Tuliskan unit/elemen/KUK jika belum tercapai */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Tuliskan unit/elemen/KUK jika belum tercapai:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit {!feedbackResult && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={unitField}
                          disabled={feedbackResult || !!assessorQrValue}
                          onChange={(e) => setUnitField(e.target.value)}
                          className={`w-full rounded-lg px-3 py-2 text-sm transition-all
                  ${feedbackResult || !!assessorQrValue
                              ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                              : formErrors.unit
                                ? 'bg-red-50 border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
                `}
                        />
                        {formErrors.unit && (
                          <p className="mt-1 text-xs text-red-600">Unit harus diisi</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Elemen {!feedbackResult && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={elementField}
                          disabled={feedbackResult || !!assessorQrValue}
                          onChange={(e) => setElementField(e.target.value)}
                          className={`w-full rounded-lg px-3 py-2 text-sm transition-all
                  ${feedbackResult || !!assessorQrValue
                              ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                              : formErrors.element
                                ? 'bg-red-50 border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
                `}
                        />
                        {formErrors.element && (
                          <p className="mt-1 text-xs text-red-600">Elemen harus diisi</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        KUK {!feedbackResult && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={kukField}
                        disabled={feedbackResult || !!assessorQrValue}
                        onChange={(e) => setKukField(e.target.value)}
                        className={`w-full rounded-lg px-3 py-2 text-sm transition-all
                ${feedbackResult || !!assessorQrValue
                            ? "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                            : formErrors.kuk
                              ? 'bg-red-50 border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                              : "bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                          }
              `}
                      />
                      {formErrors.kuk && (
                        <p className="mt-1 text-xs text-red-600">KUK harus diisi</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Asesi
                    </h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={result?.assessee.name ?? "N/A"}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={formattedDate}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                        readOnly
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Asesor Section */}
                  <div className="mb-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Asesor
                    </h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={result?.assessor.name ?? "N/A"}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={result?.assessor.no_reg_met ?? "N/A"}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={formattedDate}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                        readOnly
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Right Column: QR code */}
                <div className="h-full flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* QR Asesi */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                      <span className="text-sm font-semibold text-gray-800">
                        QR Code Asesi
                      </span>
                      {result?.ia05_header?.approved_assessee && assesseeQrValue ? (
                        <QRCodeCanvas
                          value={assesseeQrValue}
                          size={100}
                          className="w-40 h-40 object-contain"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm text-center">
                            {result?.ia05_header?.approved_assessee
                              ? "QR Asesi sudah disetujui"
                              : "Menunggu persetujuan asesi"}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {result?.assessee?.name || "-"}
                      </span>
                      {result?.ia05_header?.approved_assessee && (
                        <span className="text-green-600 font-semibold text-sm mt-2">
                          Sudah disetujui asesi
                        </span>
                      )}
                    </div>

                    {/* QR Asesor */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
                      <span className="text-sm font-semibold text-gray-800">
                        QR Code Asesor
                      </span>
                      {assessorQrValue ? (
                        <QRCodeCanvas
                          value={assessorQrValue}
                          size={100}
                          className="w-40 h-40 object-contain"
                        />
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm text-center">
                            QR Asesor akan muncul di sini
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {result?.assessor?.name || "-"}
                      </span>
                      {/* Status jika sudah approved */}
                      {result?.ia05_header?.approved_assessor === true && (
                        <span className="text-green-600 font-semibold text-sm mt-2">
                          Sebagai Asesor, Anda sudah setuju
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    {/* Status/Error messages */}
                    {processError && (
                      <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                        {processError}
                      </div>
                    )}
                    {processSuccess && (
                      <div className="text-green-500 text-sm text-center p-2 bg-green-50 rounded-md">
                        ✅ {processSuccess}
                      </div>
                    )}

                    {/* Simpan Umpan Balik Button - Full width */}
                    <button
                      onClick={handleSaveFeedbackClick}
                      disabled={saveProcessing || !!assessorQrValue || assesseeAnswers.length === 0}
                      className={`w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md
    flex items-center justify-center
    ${saveProcessing || !!assessorQrValue
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-green-700 cursor-pointer"
                        }`}
                    >
                      <Save size={18} className="mr-2" />
                      {saveProcessing ? "Menyimpan..." : "Simpan Rekomendasi"}
                    </button>

                    {/* Generate QR Button - Full width */}
                    <button
                      onClick={handleGenerateQRClick}
                      disabled={qrProcessing || !!assessorQrValue || !isSaved}
                      className={`w-full bg-[#E77D35] text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md
    flex items-center justify-center
          ${qrProcessing || !!assessorQrValue || !isSaved
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-[#E77D35]/90 cursor-pointer"
                        }`}
                    >
                      <QrCode size={18} className="mr-2" />
                      {qrProcessing
                        ? "Memproses..."
                        : assessorQrValue
                          ? "QR Sudah Digenerate"
                          : "Generate QR"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal Konfirmasi Simpan */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
          title="Konfirmasi Simpan"
          message={
            <>
              <div>Anda akan menyimpan pilihan berikut:</div>
              <div className="mt-2 font-bold">{pendingValue}</div>
              {!feedbackResult && (
                <div className="mt-4">
                  <div className="text-sm font-medium">Detail yang akan disimpan:</div>
                  <div className="mt-2 text-sm flex justify-center">
                    <table>
                      <tr>
                        <td className="pr-2 align-top text-start">Unit</td>
                        <td className="pr-2 align-top">:</td>
                        <td className="text-start">{unitField}</td>
                      </tr>
                      <tr>
                        <td className="pr-2 align-top text-start">Elemen</td>
                        <td className="pr-2 align-top">:</td>
                        <td className="text-start">{elementField}</td>
                      </tr>
                      <tr>
                        <td className="pr-2 align-top text-start">KUK</td>
                        <td className="pr-2 align-top">:</td>
                        <td className="text-start">{kukField}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              )}
            </>
          }
          confirmText="Simpan"
          cancelText="Batal"
          type="warning"
        />

        {/* Modal Konfirmasi Generate QR dengan Countdown */}
        <ConfirmModal
          isOpen={showQRConfirmModal}
          onClose={() => setShowQRConfirmModal(false)}
          onConfirm={handleConfirmGenerateQR}
          title="Konfirmasi Generate QR"
          message={
            <>
              <strong>Perhatian!</strong><br />
              Setelah generate QR, data tidak dapat diubah lagi.<br />
              Pastikan semua data sudah benar sebelum melanjutkan.
            </>
          }
          confirmText="Generate QR"
          cancelText="Batal"
          type="danger"
          countdown={5}
        />
      </div>
    </div>
  );
}