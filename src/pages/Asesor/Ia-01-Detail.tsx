import React, { useState, useEffect, useRef } from 'react';
import { Monitor, ChevronLeft, Search } from 'lucide-react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import NavbarAsesor from '@/components/NavAsesor';
import paths from "@/routes/paths";
import api from '@/helper/axios';
import { useAssessmentParams } from '@/components/AssessmentAsesorProvider';

interface ElementDetail {
  id: number;
  description: string;
  benchmark: string;
  result: any;
}
interface ElementIA01 {
  id: number;
  uc_id: number;
  title: string;
  details: ElementDetail[];
}

const PenilaianLanjut: React.FC<{ initialValue?: string; onChange: (value: string) => void }> = ({
  initialValue = '',
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      onChange(value);
    }
  };

  return (
    <div className="p-2">
      {isEditing ? (
        <textarea
          className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p
          className="text-gray-700 cursor-pointer min-h-[24px]"
          onClick={() => setIsEditing(true)}
        >
          {value || 'Klik untuk menambahkan penilaian...'}
        </p>
      )}
    </div>
  );
};

export default function Ia01Detail() {
  const { id_unit } = useParams();
  const { id_assessment, id_result, id_asesi } = useAssessmentParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeGroup = searchParams.get('group') || '';
  const unitNumber = location.state?.unitNumber || 'N/A';
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [elements, setElements] = useState<ElementIA01[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKompeten, setFilterKompeten] = useState<'all' | 'kompeten' | 'belum'>('all');
  const [pencapaian, setPencapaian] = useState<Record<number, string>>({});
  const [penilaianLanjut, setPenilaianLanjut] = useState<Record<number, string>>({});
  const finishedRef = useRef(false);
  const [unassessedCriteria, setUnassessedCriteria] = useState<number[]>([]);
  const [unitNumberMap, setUnitNumberMap] = useState<Record<number, number>>({});

  // Handle Save button
  const handleSave = async () => {
    // Validasi apakah semua kriteria sudah dinilai
    const unassessed = getUnassessedCriteria();
    if (unassessed.length > 0) {
      setUnassessedCriteria(unassessed);
      setSaveError('Harap isi penilaian untuk semua kriteria kerja');
      return;
    }

    if (!id_result) return;
    setSaving(true);
    setSaveError(null);

    try {
      // Pastikan semua penilaian lanjut memiliki nilai, gunakan "-" jika kosong
      const processedPenilaianLanjut = { ...penilaianLanjut };

      // Iterasi melalui semua elemen dan detail untuk memastikan semua memiliki nilai
      elements.forEach(el => {
        el.details.forEach(det => {
          if (!processedPenilaianLanjut[det.id] || processedPenilaianLanjut[det.id].trim() === '') {
            processedPenilaianLanjut[det.id] = '-';
          }
        });
      });

      // Payload per detail (kriteria kerja)
      const payload = {
        result_id: Number(id_result),
        elements: elements.flatMap(el =>
          el.details.map(det => ({
            element_detail_id: det.id,
            is_competent: pencapaian[det.id] === 'kompeten',
            evaluation: processedPenilaianLanjut[det.id] // Gunakan nilai yang sudah diproses
          }))
        )
      };

      // Kirim data ke API
      await api.post('/assessments/ia-01/result/send', payload);

      // Construct navigation path with activeGroup
      const basePath = paths.asesor.assessment.ia01(
        id_assessment ?? '-',
        id_asesi ?? '-'
      );

      const navigationPath = activeGroup
        ? `${basePath}?group=${encodeURIComponent(activeGroup)}`
        : basePath;

      console.log('Navigating to:', navigationPath); // Debug log

      // Force navigation with replace to ensure it works
      navigate(navigationPath, { replace: true });

    } catch (e: any) {
      setSaveError('Gagal menyimpan data: ' + e.message);
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id_result && id_unit) fetchElements();
    // eslint-disable-next-line
  }, [id_result, id_unit]);

  const fetchElements = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/assessments/ia-01/units/${id_result}/elements/${id_unit}`
      );
      if (response.data.success) {
        setElements(response.data.data);
        // Auto-populate pencapaian dan penilaianLanjut dari data result (per detail)
        const pencapaianInit: Record<number, string> = {};
        const penilaianLanjutInit: Record<number, string> = {};
        response.data.data.forEach((el: any) => {
          if (el.details && el.details.length > 0) {
            el.details.forEach((det: any) => {
              if (det.result) {
                pencapaianInit[det.id] = det.result.is_competent ? 'kompeten' : 'belum';
                penilaianLanjutInit[det.id] = det.result.evaluation || '';
              }
            });
          }
        });
        setPencapaian(pencapaianInit);
        setPenilaianLanjut(penilaianLanjutInit);
      }
    } finally {
      setLoading(false);
    }
  };

  // id = detail.id
  const handlePencapaianChange = (id: number, value: string) => {
    setPencapaian(prev => {
      const updated = { ...prev, [id]: value };
      checkAndFinishUnit(updated);

      // Hapus kriteria dari daftar unassessed jika sudah dinilai
      if (unassessedCriteria.includes(id)) {
        setUnassessedCriteria(prev => prev.filter(item => item !== id));
      }

      return updated;
    });
  };

  // Cek jika semua elemen sudah diisi (kompeten/belum), lalu update status unit ke finished
  const checkAndFinishUnit = async (updatedPencapaian: Record<number, string>) => {
    if (!elements.length || finishedRef.current) return;
    // Ambil semua id detail dari unit ini
    const allDetailIds: number[] = elements.flatMap(el => el.details.map(det => det.id));
    const allChecked = allDetailIds.every(id => updatedPencapaian[id] === 'kompeten' || updatedPencapaian[id] === 'belum');
    if (allChecked) {
      finishedRef.current = true;
      try {
        await api.put(`/assessments/ia-01/units/${id_result}/unit/${id_unit}/finish`);
      } catch (e) {
        // Optional: handle error
      }
    }
  };

  // id = detail.id
  const handlePenilaianLanjutChange = (id: number, value: string) => {
    setPenilaianLanjut(prev => ({ ...prev, [id]: value }));
  };

  const handleFilterChange = (value: 'all' | 'kompeten' | 'belum') => {
    setFilterKompeten(value);
    if (value === 'kompeten' || value === 'belum') {
      const newPencapaian: Record<number, string> = {};
      elements.forEach(item => {
        item.details.forEach(det => {
          newPencapaian[det.id] = value;
        });
      });
      setPencapaian(newPencapaian);

      // Hapus semua kriteria dari daftar unassessed karena sudah dinilai semua
      setUnassessedCriteria([]);
    }
  };

  // Fungsi untuk mendapatkan daftar kriteria yang belum dinilai
  const getUnassessedCriteria = () => {
    const unassessed: number[] = [];
    elements.forEach(el => {
      el.details.forEach(det => {
        if (!pencapaian[det.id] || (pencapaian[det.id] !== 'kompeten' && pencapaian[det.id] !== 'belum')) {
          unassessed.push(det.id);
        }
      });
    });
    return unassessed;
  };

  const filteredData = elements.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.details.some(det => det.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hitung jumlah kriteria yang belum dinilai
  const unassessedCount = getUnassessedCriteria().length;
  const fetchAllUnits = async () => {
    if (!id_result) return;
    try {
      const response = await api.get(`/assessments/ia-01/units/${id_result}`);
      if (response.data.success) {
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

        // Buat mapping id unit ke nomor urut global
        const numberMap: Record<number, number> = {};
        flattenedUnits.forEach((unit: any, index: number) => {
          numberMap[unit.id] = index + 1;
        });
        setUnitNumberMap(numberMap);
      }
    } catch (error: any) {
      console.error('fetchAllUnits error:', error);
    }
  };

  // Panggil fungsi ini dalam useEffect
  useEffect(() => {
    if (id_result) {
      fetchAllUnits();
      fetchElements();
    }
  }, [id_result, id_unit]);

  // Tidak perlu kirim state, langsung navigasi biasa
  const handleBack = () => {
    navigate(paths.asesor.assessment.ia01(
      id_assessment ?? '-',
      id_asesi ?? '-'
    ) + (activeGroup ? `?group=${encodeURIComponent(activeGroup)}` : ''));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm">
        <NavbarAsesor
          title="Detail"
          icon={
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-600 cursor-pointer transition-colors flex items-center"
            >
              <ChevronLeft size={20} />
            </button>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm m-4 px-4 py-7">
        {/* Header */}
        <div className="pb-7 flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-[#00809D]">
            <Monitor size={20} />
            <span className="font-medium">
              Unit kompetensi {unitNumberMap[Number(id_unit)] || 'N/A'}
            </span>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Kompeten */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none">

            <label
              className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
                ${filterKompeten === 'kompeten' ? "bg-[#E77D3533]" : ""}`}
            >
              <input
                type="radio"
                name="filter"
                value="kompeten"
                checked={filterKompeten === 'kompeten'}
                onChange={() => handleFilterChange('kompeten')}
                className="hidden"
              />
              <span
                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${filterKompeten === 'kompeten' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
              >
                {filterKompeten === 'kompeten' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="white"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span className={filterKompeten === 'kompeten' ? "text-gray-900" : "text-gray-500"}>
                Ceklis Semua Ya
              </span>
            </label>

            <label
              className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
                ${filterKompeten === 'belum' ? "bg-[#E77D3533]" : ""}`}
            >
              <input
                type="radio"
                name="filter"
                value="belum"
                checked={filterKompeten === 'belum'}
                onChange={() => handleFilterChange('belum')}
                className="hidden"
              />
              <span
                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${filterKompeten === 'belum' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}`}
              >
                {filterKompeten === 'belum' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="white"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span className={filterKompeten === 'belum' ? "text-gray-900" : "text-gray-500"}>
                Ceklis Semua Tidak
              </span>
            </label>
          </div>
        </div>

        {/* Status info */}
        {unassessedCount > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              <strong>{unassessedCount} kriteria</strong> belum dinilai. Harap beri penilaian Ya/Tidak untuk semua kriteria sebelum menyimpan.
            </p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">No</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700"></th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Kriteria Untuk Kerja</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Standar Industri atau Tempat Kerja</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700">Pencapaian</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700">Penilaian Lanjut</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <React.Fragment key={item.id}>
                  {item.details.map((det, idx) => {
                    const isUnassessed = !pencapaian[det.id] ||
                      (pencapaian[det.id] !== 'kompeten' && pencapaian[det.id] !== 'belum');

                    return (
                      <tr
                        key={det.id}
                        className={`border-t border-gray-200`}
                      >
                        {idx === 0 && (
                          <td rowSpan={item.details.length} className="px-4 py-3 text-sm text-gray-900 align-top">
                            {i + 1}
                          </td>
                        )}
                        {idx === 0 && (
                          <td rowSpan={item.details.length} className="px-4 py-3 text-sm text-gray-900 align-top">
                            {item.title}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-blue-600 min-w-8">{det.id}</span>
                            <span>{det.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{det.benchmark}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                            {/* Kompeten */}
                            <label
                              className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm
                                ${pencapaian[det.id] === "kompeten" ? "bg-[#E77D3533]" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`pencapaian-${det.id}`}
                                value="kompeten"
                                checked={pencapaian[det.id] === "kompeten"}
                                onChange={(e) => handlePencapaianChange(det.id, e.target.value)}
                                className="hidden"
                              />
                              <span
                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                  ${pencapaian[det.id] === "kompeten"
                                    ? "bg-[#E77D35] border-[#E77D35]"
                                    : "border-[#E77D35]"
                                  }`}
                              >
                                {pencapaian[det.id] === "kompeten" && (
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
                                className={
                                  pencapaian[det.id] === "kompeten"
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                }
                              >
                                Ya
                              </span>
                            </label>
                            {/* Belum Kompeten */}
                            <label
                              className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm
                                ${pencapaian[det.id] === "belum" ? "bg-[#E77D3533]" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`pencapaian-${det.id}`}
                                value="belum"
                                checked={pencapaian[det.id] === "belum"}
                                onChange={(e) => handlePencapaianChange(det.id, e.target.value)}
                                className="hidden"
                              />
                              <span
                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                  ${pencapaian[det.id] === "belum"
                                    ? "bg-[#E77D35] border-[#E77D35]"
                                    : "border-[#E77D35]"
                                  }`}
                              >
                                {pencapaian[det.id] === "belum" && (
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
                                className={
                                  pencapaian[det.id] === "belum"
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                }
                              >
                                Tidak
                              </span>
                            </label>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <PenilaianLanjut
                            initialValue={penilaianLanjut[det.id] || ''}
                            onChange={(value) => handlePenilaianLanjutChange(det.id, value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center gap-4 mt-6">
          {saveError && <span className="text-red-500 text-sm mr-4">{saveError}</span>}
          <button
            className="bg-[#E77D35] px-12 text-white lg:px-20 py-2 rounded-lg font-medium hover:bg-[#E77D35]/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
            onClick={handleSave}
            disabled={saving || unassessedCount > 0}
          >
            {saving ? 'Menyimpan...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}