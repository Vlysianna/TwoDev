import { useState, useEffect } from "react";
import { FileCheck2, ChevronLeft, AlertCircle, Check, Save, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import type { ResultAK01 } from "@/model/ak01-model";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import { QRCodeCanvas } from "qrcode.react";
import NavbarAsesor from "@/components/NavAsesor";
import useToast from "@/components/ui/useToast";
import { formatDateInputLocal } from "@/helper/format-date";

export default function CekAk01() {
  const { id_schedule, id_result, id_asesi, id_asesor } =
    useAssessmentParams();

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataSaved, setIsDataSaved] = useState(false); // State baru untuk melacak apakah data sudah disimpan

  const [data, setData] = useState<ResultAK01>({
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
    created_at: "N/A",
    location: "",
    ak01_header: {
      id: 0,
      approved_assessee: false,
      approved_assessor: false,
      created_at: "N/A",
      updated_at: "N/A",
    },
    schedule: {
      id: 20,
      assessment_id: 17,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  const [TUK, setTUK] = useState("");
  const [selectedEvidences, setSelectedEvidences] = useState<string[]>([]);
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`assessments/ak-01/data/${id_result}`);
      const rawData = response.data;
      if (rawData.success) {
        // console.log(rawData.data);
        setData(rawData.data);

        if (rawData.data.ak01_header.rows.length > 0) {
          setSelectedEvidences(
            rawData.data.ak01_header.rows.flatMap((row: any) => row.evidence)
          );
          setIsDataSaved(true); // Set state menjadi true jika data sudah ada
        }
        
        setTUK(
          rawData.data.location
        );

        if (rawData.data.ak01_header.approved_assessor) {
          setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        }

        if (rawData.data.ak01_header.approved_assessee) {
          setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        }
      } else {
        setError(response?.data?.message || "Gagal memuat data");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat memuat data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await api.put(
        `/assessments/ak-01/result/assessor/${id_result}/approve`
      );
      if (response.data.success) {
        setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        toast.show({
          title: "Berhasil",
          description: "QR Code Asesor berhasil digenerate",
          type: "success",
        });
      }
    } catch (error) {
      // console.log("Error Generating QR Code:", error);
      toast.show({
        title: "Gagal",
        description: "Gagal generate QR Code",
        type: "error",
      });
    }
  };

  const handleOnSubmit = async () => {

    const requestData = {
      result_id: id_result,
      evidences: selectedEvidences,
    };

    try {
      const response = await api.post(`/assessments/ak-01/`, requestData);
      if (response.data.success) {
        setIsDataSaved(true); // Set state menjadi true setelah berhasil menyimpan
        toast.show({
          title: "Berhasil",
          description: "Berhasil menyimpan data",
          type: "success",
        });
      } else {
        toast.show({
          title: "Gagal",
          description: "Gagal menyimpan data",
          type: "error",
        });
      }
    } catch (error) {
      // console.log("Error saving data:", error);
      toast.show({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        type: "error",
      });
    }
  };

  const evidenceOptions = [
    "Verifikasi Portofolio",
    "Review Produk",
    "Observasi Langsung",
    "Kegiatan Terstruktur",
    "Pertanyaan Lisan",
    "Pertanyaan Tertulis",
    "Pertanyaan Wawancara",
    "Lainnya",
  ];

  const handleCheckboxChange = (evidence: string) => {
    setSelectedEvidences((prev) => {
      if (prev.includes(evidence)) {
        return prev.filter((item) => item !== evidence);
      } else {
        return [...prev, evidence];
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-[#E77D35] text-white px-4 py-2 rounded hover:bg-orange-600"
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
            title="Persetujuan Asesmen dan Kerahasiaan"
            icon={
              <Link to={paths.asesor.assessment.dashboardAsesmenMandiri(id_schedule)} className="text-gray-500 hover:text-gray-600">
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>
        <main className="m-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header Section */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="text-black-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Persetujuan Asesmen dan Kerahasiaan
                </h2>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Persetujuan Asesmen ini untuk menjamin bahwa Asesi telah diberi
                arahan secara rinci tentang perencanaan dan proses asesmen
              </p>
            </div>

            <div className="pt-6">
              {/* Top grid responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left column */}
                <div className="lg:col-span-7">
                  <h2 className="font-semibold text-gray-800 mb-3">
                    Skema Sertifikasi (KKNI/Okupasi/Klaster)
                  </h2>
                  <div className="text-sm mb-7 flex flex-wrap items-center gap-2">
                    <span className="text-gray-700">
                      {data.assessment.occupation.name}
                    </span>
                    <span className="bg-[#E77D3533] text-[#E77D35] text-xs rounded px-2 py-1 select-none">
                      {data.assessment.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      value={data.assessee.name}
                      readOnly
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      value={data.assessor.name}
                      readOnly
                    />
                  </div>

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Pelaksanaan asesmen disepakati pada:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      value={formatDateInputLocal(data.schedule.start_date)}
                      disabled
                    />
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                        value={TUK}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-5">
                  <h2 className="font-semibold text-gray-800 mb-3">
                    Bukti yang akan dikumpulkan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm mt-4">
                    {evidenceOptions.map((option) => {
                      const checked =
                        selectedEvidences?.includes(option) || false;
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
                                    ${checked ? "bg-orange-100 " : ""}`}
                        >
                          <input
                            type="checkbox"
                            className="hidden cursor-pointer"
                            checked={checked}
                            onChange={() => handleCheckboxChange(option)}
                            disabled={!!assessorQrValue} // Disable jika QR sudah digenerate
                          />
                          <span
                            className={`w-4 h-4 flex items-center justify-center rounded-xs border-2
                                    ${checked
                                ? "bg-[#E77D35] border-[#E77D35]"
                                : "border-[#E77D35]"
                              }`}
                          >
                            {checked && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </span>
                          <span
                            className={
                              checked ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Declaration Sections */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Kiri: isi teks */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Bahwa saya telah mendapatkan penjelasan terkait hak dan prosedur banding asesmen dari asesor.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Asesor :</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Menyatakan tidak akan membuka hasil pekerjaan yang saya peroleh karena penugasan saya sebagai Asesor dalam pekerjaan Asesmen kepada siapapun atau organisasi apapun selain kepada pihak yang berwenang sehubungan dengan kewajiban saya sebagai Asesor yang ditugaskan oleh LSP.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Saya setuju mengikuti asesmen dengan pemahaman bahwa informasi yang dikumpulkan hanya digunakan untuk pengembangan profesional dan hanya dapat diakses oleh orang tertentu saja.
                      </p>
                    </div>
                  </div>

                  {/* Kanan: QR Code Section */}
                  <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* QR Code Asesi */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
                      <h4 className="text-sm font-semibold text-gray-800 text-center">QR Code Asesi</h4>
                      {assesseeQrValue ? (
                        <>
                          <QRCodeCanvas
                            value={assesseeQrValue}
                            size={120}
                            className="w-40 h-40 object-contain"
                          />
                          <div className="text-green-600 font-semibold text-xs text-center">
                            Sudah disetujui Asesi
                          </div>
                        </>
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs text-center">
                            Menunggu persetujuan asesi
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-800 text-center">{data.assessee.name}</span>
                    </div>

                    {/* QR Code Asesor */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
                      <h4 className="text-sm font-semibold text-gray-800 text-center">QR Code Asesor</h4>
                      {assessorQrValue ? (
                        <>
                          <QRCodeCanvas
                            value={assessorQrValue}
                            size={120}
                            className="w-40 h-40 object-contain"
                          />
                          <div className="text-green-600 font-semibold text-xs text-center">
                            Sebagai Asesor, Anda sudah setuju
                          </div>
                        </>
                      ) : (
                        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center flex-col gap-1">
                          <span className="text-gray-400 text-xs text-center">QR Code Asesor</span>
                          <span className="text-gray-400 text-xs text-center">Klik tombol "Generate QR"</span>
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-800 text-center">{data.assessor.name}</span>
                    </div>
                    {/* Submit Button */}
                    <div className="sm:col-span-2 mt-4 border-t border-gray-200 pt-6 space-y-2">
                      <button
                        type="submit"
                        className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${!TUK ||
                          !selectedEvidences ||
                          selectedEvidences.length === 0 ||
                          assessorQrValue // Disable jika QR sudah digenerate
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-700 cursor-pointer"
                          }`}
                        onClick={(e) => {
                          if (
                            !TUK ||
                            !selectedEvidences ||
                            selectedEvidences.length === 0 ||
                            assessorQrValue // Disable jika QR sudah digenerate
                          )
                            e.preventDefault();
                          handleOnSubmit();
                        }}
                        disabled={
                          !TUK ||
                          !selectedEvidences ||
                          selectedEvidences.length === 0 ||
                          !!assessorQrValue // Disable jika QR sudah digenerate
                        }
                      >
                        <Save size={18} className="mr-2" />
                        {isDataSaved ? "Perbarui Persetujuan" : "Simpan Persetujuan"}
                      </button>
                      <button
                        disabled={!isDataSaved || !!assessorQrValue} // Disable jika data belum disimpan atau QR sudah digenerate
                        onClick={() => {
                          if (isDataSaved && !assessorQrValue) handleGenerateQRCode();
                        }}
                        className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${!isDataSaved || assessorQrValue ? "cursor-not-allowed opacity-50" : "hover:bg-orange-600 cursor-pointer"
                          }`}
                      >
                        <QrCode size={18} className="mr-2" />
                        Generate QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}