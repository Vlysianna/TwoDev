import { useState, useEffect, use } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';
import api from '@/helper/axios';
import paths from "@/routes/paths";
import { useAssessmentParams } from '@/components/AssessmentAsesorProvider';
import { QRCodeCanvas } from 'qrcode.react';
import { getAssessorUrl, getAssesseeUrl } from '@/lib/hashids';
import { Link, useLocation, useSearchParams } from 'react-router-dom';


export default function Ia01() {
  const { id_assessment, id_asesor, id_result, id_asesi } = useAssessmentParams ? useAssessmentParams() : {};
  console.log('params:', { id_assessment, id_asesor, id_result, id_asesi });
  const [selectedKPekerjaan, setSelectedKPekerjaan] = useState<string>('');
  const [groupList, setGroupList] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<'kompeten' | 'belum' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [unitData, setUnitData] = useState<any[]>([]);
  const [completedUnits, setCompletedUnits] = useState<number>(0);
  const [resultData, setResultData] = useState<any>(null);
  const [unitNumberMap, setUnitNumberMap] = useState<Record<number, number>>({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for IA-01 header fields
  const [groupField, setGroupField] = useState('');
  const [unitField, setUnitField] = useState('');
  const [elementField, setElementField] = useState('');
  const [kukField, setKukField] = useState('');
  const [assesmentDate, setAssesmentDate] = useState('');

  // Store initial values for reset
  const [initialHeader, setInitialHeader] = useState({
    group: '',
    unit: '',
    element: '',
    kuk: ''
  });


  const [assesseeQrValue, setAssesseeQrValue] = useState("");
  const [assessorQrValue, setAssessorQrValue] = useState("");
  // State untuk simpan header
  const [savingHeader, setSavingHeader] = useState(false);
  const [saveHeaderError, setSaveHeaderError] = useState<string | null>(null);
  // Cek apakah ada perubahan pada header atau rekomendasi
  const isHeaderChanged = () => {
    if (!resultData?.ia01_header) return false;
    return (
      groupField !== (resultData.ia01_header.group || "") ||
      unitField !== (resultData.ia01_header.unit || "") ||
      elementField !== (resultData.ia01_header.element || "") ||
      kukField !== (resultData.ia01_header.kuk || "") ||
      (typeof resultData.ia01_header.is_competent === 'boolean' &&
        (recommendation === 'kompeten' ? true : recommendation === 'belum' ? false : null) !== resultData.ia01_header.is_competent)
    );
  };

  // Cek field wajib: jika rekomendasi 'belum', semua field wajib diisi. Jika 'kompeten', field boleh kosong.
  const isHeaderValid = () => {
    if (recommendation === 'belum') {
      return (
        groupField.trim() !== '' &&
        unitField.trim() !== '' &&
        elementField.trim() !== '' &&
        kukField.trim() !== ''
      );
    }
    // Jika kompeten, cukup rekomendasi terisi
    return recommendation === 'belum' || recommendation === 'kompeten';
  };

  // Handler simpan header IA-01
  const handleSaveHeader = async () => {
    if (!id_result) return;
    const completion = unitData.length > 0 ? `${Math.round((completedUnits / unitData.length) * 100)}%` : '0%';
    if (completion !== '100%') {
      setSaveHeaderError("Isilah semua unit terlebih dahulu sebelum menyimpan hasil rekomendasi.");
      return;
    }

    setSavingHeader(true);
    setSaveHeaderError(null);

    try {
      // 1. Approve Asesor
      await api.put(`/assessments/ia-01/result/assessor/${id_result}/approve`);

      // 2. Simpan rekomendasi ke endpoint baru
      await api.post(`/assessments/ia-01/result/send-header`, {
        result_id: Number(id_result),
        group: groupField,
        unit: unitField,
        element: elementField,
        kuk: kukField,
        is_competent: recommendation === 'kompeten',
      });

      fetchResultData(); // refresh
    } catch (err) {
      setSaveHeaderError("Gagal menyimpan rekomendasi IA-01");
    } finally {
      setSavingHeader(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!id_asesor) return;
    const completion = unitData.length > 0 ? `${Math.round((completedUnits / unitData.length) * 100)}%` : '0%';
    if (completion !== '100%') {
      setSaveHeaderError("Simpan hasil rekomendasi terlebih dahulu sebelum menyetujui sebagai asesor.");
      return;
    }

    try {
      const response = await api.put(`/assessments/ia-01/result/assessor/${id_result}/approve`);
      if (response.data.success) {
        const qrValue = getAssessorUrl(Number(id_asesor));
        console.log('Generated QR Asesor:', qrValue); // Debug
        setAssessorQrValue(qrValue);
      }
    } catch (error) {
      console.error("Error approving assessor:", error);
      setSaveHeaderError("Gagal menyetujui sebagai asesor");
    }
  };

  useEffect(() => {
    if (id_assessment) fetchAssessment();
    if (id_result) fetchUnitData();
  }, [id_assessment, id_result]);

  useEffect(() => {
    if (unitData && unitData.length > 0) {
      const completed = unitData.filter((unit: any) => unit.finished);
      setCompletedUnits(completed.length);
    }
  }, [unitData]);

  const fetchAssessment = async () => {
    if (!id_assessment) return;
    try {
      setLoading(true);
      const response = await api.get(`/assessments/${id_assessment}`);
      console.log('fetchAssessment response:', response.data);
      if (response.data.success) {
        setAssessment(response.data.data);
      }
    } catch (error: any) {
      setError('Gagal memuat data asesmen');
      console.error('fetchAssessment error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUnitData = async () => {
    if (!id_result) return;
    try {
      const response = await api.get(`/assessments/ia-01/units/${id_result}`);
      console.log('fetchUnitData response:', response.data);

      if (response.data.success) {
        // Ambil daftar group name
        const groupNames = response.data.data.map((group: any) => group.name);
        setGroupList(groupNames);

        // Auto-select first group if available
        if (groupNames.length > 0) {
          setSelectedKPekerjaan(groupNames[0]);
        }

        // Flatten data dari group ke unit
        const flattenedUnits = response.data.data.flatMap((group: any) =>
          group.units.map((unit: any) => ({
            id: unit.id,
            title: unit.title,
            unit_code: unit.unit_code,
            finished: unit.finished,
            status: unit.status,
            progress: unit.progress,
            group_name: group.name,
            kPekerjaan: group.name,
          }))
        );

        setUnitData(flattenedUnits);

        // Buat mapping id unit ke nomor urut global
        const numberMap: Record<number, number> = {};
        flattenedUnits.forEach((unit: any, index: number) => {
          numberMap[unit.id] = index + 1;
        });
        setUnitNumberMap(numberMap);
      }
    } catch (error: any) {
      setError('Gagal memuat unit kompetensi');
      console.error('fetchUnitData error:', error);
    }
  };

  // fetchUnitData();

  // Dalam useEffect yang fetch resultData
  const fetchResultData = async () => {
    if (!id_result) return;
    try {
      const response = await api.get(`/assessments/ia-01/result/${id_result}`);
      console.log('fetchResultData response:', response.data);

      if (response.data.success) {
        setResultData(response.data.data);

        // Generate QR value untuk asesi jika sudah approved
        if (response.data.data.ia01_header?.approved_assessee && id_asesi) {
          setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
        }

        if (response.data.data.ia01_header?.approved_assessor) {
          setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
        }
      }
    } catch (error) {
      console.error("fetchResultData error:", error);
    }
  };


  useEffect(() => {
    fetchResultData();
  }, [id_result]);

  useEffect(() => {
    if (resultData?.ia01_header) {
      setGroupField(resultData.ia01_header.group || '');
      setUnitField(resultData.ia01_header.unit || '');
      setElementField(resultData.ia01_header.element || '');
      setKukField(resultData.ia01_header.kuk || '');
      setAssesmentDate(resultData.ia01_header.updated_at || '');
      setInitialHeader({
        group: resultData.ia01_header.group || '',
        unit: resultData.ia01_header.unit || '',
        element: resultData.ia01_header.element || '',
        kuk: resultData.ia01_header.kuk || ''
      });

      // Sync recommendation state dengan data dari API
      if (typeof resultData.ia01_header.is_competent === 'boolean') {
        setRecommendation(resultData.ia01_header.is_competent ? 'kompeten' : 'belum');
      } else {
        setRecommendation(null); // Reset jika tidak ada data
      }
    }
  }, [resultData]);

  useEffect(() => {
    if (recommendation === 'kompeten') {
      // Isi dengan "-" ketika memilih kompeten
      setGroupField('-');
      setUnitField('-');
      setElementField('-');
      setKukField('-');
    } else if (recommendation === 'belum') {
      // Kembalikan ke nilai awal dari API ketika memilih belum kompeten
      setGroupField(initialHeader.group);
      setUnitField(initialHeader.unit);
      setElementField(initialHeader.element);
      setKukField(initialHeader.kuk);
    }
  }, [recommendation, initialHeader]);

  const handleRecommendationChange = (value: 'kompeten' | 'belum') => {
    setRecommendation(value);

    if (value === 'kompeten') {
      // Langsung isi dengan "-" ketika memilih kompeten
      setGroupField('-');
      setUnitField('-');
      setElementField('-');
      setKukField('-');
    } else {
      // Kembalikan ke nilai awal ketika memilih belum kompeten
      setGroupField(initialHeader.group);
      setUnitField(initialHeader.unit);
      setElementField(initialHeader.element);
      setKukField(initialHeader.kuk);
    }
  };

  // misalnya assesmentDate = "2025-10-24"
  const formattedDate = assesmentDate
    ? new Date(assesmentDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  // Filter data berdasarkan K-Pekerjaan yang dipilih
  const getFilteredData = () => {
    return unitData.filter(unit => unit.group_name === selectedKPekerjaan);
  };
  const filteredData = getFilteredData();

  // Simpan group aktif ke localStorage saat berubah
  useEffect(() => {
    if (selectedKPekerjaan) {
      localStorage.setItem('activeGroup', selectedKPekerjaan);
    }
  }, [selectedKPekerjaan]);


  useEffect(() => {
    const groupFromUrl = searchParams.get('group');

    // Prioritaskan group dari URL jika valid
    if (groupFromUrl && groupList.includes(groupFromUrl)) {
      setSelectedKPekerjaan(groupFromUrl);
    }
    // Jika tidak ada di URL, gunakan group pertama yang tersedia
    else if (groupList.length > 0) {
      setSelectedKPekerjaan(groupList[0]);
    }
  }, [groupList, searchParams]);


  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAsesor
        title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR-IA-01"
        icon={
          <Link to={paths.asesor.assessment.dashboardAsesmenMandiri(id_assessment!)} className="text-gray-500 hover:text-gray-600">
            <ChevronLeft size={20} />
          </Link>
        }
      />
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-medium whitespace-nowrap">Skema Sertifikasi (Okupasi)</h2>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <polyline points="12,6 12,12 16,14" strokeWidth="2"></polyline>
              </svg>
              <span className="text-sm text-gray-600">
                <span className="capitalize">
                  {resultData?.tuk || '-'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-sm text-gray-600">{assessment?.occupation?.name || 'Pemrogram Junior ( Junior Coder )'}</span>
            <div className="bg-[#E77D3533] text-[#E77D35] px-3 py-1 rounded text-sm font-medium w-fit">
              {assessment?.code || 'SMK RPL PJ/SPSMK24/2023'}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-gray-500">
              <span className="font-bold">Asesi:</span> {resultData?.assessee?.name || '-'}
            </span>
            <span className="text-sm text-gray-500">
              <span className="font-bold">Asesor:</span> {resultData?.assessor?.name || '-'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {assessment?.date || '24 Oktober 2025 | 07:00 - 15:00'}
          </span>
        </div>
      </div>
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {groupList.map((tab, idx) => (
              <button
                key={tab} // Key yang unik
                onClick={() => setSelectedKPekerjaan(tab)}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedKPekerjaan === tab
                  ? 'bg-[#E77D35] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center justify-between w-full min-w-[220px]">
              <span className="text-sm text-gray-600">Completion</span>
              <span className="text-sm font-medium text-gray-900">{unitData.length > 0 ? `${Math.round((completedUnits / unitData.length) * 100)}%` : '0%'}</span>
            </div>
            <div className="w-full">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#E77D35] h-2 rounded-full" style={{ width: unitData.length > 0 ? `${(completedUnits / unitData.length) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredData.map((unit: any, index: number) => (
            <div key={unit.id} className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#E77D35]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#E77D35]">
                    Unit kompetensi {unitNumberMap[unit.id] || 'N/A'}
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">{unit.title}</h3>
              <p className="text-xs text-gray-500 mb-1">{unit.unit_code}</p>
              <p className="text-xs text-gray-400 italic">{unit.group_name}</p>

              <div className="flex items-center justify-between mt-3">
                {unit.finished ? (
                  <span className="bg-[#E77D3533] text-[#E77D35] px-2 py-1 rounded text-xs font-medium">Finished</span>
                ) : (
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">In Progress</span>
                )}
                <Link
                  to={paths.asesor.assessment.ia01Detail(
                    id_assessment ?? '-',
                    id_result ?? '-',
                    id_asesi ?? '-',
                    unit.id
                  ) + `?group=${encodeURIComponent(selectedKPekerjaan)}`}
                  className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
                >
                  Lihat detail
                  <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white mx-4 lg:mx-6 mt-4 lg:mt-6 mb-6 rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr] gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-1 h-full flex flex-col">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
            <div className="space-y-3 mb-6">
              {!resultData ? (
                <div className="text-gray-500">Memuat rekomendasi...</div>
              ) : (
                <>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recommendation"
                      checked={recommendation === 'kompeten'}
                      onChange={() => handleRecommendationChange('kompeten')}
                      className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                    />
                    <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${recommendation === 'belum' ? 'line-through opacity-50' : ''
                      }`}>
                      Asesi telah memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>KOMPETEN</strong>
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recommendation"
                      checked={recommendation === 'belum'}
                      onChange={() => handleRecommendationChange('belum')}
                      className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
                    />
                    <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${recommendation === 'kompeten' ? 'line-through opacity-50' : ''
                      }`}>
                      Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>BELUM KOMPETEN</strong>
                    </span>
                  </label>
                </>
              )}
            </div>
            <div className='mb-2'>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pada :</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelompok Pekerjaan</label>
                <input
                  type="text"
                  value={groupField}
                  onChange={e => setGroupField(e.target.value)}
                  disabled={recommendation === 'kompeten'}
                  className={`w-full rounded-lg px-3 py-2 text-sm transition-all
        ${recommendation === 'kompeten'
                      ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
      `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  value={unitField}
                  onChange={e => setUnitField(e.target.value)}
                  disabled={recommendation === 'kompeten'}
                  className={`w-full rounded-lg px-3 py-2 text-sm transition-all
        ${recommendation === 'kompeten'
                      ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
      `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Elemen</label>
                <input
                  type="text"
                  value={elementField}
                  onChange={e => setElementField(e.target.value)}
                  disabled={recommendation === 'kompeten'}
                  className={`w-full rounded-lg px-3 py-2 text-sm transition-all
        ${recommendation === 'kompeten'
                      ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
      `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KUK</label>
                <input
                  type="text"
                  value={kukField}
                  onChange={e => setKukField(e.target.value)}
                  disabled={recommendation === 'kompeten'}
                  className={`w-full rounded-lg px-3 py-2 text-sm transition-all
        ${recommendation === 'kompeten'
                      ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35]'}
      `}
                />
              </div>
            </div>
            <div className="flex-grow"></div>
          </div>
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
              <div className="mb-3">
                <input
                  type="text"
                  value={resultData?.assessee?.name || '-'}
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
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                </svg>
              </div>
            </div>
            <div className="mb-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
              <div className="mb-3">
                <input
                  type="text"
                  value={resultData?.assessor?.name || '-'}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  readOnly
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={resultData?.assessor?.no_reg_met || '-'}
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
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                </svg>
              </div>
            </div>
            <div className="flex-grow"></div>
          </div>
          <div className="px-2 h-full flex flex-col">
            <div className="grid grid-cols-1 gap-4">
              {/* QR Asesi */}
              <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                {resultData?.ia01_header?.approved_assessee && assesseeQrValue ? (
                  <QRCodeCanvas
                    value={assesseeQrValue}
                    size={100}
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm text-center">
                      {resultData?.ia01_header?.approved_assessee
                        ? 'QR Asesi sudah disetujui'
                        : 'Menunggu persetujuan asesi'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800">
                  {resultData?.assessee?.name || '-'}
                </span>
                {resultData?.ia01_header?.approved_assessee && (
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
                  {resultData?.assessor?.name || '-'}
                </span>
                {/* Tombol Setujui hanya muncul jika belum approved */}
                {resultData?.ia01_header?.approved_assessor !== true && (
                  <button
                    disabled={assessorQrValue !== ""}
                    onClick={handleGenerateQRCode}
                    className={`block text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${!assessorQrValue
                      ? "hover:bg-orange-600 cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                      }`}
                  >
                    {assessorQrValue ? "QR Telah Digenerate" : "Setujui"}
                  </button>
                )}
                {/* Status jika sudah approved */}
                {resultData?.ia01_header?.approved_assessor === true && (
                  <span className="text-green-600 font-semibold text-sm mt-2">
                    Sebagai Asesor, Anda sudah setuju
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4">
          {saveHeaderError && (
            <span className="text-red-500 text-sm sm:mr-4 text-center sm:text-left">
              {saveHeaderError}
            </span>
          )}

          {(unitData.length > 0 ? `${Math.round((completedUnits / unitData.length) * 100)}%` : '0%') !== '100%' && (
            <span className="text-orange-600 text-sm font-medium sm:mr-4 text-center sm:text-left">
              Isilah semua unit terlebih dahulu sebelum menyimpan hasil rekomendasi.
            </span>
          )}

          {resultData?.ia01_header?.approved_assessee && (
            <span className="text-green-600 text-sm font-medium sm:mr-4 text-center sm:text-left">
              Asesi telah menyetujui rekomendasi
            </span>
          )}

          <button
            className={`
      bg-[#E77D35] text-white 
      w-full sm:w-auto
      px-6 sm:px-12 lg:px-40 
      py-3 rounded-lg font-medium 
      transition-all duration-200 shadow-sm 
      hover:shadow-md
      ${(!isHeaderChanged() || !isHeaderValid() || savingHeader || !assessorQrValue)
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-[#E77D35]/90 cursor-pointer'
              }`}
            onClick={handleSaveHeader}
            disabled={!isHeaderChanged() || !isHeaderValid() || savingHeader || !assessorQrValue}
          >
            {savingHeader ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}