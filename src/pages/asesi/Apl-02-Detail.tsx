import React, { useEffect, useState } from "react";
import { Monitor, ChevronLeft, Search, Check } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link, useNavigate, useParams } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import routes from "@/routes/paths";
import { useAssessmentParams } from "@/components/IsApproveApl01";
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
	is_competent: boolean;
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

	useEffect(() => {
		fetchElements();
	}, [user]);

	useEffect(() => {
		if (elements.length < 0) {
			navigate(
				routes.asesi.assessment.apl02(id_assessment, id_asesor)
			);
		}
	}, [elements]);

	const handleProofSelection = (criteriaId: number, value: string) => {
		setSelectedProof((prev) => ({
			...prev,
			[criteriaId]: value,
		}));
	};

	const handlePencapaianChange = (id: number, value: string) => {
		setPencapaian((prev) => ({
			...prev,
			[id]: value,
		}));
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

	const filteredData = elements.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.details.some((detail) =>
				detail.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		return matchesSearch;
	});

	const fetchElements = async () => {
		try {
			const response = await api.get(
				`/assessments/apl-02/units/${id_result}/elements/${id_unit}`
			);

			if (response.data.success) {
				setElements(response.data.data);
			}
		} catch (error: any) {
			console.log("Error fetching elements:", error);
		}
	};

	const onSubmit = async (data: FormValues) => {
		const payload = {
			result_id: id_result,
			elements: Object.entries(data.elements).map(([elementId, val]) => ({
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
		} catch (error) {
			console.error("Save failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mx-auto">
					<div className="bg-white rounded-lg shadow-sm mb-8">
						<NavbarAsesi
							title="Detail"
							icon={
								<Link
									to={paths.asesi.assessment.apl02(
										id_assessment,
										id_asesor
									)}
									className="text-gray-500 hover:text-gray-600"
								>
									<ChevronLeft size={20} />
								</Link>
							}
						/>
					</div>

					<div className="bg-white rounded-lg shadow-sm m-10 px-5 py-7">
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
										{ value: "belum", label: "Belum Kompeten" },
									].map((opt) => (
										<label
											key={opt.value}
											className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition ${filterKompeten === opt.value ? "bg-[#E77D3533]" : ""
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
												className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${filterKompeten === opt.value
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
									{filteredData.map((item) => (
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
														<>
															{/* Kriteria */}
															<div className="flex items-start gap-2">
																<span className="font-medium text-[#00809D] min-w-8">
																	{criteria.id}
																</span>
																<span>{criteria.description}</span>
															</div>
														</>
													))}
												</td>

												{/* Pencapaian */}
												<td className="px-2 sm:px-4 py-2 sm:py-3">
													<Controller
														name={`elements.${item.id}.is_competent`}
														control={control}
														defaultValue={false}
														render={({ field }) => {
															const selected = field.value; // boolean
															return (
																<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
																	{/* Kompeten */}
																	<label
																		className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm ${selected === true ? "bg-[#E77D3533]" : ""
																			}`}
																	>
																		<input
																			type="radio"
																			value="true"
																			checked={selected === true}
																			onChange={() => field.onChange(true)}
																			className="hidden"
																		/>
																		<span
																			className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${selected === true
																					? "bg-[#E77D35] border-[#E77D35]"
																					: "border-[#E77D35]"
																				}`}
																		>
																			{selected === true && (
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
																				selected === true
																					? "text-gray-900"
																					: "text-gray-500"
																			}
																		>
																			Kompeten
																		</span>
																	</label>

																	{/* Belum Kompeten */}
																	<label
																		className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-sm ${selected === false ? "bg-[#E77D3533]" : ""
																			}`}
																	>
																		<input
																			type="radio"
																			value="false"
																			checked={selected === false}
																			onChange={() => field.onChange(false)}
																			className="hidden"
																		/>
																		<span
																			className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${selected === false
																					? "bg-[#E77D35] border-[#E77D35]"
																					: "border-[#E77D35]"
																				}`}
																		>
																			{selected === false && (
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
																				selected === false
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
																						console.log(v);
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
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="relative">
						<motion.button
							type="submit"
							className="absolute right-10 bg-[#E77D35] hover:bg-[#E77D35] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							initial={{ opacity: 0, y: 20 }} // mulai transparan & agak ke bawah
							animate={{ opacity: 1, y: 0 }} // animasi ke normal posisi
							transition={{ duration: 0.2, ease: "easeOut" }} // durasi & easing
						>
							Save
						</motion.button>
					</div>
				</div>
			</form>
		</div>
	);
}
