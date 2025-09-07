import React, { useEffect, useState, useRef } from "react";
import { Monitor, ChevronLeft, Search, Check } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link, useNavigate, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import routes from "@/routes/paths";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
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
};

type Element = {
  element_id: number;
  is_competent: boolean | null; // Changed to allow null for empty state
  evidence: string[];
};

type FormValues = {
  result_id: number;
  elements: Element[];
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

export default function Apl02Detail() {
  const { id_unit } = useParams();
  const { id_assessment, id_asesor, id_result } = useAssessmentParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, setValue, getValues } = useForm<FormValues>();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKompeten, setFilterKompeten] = useState("all");
  const [selectedProof, setSelectedProof] = useState<{
    [key: number]: string | undefined;
  }>({});
  const [pencapaian, setPencapaian] = useState<{
    [key: number]: string | undefined;
  }>({});
  const [globalProof, setGlobalProof] = useState(""); // dropdown header
  const [elements, setElements] = useState<AssessmentElement[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unassessedElements, setUnassessedElements] = useState<number[]>([]);
  const finishedRef = useRef(false);

  useEffect(() => {
    fetchElements();
  }, [user]);

  useEffect(() => {
    if (elements.length < 0) {
      navigate(routes.asesi.assessment.apl02(id_assessment, id_asesor));
    }
  }, [elements]);

  const handleProofSelection = (criteriaId: number, value: string) => {
    setSelectedProof((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const handlePencapaianChange = (id: number, value: string | null) => {
    if (value === null) {
      // Clear selection
      setPencapaian((prev) => {
        const newPencapaian = { ...prev };
        delete newPencapaian[id];
        return newPencapaian;
      });
      
      // Update react-hook-form value to null
      setValue(`elements.${id}.is_competent`, null);
      
      // Add to unassessed if not already there
      if (!unassessedElements.includes(id)) {
        setUnassessedElements(prev => [...prev, id]);
      }
    } else {
      setPencapaian((prev) => ({
        ...prev,
        [id]: value,
      }));
      
      // Update react-hook-form value
      setValue(`elements.${id}.is_competent`, value === "kompeten");
      
      // Remove from unassessed if already there
      if (unassessedElements.includes(id)) {
        setUnassessedElements(prev => prev.filter(item => item !== id));
      }
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterKompeten(value);

    if (value === "kompeten" || value === "belum") {
      const isKompeten = value === "kompeten";
      const newPencapaian: { [key: number]: string } = {};
      
      elements.forEach((item) => {
        newPencapaian[item.id] = value;
        // update react-hook-form value
        setValue(`elements.${item.id}.is_competent`, isKompeten);
      });
      
      setPencapaian(newPencapaian);
      
      // Hapus semua elemen dari daftar unassessed karena sudah dinilai semua
      setUnassessedElements([]);
    } else if (value === "all") {
      // Clear all selections
      const newPencapaian: { [key: number]: string } = {};
      elements.forEach((item) => {
        setValue(`elements.${item.id}.is_competent`, null);
      });
      setPencapaian(newPencapaian);
      
      // Add all elements to unassessed
      setUnassessedElements(elements.map(el => el.id));
    }
  };

  const handleGlobalProofChange = (value: string) => {
    setGlobalProof(value);

    const newProof: { [key: number]: string } = {};
    elements.forEach((item) => {
      newProof[item.id] = value;
      // update react-hook-form value
      if (value) {
        setValue(`elements.${item.id}.evidence`, [value]);
      } else {
        setValue(`elements.${item.id}.evidence`, []);
      }
    });
    setSelectedProof(newProof);
  };

  // Fungsi untuk mendapatkan daftar elemen yang belum dinilai
  const getUnassessedElements = () => {
    const unassessed: number[] = [];
    elements.forEach(el => {
      if (!pencapaian[el.id] || 
          (pencapaian[el.id] !== 'kompeten' && pencapaian[el.id] !== 'belum')) {
        unassessed.push(el.id);
      }
    });
    return unassessed;
  };

  const filteredData = elements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.some((detail) =>
        detail.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const fetchElements = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/assessments/apl-02/units/${id_result}/elements/${id_unit}`
      );

      if (response.data.success) {
        setElements(response.data.data);
        
        // Auto-populate pencapaian dari data yang sudah ada
        const pencapaianInit: { [key: number]: string } = {};
        const unassessedInit: number[] = [];
        
        response.data.data.forEach((el: any) => {
          if (el.result) {
            pencapaianInit[el.id] = el.result.is_competent ? 'kompeten' : 'belum';
            // Juga set nilai di react-hook-form
            setValue(`elements.${el.id}.is_competent`, el.result.is_competent);
            
            // Set evidence jika ada
            if (el.result.evidences && el.result.evidences.length > 0) {
              setValue(`elements.${el.id}.evidence`, el.result.evidences.map((e: any) => e.evidence));
              setSelectedProof(prev => ({...prev, [el.id]: el.result.evidences[0].evidence}));
            }
          } else {
            // Jika tidak ada data sebelumnya, set sebagai unassessed
            unassessedInit.push(el.id);
            setValue(`elements.${el.id}.is_competent`, null);
          }
        });
        
        setPencapaian(pencapaianInit);
        setUnassessedElements(unassessedInit);
      }
    } catch (error: any) {
      console.log("Error fetching elements:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Validasi apakah semua elemen sudah dinilai
    const unassessed = getUnassessedElements();
    if (unassessed.length > 0) {
      setUnassessedElements(unassessed);
      setSaveError('Harap isi penilaian untuk semua elemen');
      return;
    }

    setSaving(true);
    setSaveError(null);
    
    // Filter out elements with null values (shouldn't happen after validation)
    const validElements = Object.entries(data.elements).filter(
      ([, val]) => val.is_competent !== null
    );
    
    const payload = {
      result_id: id_result,
      elements: validElements.map(([elementId, val]) => ({
        is_competent: val.is_competent,
        element_id: Number(elementId),
        evidences: val.evidence.map((evidence) => ({
          evidence: evidence,
        })),
      })),
    };

    console.log("Payload:", payload);

    try {
      await api.post("/assessments/apl-02/result/send", payload);
      navigate(paths.asesi.assessment.apl02(id_assessment, id_asesor));
    } catch (error: any) {
      setSaveError('Gagal menyimpan data: ' + error.message);
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  // Hitung jumlah elemen yang belum dinilai
  const unassessedCount = getUnassessedElements().length;

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <NavbarAsesi
              title="Detail"
              icon={
                <Link
                  to={paths.asesi.assessment.apl02(id_assessment, id_asesor)}
                  className="text-gray-500 hover:text-gray-600"
                >
                  <ChevronLeft size={20} />
                </Link>
              }
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm m-4 px-5 py-7">
            {/* Header */}
            <div className="pb-7">
              <div className="flex flex-wrap items-center w-full gap-4 md:gap-6">
                {/* Unit Kompetensi */}
                <div className="flex items-center gap-2 text-[#00809D] flex-none">
                  <Monitor size={20} />
                  <span className="font-medium">Unit kompetensi 1</span>
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

                {/* Filter Kompeten */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none">
                  {[
                    { value: "kompeten", label: "Semua Kompeten" },
                    { value: "belum", label: "Semua Belum Kompeten" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition ${
                        filterKompeten === opt.value ? "bg-[#E77D3533]" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="filter"
                        value={opt.value}
                        checked={filterKompeten === opt.value}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="hidden"
                      />
                      <span
                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                          filterKompeten === opt.value
                            ? "bg-[#E77D35] border-[#E77D35]"
                            : "border-[#E77D35]"
                        }`}
                      >
                        {filterKompeten === opt.value && (
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
                      <span
                        className={
                          filterKompeten === opt.value
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Global Bukti Relevan */}
                <div className="flex items-center gap-2 flex-none w-full md:w-80">
                  <select
                    className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 hover:cursor-pointer"
                    value={globalProof}
                    onChange={(e) => handleGlobalProofChange(e.target.value)}
                  >
                    <option value="">Bukti Relevan</option>
                    <option value="dokumen1">Dokumen 1</option>
                    <option value="dokumen2">Dokumen 2</option>
                    <option value="dokumen3">Dokumen 3</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status info */}
            {unassessedCount > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">
                  <strong>{unassessedCount} elemen</strong> belum dinilai. Harap beri penilaian Kompeten/Belum Kompeten untuk semua elemen sebelum menyimpan.
                </p>
              </div>
            )}

            {/* Table */}
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
                  {filteredData.map((item) => {
                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          key={item.uc_id}
                          className={`${"border-t border-gray-300"}`}
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 align-top">
                            <div className="flex items-start gap-2">
                              <span className="font-medium">{item.id}</span>
                              <span>{item.title}</span>
                            </div>
                          </td>

                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                            {item.details.map((criteria) => (
                              <div key={criteria.id} className="flex items-start gap-2 mb-2">
                                <span className="font-medium text-[#00809D] min-w-8">
                                  {criteria.id}
                                </span>
                                <span>{criteria.description}</span>
                              </div>
                            ))}
                          </td>

                          {/* Pencapaian */}
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <Controller
                              name={`elements.${item.id}.is_competent`}
                              control={control}
                              defaultValue={null}
                              render={({ field }) => {
                                const selectedValue = field.value === true ? "kompeten" : 
                                                    field.value === false ? "belum" : null;
                                
                                return (
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                                    {/* Kompeten */}
                                    <label
                                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm ${
                                        selectedValue === "kompeten" ? "bg-[#E77D3533]" : ""
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        value="true"
                                        checked={selectedValue === "kompeten"}
                                        onChange={() => {
                                          field.onChange(true);
                                          handlePencapaianChange(item.id, "kompeten");
                                        }}
                                        className="hidden"
                                      />
                                      <span
                                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                                          selectedValue === "kompeten"
                                            ? "bg-[#E77D35] border-[#E77D35]"
                                            : "border-[#E77D35]"
                                        }`}
                                      >
                                        {selectedValue === "kompeten" && (
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
                                          selectedValue === "kompeten"
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                        }
                                      >
                                        Kompeten
                                      </span>
                                    </label>

                                    {/* Belum Kompeten */}
                                    <label
                                      className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm ${
                                        selectedValue === "belum" ? "bg-[#E77D3533]" : ""
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        value="false"
                                        checked={selectedValue === "belum"}
                                        onChange={() => {
                                          field.onChange(false);
                                          handlePencapaianChange(item.id, "belum");
                                        }}
                                        className="hidden"
                                      />
                                      <span
                                        className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                                          selectedValue === "belum"
                                            ? "bg-[#E77D35] border-[#E77D35]"
                                            : "border-[#E77D35]"
                                        }`}
                                      >
                                        {selectedValue === "belum" && (
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
                                          selectedValue === "belum"
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                        }
                                      >
                                        Belum Kompeten
                                      </span>
                                    </label>
                                  </div>
                                );
                              }}
                            />
                          </td>

                          {/* Bukti relevan */}
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <Controller
                              name={`elements.${item.id}.evidence`}
                              control={control}
                              render={({ field }) => {
                                const values = field.value || [];
                                return (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        role="combobox"
                                        className="w-[200px] justify-between rounded-md border px-3 py-2 text-sm text-left"
                                      >
                                        {values.length > 0
                                          ? `${values.length} selected`
                                          : "Select evidences..."}
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                      <Command>
                                        <CommandInput placeholder="Search..." />
                                        <CommandEmpty>
                                          No evidence found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {evidenceOptions.map((opt) => {
                                            const selected = values.some((v) => {
                                              return v === opt;
                                            });
                                            return (
                                              <CommandItem
                                                key={opt}
                                                onSelect={() => {
                                                  if (selected) {
                                                    field.onChange(
                                                      values.filter(
                                                        (v) => v !== opt
                                                      )
                                                    );
                                                  } else {
                                                    field.onChange([
                                                      ...values,
                                                      opt,
                                                    ]);
                                                  }
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selected
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {opt}
                                              </CommandItem>
                                            );
                                          })}
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                );
                              }}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="relative flex justify-end items-center gap-4 mt-6 mr-10">
            {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
            <motion.button
              type="submit"
              className="bg-[#E77D35] hover:bg-[#E77D35] text-white font-bold py-2 mb-6 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              disabled={saving || unassessedCount > 0}
            >
              {saving ? 'Menyimpan...' : 'Save'}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}