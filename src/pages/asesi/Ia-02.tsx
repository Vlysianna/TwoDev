import {
  ChevronLeft,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import type { ResultIA02 } from "@/model/ia02-model";
import api from "@/helper/axios";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";

export default function Ia02() {
  const { id_result, id_assessment, id_asesi, id_asesor } =
    useAssessmentParams();

  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultIA02>({
    id: 0,
    assessment: {
      id: 0,
      code: "N/A",
      occupation: {
        id: 0,
        name: "N/A",
        scheme: {
          id: 0,
          name: "N/A",
          code: "N/A",
        },
      },
    },
    assessee: {
      id: 0,
      name: "N/A",
      email: "N/A",
    },
    assessor: {
      id: 0,
      name: "N/A",
      email: "N/A",
      no_reg_met: "N/A",
    },
    tuk: "N/A",
    is_competent: false,
    created_at: "0000-00-00T00:00:00.000Z",
    ia02_header: {
      id: 0,
      approved_assessee: false,
      approved_assessor: false,
      created_at: "0000-00-00T00:00:00.000Z",
      updated_at: "0000-00-00T00:00:00.000Z",
    },
  });
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (id_result && id_assessment) {
      fetchResult(id_result);
    }
  }, [user]);

  const fetchResult = async (id_result: string) => {
    try {
      const response = await api.get(`/assessments/ia-02/result/${id_result}`);
      if (response.data.success) {
        setResult(response.data.data);

        if (response.data.data.ia02_header.approved_assessee) {
          setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        }

        if (response.data.data.ia02_header.approved_assessor) {
          setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        }
      }
    } catch (error: any) {
      console.log("Error fetching result:", error);
      setError("Gagal memuat data asesmen");
    }
  };

  const handleViewPDF = async () => {
    try {
      setGeneratingPdf(true);
      const response = await api.get(
        `/assessments/ia-02/pdf/${id_assessment}`,
        {
          responseType: "blob",
        }
      );

      // Create blob and open in new tab
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      setError("Gagal membuka PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await api.put(
        `/assessments/ia-02/result/assessee/${id_result}/approve`
      );
      if (response.data.success) {
        setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
      }
    } catch (error) {
      console.log("Error fetching unit competencies:", error);
    }
  };

  const petunjukList = [
    "Baca dan pelajari setiap instruksi kerja di bawah ini dengan cermat sebelum melaksanakan praktek",
    "Klarifikasi kepada assessor kompetensi apabila ada hal-hal yang belum jelas",
    "Laksanakan pekerjaan sesuai dengan urutan proses yang sudah ditetapkan",
    "Seluruh proses kerja mengacu kepada SOP/WI yang dipersyaratkan (Jika Ada)",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesi
            title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR.IA.02"
            icon={
              <Link
                to={paths.asesi.dashboard}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>

        <main className='m-4'>
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header Info */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Kiri */}
                <div className="flex-1">
                  <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    Skema Sertifikasi ( Okupasi )
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock size={14} />
                      {result.tuk}
                    </span>
                  </h2>

                  {/* Asesi & Asesor */}
                  <div className="text-sm text-gray-500 mt-1">
                    Asesi:{" "}
                    <span className="text-gray-800">
                      {result.assessee.name}
                    </span>{" "}
                    &nbsp;|&nbsp; Asesor:{" "}
                    <span className="text-gray-800">
                      {result.assessor.name}
                    </span>
                  </div>
                </div>

                {/* Kanan */}
                <div className="flex-1 text-left sm:text-right">
                  <div className="flex flex-col sm:items-end gap-1">
                    {/* Skema + kode */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                      <p className="text-sm text-gray-800 font-medium">
                        {result.assessment.occupation.name}
                      </p>
                      <p className="text-xs text-[#E77D35] bg-[#E77D3533] px-2 py-0.5 rounded w-fit">
                        {result.assessment.code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Petunjuk */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                A. Petunjuk
              </h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                {petunjukList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
              {/* PDF Options */}
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleViewPDF}
                  disabled={generatingPdf}
                  className="flex items-center justify-center gap-2 bg-[#E77D35] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lihat PDF
                </button>
              </div>
            </div>
          </div>

          {/* Validasi */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
              {/* Bagian kiri (2 kolom) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Asesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asesi
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="Nama Asesi"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={result.assessee.name}
                      readOnly
                    />
                    <input
                      type="date"
                      placeholder="Tanggal"
                      className="w-full sm:w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 sm:mt-0"
                      value={result.ia02_header.updated_at.split("T")[0]}
                      disabled
                    />
                  </div>
                </div>

                {/* Asesor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asesor
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="Nama Asesor"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={result.assessor.name}
                      readOnly
                    />
                    <input
                      type="date"
                      placeholder="Tanggal"
                      className="w-full sm:w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 sm:mt-0"
                      value={result.ia02_header.updated_at.split("T")[0]}
                      disabled
                    />
                  </div>
                </div>

                {/* Kode */}
                <div>
                  <input
                    type="text"
                    placeholder="No. Reg MET"
                    className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={result.assessor.no_reg_met}
                    readOnly
                  />
                </div>
              </div>

              {/* QR Code Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
                <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                  {assesseeQrValue && (
                    <QRCodeCanvas
                      value={assesseeQrValue}
                      size={156}
                      className="w-40 h-40 object-contain"
                    >
                      {assesseeQrValue}
                    </QRCodeCanvas>
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {result.assessee.name}
                  </span>
                  {!assesseeQrValue && (
                    <button
                      disabled={assesseeQrValue !== ""}
                      onClick={() => {
                        if (!assesseeQrValue && assessorQrValue)
                          handleGenerateQRCode();
                      }}
                      className={`block text-center cursor-pointer bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${!assesseeQrValue && assessorQrValue
                        ? "hover:bg-orange-600"
                        : "cursor-not-allowed opacity-50"
                        }`}
                    >
                      Setujui
                    </button>
                  )}
                </div>
                <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                  {assessorQrValue && (
                    <QRCodeCanvas
                      value={assessorQrValue}
                      size={156}
                      className="w-40 h-40 object-contain"
                    >
                      {assessorQrValue}
                    </QRCodeCanvas>
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {result.assessor.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
