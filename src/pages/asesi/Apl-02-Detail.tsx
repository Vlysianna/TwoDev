import React, { useEffect, useState } from "react";
import { Monitor, ChevronLeft, Search, Check, AlertCircle } from "lucide-react";
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
import useToast from "@/components/ui/useToast";

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

type Element = {
  element_id: number;
  is_competent: boolean | null;
  evidence: string[];
};

type FormValues = {
  result_id: number;
  elements: Element[];
};

type EvidenceOptionType =
  | "Kartu Pelajar"
  | "Kartu Keluarga / KTP"
  | "Pasfoto berwarna ukuran 3 x 4"
  | "Rapor SMK Konsentrasi Keahlian semester 1 sampai dengan 5K"
  | "Sertifikat / Surat Keterangan Praktik Kerja Lapangan (PKL)";

const evidenceOptions: EvidenceOptionType[] = [
  "Kartu Pelajar",
  "Kartu Keluarga / KTP",
  "Pasfoto berwarna ukuran 3 x 4",
  "Rapor SMK Konsentrasi Keahlian semester 1 sampai dengan 5K",
  "Sertifikat / Surat Keterangan Praktik Kerja Lapangan (PKL)",
];

export default function Apl02Detail() {
  const { id_unit, unit_number } = useParams();
  const { id_schedule: id_assessment, id_asesor, id_result } = useAssessmentParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleSubmit, control, setValue, getValues } = useForm<FormValues>();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKompeten, setFilterKompeten] = useState("all");
  const [selectedProof, setSelectedProof] = useState<{
    [key: number]: string[];
  }>({});
  const [pencapaian, setPencapaian] = useState<{
    [key: number]: string | undefined;
  }>({});
  const [globalProof, setGlobalProof] = useState("");
  const [elements, setElements] = useState<AssessmentElement[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unassessedElements, setUnassessedElements] = useState<number[]>([]);
  const [isEditable, setIsEditable] = useState(true);
  const [assessmentStatus, setAssessmentStatus] = useState<any>(null);

  // State untuk pencarian bukti - dipindahkan ke sini
  const [proofSearchTerm, setProofSearchTerm] = useState("");

  const toast = useToast();

  const checkAssessmentStatus = async () => {
    try {
      const response = await api.get(`/assessments/apl-02/result/${id_result}`);
      if (response.data.success) {
        const data = response.data.data;
        setAssessmentStatus(data.apl02_header);

        if (data.apl02_header?.approved_assessee) {
          setIsEditable(false);
        }
      }
    } catch (error) {
      console.error("Gagal memeriksa status asesmen:", error);
    }
  };

  useEffect(() => {
    checkAssessmentStatus();
    fetchElements();
  }, [user]);

  useEffect(() => {
    if (elements.length < 0) {
      navigate(routes.asesi.assessment.apl02(id_assessment, id_asesor));
    }
  }, [elements]);

  // Fungsi untuk memfilter bukti berdasarkan pencarian
  const getFilteredProofs = (proofs: string[]) => {
    if (!proofSearchTerm) return proofs;
    return proofs.filter(proof =>
      proof.toLowerCase().includes(proofSearchTerm.toLowerCase())
    );
  };

  const handlePencapaianChange = (id: number, value: string | null) => {
    if (value === null) {
      setPencapaian((prev) => {
        const newPencapaian = { ...prev };
        delete newPencapaian[id];
        return newPencapaian;
      });
      setValue(`elements.${id}.is_competent`, null);

      if (!unassessedElements.includes(id)) {
        setUnassessedElements((prev) => [...prev, id]);
      }
    } else {
      setPencapaian((prev) => ({
        ...prev,
        [id]: value,
      }));
      setValue(`elements.${id}.is_competent`, value === "kompeten");

      if (unassessedElements.includes(id)) {
        setUnassessedElements((prev) => prev.filter((item) => item !== id));
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
        setValue(`elements.${item.id}.is_competent`, isKompeten);
      });

      setPencapaian(newPencapaian);
      setUnassessedElements([]);
    } else if (value === "all") {
      const newPencapaian: { [key: number]: string } = {};
      elements.forEach((item) => {
        setValue(`elements.${item.id}.is_competent`, null);
      });
      setPencapaian(newPencapaian);
      setUnassessedElements(elements.map((el) => el.id));
    }
  };

  const handleGlobalProofChange = (values: string[]) => {
    elements.forEach((item) => {
      setValue(`elements.${item.id}.evidence`, values);
    });

    const newProof: { [key: number]: string[] } = {};
    elements.forEach((item) => {
      newProof[item.id] = values;
    });
    setSelectedProof(newProof);
  };

  const getUnfilledElements = () => {
    const formValues = getValues();
    const unfilled: number[] = [];
    elements.forEach((el) => {
      const pencapaian = formValues.elements?.[el.id]?.is_competent;
      const evidence = formValues.elements?.[el.id]?.evidence;
      if (
        pencapaian === null ||
        pencapaian === undefined ||
        !evidence ||
        evidence.length === 0
      ) {
        unfilled.push(el.id);
      }
    });
    return unfilled;
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

        const pencapaianInit: { [key: number]: string } = {};
        const proofInit: { [key: number]: string[] } = {};
        const unassessedInit: number[] = [];

        response.data.data.forEach((el: any) => {
          if (el.result) {
            pencapaianInit[el.id] = el.result.is_competent
              ? "kompeten"
              : "belum";
            setValue(`elements.${el.id}.is_competent`, el.result.is_competent);

            if (el.result.evidences && el.result.evidences.length > 0) {
              const evidenceValues = el.result.evidences.map((e: any) => e.evidence);
              setValue(`elements.${el.id}.evidence`, evidenceValues);
              proofInit[el.id] = evidenceValues;
            }
          } else {
            unassessedInit.push(el.id);
            setValue(`elements.${el.id}.is_competent`, null);
          }
        });

        setPencapaian(pencapaianInit);
        setSelectedProof(proofInit);
        setUnassessedElements(unassessedInit);
      }
    } catch (error: any) {
      // console.log("Error fetching elements:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const unfilled = getUnfilledElements();
    if (unfilled.length > 0) {
      setSaveError("Harap isi pencapaian dan bukti relevan untuk semua elemen");
      return;
    }

    setSaving(true);
    setSaveError(null);

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

    // console.log("Payload:", payload);

    try {
      await api
        .post("/assessments/apl-02/result/send", payload)
        .then((response) => {
          if (response.data.success) {
            toast.show({
              title: "Berhasil",
              description: "Berhasil menyimpan data",
              type: "success",
            });
            navigate(paths.asesi.assessment.apl02(id_assessment, id_asesor));
          } else {
            toast.show({
              title: "Gagal",
              description: "Gagal menyimpan data",
              type: "error",
            });
          }
        });
    } catch (error: any) {
      setSaveError("Gagal menyimpan data: " + error.message);
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const unfilledCount = getUnfilledElements().length;

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
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

          {!isEditable && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <p className="text-yellow-800">
                  Data tidak dapat diubah karena QR code sudah digenerate.
                </p>
              </div>
            </div>
          )}

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

                  {/* Filter Kompeten */}
                  <div className={`flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none ${!isEditable ? "hidden" : ""}`}>
                    {[
                      { value: "kompeten", label: "Semua Kompeten" },
                      { value: "belum", label: "Semua Belum Kompeten" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 px-2 py-1 rounded-sm transition 
        ${filterKompeten === opt.value ? "bg-[#E77D3533]" : ""} 
        ${!isEditable ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name="filter"
                          value={opt.value}
                          checked={filterKompeten === opt.value}
                          onChange={(e) => isEditable && handleFilterChange(e.target.value)}
                          disabled={!isEditable}
                          className="hidden"
                        />
                        <span
                          className={`w-4 h-4 flex items-center justify-center rounded-full border-2 
          ${filterKompeten === opt.value ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"} 
          ${!isEditable ? "cursor-not-allowed" : ""}`}
                        >
                          {filterKompeten === opt.value && <Check className="w-4 h-4 text-white" />}
                        </span>
                        <span className={`${filterKompeten === opt.value ? "text-gray-900" : "text-gray-500"} ${!isEditable ? "cursor-not-allowed" : ""}`}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Global Bukti Relevan - Multi Select */}
                  <div className={`flex items-center gap-2 flex-none w-full md:w-80 ${!isEditable ? "hidden" : ""}`}>
                    <Controller
                      name="globalEvidence"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={`w-full px-3 py-2 bg-[#DADADA33] rounded-md text-left text-sm ${!isEditable ? "cursor-not-allowed" : "cursor-pointer"}`}
                              disabled={!isEditable}
                            >
                              {field.value?.length > 0
                                ? `${field.value.length} Bukti Relevan telah dipilih`
                                : "Pilih Bukti Relevan"}
                            </button>
                          </PopoverTrigger>
                          {isEditable && (
                            <PopoverContent className="w-[250px] p-0">
                              <Command>
                                <CommandInput placeholder="Cari Bukti Relevan" />
                                <CommandEmpty>
                                  Bukti Relevan tidak ditemukan.
                                </CommandEmpty>
                                <CommandGroup>
                                  {evidenceOptions.map((opt) => {
                                    const selected = field.value?.includes(opt);
                                    return (
                                      <CommandItem
                                        key={opt}
                                        onSelect={() => {
                                          const currentValues = field.value || [];
                                          let newValues;

                                          if (selected) {
                                            newValues = currentValues.filter((v) => v !== opt);
                                          } else {
                                            newValues = [...currentValues, opt];
                                          }

                                          field.onChange(newValues);
                                          handleGlobalProofChange(newValues);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selected ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {opt}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          )}
                        </Popover>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Status info */}
              {unfilledCount > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">
                    <strong>{unfilledCount} elemen</strong> belum diisi
                    pencapaian <u>dan</u> bukti relevan. Harap isi{" "}
                    <b>Kompeten/Belum Kompeten</b> dan pilih{" "}
                    <b>Bukti Relevan</b> untuk semua elemen sebelum menyimpan.
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
                    {filteredData.map((item, i) => {
                      const elementNumber = i + 1;
                      return (
                        <React.Fragment key={item.id}>
                          <tr
                            key={item.uc_id}
                            className={`${"border-t border-gray-300"}`}
                          >
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

                            {/* Pencapaian */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <Controller
                                name={`elements.${item.id}.is_competent`}
                                control={control}
                                defaultValue={null}
                                render={({ field }) => {
                                  const selectedValue =
                                    field.value === true
                                      ? "kompeten"
                                      : field.value === false
                                        ? "belum"
                                        : null;

                                  const disabledClasses = !isEditable ? "cursor-not-allowed opacity-80" : "";

                                  return (
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                                      {/* Kompeten */}
                                      <label
                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm transition text-sm ${selectedValue === "kompeten" ? "bg-[#E77D3533]" : ""} ${disabledClasses}`}
                                      >
                                        <input
                                          type="radio"
                                          value="true"
                                          checked={selectedValue === "kompeten"}
                                          onChange={() => {
                                            if (isEditable) {
                                              field.onChange(true);
                                              handlePencapaianChange(item.id, "kompeten");
                                            }
                                          }}
                                          disabled={!isEditable}
                                          className="hidden"
                                        />
                                        <span
                                          className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${selectedValue === "kompeten" ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"} ${disabledClasses}`}
                                        >
                                          {selectedValue === "kompeten" && <Check className="w-4 h-4 text-white" />}
                                        </span>
                                        <span className={`${selectedValue === "kompeten" ? "text-gray-900" : "text-gray-500"} ${disabledClasses}`}>
                                          Kompeten
                                        </span>
                                      </label>

                                      {/* Belum Kompeten */}
                                      <label
                                        className={`flex items-center gap-2 px-2 py-1 rounded-sm transition text-sm ${selectedValue === "belum" ? "bg-[#E77D3533]" : ""} ${disabledClasses}`}
                                      >
                                        <input
                                          type="radio"
                                          value="false"
                                          checked={selectedValue === "belum"}
                                          onChange={() => {
                                            if (isEditable) {
                                              field.onChange(false);
                                              handlePencapaianChange(item.id, "belum");
                                            }
                                          }}
                                          disabled={!isEditable}
                                          className="hidden"
                                        />
                                        <span
                                          className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${selectedValue === "belum" ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"} ${disabledClasses}`}
                                        >
                                          {selectedValue === "belum" && <Check className="w-4 h-4 text-white" />}
                                        </span>
                                        <span className={`${selectedValue === "belum" ? "text-gray-900" : "text-gray-500"} ${disabledClasses}`}>
                                          Belum Kompeten
                                        </span>
                                      </label>
                                    </div>
                                  );
                                }}
                              />
                            </td>

                            {/* Bukti relevan */}
                            <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${!isEditable ? "" : ""}`}>
                              <Controller
                                name={`elements.${item.id}.evidence`}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => {
                                  const values = field.value || [];

                                  return (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          type="button"
                                          role="combobox"
                                          className={`w-[200px] justify-between rounded-md border px-3 py-2 text-sm text-left ${!isEditable ? "cursor-pointer bg-white hover:bg-gray-50" : "cursor-pointer bg-white"
                                            }`}
                                        // HAPUS disabled={!isEditable} - biar tombol tetap bisa diklik di mode view-only
                                        >
                                          {values.length > 0
                                            ? `${values.length} bukti terpilih`
                                            : "Pilih bukti relevan"}
                                        </button>
                                      </PopoverTrigger>

                                      {isEditable ? (
                                        <PopoverContent className="w-[250px] p-0">
                                          <Command>
                                            <CommandInput placeholder="Cari Bukti Relevan..." />
                                            <CommandEmpty>Tidak ada bukti relevan.</CommandEmpty>
                                            <CommandGroup>
                                              {evidenceOptions.map((opt) => {
                                                const selected = values.includes(opt);
                                                return (
                                                  <CommandItem
                                                    key={opt}
                                                    onSelect={() => {
                                                      let newValues;
                                                      if (selected) {
                                                        newValues = values.filter((v) => v !== opt);
                                                      } else {
                                                        newValues = [...values, opt];
                                                      }
                                                      field.onChange(newValues);
                                                      setSelectedProof((prev) => ({
                                                        ...prev,
                                                        [item.id]: newValues,
                                                      }));
                                                    }}
                                                  >
                                                    <Check
                                                      className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selected ? "opacity-100" : "opacity-0"
                                                      )}
                                                    />
                                                    {opt}
                                                  </CommandItem>
                                                );
                                              })}
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      ) : (
                                        <PopoverContent className="w-[250px] p-0">
                                          <Command>
                                            <CommandGroup>
                                              <div className="p-2">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                  Bukti yang dipilih:
                                                </h4>
                                                {values.length > 0 ? (
                                                  <ul className="space-y-1">
                                                    {values.map((proof, index) => (
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
                                      )}
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
              {saveError && (
                <span className="text-red-500 text-sm">{saveError}</span>
              )}
              <motion.button
                type="submit"
                className="bg-[#E77D35] hover:bg-[#E77D35] text-white font-bold py-2 mb-6 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer hover:bg-orange-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                disabled={saving || unfilledCount > 0}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </motion.button>
            </div>
          </main>
        </div>
      </form>
    </div>
  );
}