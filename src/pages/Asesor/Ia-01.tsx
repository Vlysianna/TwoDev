import { useState, useEffect, use } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, Monitor, QrCode, Save } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';
import api from '@/helper/axios';
import paths from "@/routes/paths";
import { useAssessmentParams } from '@/components/AssessmentAsesorProvider';
import { QRCodeCanvas } from 'qrcode.react';
import { getAssessorUrl, getAssesseeUrl } from '@/lib/hashids';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import ConfirmModal from '@/components/ConfirmModal';


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
  // Tambahkan state untuk proses dan status
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [qrProcessing, setQrProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingValue, setPendingValue] = useState<string>('');
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
      setProcessError("Isilah semua unit terlebih dahulu sebelum menyimpan hasil rekomendasi.");
      return;
    }

    setSaveProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);

    try {
      // HANYA simpan rekomendasi, TANPA approve asesor
      await api.post(`/assessments/ia-01/result/send-header`, {
        result_id: Number(id_result),
        group: groupField,
        unit: unitField,
        element: elementField,
        kuk: kukField,
        is_competent: recommendation === 'kompeten',
      });

      setIsSaved(true);
      setProcessSuccess("Rekomendasi berhasil disimpan");
      fetchResultData();
      setTimeout(() => setProcessSuccess(null), 3000);
    } catch (err) {
      setProcessError("Gagal menyimpan rekomendasi IA-01");
      setIsSaved(false);
    } finally {
      setSaveProcessing(false);
    }
  };

  // Handler generate QR code (sekaligus approve asesor)
  const handleGenerateQRCode = async () => {
    if (!id_asesor || !isSaved) return;
    setQrProcessing(true);
    setProcessError(null);
    setProcessSuccess(null);

    try {
      // Pindahkan panggilan approve asesor ke sini
      const response = await api.put(`/assessments/ia-01/result/assessor/${id_result}/approve`);
      if (response.data.success) {
        const qrValue = getAssessorUrl(Number(id_asesor));
        setAssessorQrValue(qrValue);
        setProcessSuccess("QR Code berhasil digenerate");
        fetchResultData();
        setTimeout(() => setProcessSuccess(null), 3000);
      }
    } catch (error) {
      setProcessError("Gagal menyetujui sebagai asesor");
    } finally {
      setQrProcessing(false);
    }
  };

  const handleSaveHeaderClick = () => {
    setPendingValue(recommendation === 'kompeten' ? 'Kompeten' : 'Belum Kompeten');
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    await handleSaveHeader();
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesor title='Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR-IA-01' icon={<Link
            to={paths.asesor.assessment.dashboardAsesmenMandiri(id_assessment!)}
            className="text-gray-500 hover:text-gray-600">
            <ChevronLeft size={20} />
          </Link>
          }
          />
        </div>

        <main className='m-4'>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-lg font-medium whitespace-nowrap">Skema Sertifikasi (Okupasi)</h2>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
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
          <div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                {groupList.map((tab, idx) => (
                  <button
                    key={tab} // Key yang unik
                    onClick={() => setSelectedKPekerjaan(tab)}
                    className={`px-3 lg:px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedKPekerjaan === tab
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
                  <span className="text-sm text-gray-600">Penyelesaian</span>
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
                        <Monitor size={16} className="text-[#E77D35]" />
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
                      <span className="bg-[#E77D3533] text-[#E77D35] px-2 py-1 rounded text-xs font-medium">Selesai</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">Belum selesai</span>
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
          <div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
            {/* Bagian Rekomendasi - Full Width */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
              <div className="space-y-3">
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
                        disabled={!!assessorQrValue} // Tambahkan ini
                      />
                      <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
    ${recommendation === 'belum' ? 'line-through opacity-50' : ''}`}>
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
                        disabled={!!assessorQrValue} // Tambahkan ini
                      />
                      <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
                ${recommendation === 'kompeten' ? 'line-through opacity-50' : ''}`}>
                        Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong
                          className='text-red-600'>BELUM KOMPETEN</strong>
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Dua Kolom: Asesi/Asesor dan QR Code */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start">
              {/* Kolom Kiri - Asesi dan Asesor */}
              <div className="h-full flex flex-col">
                <div className='mb-2'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pada :</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

                {/* Bagian Asesi dan Asesor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Asesi */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        value={resultData?.assessee?.name || '-'}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="relative mb-4">
                      <input
                        type="text"
                        value={formattedDate}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                        readOnly
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Asesor */}
                  <div>
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
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan - QR Code */}
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            ? "QR Asesi sudah disetujui"
                            : "Menunggu persetujuan asesi"}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800">
                      {resultData?.assessee?.name || "-"}
                    </span>
                    {resultData?.ia01_header?.approved_assessee && (
                      <span className="text-green-600 text-center font-semibold text-sm mt-2">
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
                      {resultData?.assessor?.name || "-"}
                    </span>
                    {resultData?.ia01_header?.approved_assessor === true && (
                      <span className="text-green-600 font-semibold text-center text-sm mt-2">
                        Sebagai Asesor, Anda sudah setuju
                      </span>
                    )}
                  </div>

                  {/* Section bawah tombol (full width, col-span-2) */}
                  <div className="col-span-1 sm:col-span-2 mt-8 flex flex-col items-center gap-4">
                    {saveHeaderError && (
                      <span className="text-red-500 text-sm text-center">{saveHeaderError}</span>
                    )}

                    {(unitData.length > 0
                      ? `${Math.round((completedUnits / unitData.length) * 100)}%`
                      : "0%") !== "100%" && (
                        <span className="text-orange-600 text-sm font-medium text-center">
                          Isilah semua unit terlebih dahulu sebelum menyimpan hasil rekomendasi.
                        </span>
                      )}

                    {resultData?.ia01_header?.approved_assessee && (
                      <span className="text-green-600 text-sm font-medium text-center">
                        Asesi telah menyetujui rekomendasi
                      </span>
                    )}

                    {/* Tombol Simpan Rekomendasi */}
                    <div className="w-full flex flex-col gap-4">
                      <div>
                        <div className="text-gray-500 text-xs mb-2 text-center">
                          {!recommendation
                            ? "Pilih rekomendasi terlebih dahulu"
                            : assessorQrValue
                              ? "Setelah generate QR, rekomendasi tidak dapat diubah"
                              : "Simpan rekomendasi sebelum generate QR"}
                        </div>
                        <button
                          onClick={handleSaveHeaderClick}
                          disabled={saveProcessing || !recommendation || assessorQrValue || !isHeaderChanged()}
                          className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${saveProcessing || !recommendation || assessorQrValue || !isHeaderChanged()
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-green-700 cursor-pointer"
                            }`}
                        >
                          <Save size={18} className="mr-2" />
                          {saveProcessing
                            ? "Menyimpan..."
                            : "Simpan Rekomendasi"}
                        </button>
                        {processError && (
                          <div className="text-red-500 text-xs mt-2 text-center">
                            {processError}
                          </div>
                        )}
                        {processSuccess && (
                          <div className="text-green-500 text-xs mt-2 text-center">
                            ✅ {processSuccess}
                          </div>
                        )}
                      </div>

                      {/* Generate QR */}
                      <div>
                        <button
                          onClick={handleGenerateQRCode}
                          disabled={qrProcessing || assessorQrValue || !isSaved}
                          className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${qrProcessing || assessorQrValue || !isSaved
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-orange-600 cursor-pointer"
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
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan"
        message={
          <>
            Anda akan menyimpan pilihan berikut:{" "}
            <br /><strong>{pendingValue}</strong>
          </>
        }
        confirmText="Simpan"
        cancelText="Batal"
        type="warning"
      />
    </div>
  );
}