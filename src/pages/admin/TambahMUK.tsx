// TambahMUK.tsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import mammoth from "mammoth";
import { ChevronDown, Filter } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import {
	convertSkemaToPostPayload,
	type ElementAPL02,
	type ElementIA01,
	type ItemElementAPL02,
	type SkemaType,
	type UnitAPL02,
	type UnitIA01,
} from "@/lib/types";
import UnitFieldAPL02 from "@/components/apl02/UnitField";
import UnitFieldIA01 from "@/components/ia01/UnitField";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/helper/axios";
import { useNavigate } from "react-router-dom";

const defaultValues: SkemaType = {
	jurusan: "",
	pilihSkema: "",
	pilihOkupasi: "",
	code: "",
	uc_apl02s: [],
	groups_ia: {
		name: "",
		scenario: "",
		duration: 0,
		units: [],
		tools: [],
		qa_ia03: [],
	},
};

const TambahMUK: React.FC = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		reset,
		formState: { errors },
		getValues,
	} = useForm<SkemaType, UnitIA01[]>({ defaultValues });

	const [school, setSchool] = useState("LSPSMK24");
	const [year, setYear] = useState(new Date().getFullYear());
	const [valueOccupation, setValueOccupation] = useState("");

	const [openValueAPL02, setOpenValueAPL02] = useState<string | undefined>(
		undefined
	);
	const [openValueIA01, setOpenValueIA01] = useState<string | undefined>(
		undefined
	);
	const [occupations, setOccupations] = useState<
		{
			id: number;
			name: string;
			scheme?: { id: number; code: string; name: string };
		}[]
	>([]);
	const [schemes, setSchemes] = useState<
		{ id: number; code: string; name: string }[]
	>([]);
	const [submitting, setSubmitting] = useState(false);

	const {
		fields: fieldsAPL02,
		append: appendAPL02,
		remove: removeAPL02,
	} = useFieldArray({
		control,
		name: "uc_apl02s",
	});
	const {
		fields: fieldsIA01,
		append: appendIA01,
		remove: removeIA01,
	} = useFieldArray({
		control,
		name: "groups_ia.units",
	});

	const pilihSkema = watch("pilihSkema");
	// const pilihOkupasi = watch("pilihOkupasi");
	const currentNomorSKM = watch("code");

	useEffect(() => {
		const code = `SKM.${
			schemes.find((s) => s.id === Number(pilihSkema))?.code ?? ""
		}.${valueOccupation}/${school}/${year}`;
		setValue("code", code);
	}, [pilihSkema, valueOccupation, school, year, setValue]);

	useEffect(() => {
		// fetch occupations and schemes for selects
		api
			.get("/occupations")
			.then((res) => setOccupations(res.data.data || []))
			.catch(() => setOccupations([]));

		api
			.get("/schemes")
			.then((res) => setSchemes(res.data.data || []))
			.catch(() => setSchemes([]));
	}, []);

	// filter occupations by selected scheme (pilihSkema holds scheme id)
	const [filteredOccupations, setFilteredOccupations] = useState<
		{
			id: number;
			name: string;
			scheme?: { id: number; code: string; name: string };
		}[]
	>([]);

	useEffect(() => {
		if (pilihSkema) {
			setFilteredOccupations(
				occupations.filter(
					(o) => o.scheme && Number(pilihSkema) === Number(o.scheme.id)
				)
			);
		} else {
			setFilteredOccupations(occupations);
		}
	}, [pilihSkema, occupations]);

	async function handleUploadAPL02(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const {
				SkemaType: parsedData,
				year,
				school,
				occupation,
			} = parseHTMLToAPL02(html);
			// console.log(parsedData);

			setYear(Number(year));
			setSchool(school);
			// console.log(school);
			setValueOccupation(occupation);
			parsedData.code = currentNomorSKM;

			const currentValues = getValues();

			// reset form tapi biarkan pilihSkema/pilihOkupasi kosong agar user pilih manual
			reset({
				...currentValues,
				...parsedData,
				pilihSkema: "",
				pilihOkupasi: "",
			});
			setOpenValueAPL02("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
	}

	async function handleUploadIA01(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToIA01(html);

			// console.log(parsedData);

			const currentValues = getValues();

			reset({
				...currentValues,
				groups_ia: {
					units: parsedData,
				},
			});
			setOpenValueIA01("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
	}

	async function handleUploadAK() {}
	async function handleUploadSoal() {}

	const onSubmit = async (data: SkemaType) => {
		// prepare payload
		const occupationId = Number(data.pilihOkupasi) || undefined;
		if (!occupationId) {
			alert("Pilih Okupasi terlebih dahulu");
			return;
		}

		const skema = convertSkemaToPostPayload(data, occupationId);

		try {
			setSubmitting(true);
			// POST to /assessments/create (app mounts assessmentRoutes on /api/assessments)
			const res = await api.post("/assessments/create", skema);
			if (res?.data?.success) {
				alert("APL berhasil dibuat");
				// navigate to assessments list or refresh
				navigate("/admin/assessments");
			} else {
				alert("Gagal membuat APL");
			}
		} catch (err: unknown) {
			console.error(err);
			// try to read axios response message if present
			// @ts-expect-error - err may come from axios with response structure
			const message = err?.response?.data?.message || "Terjadi kesalahan";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />

				<main className="flex-1 overflow-auto p-6">
					{/* Breadcrumb */}
					<div className="mb-4 text-sm text-gray-500">
						Kelola Database &rarr; Tambah MUK
					</div>

					{/* Card container mirip contoh KelolaMUK */}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 space-y-6">
							{/* Header */}
							<div>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<h1 className="text-2xl font-semibold text-gray-900">
											Tambah Kelengkapan MUK
										</h1>
										<p className="text-sm text-gray-500 mt-1">
											Isi data unit dan elemen, atau import dari .docx
										</p>
									</div>

									<div className="flex gap-3">
										<button
											type="button"
											onClick={() => console.log("filter")}
											className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
										>
											<Filter size={16} className="text-[#E77D35]" /> Filter
										</button>
										<button
											type="button"
											onClick={() => console.log("export")}
											className="bg-[#E77D35] text-white rounded-md text-sm px-4 py-2 hover:bg-orange-600 transition-colors"
										>
											Export ke Excel
										</button>
									</div>
								</div>
							</div>

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Body */}
							<div className="space-y-6">
								{/* Skema & Okupasi */}
								<div>
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Skema
									</h2>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Pilih Skema
											</label>

											<div className="relative w-full">
												<select
													{...register("pilihSkema", {
														required: "Pilih Skema wajib diisi",
													})}
													className={`w-full px-3 py-2 border rounded-md appearance-none ${
														errors.pilihSkema
															? "border-red-500"
															: "border-gray-300"
													}`}
												>
													<option value="">Pilih Skema</option>
													{schemes.map((s) => (
														<option key={s.id} value={s.id}>
															{s.code} - {s.name}
														</option>
													))}
												</select>
												<ChevronDown
													size={18}
													className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
												/>
											</div>
											{errors.pilihSkema && (
												<p className="text-xs text-red-500 mt-1">
													{errors.pilihSkema.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Pilih Okupasi
											</label>
											<div className="relative w-full">
												<select
													{...register("pilihOkupasi", {
														required: "Pilih Okupasi wajib diisi",
													})}
													className={`w-full px-3 py-2 border rounded-md appearance-none ${
														errors.pilihOkupasi
															? "border-red-500"
															: "border-gray-300"
													}`}
												>
													<option value="">Pilih Okupasi</option>
													{filteredOccupations.map((o) => (
														<option key={o.id} value={o.id}>
															{o.name}
														</option>
													))}
												</select>
												<ChevronDown
													size={18}
													className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
												/>
											</div>
											{errors.pilihOkupasi && (
												<p className="text-xs text-red-500 mt-1">
													{errors.pilihOkupasi.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Nomor SKM
											</label>
											<input
												{...register("code")}
												type="text"
												readOnly
												placeholder={`SKM.${
													schemes.find((s) => s.id === Number(pilihSkema))
														?.code ?? ""
												}.${valueOccupation}/${school}/${year}`}
												className="w-full px-3 py-2 border rounded-md border-gray-300"
											/>
										</div>
									</div>
								</div>

								{/* NOTE: Judul & Nomor Skema TIDAK DITAMPILKAN sesuai request */}

								{/* APL 02 */}
								<div className="mb-6">
									<div>
										<div className="flex items-center justify-between mb-4">
											<h2 className="text-lg font-semibold text-gray-900">
												Upload File APL 02
											</h2>
										</div>

										{/* Import .docx */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												File APL 02
											</label>

											<div className="flex mb-4 items-stretch">
												<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
													Pilih File
													<input
														type="file"
														accept=".docx"
														onChange={handleUploadAPL02}
														className="hidden"
													/>
												</label>
												<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-8">
													Convert file unit dari word
												</span>
											</div>

											<p className="text-xs text-gray-500 mt-2">
												File harus berisi tabel unit + elemen agar bisa diparse
												otomatis.
											</p>
										</div>
									</div>

									{/* Body */}
									<Accordion
										type="single"
										collapsible
										value={openValueAPL02}
										onValueChange={setOpenValueAPL02}
									>
										<AccordionItem value="item-1">
											<AccordionTrigger>
												<div className="flex items-center justify-between">
													<div>
														<h2 className="text-lg font-semibold text-gray-900">
															Form Units
														</h2>

														<p className="text-sm text-gray-500 mt-1">
															Klik di sini untuk membuka/mentutup
														</p>
													</div>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div
													className="p-6 border border-gray-300 rounded-md space-y-6 overflow-auto flex-1"
													style={{ maxHeight: "calc(100vh - 180px)" }}
												>
													{/* Units */}
													<div>
														<div className="space-y-4">
															{fieldsAPL02.map((_field, unitIndex) => (
																<div key={_field.id}>
																	<UnitFieldAPL02
																		unitFields={fieldsAPL02}
																		useForm={{ control, register }}
																		removeUnit={removeAPL02}
																		unitIndex={unitIndex}
																		key={_field.id}
																	/>
																</div>
															))}
														</div>

														<div className="mt-4">
															<button
																type="button"
																onClick={() =>
																	appendAPL02({
																		unit_code: "",
																		title: "",
																		elements: [
																			{
																				id: "",
																				title: "",
																				details: [{ id: "", description: "" }],
																			},
																		],
																	})
																}
																className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
															>
																Tambah Unit
															</button>
														</div>
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>

									<div>
										<button
											type="submit"
											disabled={submitting}
											className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:opacity-95"
										>
											{submitting ? "Menyimpan..." : "Tambah APL"}
										</button>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload File AK */}
								<div className="mb-6">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload File AK
									</h2>
									<div className="space-y-4">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											File AK
										</label>
										<div className="flex mb-4 items-stretch">
											<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
												Pilih File
												<input
													type="file"
													accept=".docx"
													onChange={handleUploadAK}
													className="hidden"
												/>
											</label>
											<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-8">
												Convert file unit dari word
											</span>
										</div>
										<div className="flex items-center gap-2">
											<button className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:opacity-95">
												Tambah AK
											</button>
											<button className="px-6 py-2 border border-[#E77D35] text-[#E77D35] rounded-md hover:bg-orange-50">
												Hapus AK
											</button>
										</div>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload File IA */}
								<div className="mb-6">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload File IA 01
									</h2>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											File IA 01
										</label>
										<div className="flex mb-4 items-stretch">
											<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
												Pilih File
												<input
													type="file"
													accept=".docx"
													onChange={handleUploadIA01}
													className="hidden"
												/>
											</label>
											<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-8">
												Convert file unit dari word
											</span>
										</div>
										{/* Body */}
										<Accordion
											type="single"
											collapsible
											value={openValueIA01}
											onValueChange={setOpenValueIA01}
										>
											<AccordionItem value="item-1">
												<AccordionTrigger>
													<div className="flex items-center justify-between">
														<div>
															<h2 className="text-lg font-semibold text-gray-900">
																Form Units
															</h2>

															<p className="text-sm text-gray-500 mt-1">
																Klik di sini untuk membuka/mentutup
															</p>
														</div>
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<div
														className="p-6 border border-gray-300 rounded-md space-y-6 overflow-auto flex-1"
														style={{ maxHeight: "calc(100vh - 180px)" }}
													>
														{/* Units */}
														<div>
															<div className="space-y-4">
																{fieldsIA01.map((_field, unitIndex) => (
																	<div key={_field.id}>
																		<UnitFieldIA01
																			unitFields={fieldsIA01}
																			useForm={{ control, register }}
																			removeUnit={removeIA01}
																			unitIndex={unitIndex}
																			key={_field.id}
																		/>
																	</div>
																))}
															</div>

															<div className="mt-4">
																<button
																	type="button"
																	onClick={() =>
																		appendIA01({
																			unit_code: "",
																			title: "",
																			elements: [
																				{
																					id: "",
																					title: "",
																					details: [
																						{
																							id: "",
																							description: "",
																							benchmark: "",
																						},
																					],
																				},
																			],
																		})
																	}
																	className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
																>
																	Tambah Unit
																</button>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
										<div className="flex items-center gap-2">
											<button className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:opacity-95">
												Tambah IA
											</button>
											<button className="px-6 py-2 border border-[#E77D35] text-[#E77D35] rounded-md hover:bg-orange-50">
												Hapus IA
											</button>
										</div>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload Soal */}
								<div className="mb-6">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload IA 05
									</h2>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										File IA 05
									</label>
									<div className="flex mb-4 items-stretch">
										<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
											Pilih File
											<input
												type="file"
												accept=".docx,.pdf"
												onChange={handleUploadSoal}
												className="hidden"
											/>
										</label>
										<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-10">
											Pilih file soal
										</span>
									</div>
								</div>

								{/* Submit */}
								<div>
									<button
										type="submit"
										disabled={submitting}
										className="w-full bg-[#E77D35] text-white py-3 rounded-md font-semibold hover:opacity-95 transition-colors disabled:opacity-60"
									>
										{submitting ? "Menyimpan..." : "Simpan MUK"}
									</button>
								</div>
							</div>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

async function extractDocxText(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const result = await mammoth.convertToHtml({ arrayBuffer });
	return result.value;
}

export function parseHTMLToAPL02(html: string): {
	SkemaType: SkemaType;
	year: string;
	school: string;
	occupation: string;
} {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	// console.log(doc);
	const tables = Array.from(doc.querySelectorAll("table"));
	// console.log(tables);
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	const jurusan = "";
	const judulSkema = "";
	let year = "";
	let school = "";
	let occupation = "";
	const units: UnitAPL02[] = [];

	let currentUnit: UnitAPL02 | null = null;
	let currentElemen: ElementAPL02 | null = null;
	let elemenCounter = 1;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));

		// console.log(rows);

		for (const row of rows) {
			const text = row.innerText;
			const cells = Array.from(row.querySelectorAll("td")).map((td) =>
				td.innerText.trim()
			);
			// console.log(text);

			if (text.includes("Nomor")) {
				year = cells[2].trim().split("/").at(-1) || "";
				school = cells[2].trim().split("/").at(-2) || "";
				console.log(cells[2].trim().split("/"));
				occupation = cells[2].trim().split("/").at(0)?.split(".").at(-1) || "";
				continue;
			}

			if (text.includes("Kode Unit")) {
				const kodeMatch = text.match(/Kode Unit\s*:?\s*(.+)/);
				const kode =
					kodeMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				currentUnit = {
					unit_code: kode,
					title: "",
					elements: [],
				};
				continue;
			}

			if (text.includes("Judul Unit")) {
				const judulMatch = text.match(/Judul Unit\s*:?\s*(.+)/);
				const judul =
					judulMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				if (currentUnit) {
					currentUnit.title = judul;
					units.push(currentUnit);
					currentUnit = null;
				}
				continue;
			}

			if (text.match(/Elemen/)) {
				const id = `${elemenCounter}`;

				let elementText = "";
				const elemenLi = Array.from(row.querySelectorAll("ol li")).find((li) =>
					li.textContent?.includes("Elemen")
				);
				if (elemenLi) {
					elementText =
						elemenLi.textContent
							?.replace("Elemen", "")
							.replace(":", "")
							.trim() || "";
				}
				console.log(elementText);

				const items: ItemElementAPL02[] = [];
				const itemList = row.querySelectorAll("ul li ol li");
				itemList.forEach((li, i) => {
					if (li.textContent) {
						items.push({
							id: `${elemenCounter}.${i + 1}`,
							description: li.textContent.trim(),
						});
					}
				});

				currentElemen = {
					id,
					title: elementText,
					details: items,
				};
				if (units.length > 0) {
					units[units.length - 1].elements.push(currentElemen);
				}
				// console.log(units);
				elemenCounter++;
				continue;
			}
		}
	}

	const filteredUnits = units.filter((unit) => unit.elements.length > 0);

	return {
		SkemaType: {
			jurusan,
			pilihSkema: judulSkema,
			pilihOkupasi: "",
			code: "",
			uc_apl02s: filteredUnits,
			groups_ia: {
				name: "",
				scenario: "",
				duration: 0,
				units: [],
				tools: [],
				qa_ia03: [],
			},
		},
		year: year,
		school: school,
		occupation: occupation,
	};
}

function parseHTMLToIA01(html: string): UnitIA01[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const tables = Array.from(doc.querySelectorAll("table"));
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	const units: UnitIA01[] = [];
	let currentUnit: UnitIA01 | null = null;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));

		// --- cek tabel unit kompetensi ---
		if (rows.some((r) => r.innerText.includes("Unit Kompetensi"))) {
			let unit_code = "";
			let title = "";

			for (const row of rows) {
				const cells = Array.from(row.querySelectorAll("td")).map((td) =>
					td.innerText.trim()
				);

				if (cells.join(" ").includes("Kode Unit")) {
					unit_code = cells[cells.length - 1]; // ambil kolom terakhir
				}
				if (cells.join(" ").includes("Judul Unit")) {
					title = cells[cells.length - 1];
				}
			}

			if (unit_code && title) {
				currentUnit = { unit_code, title, elements: [] };
				units.push(currentUnit);
			}
		}

		// --- cek tabel elemen & kriterianya ---
		if (
			rows.some(
				(r) =>
					r.innerText.includes("Elemen") && r.innerText.includes("Kriteria")
			)
		) {
			if (!currentUnit) {
				throw new Error("Tabel elemen muncul sebelum tabel unit.");
			}

			let currentElemen: ElementIA01 | null = null;

			let benchmark = "";

			for (const row of rows.slice(2)) {
				// skip header 2 baris
				const cells = Array.from(row.querySelectorAll("td")).map((td) =>
					td.innerText.trim()
				);

				if (cells.length === 0) continue;

				if (cells[0] && !isNaN(Number(cells[0]))) {
					const id = cells[0];
					const title = cells[1];
					const description = cells[2];
					benchmark = cells[3];

					currentElemen = { id, title, details: [] };
					if (description) {
						// console.log(cells);

						currentElemen?.details.push({
							id: `${id}.${currentElemen.details.length + 1}`,
							description: description,
							benchmark: benchmark,
						});
					}

					currentUnit.elements.push(currentElemen);
				} else if (currentElemen) {
					// baris lanjutan (hanya kriteria tambahan)
					const description = cells[0];
					benchmark = cells[1] ? cells[1] : benchmark;
					if (description) {
						const nextDetailId = `${currentElemen.id}.${
							currentElemen.details.length + 1
						}`;
						// console.log(cells);

						currentElemen.details.push({
							id: nextDetailId,
							description: description,
							benchmark: benchmark,
						});
					}
				}
			}
		}
	}

	return units;
}

export default TambahMUK;
