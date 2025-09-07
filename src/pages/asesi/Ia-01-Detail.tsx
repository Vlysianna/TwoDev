import React, { useState, useEffect, useRef } from 'react';
import { Monitor, ChevronLeft, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import NavbarAsesor from '@/components/NavAsesor';
import paths from "@/routes/paths";
import api from '@/helper/axios';
import { useAssessmentParams } from '@/components/AssessmentAsesiProvider';

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

const PenilaianLanjut: React.FC<{ value?: string }> = ({
    value = ''
}) => {
    return (
        <div className="p-2">
            <p className="text-gray-700 min-h-[24px]">
                {value || 'Klik untuk menambahkan penilaian...'}
            </p>
        </div>
    );
};

export default function Ia01AsesiDetail() {

    const { id_unit } = useParams();
    const { id_assessment, id_result, id_asesor } = useAssessmentParams();
    const [elements, setElements] = useState<ElementIA01[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKompeten, setFilterKompeten] = useState<'all' | 'kompeten' | 'belum'>('all');
    // key: detail.id
    const [pencapaian, setPencapaian] = useState<Record<number, string>>({});
    const [penilaianLanjut, setPenilaianLanjut] = useState<Record<number, string>>({});

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

    const handleFilterChange = (value: 'all' | 'kompeten' | 'belum') => {
        setFilterKompeten(value);
        // HAPUS functionality untuk set semua nilai
    };

    const filteredData = elements.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.some(det => det.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm mb-8">
                <NavbarAsesor
                    title="Detail (View Only)"
                    icon={
                        <Link to={paths.asesi.assessment.ia01Asesi(
                            id_assessment ?? '-',
                            id_asesor ?? '-'
                        )}
                            className="text-gray-500 hover:text-gray-600">
                            <ChevronLeft size={20} />
                        </Link>
                    }
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm m-4 px-4 py-7">
                {/* Header */}
                <div className="pb-7 flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-[#00809D]">
                        <Monitor size={20} />
                        <span className="font-medium">Unit kompetensi {id_unit} (View Only)</span>
                    </div>

                    {/* Search - Read Only */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled
                        />
                    </div>

                    {/* Filter Kompeten - Read Only */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none">

                        <label
                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed
                ${filterKompeten === 'kompeten' ? "bg-[#E77D3533]" : ""}`}
                        >
                            <input
                                type="radio"
                                name="filter"
                                value="kompeten"
                                checked={filterKompeten === 'kompeten'}
                                onChange={() => handleFilterChange('kompeten')}
                                className="hidden"
                                disabled
                            />
                            <span
                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${filterKompeten === 'kompeten' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35] opacity-50"}`}
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
                            <span className={filterKompeten === 'kompeten' ? "text-gray-900" : "text-gray-400"}>
                                Ceklis Semua Ya
                            </span>
                        </label>

                        <label
                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed
                ${filterKompeten === 'belum' ? "bg-[#E77D3533]" : ""}`}
                        >
                            <input
                                type="radio"
                                name="filter"
                                value="belum"
                                checked={filterKompeten === 'belum'}
                                onChange={() => handleFilterChange('belum')}
                                className="hidden"
                                disabled
                            />
                            <span
                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${filterKompeten === 'belum' ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35] opacity-50"}`}
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
                            <span className={filterKompeten === 'belum' ? "text-gray-900" : "text-gray-400"}>
                                Ceklis Semua Tidak
                            </span>
                        </label>
                    </div>
                </div>

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
                                    {item.details.map((det, idx) => (
                                        <tr key={det.id} className="border-t border-gray-200">
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
                                                    {/* Kompeten - Read Only */}
                                                    <label
                                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm
                              ${pencapaian[det.id] === "kompeten" ? "bg-[#E77D3533]" : "opacity-50"}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`pencapaian-${det.id}`}
                                                            value="kompeten"
                                                            checked={pencapaian[det.id] === "kompeten"}
                                                            onChange={() => { }}
                                                            className="hidden"
                                                            disabled
                                                        />
                                                        <span
                                                            className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                ${pencapaian[det.id] === "kompeten"
                                                                    ? "bg-[#E77D35] border-[#E77D35]"
                                                                    : "border-gray-300"
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
                                                                    : "text-gray-400"
                                                            }
                                                        >
                                                            Ya
                                                        </span>
                                                    </label>
                                                    {/* Belum Kompeten - Read Only */}
                                                    <label
                                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm
                              ${pencapaian[det.id] === "belum" ? "bg-[#E77D3533]" : "opacity-50"}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`pencapaian-${det.id}`}
                                                            value="belum"
                                                            checked={pencapaian[det.id] === "belum"}
                                                            onChange={() => { }}
                                                            className="hidden"
                                                            disabled
                                                        />
                                                        <span
                                                            className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                ${pencapaian[det.id] === "belum"
                                                                    ? "bg-[#E77D35] border-[#E77D35]"
                                                                    : "border-gray-300"
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
                                                                    : "text-gray-400"
                                                            }
                                                        >
                                                            Tidak
                                                        </span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <PenilaianLanjut
                                                    value={penilaianLanjut[det.id] || ''}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* HAPUS Tombol Save */}
            </div>
        </div>
    );
}