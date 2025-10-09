import React, { useState, useEffect } from "react";
import { Monitor, ChevronLeft, Search, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import NavbarAsesor from "@/components/NavAsesor";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type AssessmentElement = {
  id: number;
  uc_id: number;
  title: string;
  details: {
    id: number;
    element_id: number;
    description: string;
  }[];
  result?: {
    is_competent: boolean;
    evidences: {
      evidence: string;
    }[];
  };
};

type EvidenceOptionType =
  | "Fotocopy Ijazah Terakhir"
  | "Pas foto 3x4 latar belakang merah"
  | "Kartu Tanda Penduduk ( KTP ) / KK"
  | "Raport semester 1 s.d. 5";

const evidenceOptions: EvidenceOptionType[] = [
  "Fotocopy Ijazah Terakhir",
  "Pas foto 3x4 latar belakang merah",
  "Kartu Tanda Penduduk ( KTP ) / KK",
  "Raport semester 1 s.d. 5",
];

export default function CekApl02Detail() {
  const { id_unit, unit_number } = useParams();
  const { id_assessment, id_result, id_asesi } = useAssessmentParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKompeten, setFilterKompeten] = useState("all");
  const [elements, setElements] = useState<AssessmentElement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElements();
  }, []);

  const fetchElements = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/assessments/apl-02/units/${id_result}/elements/${id_unit}`
      );

      if (response.data.success) {
        setElements(response.data.data);
      }
    } catch (error: any) {
      // console.log("Error fetching elements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = elements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.some((detail) =>
        detail.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  // Fungsi untuk mendapatkan status pencapaian
  const getPencapaianStatus = (element: AssessmentElement) => {
    if (!element.result) return null;
    return element.result.is_competent ? "kompeten" : "belum";
  };

  // Fungsi untuk mendapatkan bukti yang dipilih
  const getSelectedProofs = (element: AssessmentElement) => {
    if (!element.result || !element.result.evidences) return [];
    return element.result.evidences.map((evidence) => evidence.evidence);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <NavbarAsesor
            title="Detail APL-02 (View Only)"
            icon={
              <Link
                to={paths.asesor.assessment.cekApl02(
                  id_assessment || "",
                  id_asesi || ""
                )}
                className="text-gray-500 hover:text-gray-600"
              >
                <ChevronLeft size={20} />
              </Link>
            }
          />
        </div>
        <main className="m-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="pb-7">
              <div className="flex flex-wrap items-center w-full gap-4 md:gap-6">
                {/* Unit Kompetensi */}
                <div className="flex items-center gap-2 text-[#00809D] flex-none">
                  <Monitor size={20} />
                  <span className="font-medium">
                    Unit kompetensi {unit_number || 1}
                  </span>
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <p>Memuat data...</p>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="w-full min-w-[900px] table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 sm:p-5 text-left text-sm font-medium text-gray-700 w-64">
                        Elemen
                      </th>
                      <th className="p-3 sm:p-5 text-left text-sm font-medium text-gray-700 w-64">
                        Kriteria Untuk Kerja
                      </th>
                      <th className="p-3 sm:p-5 text-center text-sm font-medium text-gray-700 w-40">
                        Pencapaian
                      </th>
                      <th className="p-3 sm:p-5 text-center text-sm font-medium text-gray-700 w-40">
                        Bukti yang relevan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, i) => {
                      const pencapaianStatus = getPencapaianStatus(item);
                      const selectedProofs = getSelectedProofs(item);
                      const elementNumber = i + 1;

                      return (
                        <React.Fragment key={item.id}>
                          <tr className="border-t border-gray-300">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 align-top">
                              <div className="flex items-start gap-2">
                                <span className="font-medium">
                                  {elementNumber}
                                </span>
                                <span>{item.title}</span>
                              </div>
                            </td>

                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                              {item.details.map((criteria, j) => {
                                const criteriaNumber = `${elementNumber}.${j + 1}`;
                                return (
                                  <div
                                    key={criteria.id}
                                    className="flex items-start gap-2 mb-2"
                                  >
                                    <span className="font-medium text-[#00809D] min-w-8">
                                      {criteriaNumber}
                                    </span>
                                    <span>{criteria.description}</span>
                                  </div>
                                );
                              })}
                            </td>

                            {/* Pencapaian (Readonly) */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                                {/* Kompeten */}
                                <label
                                  className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm ${pencapaianStatus === "kompeten"
                                      ? "bg-[#E77D3533]"
                                      : ""
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    value="true"
                                    checked={pencapaianStatus === "kompeten"}
                                    className="hidden"
                                    disabled
                                  />
                                  <span
                                    className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${pencapaianStatus === "kompeten"
                                        ? "bg-[#E77D35] border-[#E77D35]"
                                        : "border-[#E77D35]"
                                      }`}
                                  >
                                    {pencapaianStatus === "kompeten" && (
                                      <Check className="w-4 h-4 text-white" />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      pencapaianStatus === "kompeten"
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }
                                  >
                                    Kompeten
                                  </span>
                                </label>

                                {/* Belum Kompeten */}
                                <label
                                  className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm ${pencapaianStatus === "belum"
                                      ? "bg-[#E77D3533]"
                                      : ""
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    value="false"
                                    checked={pencapaianStatus === "belum"}
                                    className="hidden"
                                    disabled
                                  />
                                  <span
                                    className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${pencapaianStatus === "belum"
                                        ? "bg-[#E77D35] border-[#E77D35]"
                                        : "border-[#E77D35]"
                                      }`}
                                  >
                                    {pencapaianStatus === "belum" && (
                                      <Check className="w-4 h-4 text-white" />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      pencapaianStatus === "belum"
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                    }
                                  >
                                    Belum Kompeten
                                  </span>
                                </label>
                              </div>
                            </td>

                            {/* Bukti relevan (Readonly - MODIFIED) */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="w-[200px] justify-between rounded-md border px-3 py-2 text-sm text-left bg-white hover:bg-gray-50 cursor-pointer"
                                  >
                                    {selectedProofs.length > 0
                                      ? `${selectedProofs.length} bukti terpilih`
                                      : "Tidak ada bukti"}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                  <Command>
                                    <CommandGroup>
                                      <div className="p-2">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                          Bukti yang dipilih:
                                        </h4>
                                        {selectedProofs.length > 0 ? (
                                          <ul className="space-y-1">
                                            {selectedProofs.map((proof, index) => (
                                              <li
                                                key={index}
                                                className="flex items-center text-sm text-gray-600 p-1 bg-gray-50 rounded"
                                              >
                                                <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                                <span className="truncate">{proof}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-sm text-gray-500 italic">
                                            Tidak ada bukti yang dipilih
                                          </p>
                                        )}
                                      </div>
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}