import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, House, Monitor } from 'lucide-react';
import NavbarAsesor from '@/components/NavAsesor';
import api from '@/helper/axios';
import { useAssessmentParams } from '@/components/AssessmentAsesiProvider';
import { QRCodeCanvas } from 'qrcode.react';
import { getAssesseeUrl, getAssessorUrl } from '@/lib/hashids';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import paths from "@/routes/paths";
import NavbarAsesi from '@/components/NavbarAsesi';
import ConfirmModal from '@/components/ConfirmModal';

export default function Ia01Asesi() {
    const { id_assessment, id_asesor, id_result, id_asesi, mutateNavigation } = useAssessmentParams();
    const [selectedKPekerjaan, setSelectedKPekerjaan] = useState('');
    const [groupList, setGroupList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [assessment, setAssessment] = useState<any>(null);
    const [unitData, setUnitData] = useState<any[]>([]);
    const [completedUnits, setCompletedUnits] = useState<number>(0);
    const [valueQr, setValueQr] = useState('');
    const [resultData, setResultData] = useState<any>(null);
    const [generating, setGenerating] = useState(false);
    const [unitNumberMap, setUnitNumberMap] = useState<Record<number, number>>({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleGenerateQRCode = async () => {
        if (!id_result) return;

        setGenerating(true);
        try {
            const response = await api.put(
                `/assessments/ia-01/result/assessee/${id_result}/approve`
            );

            console.log("Response approve:", response.data);
            setValueQr(getAssesseeUrl(Number(id_asesi)));
            fetchResultData();
            mutateNavigation();
        } catch (e) {
            console.error("Gagal generate QR:", e);
            setError('Gagal generate QR Code');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (id_assessment) fetchAssessment();
        if (id_result) fetchUnitData();
        fetchResultData();
    }, [id_assessment, id_result]);

    useEffect(() => {
        if (unitData && unitData.length > 0) {
            console.log(unitData)
            const completed = unitData.filter((unit: any) => unit.finished);
            setCompletedUnits(completed.length);
        }
    }, [unitData]);

    const fetchAssessment = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/assessments/${id_assessment}`);
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
        try {
            const response = await api.get(`/assessments/ia-01/units/${id_result}`);
            console.log('fetchUnitData response asesi:', response.data);

            if (response.data.success) {
                const groupNames = response.data.data.map((group: any) => group.name);
                setGroupList(groupNames);

                // Set selected group from URL or first group
                const groupFromUrl = searchParams.get('group');
                if (groupFromUrl && groupNames.includes(groupFromUrl)) {
                    setSelectedKPekerjaan(groupFromUrl);
                } else if (groupNames.length > 0) {
                    setSelectedKPekerjaan(groupNames[0]);
                }

                const flattenedUnits = response.data.data.flatMap((group: any) =>
                    group.units.map((unit: any) => ({
                        id: unit.id,
                        title: unit.title,
                        unit_code: unit.unit_code,
                        finished: unit.finished,
                        status: unit.status,
                        progress: unit.progress,
                        group_name: group.name,
                    }))
                );
                console.log(flattenedUnits);

                setUnitData(flattenedUnits);

                // Create unit number mapping
                const numberMap: Record<number, number> = {};
                flattenedUnits.forEach((unit: any, index: number) => {
                    numberMap[unit.id] = index + 1;
                });
                setUnitNumberMap(numberMap);
            }
        } catch (error: any) {
            setError('Gagal memuat unit kompetensi');
            console.error('fetchUnitData error asesi:', error);
        }
    };

    const fetchResultData = async () => {
        if (!id_result) return;
        try {
            const response = await api.get(`/assessments/ia-01/result/${id_result}`);
            console.log('fetchResultData response asesi:', response.data);

            if (response.data.success) {
                setResultData(response.data.data);
                if (response.data.data.ia01_header?.approved_assessee && id_asesi) {
                    setValueQr(getAssesseeUrl(Number(id_asesi)));
                }
            }
        } catch (error) {
            console.error("fetchResultData error asesi:", error);
        }
    };

    // Update URL when selected group changes
    useEffect(() => {
        if (selectedKPekerjaan) {
            searchParams.set('group', selectedKPekerjaan);
            setSearchParams(searchParams);
        }
    }, [selectedKPekerjaan, searchParams, setSearchParams]);

    const getFilteredData = () => {
        return unitData.filter(unit => unit.group_name === selectedKPekerjaan);
    };

    const filteredData = getFilteredData();

    const assesmentDate = resultData?.ia01_header?.updated_at || assessment?.date || '';
    const formattedDate = assesmentDate
        ? new Date(assesmentDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "";

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <NavbarAsesi
                        title="Ceklis Observasi Aktivitas di Tempat Kerja atau di Tempat Kerja Simulasi - FR-IA-01"
                        icon={
                            <Link to={paths.asesi.dashboard} onClick={(e) => {
                                e.preventDefault(); // cegah auto navigasi
                                setIsConfirmOpen(true);
                            }}
                                className="text-gray-500 hover:text-gray-600"
                            >
                                <House size={20} />
                            </Link>
                        }
                    />
                    <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => {
                            setIsConfirmOpen(false);
                            navigate(paths.asesi.dashboard); // manual navigate setelah confirm
                        }}
                        title="Konfirmasi"
                        message="Apakah Anda yakin ingin kembali ke Dashboard?"
                        confirmText="Ya, kembali"
                        cancelText="Batal"
                        type="warning"
                    />
                </div>

                <main className='m-4'>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <h2 className="text-lg font-medium whitespace-nowrap">Skema Sertifikasi (Okupasi)</h2>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Sewaktu</span>
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
                                    <span className="font-bold">Asesi:</span> {resultData?.assessee?.name || assessment?.assessee?.name || '-'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    <span className="font-bold">Asesor:</span> {resultData?.assessor?.name || assessment?.assessor?.name || '-'}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                {formattedDate || '24 Oktober 2025 | 07:00 - 15:00'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                            <div className="flex flex-wrap gap-2">
                                {groupList.map((tab, idx) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedKPekerjaan(tab)}
                                        className={`px-3 lg:px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedKPekerjaan === tab
                                            ? 'bg-[#E77D35] text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                            }`}
                                        {...(selectedKPekerjaan === '' && idx === 0 ? { autoFocus: true } : {})}
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
                            {filteredData.length === 0 ? (
                                <div className="col-span-full text-center text-gray-400 py-8">
                                    {unitData.length === 0 ? 'Memuat data...' : 'Belum ada unit yang dikerjakan.'}
                                </div>
                            ) : (
                                filteredData.map((unit: any, index: number) => (
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
                                                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">Belum Selesai</span>
                                            )}
                                            <Link
                                                to={paths.asesi.assessment.ia01AsesiDetail(
                                                    id_assessment ?? '-',
                                                    id_result ?? '-',
                                                    id_asesor ?? '-',
                                                    unit.id
                                                ) + `?group=${encodeURIComponent(selectedKPekerjaan)}`}
                                                className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
                                            >
                                                Lihat detail
                                                <ChevronRight size={14} className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr] gap-6 lg:gap-8 items-start">
                            <div className="lg:col-span-1 h-full flex flex-col">
                                <h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
                                <div className="space-y-3 mb-6">
                                    <label className="flex items-start space-x-3 cursor-not-allowed">
                                        <input
                                            type="radio"
                                            name="recommendation"
                                            checked={resultData?.ia01_header?.is_competent === true}
                                            onChange={() => { }}
                                            disabled
                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] cursor-not-allowed"
                                        />
                                        <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${resultData?.ia01_header?.is_competent === false ? 'line-through opacity-50' : ''
                                            }`}>
                                            Asesi telah memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>KOMPETEN</strong>
                                        </span>
                                    </label>
                                    <label className="flex items-start space-x-3 cursor-not-allowed">
                                        <input
                                            type="radio"
                                            name="recommendation"
                                            checked={resultData?.ia01_header?.is_competent === false}
                                            onChange={() => { }}
                                            disabled
                                            className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] cursor-not-allowed"
                                        />
                                        <span className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${resultData?.ia01_header?.is_competent === true ? 'line-through opacity-50' : ''
                                            }`}>
                                            Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan <strong>BELUM KOMPETEN</strong>
                                        </span>
                                    </label>

                                    {/* Tambahan untuk kasus belum ada rekomendasi */}
                                    {resultData?.ia01_header?.is_competent === null && (
                                        <div className="text-gray-500 italic">
                                            Asesor belum memberikan rekomendasi
                                        </div>
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
                                            value={resultData?.ia01_header?.group || ''}
                                            disabled
                                            className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                                        <input
                                            type="text"
                                            value={resultData?.ia01_header?.unit || ''}
                                            disabled
                                            className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Elemen</label>
                                        <input
                                            type="text"
                                            value={resultData?.ia01_header?.element || ''}
                                            disabled
                                            className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">KUK</label>
                                        <input
                                            type="text"
                                            value={resultData?.ia01_header?.kuk || ''}
                                            disabled
                                            className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
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
                                            value={resultData?.assessee?.name || assessment?.assessee?.name || '-'}
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formattedDate}
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                                            readOnly
                                            disabled
                                        />
                                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="mb-auto">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            value={resultData?.assessor?.name || assessment?.assessor?.name || '-'}
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            value={resultData?.assessor?.no_reg_met || assessment?.assessor?.no_reg_met || '-'}
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formattedDate}
                                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
                                            readOnly
                                            disabled
                                        />
                                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="flex-grow"></div>
                            </div>
                            <div className="px-2 h-full flex flex-col">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* QR Asesor */}
                                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                                        {resultData?.ia01_header?.approved_assessor ? (
                                            <QRCodeCanvas
                                                value={getAssessorUrl(Number(id_asesor))}
                                                size={100}
                                                className="w-40 h-40 object-contain"
                                            />
                                        ) : (
                                            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm text-center">
                                                    {id_asesor
                                                        ? 'Menunggu persetujuan asesor'
                                                        : 'QR Asesor belum tersedia'
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-gray-800">
                                            {resultData?.assessor?.name || assessment?.assessor?.name || "-"}
                                        </span>
                                        {resultData?.ia01_header?.approved_assessor && (
                                            <span className="text-green-600 font-semibold text-sm mt-2">
                                                Sudah disetujui asesor
                                            </span>
                                        )}
                                    </div>
                                    {/* QR Asesi */}
                                    <div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
                                        {resultData?.ia01_header?.approved_assessee || valueQr ? (
                                            <QRCodeCanvas
                                                value={getAssesseeUrl(Number(id_asesi))}
                                                size={100}
                                                className="w-40 h-40 object-contain"
                                            />
                                        ) : (
                                            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">QR Code akan muncul di sini</span>
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-gray-800">
                                            {resultData?.assessee?.name || assessment?.assessee?.name || '-'}
                                        </span>
                                        {resultData?.ia01_header?.approved_assessee && (
                                            <span className="text-green-600 font-semibold text-sm mt-2">
                                                Sebagai Asesi, Anda sudah setuju
                                            </span>
                                        )}
                                    </div>

                                    {/* Tombol Generate QR */}
                                    <button
                                        onClick={handleGenerateQRCode}
                                        disabled={!id_asesi || !!valueQr || resultData?.ia01_header?.approved_assessee || !resultData?.ia01_header?.approved_assessor}
                                        className={`w-full text-center bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 ${!id_asesi || valueQr || resultData?.ia01_header?.approved_assessee || !resultData?.ia01_header?.approved_assessor
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:bg-orange-600 cursor-pointer"
                                            }`}
                                    >
                                        {generating
                                            ? "Menggenerate..."
                                            : valueQr || resultData?.ia01_header?.approved_assessee
                                                ? "QR Code Telah Digenerate"
                                                : "Generate QR Code Saya"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}