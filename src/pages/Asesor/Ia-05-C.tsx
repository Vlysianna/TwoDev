import React, { useState, useEffect } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import NavbarAsesor from "../../components/NavAsesor";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import { useAuth } from "@/contexts/AuthContext";
import type { ResultIA05C, AssesseeAnswer } from "@/model/ia05c-model";
import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import { QRCodeCanvas } from "qrcode.react";

// Main Component
export default function Ia05C() {
  const { id_assessment, id_asesi, id_asesor, id_result } =
    useAssessmentParams();
  const { user } = useAuth();

  // Table row radio state: { [questionId]: 'Ya' | 'Tidak' }
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  // Assessment summary radio: 'assesment1' = Semua Tercapai, 'assesment3' = Tidak Tercapai
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<ResultIA05C | null>(null);
  const [assesseeAnswers, setAssesseeAnswers] = useState<AssesseeAnswer[]>([]);
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  const [feedbackResult, setFeedbackResult] = useState<boolean>(false);
  const [unitField, setUnitField] = useState("");
  const [elementField, setElementField] = useState("");
  const [kukField, setKukField] = useState("");

  // Format date for display
  const formattedDate = result?.ia05_header.updated_at
    ? new Date(result.ia05_header.updated_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    fetchData();
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
        const rawData: ResultIA05C = resultResponse.data.data;
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

  const handleGenerateQRCode = async () => {
    try {
      const response = await api.put(
        `/assessments/ia-05/result/assessor/${id_result}/approve`
      );
      if (response.data.success) {
        setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
      }
    } catch (error) {
      console.error("Error Generating QR Code:", error);
      alert("Gagal generate QR Code");
    }
  };

  // Handle summary radio (Semua Tercapai/Tidak Tercapai)
  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    // If 'Semua Tercapai', set all answers to 'Ya'; if 'Tidak Tercapai', set all to 'Tidak'
    if (value === "assesment1") {
      const allYes: Record<number, string> = {};
      assesseeAnswers.forEach((answer) => {
        allYes[answer.id] = "Ya";
      });
      setSelectedAnswers(allYes);
    } else if (value === "assesment3") {
      const allNo: Record<number, string> = {};
      assesseeAnswers.forEach((answer) => {
        allNo[answer.id] = "Tidak";
      });
      setSelectedAnswers(allNo);
    }
  };

  // Handle per-question radio
  const handleTableRadioChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: value }));
    // If user manually changes a row, unset the summary radio
    setSelectedValue("");
  };

  const handleFeedbackRadioChange = (value: string) => {
    setFeedbackResult(value === "tercapai");
    // Clear unit/element/kuk fields if "Tercapai" is selected
    if (value === "tercapai") {
      setUnitField("");
      setElementField("");
      setKukField("");
    }
  };

  const options = [
    { key: "assesment1", label: "Semua Tercapai" },
    { key: "assesment3", label: "Tidak Tercapai" },
  ];

  const feedbackOptions = [
    { key: "tercapai", label: "Tercapai" },
    { key: "belum-tercapai", label: "Belum Tercapai" },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare data for submission in the correct format
      const submissionData = {
        result_id: Number(id_result),
        is_achieved: feedbackResult,
        unit: feedbackResult ? null : unitField,
        element: feedbackResult ? null : elementField,
        kuk: feedbackResult ? null : kukField,
        results: assesseeAnswers.map((answer) => ({
          option_id: answer.answers.id,
          approved: selectedAnswers[answer.id] === "Ya",
        })),
      };

      console.log("Submitting data:", submissionData);

      const response = await api.post(
        `/assessments/ia-05/result/assessor/send`,
        submissionData
      );

      if (response.data.success) {
        fetchData(); // Refresh data
      } else {
        setError("Gagal menyimpan data: " + response.data.message);
      }
    } catch (error: any) {
      setError(
        "Gagal menyimpan data: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
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
      {/* Navbar */}
      <div className="bg-white">
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

      {/* Content */}
      <div className="max-w-[1450px] mx-auto py-2 md:py-6 px-2 md:px-0">
        <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 mb-6 rounded-lg shadow-sm border p-4 lg:p-6">
          {/* Header Info & Progress */}
          <div className="py-4 md:py-6 border-gray-200">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
              {/* Left */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                <h2 className="text-sm font-medium text-gray-800">
                  Skema Sertifikasi (Okupasi)
                </h2>
                <div className="flex items-center text-xs md:text-sm text-gray-500">
                  <Clock size={12} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">{result?.tuk ?? "N/A"}</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <div className="text-sm text-gray-700">
                  {result?.assessment.occupation.name ?? "N/A"}
                </div>
                <div className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
                  {result?.assessment.code ?? "N/A"}
                </div>
              </div>
            </div>

            {/* Filter Row + Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center">
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
              <div className="col-span-1 md:col-span-1">
                <div className="flex flex-col md:flex-row md:gap-6 space-y-2 md:space-y-0">
                  {options.map((option) => (
                    <label
                      key={option.key}
                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition 
                        ${
                          selectedValue === option.key ? "bg-[#E77D3533]" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="assesment"
                        value={option.key}
                        className="hidden"
                        checked={selectedValue === option.key}
                        onChange={() => handleRadioChange(option.key)}
                      />
                      <span
                        className={`w-5 aspect-square flex items-center justify-center rounded-full border-2 
                          ${
                            selectedValue === option.key
                              ? "bg-[#E77D35] border-[#E77D35]"
                              : "border-[#E77D35]"
                          }`}
                      >
                        {selectedValue === option.key && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`${
                          selectedValue === option.key
                            ? "text-gray-900"
                            : "text-gray-500"
                        } whitespace-nowrap text-sm`}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
                {/* Teks Asesmen Awal */}
                <span className="text-sm font-medium text-gray-400">
                  Asesmen awal: {assesseeAnswers.length} /{" "}
                  {assesseeAnswers.length}
                </span>

                {/* Progress Bar */}
                <div className="w-full md:w-1/2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#E77D35] h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>

                {/* Persen */}
                <span className="text-sm font-medium text-[#E77D35]">100%</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-3 md:p-6 border border-gray-200 rounded-sm">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
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
                                className={`flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-sm cursor-pointer transition ${
                                  selectedAnswers[answer.id] === option
                                    ? "bg-[#E77D3533]"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${answer.id}`}
                                  value={option}
                                  className="hidden"
                                  checked={
                                    selectedAnswers[answer.id] === option
                                  }
                                  onChange={() =>
                                    handleTableRadioChange(answer.id, option)
                                  }
                                />
                                <span
                                  className={`w-4 md:w-5 aspect-square flex items-center justify-center rounded-full border-2 ${
                                    selectedAnswers[answer.id] === option
                                      ? "bg-[#E77D35] border-[#E77D35]"
                                      : "border-[#E77D35]"
                                  }`}
                                >
                                  {selectedAnswers[answer.id] === option && (
                                    <svg
                                      className="w-2 h-2 md:w-3 md:h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                <span
                                  className={`${
                                    selectedAnswers[answer.id] === option
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
              </div>
            </div>
          </div>
        </div>

        {/* Umpan Balik Section - Updated to match IA01 style */}
        <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 mb-6 rounded-lg shadow-sm border p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr] gap-6 lg:gap-8 items-start">
            {/* Left Section: Umpan Balik */}
            <div className="lg:col-span-1 h-full flex flex-col">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Umpan Balik
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Aspek pengetahuan seluruh unit kompetensi yang diujikan
              </p>

              {/* Radio Buttons untuk Tercapai/Belum Tercapai */}
              <div className="space-y-3 mb-6">
                {feedbackOptions.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-start space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="feedbackResult"
                      value={option.key}
                      checked={feedbackResult === (option.key === "tercapai")}
                      onChange={() => handleFeedbackRadioChange(option.key)}
                      className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                    />
                    <span
                      className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
                        feedbackResult !== (option.key === "tercapai")
                          ? "opacity-50 line-through"
                          : ""
                      }`}
                    >
                      {option.key === "tercapai"
                        ? "Tercapai"
                        : "Belum Tercapai"}
                    </span>
                  </label>
                ))}
              </div>

              {/* Tuliskan unit/elemen/KUK jika belum tercapai */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  Tuliskan unit/elemen/KUK jika belum tercapai:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={unitField}
                      disabled={feedbackResult} // Disable if "Tercapai" is selected
                      onChange={(e) => setUnitField(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Elemen
                    </label>
                    <input
                      type="text"
                      value={elementField}
                      disabled={feedbackResult} // Disable if "Tercapai" is selected
                      onChange={(e) => setElementField(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KUK
                  </label>
                  <input
                    type="text"
                    value={kukField}
                    disabled={feedbackResult} // Disable if "Tercapai" is selected
                    onChange={(e) => setKukField(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]"
                  />
                </div>
              </div>
            </div>

            {/* Middle Section: Asesi and Asesor */}
            <div className="h-full flex flex-col">
              {/* Asesi Section */}
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
                    type="text"
                    value={formattedDate}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                    readOnly
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      strokeWidth="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                  </svg>
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
                    type="text"
                    value={formattedDate}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                    readOnly
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      strokeWidth="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Section: QR and Generate Button */}
            <div className="px-2 h-full flex flex-col">
              <div className="grid grid-cols-1 gap-4">
                {/* QR Asesi */}
                <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
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
                  {/* Tombol Setujui hanya muncul jika belum approved */}
                  {result?.ia05_header?.approved_assessor !== true && (
                    <button
                      disabled={!!assessorQrValue}
                      onClick={handleGenerateQRCode}
                      className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        !assessorQrValue
                          ? "hover:bg-orange-600 cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      {assessorQrValue ? "QR Telah Digenerate" : "Setujui"}
                    </button>
                  )}
                  {/* Status jika sudah approved */}
                  {result?.ia05_header?.approved_assessor === true && (
                    <span className="text-green-600 font-semibold text-sm mt-2">
                      Sebagai Asesor, Anda sudah setuju
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Lanjut Button */}
          <div className="mt-8 flex justify-center md:justify-end items-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-[#E77D35] text-white px-40 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-[#E77D35]/90 cursor-pointer"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
