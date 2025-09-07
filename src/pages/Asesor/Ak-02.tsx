import { useEffect, useState } from "react";
import NavbarAsesor from "@/components/NavAsesor";
import { FileText } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";

// Types
interface User {
  id: number;
  role_id: number;
  full_name: string;
  email: string;
}

interface UnitCompetensi {
  id: number;
  unit_code: string;
  title: string;
}

interface AK02Row {
  id?: number;
  uc_id: number;
  evidence: string[];
  uc?: UnitCompetensi;
}

interface AK02Data {
  id?: number;
  result_id: number;
  approved_assessee: boolean;
  approved_assessor: boolean;
  is_competent: boolean | null;
  follow_up: string;
  comment: string;
  rows: AK02Row[];
}

export default function Ak02() {
  // User and authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Form state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [assessmentResult, setAssessmentResult] = useState<string>(""); // Changed: Start with empty string
  const [followUp, setFollowUp] = useState<string>("");
  const [assessorComments, setAssessorComments] = useState<string>("");
  const [asesiName, setAsesiName] = useState("");
  const [asesiDate, setAsesiDate] = useState("");
  const [asesorName, setAsesorName] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [asesorDate, setAsesorDate] = useState("");

  // AK02 specific state
  const [ak02Data, setAk02Data] = useState<AK02Data | null>(null);
  const [units, setUnits] = useState<UnitCompetensi[]>([]);
  const [resultId] = useState(1); // This should come from route params or context

  // QR Code states - Added like in AK-01
  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");

  const competencyUnits = [
    "Menggunakan Struktur Data",
    "Menggunakan Spesifikasi Program",
    "Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia",
    "Menulis Kode Dengan Prinsip Sesuai Guidelines dan Best Practices",
    "Mengimplementasikan Pemrograman Terstruktur",
    "Membuat Dokumen Kode Program",
    "Melakukan Debugging",
    "Melaksanakan Pengujian Unit Program",
  ];

  const evidenceTypes = [
    "Observasi Demonstrasi",
    "Portofolio",
    "Pernyataan Pihak Ketiga Pernyataan Wawancara",
    "Pertanyaan Lisan",
    "Pertanyaan Tertulis",
    "Proyek Kerja",
    "Lainnya",
  ];

  // Get auth token
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Create authenticated API headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Get current user using the /auth/me endpoint
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = getAuthToken();
        
        if (!token) {
          setAuthError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const htmlText = await response.text();
          console.log('HTML Response:', htmlText);
          
          setAuthError('Server returned HTML instead of JSON. Check backend routing.');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          if (response.status === 401) {
            setAuthError('Authentication failed. Please log in again.');
          } else if (response.status === 403) {
            setAuthError('Token expired or invalid. Please log in again.');
          } else {
            const errorData = await response.json();
            setAuthError(`Server error (${response.status}): ${errorData.message || 'Unknown error'}`);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          const user = data.data;
          setCurrentUser({
            id: user.id,
            role_id: user.role_id,
            // role_id: 3,
            full_name: user.full_name,
            email: user.email,
          });
          
          // Check if user has permission to access this page (role_id 2 = assessor, role_id 3 = assessee)
          if (user.role_id !== 2 && user.role_id !== 3) {
            setAuthError(`Access denied. Only assessors and assessees can access this page. Your role: ${user.role_id}`);
            setLoading(false);
            return;
          }

          // Auto-populate data based on user info
          setAsesorName(user.full_name);
          setAsesorId(user.id.toString());
          
          // Load AK02 data and units after user is confirmed
          await loadUnits();
          await loadAK02Data();
        } else {
          setAuthError(`API returned error: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          setAuthError('Cannot connect to backend server. Make sure backend is running on http://localhost:3000');
        } else {
          setAuthError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    const today = new Date().toISOString().split("T")[0]; 
    // setAsesiDate(today);
    setAsesorDate(today);

    fetchCurrentUser();
  }, []);

  // Load existing AK02 data
  const loadAK02Data = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/assessments/ak-02/result/${resultId}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const ak02 = data.data;
          setAk02Data(ak02);
          
          // Only populate form fields if data exists and is not null
          if (ak02.ak02_headers.is_competent !== null) {
            setAssessmentResult(ak02.ak02_headers.is_competent ? "kompeten" : "belum-kompeten");
          }
          setFollowUp(ak02.ak02_headers.follow_up || "");
          setAssessorComments(ak02.ak02_headers.comment || "");
          
          // Generate QR codes if already approved - Added like in AK-01
          if (ak02.ak02_headers.approved_assessor) {
            setAssessorQrValue(getAssessorUrl(Number(ak02.assessor?.id)));
          }
          
          if (ak02.ak02_headers.approved_assessee) {
            setAssesseeQrValue(getAssesseeUrl(Number(ak02.assessee?.id)));
          }
          
          // Populate evidence selections
          const newSelectedOptions: Record<string, boolean> = {};
          ak02.ak02_headers.rows.forEach((row: any) => {
            const unitIndex = units.findIndex(u => u.id === row.unit_id);
            if (unitIndex !== -1) {
              row.evidences.forEach((evidence: any) => {
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
      }
    } catch (error) {
      console.error('Failed to load AK02 data:', error);
    }
  };

  // Load units
  const loadUnits = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/assessments/ak-02/units/1`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnits(data.data.units); // Updated to match backend response structure
        }
      }
    } catch (error) {
      console.error('Failed to load units:', error);
    }
  };

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

  // Changed: Handle assessment result change with mutual exclusion
  const handleAssessmentResultChange = (value: string) => {
    if (assessmentResult === value) {
      // If clicking the same checkbox, uncheck it
      setAssessmentResult("");
    } else {
      // Set the new value
      setAssessmentResult(value);
      // If selecting "kompeten", clear follow up field
      if (value === "kompeten") {
        setFollowUp("");
      }
    }
  };

  // Changed: Validation function
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
    
    return true;
  };

  const handleSubmit = async () => {
    if (!currentUser || currentUser.role_id !== 2) {
      alert('Only assessors can submit assessment records.');
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for submission - Fixed structure to match backend
      const rows: AK02Row[] = [];
      
      // Process selected options to create rows
      Object.entries(selectedOptions).forEach(([key, isSelected]) => {
        if (isSelected) {
          const [unitIndexStr, evidenceIndexStr] = key.split('-');
          const unitIndex = parseInt(unitIndexStr);
          const evidenceIndex = parseInt(evidenceIndexStr);
          
          const unitId = units[unitIndex]?.id;
          const evidenceType = evidenceTypes[evidenceIndex];
          
          if (unitId && evidenceType) {
            const existingRow = rows.find(row => row.uc_id === unitId);
            if (existingRow) {
              existingRow.evidence.push(evidenceType);
            } else {
              rows.push({
                uc_id: unitId,
                evidence: [evidenceType]
              });
            }
          }
        }
      });

      // Fixed: Updated to match backend expected structure
      const submitData = {
        result_id: resultId,
        is_competent: assessmentResult === "kompeten",
        follow_up: followUp,
        comment: assessorComments,
        rows: rows.map(row => ({
          uc_id: row.uc_id,
          evidences: row.evidence // Changed from 'evidence' to 'evidences'
        }))
      };

      const response = await fetch('http://localhost:3000/api/assessments/ak-02/result/send', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Assessment record submitted successfully!');
        await loadAK02Data(); // Reload data
      } else {
        alert(`Failed to submit assessment record: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred while submitting');
    }
  };

  // Fixed: Updated to match backend API endpoints and QR generation like AK-01
  const handleGenerateQRAssessor = async () => {
    if (!currentUser || !ak02Data) {
      alert('Unable to approve. User data or assessment data is missing.');
      return;
    }

    if (currentUser.role_id !== 2) {
      alert('Only assessors can approve at this stage.');
      return;
    }

    try {
      // Fixed: Updated endpoint to match backend routes
      const response = await fetch(`http://localhost:3000/api/assessments/ak-02/result/assessor/${resultId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (data.success) {
        // Generate QR code like in AK-01
        setAssessorQrValue(getAssessorUrl(Number(currentUser.id)));
        alert('Approved by assessor successfully!');
        await loadAK02Data(); // Reload data
      } else {
        alert(`Failed to approve: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('An error occurred while approving');
    }
  };

  const handleGenerateQRAssessee = async () => {
    if (!currentUser || !ak02Data) {
      alert('Unable to generate QR. User data or assessment data is missing.');
      return;
    }

    if (currentUser.role_id !== 3) {
      alert('Only assessees can approve at this stage.');
      return;
    }

    if (!ak02Data.approved_assessor) {
      alert('Please wait for assessor approval first.');
      return;
    }

    try {
      // Fixed: Updated endpoint to match backend routes
      const response = await fetch(`http://localhost:3000/api/assessments/ak-02/result/assessee/${resultId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (data.success) {
        // Generate QR code like in AK-01
        setAssesseeQrValue(getAssesseeUrl(Number(currentUser.id)));
        alert('Final approval completed successfully!');
        await loadAK02Data(); // Reload data
      } else {
        alert(`Failed to approve: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('An error occurred while approving');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-600 text-center">
            <div className="text-lg font-semibold mb-2">Authentication Error</div>
            <div className="text-sm">{authError}</div>
          </div>
        </div>
      </div>
    );
  }

  // Check if forms should be disabled (for role_id 3)
  const isFormDisabled = currentUser?.role_id === 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAsesor
        title="Rekaman Asesmen Kompetensi - FR.AK.02"
        icon={<FileText size={20} />}
      />

      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Skema Sertifikasi Section - Only show for role_id 2 (assessor) */}
          {currentUser?.role_id === 2 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3 flex-wrap">
                  <h2 className="text-sm font-medium text-gray-800">
                    Skema Sertifikasi (Okupasi)
                  </h2>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                      <polyline
                        points="12,6 12,12 16,14"
                        strokeWidth="2"
                      ></polyline>
                    </svg>
                    <span className="text-sm text-gray-600">Sewaktu</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                  <div className="text-sm text-gray-700">
                    Pemrogram Junior (Junior Coder)
                  </div>
                  <div className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] sm:ml-5">
                    SMK.RPL.PJ/LSPSMK24/2023
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <div className="flex flex-wrap">
                    <span className="font-semibold mr-1">Asesi:</span>
                    <span>Ananda Keizra Oktavian</span>
                  </div>
                  <div className="flex flex-wrap">
                    <span className="font-semibold mr-1">Asesor:</span>
                    <span>{currentUser.full_name}</span>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center space-y-1 xl:space-y-0 xl:space-x-2 text-gray-600 text-sm lg:ml-auto">
                  <span className="whitespace-nowrap">24 Oktober 2025 | 07:00 – 15:00</span>
                  <span className="hidden xl:inline">-</span>
                  <span className="whitespace-nowrap">24 Oktober 2025 | 07:00 – 15:00</span>
                </div>
              </div>
            </div>
          )}

          {/* Unit Kompetensi Table - Only show for role_id 2 (assessor) */}
          {currentUser?.role_id === 2 && (
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
                    {competencyUnits.map((unit, unitIndex) => (
                      <tr
                        key={unitIndex}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          {unit}
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

          {/* Bottom form - Show for both roles but with different permissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10 lg:p-10 w-full">
            <div className="bg-gray-50 p-2 lg:col-span-20 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Left Section: Rekomendasi Hasil Asesmen */}
                <div className="lg:col-span-6 order-1">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 lg:mb-6">
                    Rekomendasi Hasil Asesmen
                  </h2>

                  {/* Changed: Checkboxes with mutual exclusion */}
                  <div className="mb-4 lg:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={assessmentResult === "kompeten"}
                          onChange={() => handleAssessmentResultChange("kompeten")}
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`text-xs sm:text-sm ${isFormDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                          Kompeten
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={assessmentResult === "belum-kompeten"}
                          onChange={() => handleAssessmentResultChange("belum-kompeten")}
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`text-xs sm:text-sm ${isFormDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                          Belum Kompeten
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Changed: Tindak Lanjut with conditional disabled/required */}
                  <div className="mb-4 lg:mb-6">
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                      isFormDisabled ? 'text-gray-400' : 
                      assessmentResult === "kompeten" ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      Tindak lanjut yang dibutuhkan
                      {assessmentResult === "belum-kompeten" && !isFormDisabled && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      (Masukkan pekerjaan tambahan dan asesmen yang diperlukan
                      untuk mencapai kompetensi)
                    </p>
                    <div className={`border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500 ${
                      isFormDisabled || assessmentResult === "kompeten" ? 'bg-gray-100' : ''
                    }`}>
                      <textarea
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        disabled={isFormDisabled || assessmentResult === "kompeten"}
                        className={`w-full resize-none border-none outline-none text-xs sm:text-sm ${
                          isFormDisabled || assessmentResult === "kompeten" ? 
                          'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                        rows={3}
                        placeholder={assessmentResult === "kompeten" ? "Tidak diperlukan untuk hasil kompeten" : ""}
                      />
                    </div>
                  </div>

                  {/* Changed: Komentar Asesor with required indicator */}
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${isFormDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                      Komentar/ Observasi oleh asesor
                      {!isFormDisabled && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className={`border border-gray-300 rounded-md p-3 min-h-[60px] sm:min-h-[80px] focus-within:ring-2 focus-within:ring-orange-500 ${isFormDisabled ? 'bg-gray-100' : ''}`}>
                      <textarea
                        value={assessorComments}
                        onChange={(e) => setAssessorComments(e.target.value)}
                        disabled={isFormDisabled}
                        className={`w-full resize-none border-none outline-none text-xs sm:text-sm ${isFormDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        rows={3}
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* Middle Section: Asesi and Asesor - Changed: All fields disabled */}
                <div className="lg:col-span-4 order-2 lg:order-2">
                  {/* Asesi Section */}
                  <div className="mb-8 lg:mb-15">
                    <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">
                      Asesi
                    </h3>

                    <div className="mb-3">
                      <input
                        type="text"
                        value={asesiName}
                        onChange={(e) => setAsesiName(e.target.value)}
                        disabled={true} // Always disabled - will be auto-populated
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        placeholder="Nama Asesi (otomatis)"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="date"
                          value={asesiDate}
                          onChange={(e) => setAsesiDate(e.target.value)}
                          disabled={true} // Always disabled - will be auto-populated
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Asesor Section */}
                  <div className="mb-6">
                    <h3 className="text-xs sm:text-sm font-semibold mb-3 text-gray-400">
                      Asesor
                    </h3>

                    <div className="mb-3">
                      <input
                        type="text"
                        value={asesorName}
                        onChange={(e) => setAsesorName(e.target.value)}
                        disabled={true} // Always disabled - auto-populated from user data
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        placeholder="Nama Asesor (otomatis)"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        value={asesorId}
                        onChange={(e) => setAsesorId(e.target.value)}
                        disabled={true} // Always disabled - auto-populated from user data
                        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        placeholder="ID Asesor (otomatis)"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="date"
                          value={asesorDate}
                          onChange={(e) => setAsesorDate(e.target.value)}
                          disabled={true} // Always disabled - will be auto-populated
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: QR and Generate Button */}
                <div className="lg:col-span-2 order-3 flex flex-col items-center space-y-6 lg:space-y-10">
                  {/* QR Code Section - Updated like AK-01 */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Assessor QR Code */}
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
                        {asesorName || "Asesor"}
                      </span>
                      {/* Assessor Approval Button */}
                      {currentUser?.role_id === 2 && !assessorQrValue && (
                        <button 
                          onClick={handleGenerateQRAssessor}
                          disabled={!!assessorQrValue}
                          className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                            !assessorQrValue
                              ? "hover:bg-orange-600"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        >
                          Setujui Asesor
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
                        >
                          {assesseeQrValue}
                        </QRCodeCanvas>
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {asesiName || "Asesi"}
                      </span>
                      {/* Assessee Approval Button */}
                      {currentUser?.role_id === 3 && !assesseeQrValue && (
                        <button 
                          onClick={handleGenerateQRAssessee}
                          disabled={!ak02Data?.approved_assessor || !!assesseeQrValue}
                          className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                            !ak02Data?.approved_assessor 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : !assesseeQrValue
                              ? "hover:bg-orange-600"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          title={!ak02Data?.approved_assessor ? 'Wait for assessor approval first' : ''}
                        >
                          Setujui Asesi
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Approval Status Indicators */}
                  <div className="flex flex-col items-center space-y-2 text-xs">
                    <div className={`flex items-center space-x-2 ${ak02Data?.approved_assessor ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${ak02Data?.approved_assessor ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>Assessor Approved</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${ak02Data?.approved_assessee ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${ak02Data?.approved_assessee ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>Assessee Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Lanjut Button - Only show for assessor (role_id 2) */}
          {currentUser?.role_id === 2 && (
            <div className="flex justify-end mt-6 lg:mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <button
                onClick={handleSubmit}
                className="bg-[#E77D35] hover:bg-[#d66d2a] text-white text-xs sm:text-sm font-medium px-8 sm:px-12 lg:px-45 py-2 sm:py-3 rounded-md transition-colors duration-200"
              >
                Lanjut
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}