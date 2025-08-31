import { ChevronLeft, Clock, AlertCircle, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentParams } from "@/components/IsApproveApl01";
import type { GroupIA, ResultIA02 } from "@/model/ia02-model";
import api from "@/helper/axios";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl } from "@/lib/hashids";

export default function Ia02() {
  const { id_result, id_assessment, id_asesi, id_asesor } =
    useAssessmentParams();

  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
  const [groups, setGroups] = useState<GroupIA[]>([]);

  const [selectedGroup, setSelectedGroup] = useState(0);
  const [assesseeQrValue, setQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  useEffect(() => {
    if (id_result && id_assessment) {
      fetchResult(id_result);
      fetchGroup(id_assessment);
    }
  }, [user]);

  const fetchResult = async (id_result: string) => {
    try {
      const response = await api.get(`/assessments/ia-02/result/${id_result}`);
      if (response.data.success) {
        setResult(response.data.data);

        if (response.data.data.ia02_header.approved_assessee) {
          setQrValue(getAssesseeUrl(Number(id_asesi)));
        }

        if (response.data.data.ia02_header.approved_assessor) {
          setAssessorQrValue(getAssesseeUrl(Number(id_asesor)));
        }
      }
    } catch (error: any) {
      console.log("Error fetching result:", error);
      setError("Gagal memuat data asesmen");
    }
  };

  const fetchGroup = async (id_assessment: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/assessments/ia-02/units/${id_assessment}`
      );
      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error: any) {
      console.log("Error fetching group:", error);
      setError("Gagal memuat data asesmen");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await api.put(
        `/assessments/ia-02/result/assessee/${id_result}/approve`
      );
      if (response.data.success) {
        setQrValue(getAssesseeUrl(Number(id_asesi)));
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-5">
          <NavbarAsesi
            title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR.IA.02"
            icon={
              <Link
                to={paths.asesi.assessment.ak01(id_assessment, id_asesor)}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
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

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
            </div>
          </div>

          {/* Skenario Tugas Praktik Demonstrasi */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
            <h3 className="text-sm font-medium text-gray-800 mb-6">
              B. Skenario Tugas Praktik Demonstrasi
            </h3>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  {groups.map((group, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-sm text-sm font-medium cursor-pointer whitespace-nowrap ${
                        index === selectedGroup
                          ? "bg-[#E77D35] text-white"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      onClick={() => setSelectedGroup(index)}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>

                {/* Unit Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groups[selectedGroup]?.units?.map((unit, index) => (
                    <div
                      key={unit.id}
                      className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="rounded-lg mr-3 flex-shrink-0">
                          <Monitor size={16} className="text-[#E77D35]" />
                        </div>
                        <h4 className="font-medium text-[#E77D35] text-sm">
                          Unit kompetensi {1 + index}
                        </h4>
                      </div>

                      <h5 className="font-medium text-gray-800 mb-2 text-sm leading-tight">
                        {unit.title}
                      </h5>

                      <p className="text-xs text-gray-500">{unit.unit_code}</p>
                    </div>
                  )) ?? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Tidak ada unit kompetensi tersedia untuk kelompok
                      pekerjaan ini.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Keterangan */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
            <div className="pt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Skenario Tugas Praktik Demonstrasi
              </h3>
              <p className="text-sm text-gray-700">
                {groups[selectedGroup]?.scenario ??
                  "Tidak ada skenario tugas praktik demonstrasi tersedia untuk kelompok pekerjaan ini."}
              </p>
              <ol className="list-disc list-inside text-sm text-gray-700 space-y-1 my-2">
                {groups[selectedGroup]?.tools?.map((tool, index) => (
                  <li key={index}>{tool.name}</li>
                )) ?? (
                  <li>
                    Tidak ada alat dan perlengkapan yang tersedia untuk kelompok
                    pekerjaan ini.
                  </li>
                )}
              </ol>
              <h3 className="text-xl font-semibold text-gray-800 my-3">
                Waktu : {groups[selectedGroup]?.duration ?? "0"} Menit
              </h3>
            </div>
          </div>

          {/* Validasi anjay */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
              {/* Bagian kiri (2 kolom) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Asesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asesi
                  </label>
                  <div className="flex items-center gap-3">
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
                      className="w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="flex items-center gap-3">
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
                      className="w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        !assesseeQrValue && assessorQrValue
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
        </div>
      </div>
    </div>
  );
}
