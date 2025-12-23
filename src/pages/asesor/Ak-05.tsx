import { useState, useEffect } from "react";
import { ChevronLeft, AlertCircle, Clock, Save } from "lucide-react";
import NavbarAsesor from "@/components/NavAsesor";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import { QRCodeCanvas } from "qrcode.react";
import { getAssessorUrl } from "@/lib/hashids";
import type { AK05ResponseData } from "@/model/ak05-model";
import ConfirmModal from "@/components/ConfirmModal";
import { formatDateInputLocal } from "@/helper/format-date";

export default function CekAk05() {
  const { id_schedule: id_assessment, id_result, id_asesor } = useAssessmentParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AK05ResponseData | null>(null);
  const [qrValue, setQrValue] = useState("");
  const [dataSaved, setDataSaved] = useState(false); // State untuk melacak apakah data sudah disimpan

  const [catatan, setCatatan] = useState("");
  const [negatifPositif, setNegatifPositif] = useState("");
  const [penolakan, setPenolakan] = useState("");
  const [saran, setSaran] = useState("");
  const [isCompetent, setIsCompetent] = useState<boolean | null>(null);
  const [deskripsi, setDeskripsi] = useState("");

  // State untuk modal konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValue, setPendingValue] = useState<string>("");
  const [showQRConfirmModal, setShowQRConfirmModal] = useState(false);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fungsi untuk mengubah status kompeten dan mengisi deskripsi otomatis
  const handleCompetentChange = (value: boolean) => {
    setIsCompetent(value);
    // Set deskripsi otomatis berdasarkan pilihan
    setDeskripsi(value ? "Kompeten" : "Belum Kompeten");
    setDataSaved(false); // Reset status saved ketika data berubah
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/assessments/ak-05/${id_result}`);
      const rawData = response.data;
      if (rawData.success) {
        setData(rawData.data);
        // console.log(rawData.data);

        // Set form values from API data
        setNegatifPositif(
          rawData.data.result.result_ak05.negative_positive_aspects || ""
        );
        setPenolakan(rawData.data.result.result_ak05.rejection_notes || "");
        setSaran(rawData.data.result.result_ak05.improvement_suggestions || "");
        setCatatan(rawData.data.result.result_ak05.notes || "");

        const competentStatus = rawData.data.result.result_ak05.is_competent;
        setIsCompetent(competentStatus);

        // Jika sudah ada nilai di database, gunakan itu
        // Jika belum, set otomatis berdasarkan status kompeten
        const existingDescription = rawData.data.result.result_ak05.description;
        setDeskripsi(
          existingDescription ||
          (competentStatus !== null
            ? competentStatus
              ? "Kompeten"
              : "Belum Kompeten"
            : "")
        );

        // jika sudah approve, langsung set QR
        if (rawData.data.result.result_ak05.approved_assessor) {
          setQrValue(getAssessorUrl(Number(id_asesor)));
          setDataSaved(true); // Data sudah tersimpan di server
        }
      } else {
        setError("Gagal memuat data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Otomatis isi "-" jika field kosong
      const payload = {
        result_id: Number(id_result),
        items: [
          {
            is_competent: isCompetent,
            description: deskripsi,
            negative_positive_aspects: negatifPositif.trim() === "" ? "-" : negatifPositif,
            rejection_notes: penolakan.trim() === "" ? "-" : penolakan,
            improvement_suggestions: saran.trim() === "" ? "-" : saran,
            notes: catatan.trim() === "" ? "-" : catatan,
          },
        ],
      };

      const response = await api.post("/assessments/ak-05", payload);

      if (response.data.success) {
        setDataSaved(true);
        setError(null);
        fetchData(); // refresh data untuk status approved
      } else {
        setError("Gagal menyimpan data");
        setDataSaved(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data");
      setDataSaved(false);
    } finally {
      setLoading(false);
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

  const handleGenerateQRCode = async () => {
    // Validasi: pastikan data sudah disimpan
    if (!dataSaved) {
      setError("Harap simpan data terlebih dahulu sebelum generate QR code");
      return;
    }

    try {
      setGeneratingQR(true);
      setError(null);

      // Approve dan generate QR code
      const response = await api.put(
        `/assessments/ak-05/result/assessor/${id_result}/approve`
      );

      if (response.data.success) {
        setQrValue(getAssessorUrl(Number(id_asesor)));
        // Refresh data untuk mendapatkan status approved_assessor yang terbaru
        fetchData();
      } else {
        setError("Gagal mengapprove hasil asesmen");
      }
    } catch (err) {
      console.error("Error generating QR:", err);
      setError("Terjadi kesalahan saat generate QR");
    } finally {
      setGeneratingQR(false);
    }
  };

  // const handleSelesai = async () => {
  //   await handleSave();
  //   // Navigate back or show success message
  // };

  // Handler tombol simpan: buka modal dulu
  const handleSaveClick = () => {
    setPendingValue(
      isCompetent === true
        ? "Kompeten"
        : isCompetent === false
          ? "Belum Kompeten"
          : ""
    );
    setShowConfirmModal(true);
  };

  // Handler konfirmasi modal
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    await handleSave();
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

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesor
            title="Laporan Asesmen - FR.AK.05"
            icon={
              <Link
                to={paths.asesor.assessment.dashboardAsesmenMandiri(id_assessment)}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>

        <main className="m-4">
          <section className="mb-1">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                {/* Header Skema */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  {/* Kiri */}
                  <div className="flex items-center space-x-3 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-800">
                      Skema Sertifikasi {data.result.assessment.occupation.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600 capitalize">
                        {data.result.tuk || "Sewaktu"}
                      </span>
                    </div>
                  </div>

                  {/* Kanan */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                    <span className="px-3 py-1 w-fit rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
                      {data.result.assessment.code}
                    </span>
                  </div>
                </div>

                {/* Detail Asesi - Asesor - Waktu */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
                  {/* Asesi & Asesor */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                    <div className="flex flex-wrap">
                      <span className="xs-text mr-1">Asesi:</span>
                      <span>{data.result.assessee.name || "N/A"}</span>
                    </div>
                    <div className="flex flex-wrap">
                      <span className="xs-text mr-1">Asesor:</span>
                      <span>{data.result.assessor.name || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Tabel Asesi --- */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="overflow-x-auto">
              <table className="w-full border rounded-xl bg-white text-sm min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-3 border text-center">No.</th>
                    <th className="p- border text-center xs-text">Nama Asesi</th>
                    <th className="p-3 border text-center">Rekomendasi</th>
                    <th className="p-3 border text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border text-center">1</td>
                    <td className="p-3 border text-center">
                      {data.result.assessee.name || "N/A"}
                    </td>
                    <td className="p-3 border">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="rekom"
                            value="true"
                            disabled
                            checked={isCompetent === true}
                            onChange={() => handleCompetentChange(true)}
                          />
                          K
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="rekom"
                            value="false"
                            disabled
                            checked={isCompetent === false}
                            onChange={() => handleCompetentChange(false)}
                          />
                          BK
                        </label>
                      </div>
                    </td>
                    <td className="p-3 border text-center">
                      <textarea
                        value={deskripsi}
                        onChange={(e) => {
                          setDeskripsi(e.target.value);
                          setDataSaved(false); // Reset status saved ketika data berubah
                        }}
                        className="w-full text-center border-none focus:ring-0 focus:outline-none resize-none"
                        rows={1}
                        placeholder="Masukkan keterangan"
                        style={{ minHeight: "1.5rem" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- Form & QR --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kiri: Form Catatan */}
            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-medium">
                Aspek Negatif dan Positif dalam Asesemen
              </h2>
              <textarea
                className="w-full border rounded-lg p-2"
                rows={2}
                placeholder="Aspek negatif dan positif"
                disabled={data?.result?.result_ak05?.approved_assessor}
                value={negatifPositif}
                onChange={(e) => {
                  setNegatifPositif(e.target.value);
                  setDataSaved(false); // Reset status saved ketika data berubah
                }}
              />
              <h2 className="text-sm font-medium">
                Pencatatan Penolakan Hasil Asesmen
              </h2>
              <textarea
                className="w-full border rounded-lg p-2"
                rows={2}
                placeholder="Pencatatan penolakan"
                value={penolakan}
                disabled={data?.result?.result_ak05?.approved_assessor}
                onChange={(e) => {
                  setPenolakan(e.target.value);
                  setDataSaved(false); // Reset status saved ketika data berubah
                }}
              />
              <h2 className="text-sm font-medium">
                Saran Perbaikan: (Asesor/Personil Terkait)
              </h2>
              <textarea
                className="w-full border rounded-lg p-2"
                rows={2}
                placeholder="Saran perbaikan"
                disabled={data?.result?.result_ak05?.approved_assessor}
                value={saran}
                onChange={(e) => {
                  setSaran(e.target.value);
                  setDataSaved(false); // Reset status saved ketika data berubah
                }}
              />
              <h2 className="text-sm font-medium">Catatan</h2>
              <textarea
                className="w-full border rounded-lg p-2"
                rows={3}
                placeholder="Catatan..."
                disabled={data?.result?.result_ak05?.approved_assessor}
                value={catatan}
                onChange={(e) => {
                  setCatatan(e.target.value);
                  setDataSaved(false); // Reset status saved ketika data berubah
                }}
              />

              {/* Status Simpan */}
              {dataSaved && (
                <p className="text-green-500 text-sm">
                  Data telah berhasil disimpan
                </p>
              )}

              {/* Tombol Simpan dengan modal konfirmasi */}
              <button
                onClick={handleSaveClick}
                disabled={loading || data?.result?.result_ak05?.approved_assessor}
                className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  loading || data?.result?.result_ak05?.approved_assessor
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700 cursor-pointer"
                }`}
              >
                <Save size={18} className="mr-2" />
                {loading ? "Menyimpan..." : "Simpan Rekomendasi"}
              </button>
            </div>

            {/* Kanan: Asesor & QR */}
            <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-medium mb-3">Asesor</h2>
                <input
                  type="text"
                  value={data.result.assessor.name || "N/A"}
                  disabled
                  className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
                />
              </div>
              <div>
                <h2 className="text-sm font-medium mb-3">Nomor Registrasi</h2>
                <input
                  type="text"
                  value={data.result.assessor.no_reg_met || "N/A"}
                  disabled
                  className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
                />
              </div>
              <div>
                <h2 className="text-sm font-medium mb-3">Tanggal</h2>
                <input
                  type="date"
                  value={formatDateInputLocal(data.result.schedule.end_date).slice(0, 10) || "N/A" }
                  disabled
                  className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
                />
              </div>

              <div className="flex flex-col items-center justify-center border rounded-lg py-10 bg-gray-50 mb-3">
                {qrValue ? (
                  <QRCodeCanvas value={qrValue} size={100} />
                ) : (
                  <p className="text-gray-400 text-sm">Belum Generate QR</p>
                )}
                {qrValue && (
                  <p className="text-sm font-semibold text-gray-800 mt-2 text-center">
                    {data.result.assessor.name || "Nama Asesor"}
                  </p>
                )}
                {/* Jika sudah approve asesor, munculkan pesan */}
                {data?.result?.result_ak05?.approved_assessor && (
                  <p className="text-green-600 text-sm font-semibold mt-2 text-center">
                    Sebagai Asesor, Anda sudah setuju
                  </p>
                )}
              </div>

              {/* Pesan error jika belum disimpan */}
              {!dataSaved && (
                <p className="text-red-500 text-sm mt-2">
                  Harap simpan rekomendasi terlebih dahulu sebelum generate QR
                </p>
              )}

              <button
                onClick={handleGenerateQRClick}
                disabled={
                  !dataSaved ||
                  generatingQR ||
                  isCompetent === null ||
                  data?.result?.result_ak05?.approved_assessor
                }
                className={`w-full text-white py-2 rounded-lg bg-[#E77D35] ${
                  !dataSaved ||
                  generatingQR ||
                  isCompetent === null ||
                  data?.result?.result_ak05?.approved_assessor
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-[#E77D35] hover:bg-orange-600 cursor-pointer"
                }`}
              >
                {generatingQR
                  ? "Memproses..."
                  : data?.result?.result_ak05?.approved_assessor
                  ? "QR Sudah Digenerate"
                  : "Generate QR"}
              </button>              
            </div>
          </section>

          <hr className="border border-gray-200" />

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
        </main>
      </div>
    </div>
  );
}
