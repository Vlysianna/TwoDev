// TambahMUK.tsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import mammoth from "mammoth";
import { ChevronDown, Filter, Upload } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import {
	convertSkemaToPostPayload,
	type Element,
	type SkemaType,
	type Unit,
} from "@/lib/types";
import UnitField from "@/components/UnitField";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/helper/axios";

const defaultValues: SkemaType = {
	jurusan: "",
	pilihSkema: "",
	pilihOkupasi: "",
	nomorSKM: "",
	unit: [
		{
			kode: "",
			judul: "",
			elemen: [{ id: "", text: "", item: [{ id: "", text: "" }] }],
		},
	],
};

const TambahMUK: React.FC = () => {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<SkemaType>({ defaultValues });

	const [school, setSchool] = useState("LSPSMK24");
	const [year, setYear] = useState(new Date().getFullYear());

	const [openValue, setOpenValue] = useState<string | undefined>(undefined);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "unit",
	});

	const pilihSkema = watch("pilihSkema");
	const pilihOkupasi = watch("pilihOkupasi");
	const currentNomorSKM = watch("nomorSKM");

	useEffect(() => {
		const nomorSKM = `SKM.${pilihSkema}.${pilihOkupasi}/${school}/${year}`;
		setValue("nomorSKM", nomorSKM);
	}, [pilihSkema, pilihOkupasi, school, year, setValue]);

	useEffect(() => {
		console.log(openValue);
	}, [openValue]);

	async function handleUploadDocx(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const { SkemaType: parsedData, year, school } = parseHTMLToSchema(html);

			setYear(Number(year));
			setSchool(school);
			console.log(school);
			parsedData.nomorSKM = currentNomorSKM;

			// reset form tapi biarkan pilihSkema/pilihOkupasi kosong agar user pilih manual
			reset({
				...defaultValues,
				...parsedData,
				pilihSkema: "",
				pilihOkupasi: "",
			});
			setOpenValue("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
	}

	async function handleUploadIA() {}
	async function handleUploadAK() {}
	async function handleUploadSoal() {}

	const onSubmit = (data: SkemaType) => {
		// di sini kirim ke API
		console.log("Submit data:", data);

		const skema = convertSkemaToPostPayload(data, Number(data.pilihOkupasi));

		console.log(skema);

		api
			.post("/assessment/apl2/create-assessment", skema)
			.then((res) => console.log(res.data));
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
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
													<option value="skema1">Skema 1</option>
													<option value="skema2">Skema 2</option>
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
												Pilih Cluster
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
													<option value="1">Okupasi 1</option>
													<option value="2">Okupasi 2</option>
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
												Nomor SKM (Otomatis terisi)
											</label>
											<input
												{...register("nomorSKM")}
												type="text"
												readOnly
												placeholder={`SKM.${pilihSkema}.${pilihOkupasi}/${school}/${year}`}
												className="w-full px-3 py-2 border rounded-md border-gray-300"
											/>
										</div>
									</div>
								</div>

								{/* NOTE: Judul & Nomor Skema TIDAK DITAMPILKAN sesuai request */}

								{/* APL 02 */}
								<div>
									<div>
										<div className="flex items-center justify-between mb-4">
											<h2 className="text-lg font-semibold text-gray-900">
												Upload File APL 02
											</h2>
										</div>

										{/* Import .docx */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Import dari .docx (opsional)
											</label>
											<label className="inline-flex items-center gap-2 bg-[#E77D35] text-white px-4 py-2 rounded-md cursor-pointer">
												<Upload size={16} />
												Pilih File .docx
												<input
													type="file"
													accept=".docx"
													onChange={handleUploadDocx}
													className="hidden"
												/>
											</label>
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
										value={openValue}
										onValueChange={setOpenValue}
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
															{fields.map((_field, unitIndex) => (
																<div key={_field.id}>
																	<UnitField
																		unitFields={fields}
																		useForm={{ control, register }}
																		removeUnit={remove}
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
																	append({
																		kode: "",
																		judul: "",
																		elemen: [
																			{
																				id: "",
																				text: "",
																				item: [{ id: "", text: "" }],
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
								</div>

								<div>
									<button
										type="submit"
										className="px-10 bg-[#E77D35] text-white py-3 rounded-md hover:opacity-95 transition-colors"
									>
										Tambah APL
									</button>
								</div>
							</form>

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Upload File AK */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-2">
									Upload File AK
								</h2>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									File AK 01
								</label>
								<div className="flex items-center gap-2 mb-4">
									<label className="inline-flex items-center gap-2 bg-[#E77D35] text-white px-4 py-2 rounded-md cursor-pointer">
										Pilih File
										<input
											type="file"
											accept=".docx"
											onChange={handleUploadAK}
											className="hidden"
										/>
									</label>
									<span className="flex-1 bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-md">
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

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Upload File IA */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-2">
									Upload File IA
								</h2>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									File IA 01
								</label>
								<div className="flex items-center gap-2 mb-4">
									<label className="inline-flex items-center gap-2 bg-[#E77D35] text-white px-4 py-2 rounded-md cursor-pointer">
										Pilih File
										<input
											type="file"
											accept=".docx"
											onChange={handleUploadIA}
											className="hidden"
										/>
									</label>
									<span className="flex-1 bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-md">
										Convert file unit dari word
									</span>
								</div>
								<div className="flex items-center gap-2">
									<button className="px-6 py-2 bg-[#E77D35] text-white rounded-md hover:opacity-95">
										Tambah IA
									</button>
									<button className="px-6 py-2 border border-[#E77D35] text-[#E77D35] rounded-md hover:bg-orange-50">
										Hapus IA
									</button>
								</div>
							</div>

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Upload Soal */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-2">
									Upload Soal
								</h2>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									File Soal
								</label>
								<div className="flex items-center gap-2 mb-4">
									<label className="inline-flex items-center gap-2 bg-[#E77D35] text-white px-4 py-2 rounded-md cursor-pointer">
										Pilih File
										<input
											type="file"
											accept=".docx,.pdf"
											onChange={handleUploadSoal}
											className="hidden"
										/>
									</label>
									<span className="flex-1 bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-md">
										Pilih file soal
									</span>
								</div>
							</div>

							{/* Submit */}
							<div>
								<button
									type="submit"
									className="w-full bg-[#E77D35] text-white py-3 rounded-md font-semibold hover:opacity-95 transition-colors"
								>
									Simpan MUK
								</button>
							</div>
						</div>
					</div>
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

export function parseHTMLToSchema(html: string): {
	SkemaType: SkemaType;
	year: string;
	school: string;
} {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	console.log(doc);
	const tables = Array.from(doc.querySelectorAll("table"));
	console.log(tables);
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	let jurusan = "";
	let judulSkema = "";
	let year = "";
	let school = "";
	const units: Unit[] = [];

	let currentUnit: Unit | null = null;
	let currentElemen: Element | null = null;
	let elemenCounter = 1;
	let itemCounter = 1;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));

		for (const row of rows) {
			const text = row.innerText.trim();
			const cells = Array.from(row.querySelectorAll("td")).map((td) =>
				td.innerText.trim()
			);

			if (text.includes("Nomor:")) {
				year = cells[2].trim().split("/").at(-1) || "";
				school = cells[2].trim().split("/").at(-2) || "";
				continue;
			}

			if (text.includes("Kode Unit")) {
				const kodeMatch = text.match(/Kode Unit\s*:?\s*(.+)/);
				const kode =
					kodeMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				currentUnit = {
					kode,
					judul: "",
					elemen: [],
				};
				continue;
			}

			if (text.includes("Judul Unit")) {
				const judulMatch = text.match(/Judul Unit\s*:?\s*(.+)/);
				const judul =
					judulMatch?.[1]?.trim() || cells[1]?.replace(":", "").trim() || "";
				if (currentUnit) {
					currentUnit.judul = judul;
					units.push(currentUnit);
					currentUnit = null;
				}
				continue;
			}

			if (text.match(/Elemen\s*\d+\s*:/)) {
				const match = text.match(/Elemen\s*(\d+)\s*:\s*(.*)/);
				const id = match?.[1] || `${elemenCounter}`;
				const elemenText = match?.[2]?.trim() || `Elemen ${elemenCounter}`;
				const ol = row.querySelector("ol");
				const items = ol
					? Array.from(ol.querySelectorAll("li")).map((li, i) => ({
							id: `${elemenCounter}.${i + 1}`,
							text: li.textContent?.trim() || "",
					  }))
					: [];

				currentElemen = {
					id,
					text: elemenText,
					item: items,
				};
				if (units.length > 0) {
					units[units.length - 1].elemen.push(currentElemen);
				}
				elemenCounter++;
				itemCounter = 1;
				continue;
			}
		}
	}

	const filteredUnits = units.filter((unit) => unit.elemen.length > 0);

	return {
		SkemaType: {
			jurusan,
			pilihSkema: judulSkema,
			pilihOkupasi: "",
			nomorSKM: "",
			unit: filteredUnits,
		},
		year: year,
		school: school,
	};
}

export default TambahMUK;
