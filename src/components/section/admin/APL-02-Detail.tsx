import api from "@/helper/axios";
import { cn } from "@/lib/utils";
import type { APL02ResponseElement } from "@/model/apl02-model";
import { Check, Monitor, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

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

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function APL02Detail({
  id_result,
  id_unit,
}: {
  id_result: string;
  id_unit: string;
}) {
  const { data: elements, isLoading: loading } = useSWR<APL02ResponseElement[]>(
    `/assessments/apl-02/units/${id_result}/elements/${id_unit}`,
    fetcher
  );

  const detailRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!elements) return [];

    return elements.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.details.some((d) =>
          d.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
  }, [elements, searchTerm]);

  const getPencapaianStatus = useCallback(
    (res: APL02ResponseElement["result"]) => {
      if (!res) return "";
      return res.is_competent ? "kompeten" : "belum";
    },
    []
  );

  useEffect(() => {
    if (elements && !loading) {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [elements, loading]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" ref={detailRef}>
      {/* Header */}
      <div className="pb-7">
        <div className="flex flex-wrap items-center w-full gap-4 md:gap-6">
          {/* Unit Kompetensi */}
          <div className="flex items-center gap-2 text-[#00809D] flex-none">
            <Monitor size={20} />
            <span className="font-medium">Unit kompetensi {id_unit || 1}</span>
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

          {/* Filter Kompeten (Disabled) */}
          {/* <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none">
						{[
							{ value: "kompeten", label: "Semua Kompeten" },
							{ value: "belum", label: "Semua Belum Kompeten" },
						].map((opt) => (
							<label
								key={opt.value}
								className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition ${
									filterKompeten === opt.value ? "bg-[#E77D3533]" : ""
								}`}
							>
								<input
									type="radio"
									name="filter"
									value={opt.value}
									checked={filterKompeten === opt.value}
									onChange={(e) => setFilterKompeten(e.target.value)}
									className="hidden"
									disabled
								/>
								<span
									className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
										filterKompeten === opt.value
											? "bg-[#E77D35] border-[#E77D35]"
											: "border-[#E77D35]"
									}`}
								>
									{filterKompeten === opt.value && (
										<Check className="w-4 h-4 text-white" />
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
					</div> */}

					{/* Global Bukti Relevan (Disabled) */}
					{/* <div className="flex items-center gap-2 flex-none w-full md:w-80">
						<select
							className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 cursor-not-allowed"
							value=""
							disabled
						>
							<option value="">Bukti Relevan</option>
							<option value="dokumen1">Dokumen 1</option>
							<option value="dokumen2">Dokumen 2</option>
							<option value="dokumen3">Dokumen 3</option>
						</select>
					</div> */}
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
              {filteredData?.map((item, i) => {
                const elementNumber = i + 1;
                const pencapaianStatus = getPencapaianStatus(item.result);

                return (
                  <React.Fragment key={item.id}>
                    <tr className="border-t border-gray-300">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 align-top">
                        <div className="flex items-start gap-2">
                          <span className="font-medium">{elementNumber}</span>
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
                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm opacity-60 cursor-not-allowed ${
                              pencapaianStatus === "kompeten"
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
                              className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                                pencapaianStatus === "kompeten"
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
                            className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm opacity-60 cursor-not-allowed ${
                              pencapaianStatus === "belum"
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
                              className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                                pencapaianStatus === "belum"
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

                      {/* Bukti relevan (Readonly) */}
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full px-3 py-2 bg-[#DADADA33] rounded-md text-left text-sm cursor-pointer"
                            >
                              Bukti Relevan
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-0 opacity-60 cursor-not-allowed">
                            <Command>
                              <CommandInput placeholder="Cari Bukti Relevan" />
                              <CommandEmpty>
                                Bukti Relevan tidak ditemukan.
                              </CommandEmpty>
                              <CommandGroup>
                                {evidenceOptions.map((opt) => {
                                  const selected = item.result?.evidences.some(
                                    (evidence) => evidence.evidence === opt
                                  );
                                  console.log(item.result);
                                  return (
                                    <CommandItem key={opt} value={opt}>
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
  );
}
