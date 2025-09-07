import React, { useState, useEffect } from "react";
import { FileText, ChevronLeft, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import NavbarAsesor from "@/components/NavAsesor";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import api from "@/helper/axios";
import paths from "@/routes/paths";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { ResultAK02, UnitCompetensi } from "@/model/ak02-model";

export default function Ak02() {
  const { id_assessment, id_result, id_asesi, id_asesor } = useAssessmentParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [data, setData] = useState<ResultAK02>({
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
    ak02_headers: {
      id: 0,
      approved_assessee: false,
      approved_assessor: false,
      is_competent: null,
      follow_up: "",
      comment: "",
      rows: [],
    },
  });

  const [units, setUnits] = useState<UnitCompetensi[]>([]);

  // Form state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [assessmentResult, setAssessmentResult] = useState<string>("");
  const [followUp, setFollowUp] = useState<string>("");
  const [assessorComments, setAssessorComments] = useState<string>("");

  // QR Code states
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  // Evidence types
  const evidenceTypes = [
    "Observasi Demonstrasi",
    "Portofolio",
    "Pernyataan Pihak Ketiga",
    "Pernyataan Wawancara",
    "Pertanyaan Lisan",
    "Pertanyaan Tertulis",
    "Proyek Kerja",
    "Lainnya",
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      await loadUnits();
      await loadAK02Data();
    } catch (error) {
      setError("Terjadi kesalahan saat memuat data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      console.log('Loading units for assessment ID:', id_assessment);
      const response = await api.get(`/assessments/ak-02/units/${id_assessment}`);
      console.log('Units API response:', response.data);
      
      if (response.data.success) {
        const apiUnits = response.data.data.units;
        console.log('API units:', apiUnits);
        
        const mappedUnits = apiUnits.map((unit: any) => ({
          id: unit.id,
          code: unit.code,
          title: unit.title,
        }));
        console.log('Mapped units:', mappedUnits);
        
        setUnits(mappedUnits);
        return mappedUnits;
      }
      return [];
    } catch (error) {
      console.error("Failed to load units:", error);
      throw error;
    }
  };

  const loadAK02Data = async (preserveFormState = false) => {
    try {
      const response = await api.get(`/assessments/ak-02/result/${id_result}`);
      const rawData = response.data;

      if (rawData.success) {
        setData(rawData.data);

        if (!preserveFormState) {
          const ak02Headers = rawData.data.ak02_headers;
          if (ak02Headers.is_competent !== null) {
            setAssessmentResult(ak02Headers.is_competent ? "kompeten" : "belum-kompeten");
          }
          setFollowUp(ak02Headers.follow_up || "");
          setAssessorComments(ak02Headers.comment || "");
        }

        // Generate QR codes if already approved
        if (rawData.data.ak02_headers.approved_assessor) {
          setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        }

        if (rawData.data.ak02_headers.approved_assessee) {
          setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        }
      } else {
        setError(rawData?.message || "Gagal memuat data AK02");
      }
    } catch (error) {
      console.error("Failed to load AK02 data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (units.length > 0 && data.ak02_headers.rows.length > 0) {
      const newSelectedOptions: Record<string, boolean> = {};
      
      data.ak02_headers.rows.forEach((row: any) => {
        // Find unit index by matching unit ID
        const unitIndex = units.findIndex(unit => unit.id === row.unit_id);
        if (unitIndex !== -1) {
          // For each evidence in this row
          row.evidences.forEach((evidence: any) => {
            // Find evidence type index
            const evidenceIndex = evidenceTypes.indexOf(evidence.evidence);
            if (evidenceIndex !== -1) {
              const key = `${unitIndex}-${evidenceIndex}`;
              newSelectedOptions[key] = true;
            }
          });
        }
      });
      setSelectedOptions(newSelectedOptions);
    }
  }, [units, data.ak02_headers.rows]);

  const handleCheckboxChange = (unitIndex: number, evidenceIndex: number) => {
    const key = `${unitIndex}-${evidenceIndex}`;
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isChecked = (unitIndex: number, evidenceIndex: number): boolean => {
    const key = `${unitIndex}-${evidenceIndex}`;
    return !!selectedOptions[key];
  };

  const handleAssessmentResultChange = (value: string) => {
    if (assessmentResult === value) {
      setAssessmentResult("");
    } else {
      setAssessmentResult(value);
      if (value === "kompeten") {
        setFollowUp("");
      }
    }
  };

  const validateForm = () => {
    if (!assessmentResult) {
      alert('Pilih hasil asesmen: Kompeten atau Belum Kompeten');
      return false;
    }
    
    if (!assessorComments.trim()) {
      alert('Komentar asesor wajib diisi');
      return false;
    }
    
    if (assessmentResult === "belum-kompeten" && !followUp.trim()) {
      alert('Tindak lanjut wajib diisi untuk hasil "Belum Kompeten"');
      return false;
    }

    // Only check for evidence if units exist
    if (units.length > 0) {
      const hasSelectedEvidence = Object.values(selectedOptions).some(Boolean);
      if (!hasSelectedEvidence) {
        alert('Pilih minimal satu bukti untuk unit kompetensi');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!user || user.role_id !== 2) {
      alert('Hanya asesor yang dapat mengirim data asesmen.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const rows: any[] = [];
      
      Object.entries(selectedOptions).forEach(([key, isSelected]) => {
        if (isSelected) {
          const [unitIndexStr, evidenceIndexStr] = key.split('-');
          const unitIndex = parseInt(unitIndexStr);
          const evidenceIndex = parseInt(evidenceIndexStr);
          
          // Use units from API
          const unit = units[unitIndex];
          const evidenceType = evidenceTypes[evidenceIndex];
          
          if (unit && evidenceType) {
            const existingRow = rows.find(row => row.uc_id === unit.id);
            if (existingRow) {
              existingRow.evidences.push(evidenceType);
            } else {
              rows.push({
                uc_id: unit.id,
                evidences: [evidenceType]
              });
            }
          }
        }
      });

      if (rows.length === 0) {
        alert('Pilih minimal satu bukti untuk unit kompetensi.');
        return;
      }

      const submitData = {
        result_id: Number(id_result),
        is_competent: assessmentResult === "kompeten",
        follow_up: followUp,
        comment: assessorComments,
        rows: rows
      };

      console.log('Submit data:', submitData);

      const response = await api.post('/assessments/ak-02/result/send', submitData);
      
      if (response.data.success) {
        alert('Data asesmen berhasil disimpan!');
        // Navigate to AK-05 page after successful submission
        navigate(paths.asesor.assessment.ak05(id_assessment, id_result, id_asesi, id_asesor));
      } else {
        alert(`Gagal menyimpan data asesmen: ${response.data.message || 'Terjadi kesalahan'}`);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      
      // Show detailed error message
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Terjadi kesalahan saat menyimpan data');
      }
    }
  };

  const handleGenerateQRCode = async () => {
    try {
      const response = await api.put(`/assessments/ak-02/result/assessor/${id_result}/approve`);
      if (response.data.success) {
        setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        // Reload data but preserve form state
        await loadAK02Data(true);
      }
    } catch (error) {
      console.log("Error Generating QR Code:", error);
    }
  };

  const handleAssesseeApproval = async () => {
    try {
      const response = await api.put(`/assessments/ak-02/result/assessee/${id_result}/approve`);
      if (response.data.success) {
        setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        // Reload data but preserve form state
        await loadAK02Data(true);
      }
    } catch (error) {
      console.log("Error approving assessee:", error);
    }
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

  const isAssessee = user?.role_id === 3;
  // const isAssessee = true;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <NavbarAsesor
            title="Rekaman Asesmen Kompetensi - FR.AK.02"
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

        <div className="px-6 pb-7">
          {/* Header Info Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3 flex-wrap">
                <h2 className="text-sm font-medium text-gray-800">
                  Skema Sertifikasi (Okupasi)
                </h2>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Sewaktu</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                <div className="text-sm text-gray-700">
                  {data.assessment.occupation.name}
                </div>
                <div className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] sm:ml-5">
                  {data.assessment.code}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                <div className="flex flex-wrap">
                  <span className="font-semibold mr-1">Asesi:</span>
                  <span>{data.assessee.name}</span>
                </div>
                <div className="flex flex-wrap">
                  <span className="font-semibold mr-1">Asesor:</span>
                  <span>{data.assessor.name}</span>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center space-y-1 xl:space-y-0 xl:space-x-2 text-gray-600 text-sm lg:ml-auto">
                <span className="whitespace-nowrap">{new Date(data.created_at).toLocaleDateString('id-ID')} | TUK: {data.tuk}</span>
              </div>
            </div>
          </div>

          {/* Unit Kompetensi Table - Only show for assessor, using API units */}
          {!isAssessee && units.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <p className="text-gray-700">
                  Beri tanda centang (✓) di kolom yang sesuai untuk mencerminkan
                  bukti yang sesuai untuk setiap Unit Kompetensi.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-64">
                        Unit Kompetensi
                      </th>
                      {evidenceTypes.map((evidence, index) => (
                        <th
                          key={index}
                          className="text-center py-4 px-3 font-semibold text-gray-700 min-w-24 text-xs"
                        >
                          {evidence}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {units.map((unit, unitIndex) => (
                      <tr
                        key={unit.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          <div className="text-sm text-gray-500 mb-1">{unit.code}</div>
                          <div>{unit.title}</div>
                        </td>
                        {evidenceTypes.map((_, evidenceIndex) => (
                          <td
                            key={evidenceIndex}
                            className="py-4 px-3 text-center"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked(unitIndex, evidenceIndex)}
                              onChange={() =>
                                handleCheckboxChange(unitIndex, evidenceIndex)
                              }
                              className="w-4 h-4 rounded border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              style={{
                                accentColor: "#FF7601",
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>  
            </div>
          )}

          {/* Bottom form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10 lg:p-10 w-full">
            <div className="bg-gray-50 p-2 lg:col-span-20 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Left Section: Rekomendasi Hasil Asesmen */}
                <div className="lg:col-span-6 order-1">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 lg:mb-6">
                    Rekomendasi Hasil Asesmen
                  </h2>

                  <div className="mb-4 lg:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={assessmentResult === "kompeten"}
                          onChange={() => handleAssessmentResultChange("kompeten")}
                          disabled={isAssessee}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`text-xs sm:text-sm ${isAssessee ? 'text-gray-400' : 'text-gray-700'}`}>
                          Kompeten
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={assessmentResult === "belum-kompeten"}
                          onChange={() => handleAssessmentResultChange("belum-kompeten")}
                          disabled={isAssessee}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`text-xs sm:text-sm ${isAssessee ? 'text-gray-400' : 'text-gray-700'}`}>
                          Belum Kompeten
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Tindak Lanjut */}
                  <div className="mb-4 lg:mb-6">
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                      isAssessee ? 'text-gray-400' : 
                      assessmentResult === "kompeten" ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      Tindak lanjut yang dibutuhkan
                      {assessmentResult === "belum-kompeten" && !isAssessee && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      (Masukkan pekerjaan tambahan dan asesmen yang diperlukan
                      untuk mencapai kompetensi)
                    </p>
                    <div className={`border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500 ${
                      isAssessee || assessmentResult === "kompeten" ? 'bg-gray-100' : ''
                    }`}>
                      <textarea
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        disabled={isAssessee || assessmentResult === "kompeten"}
                        className={`w-full resize-none border-none outline-none text-xs sm:text-sm ${
                          isAssessee || assessmentResult === "kompeten" ? 
                          'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                        rows={3}
                        placeholder={assessmentResult === "kompeten" ? "Tidak diperlukan untuk hasil kompeten" : ""}
                      />
                    </div>
                  </div>

                  {/* Komentar Asesor */}
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${isAssessee ? 'text-gray-400' : 'text-gray-700'}`}>
                      Komentar/ Observasi oleh asesor
                      {!isAssessee && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className={`border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500 ${isAssessee ? 'bg-gray-100' : ''}`}>
                      <textarea
                        value={assessorComments}
                        onChange={(e) => setAssessorComments(e.target.value)}
                        disabled={isAssessee}
                        className={`w-full resize-none border-none outline-none text-xs sm:text-sm ${isAssessee ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        rows={3}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* Middle Section: User Info */}
                <div className="lg:col-span-4 order-2 lg:order-2">
                  <div className="mb-8 lg:mb-15">
                    <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">
                      Asesi
                    </h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={data.assessee.name}
                        disabled
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="date"
                          value={new Date().toISOString().split("T")[0]}
                          disabled
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">
                      Asesor
                    </h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={data.assessor.name}
                        disabled
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={data.assessor.no_reg_met}
                        disabled
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="date"
                          value={new Date().toISOString().split("T")[0]}
                          disabled
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: QR Codes */}
                <div className="lg:col-span-2 order-3 flex flex-col items-center space-y-6 lg:space-y-10">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Assessor QR Code */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                      {assessorQrValue && (
                        <QRCodeCanvas
                          value={assessorQrValue}
                          size={156}
                          className="w-40 h-40 object-contain"
                        />
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {data.assessor.name}
                      </span>
                      {!isAssessee && !data.ak02_headers.approved_assessor && (
                        <button 
                          onClick={handleGenerateQRCode}
                          className="block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:bg-orange-600"
                        >
                          Setujui
                        </button>
                      )}
                    </div>

                    {/* Assessee QR Code */}
                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                      {assesseeQrValue && (
                        <QRCodeCanvas
                          value={assesseeQrValue}
                          size={156}
                          className="w-40 h-40 object-contain"
                        />
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {data.assessee.name}
                      </span>
                      {isAssessee && data.ak02_headers.approved_assessor && !data.ak02_headers.approved_assessee && (
                        <button 
                          onClick={handleAssesseeApproval}
                          className="block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:bg-orange-600"
                        >
                          Setujui
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="flex flex-col items-center space-y-2 text-xs">
                    <div className={`flex items-center space-x-2 ${(data.ak02_headers.approved_assessor === true || data.ak02_headers.approved_assessor === 1) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${(data.ak02_headers.approved_assessor === true || data.ak02_headers.approved_assessor === 1) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>Assessor Approved</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${(data.ak02_headers.approved_assessee === true || data.ak02_headers.approved_assessee === 1) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${(data.ak02_headers.approved_assessee === true || data.ak02_headers.approved_assessee === 1) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>Assessee Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Only show for assessor */}
          {!isAssessee && (
            <div className="flex justify-end mt-6 lg:mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <button
                onClick={handleSubmit}
                className="bg-[#E77D35] hover:bg-[#d66d2a] text-white text-xs sm:text-sm font-medium px-8 sm:px-12 lg:px-45 py-2 sm:py-3 rounded-md transition-colors duration-200"
              >
                Simpan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}