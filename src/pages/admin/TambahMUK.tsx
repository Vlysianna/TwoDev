// TambahMUK.tsx
import { useEffect, useState } from "react";
import {
	useForm,
	useFieldArray,
	type FieldArrayWithId,
	type UseFormRegister,
	type UseFieldArrayRemove,
	type Control,
	Controller,
} from "react-hook-form";
import mammoth from "mammoth";
import { ChevronDown, Filter } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import {
	type ElementAPL02,
	type ElementIA01,
	type IA01Group,
	type IA02Group,
	type IA03Group,
	type IA03Question,
	type IA05Question,
	type ItemElementAPL02,
	type SkemaType,
	type UnitAPL02,
	type UnitIA01,
	type UnitIA02,
	type UnitIA03,
} from "@/lib/types";
import UnitFieldAPL02 from "@/components/apl02/UnitField";
import UnitFieldIA01 from "@/components/ia01/UnitField";
import UnitFieldIA02 from "@/components/ia02/UnitField";
import UnitFieldIA03 from "@/components/ia03/UnitField";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/helper/axios";
import { useNavigate } from "react-router-dom";

const defaultValues: SkemaType = {
	occupation_id: 0,
	code: "",
	uc_apl02s: [],
	groups_ia01: [],
	groups_ia02: [],
	groups_ia03: [],
	ia05_questions: [],
};

let currentSchemaNumber: string | null = null;

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
	} = useForm<SkemaType>({ defaultValues });

	const [openValueAPL02, setOpenValueAPL02] = useState<string | undefined>(
		undefined
	);
	const [openValueIA01, setOpenValueIA01] = useState<string | undefined>(
		undefined
	);
	const [openValueIA02, setOpenValueIA02] = useState<string | undefined>(
		undefined
	);
	const [openValueIA03, setOpenValueIA03] = useState<string | undefined>(
		undefined
	);
	const [openValueIA05, setOpenValueIA05] = useState<string | undefined>(
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
		fields: fieldsGroupIA01,
		append: appendGruopIA01,
		remove: removeGroupIA01,
	} = useFieldArray({
		control,
		name: "groups_ia01",
	});

	const {
		fields: fieldsGroupIA02,
		append: appendGruopIA02,
		remove: removeGroupIA02,
	} = useFieldArray({
		control,
		name: "groups_ia02",
	});

	const {
		fields: fieldsGroupIA03,
		append: appendGruopIA03,
		remove: removeGroupIA03,
	} = useFieldArray({
		control,
		name: "groups_ia03",
	});

	const {
		fields: questionFields,
		append: appendQuestion,
		remove: removeQuestion,
	} = useFieldArray({
		control,
		name: "ia05_questions",
	});

	// const ia = watch("groups_ia03");

	// useEffect(() => {
	// 	console.log(ia);
	// }, [ia]);

	// const pilihSkema = watch("pilihSkema");
	// const pilihOkupasi = watch("pilihOkupasi");
	// const currentNomorSKM = watch("code");

	// useEffect(() => {
	// 	const code = `SKM.${
	// 		schemes.find((s) => s.id === Number(pilihSkema))?.code ?? ""
	// 	}.${valueOccupation}/${school}/${year}`;
	// 	setValue("code", code);
	// }, [pilihSkema, valueOccupation, school, year, setValue]);

	useEffect(() => {
		setValue("code", currentSchemaNumber ?? "");
	}, [currentSchemaNumber]);

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

	// useEffect(() => {
	// 	if (pilihSkema) {
	// 		setFilteredOccupations(
	// 			occupations.filter(
	// 				(o) => o.scheme && Number(pilihSkema) === Number(o.scheme.id)
	// 			)
	// 		);
	// 	} else {
	// 		setFilteredOccupations(occupations);
	// 	}
	// }, [pilihSkema, occupations]);

	async function handleUploadAPL02(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToAPL02(html);
			// console.log(parsedData);

			const currentValues = getValues();

			// reset form tapi biarkan pilihSkema/pilihOkupasi kosong agar user pilih manual
			reset({
				...currentValues,
				uc_apl02s: parsedData,
			});
			setOpenValueAPL02("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
		e.target.value = "";
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
				groups_ia01: parsedData,
			});
			setOpenValueIA01("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
		e.target.value = "";
	}

	async function handleUploadIA02(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToIA02(html);

			// console.log(parsedData);

			const currentValues = getValues();

			reset({
				...currentValues,
				groups_ia02: parsedData,
			});
			setOpenValueIA02("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
		e.target.value = "";
	}

	async function handleUploadIA03(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToIA03(html);

			// console.log(parsedData);

			const currentValues = getValues();

			reset({
				...currentValues,
				groups_ia03: parsedData,
			});
			setOpenValueIA03("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar." +
					err
			);
		}
		e.target.value = "";
	}

	async function handleUploadIA05A(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToIA05A(html);

			console.log(parsedData);

			const currentValues = getValues();

			reset({
				...currentValues,
				ia05_questions: parsedData,
			});
			setOpenValueIA05("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
		e.target.value = "";
	}

	async function handleUploadIA05B(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const html = await extractDocxText(file);
			const parsedData = parseHTMLToIA05B(html);

			// console.log(parsedData);

			const currentValues = getValues();

			if (currentValues.ia05_questions) {
				const mergedQuestions = currentValues.ia05_questions.map((q) => {
					const correctAnswer = parsedData[q.order];
					if (correctAnswer) {
						q.options.forEach((o) => {
							o.is_answer = o.option.trim() === correctAnswer.trim();
						});
					}
					return q;
				});

				// console.log(mergedQuestions);

				reset({
					...currentValues,
					ia05_questions: mergedQuestions,
				});
			}
			setOpenValueIA05("item-1");
		} catch (err) {
			console.error("Gagal parse docx:", err);
			alert(
				"Gagal membaca file .docx. Pastikan dokumen memiliki tabel unit/elemen yang benar."
			);
		}
		e.target.value = "";
	}

	// const groups = watch("groups_ia");
	//
	// useEffect(() => {
	// 	console.log(groups);
	// }, [groups]);

	async function handleUploadAK() {}

	const onSubmit = async (data: SkemaType) => {
		// prepare payload
		const occupationId = Number(data.occupation_id) || undefined;
		if (!occupationId) {
			alert("Pilih Okupasi terlebih dahulu");
			return;
		}

		try {
			setSubmitting(true);
			// POST to /assessments/create (app mounts assessmentRoutes on /api/assessments)
			const res = await api.post("/assessments/create", {
				...data,
				occupation_id: occupationId,
			});
			if (res?.data?.success) {
				alert("APL berhasil dibuat");
				// navigate to assessments list or refresh
				navigate("/admin");
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
										{/* <div>
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
										</div> */}

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Pilih Okupasi
											</label>
											<div className="relative w-full">
												<select
													{...register("occupation_id", {
														required: "Pilih Okupasi wajib diisi",
													})}
													className={`w-full px-3 py-2 border rounded-md appearance-none ${
														errors.occupation_id
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
											{errors.occupation_id && (
												<p className="text-xs text-red-500 mt-1">
													{errors.occupation_id.message}
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
												placeholder="SKM.{okupasi}.{kode_skema}/LSPSMKN24/{tahun}"
												className="w-full px-3 py-2 border rounded-md border-gray-300"
											/>
										</div>
									</div>
								</div>

								{/* NOTE: Judul & Nomor Skema TIDAK DITAMPILKAN sesuai request */}

								{/* APL 02 */}
								<div className="mb-3">
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
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload File IA */}
								<div className="mb-3">
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
																{fieldsGroupIA01.map((_field, groupIndex) => (
																	<div key={_field.id}>
																		<GroupIA01
																			groupFieldsIA01={fieldsGroupIA01}
																			groupIndex={groupIndex}
																			useForm={{ control, register }}
																			removeGroupIA01={removeGroupIA01}
																		/>
																	</div>
																))}
															</div>

															<div className="mt-4">
																<button
																	type="button"
																	onClick={() =>
																		appendGruopIA01([{ name: "", units: [] }])
																	}
																	className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
																>
																	Tambah Kelompok Pekerjaan
																</button>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload File IA */}
								<div className="mb-3">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload File IA 2
									</h2>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											File IA 02
										</label>
										<div className="flex mb-4 items-stretch">
											<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
												Pilih File
												<input
													type="file"
													accept=".docx"
													onChange={handleUploadIA02}
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
											value={openValueIA02}
											onValueChange={setOpenValueIA02}
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
																{fieldsGroupIA02.map((_field, groupIndex) => (
																	<div key={_field.id}>
																		<GroupIA02
																			groupFieldsIA02={fieldsGroupIA02}
																			groupIndex={groupIndex}
																			useForm={{ control, register }}
																			removeGroupIA02={removeGroupIA02}
																		/>
																	</div>
																))}
															</div>

															<div className="mt-4">
																<button
																	type="button"
																	onClick={() =>
																		appendGruopIA02([
																			{
																				tools: [],
																				units: [],
																				duration: 0,
																				name: "",
																				scenario: "",
																			},
																		])
																	}
																	className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
																>
																	Tambah Kelompok Pekerjaan
																</button>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload File IA */}
								<div className="mb-3">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload File IA 03
									</h2>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											File IA 03
										</label>
										<div className="flex mb-4 items-stretch">
											<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
												Pilih File
												<input
													type="file"
													accept=".docx"
													onChange={handleUploadIA03}
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
											value={openValueIA03}
											onValueChange={setOpenValueIA03}
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
																{fieldsGroupIA03.map((_field, groupIndex) => (
																	<div key={_field.id}>
																		<GroupIA03
																			groupFieldsIA03={fieldsGroupIA03}
																			groupIndex={groupIndex}
																			useForm={{ control, register }}
																			removeGroupIA03={removeGroupIA03}
																		/>
																	</div>
																))}
															</div>

															<div className="mt-4">
																<button
																	type="button"
																	onClick={() =>
																		appendGruopIA03([
																			{
																				name: "",
																				units: [],
																				qa_ia03: [],
																			},
																		])
																	}
																	className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
																>
																	Tambah Kelompok Pekerjaan
																</button>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								</div>

								{/* full border line */}
								<div className="border-b border-gray-200" />

								{/* Upload Soal */}
								<div className="mb-3">
									<h2 className="text-lg font-semibold text-gray-900 mb-2">
										Upload IA 05
									</h2>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										File IA 05.A
									</label>
									<div className="flex mb-4 items-stretch">
										<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
											Pilih File
											<input
												type="file"
												accept=".docx,.pdf"
												onChange={handleUploadIA05A}
												className="hidden"
											/>
										</label>
										<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-10">
											Pilih file soal
										</span>
									</div>

									<label className="block text-sm font-medium text-gray-700 mb-2">
										File IA 05.B
									</label>
									<div className="flex mb-4 items-stretch">
										<label className="inline-flex items-center bg-[#E77D35] text-white px-6 py-2 rounded-md cursor-pointer z-10">
											Pilih File
											<input
												type="file"
												accept=".docx,.pdf"
												onChange={handleUploadIA05B}
												className="hidden"
											/>
										</label>
										<span className="flex-1 bg-gray-100 text-gray-500 text-sm rounded-md px-6 flex items-center -ml-4 pl-10">
											Pilih file soal
										</span>
									</div>

									{/* body */}
									<Accordion
										type="single"
										collapsible
										value={openValueIA05}
										onValueChange={setOpenValueIA05}
									>
										<AccordionItem value="item-1">
											<AccordionTrigger>
												<div className="flex items-center justify-between">
													<div>
														<h2 className="text-lg font-semibold text-gray-900">
															Form Soal
														</h2>

														<p className="text-sm text-gray-500 mt-1">
															Klik di sini untuk membuka/mentutup
														</p>
													</div>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<>
													{questionFields.map((q, qIndex) => (
														<div
															key={q.id}
															className="border rounded-xl p-4 space-y-4 shadow-sm bg-white mb-3"
														>
															{/* Pertanyaan */}
															<div>
																<div className="flex justify-between">
																	<label className="block text-sm font-medium text-gray-700">
																		Pertanyaan {qIndex + 1}
																	</label>

																	<button
																		type="button"
																		style={{
																			color: "red",
																			textWrap: "nowrap",
																			marginTop: "0.25em",
																		}}
																		className="px-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
																		onClick={() => removeQuestion(qIndex)}
																	>
																		Hapus Pertanyaan
																	</button>
																</div>
																<input
																	{...register(
																		`ia05_questions.${qIndex}.question`
																	)}
																	className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
																	placeholder="Tulis pertanyaan..."
																/>
															</div>

															{/* Options */}
															<div className="space-y-2">
																<label className="text-sm font-medium text-gray-700">
																	Opsi
																</label>
																<OptionsFieldArray
																	control={control}
																	qIndex={qIndex}
																/>
															</div>
														</div>
													))}

													<button
														type="button"
														onClick={() =>
															appendQuestion({
																order: questionFields.length + 1,
																question: "",
																options: [{ option: "", is_answer: false }],
															})
														}
														className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
													>
														Tambah Pertanyaan
													</button>
												</>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
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

function extractSchemaNumber(doc: Document): string | null {
	const tables = doc.querySelectorAll("table");
	if (!tables) return null;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));
		for (const row of rows) {
			const cells = Array.from(row.querySelectorAll("td")).map(
				(td) => td.textContent?.trim() ?? ""
			);
			const joined = cells.join(" ");
			console.log(joined);
			if (/Nomor/i.test(joined)) {
				const nomor = cells.at(-1); // biasanya paling kanan
				return nomor?.trim() || null;
			}
		}
		continue;
	}
	return null;
}

function validateSchemaNumber(doc: Document): boolean {
	const nomor = extractSchemaNumber(doc);
	console.log(nomor);
	if (!nomor) return false;

	if (!currentSchemaNumber) {
		currentSchemaNumber = nomor; // pertama kali diset
		return true;
	}

	return currentSchemaNumber.includes(nomor);
}

function parseHTMLToAPL02(html: string): UnitAPL02[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const units: UnitAPL02[] = [];

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	// Cari node yang mengandung FR.APL.02.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.APL.02.")
	);

	if (!anchorNode) {
		console.warn("FR.APL.02. tidak ditemukan!");
		return units;
	}

	// console.log(doc);
	const tables = Array.from(doc.querySelectorAll("table"));
	// console.log(tables);
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	// const jurusan = "";
	// const judulSkema = "";
	// let year = "";
	// let school = "";
	// let occupation = "";

	let currentUnit: UnitAPL02 | null = null;
	let currentElemen: ElementAPL02 | null = null;
	let elemenCounter = 1;

	let startParsing = false;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));
		const tableText = table.innerText.replace(/\s+/g, " ").trim();

		// console.log(tableText);
		if (tableText.includes("ASESMEN MANDIRI")) {
			startParsing = true;
			continue;
		}
		if (!startParsing) continue;

		// console.log(rows);

		for (const row of rows) {
			const text = row.innerText;
			const cells = Array.from(row.querySelectorAll("td")).map((td) =>
				td.innerText.trim()
			);
			// console.log(text);

			// if (text.includes("Nomor")) {
			// 	year = cells[2].trim().split("/").at(-1) || "";
			// 	school = cells[2].trim().split("/").at(-2) || "";
			// 	console.log(cells[2].trim().split("/"));
			// 	occupation = cells[2].trim().split("/").at(0)?.split(".").at(-1) || "";
			// 	continue;
			// }

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
				const items: ItemElementAPL02[] = [];
				let title = "";

				const target = Array.from(row.querySelectorAll("td *")).find((el) =>
					el.textContent?.trim().toLowerCase().includes("kriteria unjuk kerja")
				);

				if (!target) continue;

				// cari title elemen
				const prevText =
					target.previousSibling?.textContent ||
					target.parentElement?.previousElementSibling?.textContent ||
					"";
				title = prevText.split(":").at(-1)?.trim() || "";

				// coba ambil list
				let list: Element | null =
					(target.querySelector("ol, ul") ||
						target.nextElementSibling ||
						target.parentElement?.querySelector("ol, ul")) ??
					null;

				if (list && (list.tagName === "OL" || list.tagName === "UL")) {
					// ✅ normal case
					Array.from(list.querySelectorAll("li")).forEach((li, i) => {
						// console.log(units[units.length - 1].title);
						// console.log(row);
						items.push({
							id: `${elemenCounter}.${i + 1}`,
							description: li.textContent?.trim() || "",
						});
					});
				} else {
					// ✅ fallback: <p> bernomor
					let next = target.nextElementSibling;
					while (next) {
						if (next.tagName === "P") {
							const text = next.textContent?.trim() || "";
							if (/^\d+(\.\d+)*\.?\s/.test(text)) {
								// console.log(units[units.length - 1].title);
								// console.log(row);
								items.push({
									id: text.split(" ")[0].replace(/\.$/, ""),
									description: text.replace(/^\d+(\.\d+)*\.?\s*/, ""),
								});
							}
						}
						next = next.nextElementSibling;
					}
				}

				currentElemen = {
					id,
					title: title,
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

	return filteredUnits;
}

function parseHTMLToIA01(html: string): IA01Group[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	const groups_ia: IA01Group[] = [];

	// Cari node yang mengandung FR.IA.01.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.IA.01.")
	);

	if (!anchorNode) {
		console.warn("FR.IA.01. tidak ditemukan!");
		return groups_ia;
	}

	const tables = Array.from(doc.querySelectorAll("table"));
	if (tables.length === 0)
		throw new Error("Tidak ada tabel ditemukan dalam dokumen.");

	let currentGroup: IA01Group | null = null;
	let currentUnit: UnitIA01 | null = null;

	let startParsing = false;

	for (const table of tables) {
		const rows = Array.from(table.querySelectorAll("tr"));
		const tableText = table.innerText.replace(/\s+/g, " ").trim();

		// mulai parsing setelah tabel FR.IA.01
		if (tableText.includes("FR.IA.01.")) {
			startParsing = true;
			continue;
		}
		if (!startParsing) continue;

		// --- cek apakah ini tabel group baru (Kelompok Pekerjaan) ---
		const firstCellText = rows[0]?.querySelector("td")?.innerText || "";
		if (firstCellText.match(/Kelompok Pekerjaan (\d+)/)) {
			// console.log(firstCellText);
			const groupName = firstCellText.trim();
			currentGroup = {
				name: groupName,
				units: [],
			};

			// Ambil unit header di baris kedua
			const unitRow = rows[1];
			const unitCells = Array.from(unitRow.querySelectorAll("td")).map((td) =>
				td.innerText.trim()
			);
			if (unitCells.length >= 3 && currentGroup) {
				const unit_code = unitCells[1];
				const title = unitCells[2];
				currentUnit = { unit_code, title, elements: [] };
				// currentGroup.units.push(currentUnit);
				console.log(unitCells);
				groups_ia.push(currentGroup);
			}
			continue; // lanjut ke tabel berikutnya
		}

		// --- cek tabel unit kompetensi lain di dalam group ---
		if (rows.some((r) => r.innerText.includes("Unit Kompetensi"))) {
			let unit_code = "";
			let title = "";
			for (const row of rows) {
				const cells = Array.from(row.querySelectorAll("td")).map((td) =>
					td.innerText.trim()
				);
				if (cells.join(" ").includes("Kode Unit"))
					unit_code = cells[cells.length - 1];
				if (cells.join(" ").includes("Judul Unit"))
					title = cells[cells.length - 1];
			}
			if (unit_code && title && currentGroup) {
				currentUnit = { unit_code, title, elements: [] };
				currentGroup.units.push(currentUnit);
			}
		}

		// --- cek tabel elemen & kriterianya ---
		if (
			rows.some(
				(r) =>
					r.innerText.includes("Elemen") && r.innerText.includes("Kriteria")
			)
		) {
			// console.log(curr)
			if (!currentUnit)
				// throw new Error("Tabel elemen muncul sebelum tabel unit.");
				continue;
			let currentElemen: ElementIA01 | null = null;
			let benchmark = "";

			for (const row of rows.slice(2)) {
				const cells = Array.from(row.querySelectorAll("td")).map((td) =>
					td.innerText.trim()
				);
				if (cells.length === 0) continue;

				if (cells[0] && !isNaN(Number(cells[0]))) {
					const id = cells[0];
					const title = cells[1];
					const description = cells[2];
					benchmark = cells[3] ? cells[3] : benchmark;

					currentElemen = { id, title, details: [] };
					if (description) {
						currentElemen.details.push({
							id: `${id}.${currentElemen.details.length + 1}`,
							description,
							benchmark,
						});
					}
					currentUnit.elements.push(currentElemen);
				} else if (currentElemen) {
					const description = cells[0];
					benchmark = cells[1] ? cells[1] : benchmark;
					if (description) {
						const nextDetailId = `${currentElemen.id}.${
							currentElemen.details.length + 1
						}`;
						currentElemen.details.push({
							id: nextDetailId,
							description,
							benchmark,
						});
					}
				}
			}
		}
	}

	return groups_ia;
}

function parseHTMLToIA02(html: string): IA02Group[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	const groups: IA02Group[] = [];

	// Cari node yang mengandung FR.IA.02.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.IA.02.")
	);

	if (!anchorNode) {
		console.warn("FR.IA.02. tidak ditemukan!");
		return groups;
	}

	// Mulai dari node ini, cari semua table setelahnya
	const tables: HTMLTableElement[] = [];
	let next: Element | null = anchorNode;
	while (next) {
		if (next.tagName === "TABLE") {
			tables.push(next as HTMLTableElement);
		}
		next = next.nextElementSibling;
	}

	tables.forEach((table) => {
		const groupTitleCell = table.querySelector("td p strong");
		if (
			groupTitleCell &&
			groupTitleCell.textContent?.includes("Kelompok Pekerjaan")
		) {
			const groupName = groupTitleCell.textContent.trim();

			const rows = Array.from(table.querySelectorAll("tr")).slice(1); // skip header
			const units: UnitIA02[] = [];

			rows.forEach((tr) => {
				const cols = tr.querySelectorAll("td p");
				if (cols.length >= 3) {
					const code = cols[1]?.textContent?.trim();
					const title = cols[2]?.textContent?.trim();
					if (code && title) {
						units.push({
							unit_code: code,
							title,
						});
					}
				}
			});

			// ambil scenario, tools, duration di antara table ini dan table berikutnya
			let isInScenario = false;
			let scenario = "";
			let duration = 0;
			const tools: { name: string }[] = [];

			const nextElements: Element[] = [];
			let sib = table.nextElementSibling;
			while (sib && sib.tagName !== "TABLE") {
				nextElements.push(sib);
				sib = sib.nextElementSibling;
			}

			// cari Tools (Perlengkapan dan Peralatan)
			nextElements.forEach((el) => {
				if (el.textContent?.includes("Skenario Tugas Praktik Demonstrasi")) {
					isInScenario = true;
					return; // biar <p><strong>...</strong></p> gak ikut isi
				}

				// kalau sudah ketemu H1 Perlengkapan, stop ambil skenario
				if (
					isInScenario &&
					el.tagName === "H1" &&
					el.textContent?.toLowerCase().includes("perlengkapan")
				) {
					isInScenario = false;
				}

				// kalau lagi di skenario, kumpulin semua teks <p>, <ul>, <ol>
				if (isInScenario) {
					if (["P", "UL", "OL"].includes(el.tagName)) {
						scenario += el.textContent?.trim() + "\n";
					}
				}

				// tools extraction kamu tetap jalan
				if (el.tagName === "H1" && !el.textContent?.match(/Durasi|Waktu/i)) {
					tools.push({ name: el.textContent?.trim() ?? "" });
				}

				// duration extraction
				if (el.textContent?.match(/Durasi|Waktu/i)) {
					const dur = el.textContent.match(/(\d+)/);
					if (dur) duration = parseInt(dur[1], 10);
				}
			});

			groups.push({
				name: groupName,
				scenario,
				duration,
				units,
				tools,
			});
		}
	});

	return groups;
}

function parseHTMLToIA03(html: string): IA03Group[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	const groups: IA03Group[] = [];

	// console.log(doc);

	// Cari node yang mengandung FR.IA.03.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.IA.03.")
	);

	if (!anchorNode) {
		console.warn("FR.IA.03. tidak ditemukan!");
		return groups;
	}

	// Mulai dari node ini, cari semua table setelahnya
	const tables: HTMLTableElement[] = [];
	let next: Element | null = anchorNode;
	while (next) {
		if (next.tagName === "TABLE") {
			tables.push(next as HTMLTableElement);
		}
		next = next.nextElementSibling;
	}

	for (let i = 0; i < tables.length; i++) {
		const table = tables[i];
		const firstCell = table.querySelector("td p strong")?.textContent?.trim();

		if (firstCell && firstCell.startsWith("Kelompok Pekerjaan")) {
			// --- Kelompok ditemukan ---
			const groupName = firstCell;
			const units: UnitIA03[] = [];

			const rows = Array.from(table.querySelectorAll("tr"));
			rows.slice(1).forEach((row) => {
				const cells = Array.from(row.querySelectorAll("td"));
				if (cells.length >= 3) {
					const no = parseInt(
						cells[0].textContent?.trim().replace(/\./, "") || "0",
						10
					);
					const code = cells[1].textContent?.trim() || "";
					const title = cells[2].textContent?.trim() || "";
					if (no) {
						units.push({ unit_code: code, title });
					}
				}
			});

			// --- Cari tabel pertanyaan setelah tabel kelompok ini ---
			let qa_ia03: IA03Question[] = [];
			const nextTable = tables[i + 1];
			if (nextTable) {
				const rowsQ = Array.from(nextTable.querySelectorAll("tr"));
				qa_ia03 = rowsQ
					.map((row) => {
						const cells = Array.from(row.querySelectorAll("td"));
						if (cells.length >= 2) {
							const noText = cells[0].textContent?.trim();
							const question = cells[1].textContent?.trim();
							if (noText && /^\d+/.test(noText) && question) {
								return { question };
							}
						}
						return null;
					})
					.filter((q): q is IA03Question => q !== null);
			}

			groups.push({
				name: groupName,
				units,
				qa_ia03,
			});
		}
	}
	return groups;
}

function parseHTMLToIA05A(html: string): IA05Question[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	const questions: IA05Question[] = [];
	let currentQuestion: IA05Question | null = null;
	let order = 1;

	// Cari node yang mengandung FR.IA.05.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.IA.05")
	);

	if (!anchorNode) {
		console.warn("FR.IA.05 tidak ditemukan!");
		return questions;
	}

	// ambil semua elemen yang mungkin berisi soal/opsi
	const elements = Array.from(doc.querySelectorAll("p, ol"));

	// console.log(doc);
	elements.forEach((el) => {
		// console.log(el.tagName);
		// console.log(el);
		if (el.tagName.toLowerCase() === "p") {
			const text = el.textContent?.trim() ?? "";
			if (!text) return;

			// deteksi soal (awalnya nomor 1., 2. dst)
			if (/^\d+\./.test(text)) {
				if (currentQuestion) {
					questions.push(currentQuestion);
				}
				currentQuestion = {
					order: order++,
					question: text.replace(/^\d+\.\s*/, ""),
					options: [],
				};
				return;
			}

			// deteksi opsi (awalnya a., b., c., d.)
			if (/^[a-eA-E][\.\)]/.test(text)) {
				if (currentQuestion) {
					currentQuestion.options.push({
						option: text.replace(/^[a-eA-E][\.\)]\s*/, ""),
						is_answer: false,
					});
				}
			}
		}

		// kalau bentuk <ol><li> → opsi juga
		if (el.tagName.toLowerCase() === "ol") {
			const items = Array.from(el.querySelectorAll("li")).map(
				(li) => li.textContent?.trim() ?? ""
			);
			// console.log(items);
			if (items.length === 0) return;

			if (items.length === 1) {
				// Ini soal baru
				if (currentQuestion) {
					questions.push(currentQuestion);
				}
				currentQuestion = {
					order: order++,
					question: items[0],
					options: [],
				};
			} else {
				// Ini opsi jawaban
				if (currentQuestion) {
					currentQuestion.options = items.map((t) => ({
						option: t.replace(/^[a-eA-E][\.\)]\s*/, ""), // buang prefix a./b. kalau ada
						is_answer: false,
					}));
				}
			}
		}
	});

	if (currentQuestion) {
		questions.push(currentQuestion);
	}

	return questions;
}

function parseHTMLToIA05B(html: string): Record<number, string> {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	if (!validateSchemaNumber(doc)) {
		throw new Error("Nomor skema berbeda dari file sebelumnya!");
	}

	const keyMap: Record<number, string> = {};

	// Cari node yang mengandung FR.IA.05.
	const anchorNode = Array.from(doc.querySelectorAll("body *")).find((el) =>
		el.textContent?.includes("FR.IA.05")
	);

	if (!anchorNode) {
		console.warn("FR.IA.05 tidak ditemukan!");
		return keyMap;
	}

	const tables = Array.from(doc.querySelectorAll("table"));

	for (const table of tables) {
		const firstRow = table.querySelector("tr");
		if (!firstRow) continue;

		const firstCellText =
			firstRow.querySelector("td")?.textContent?.trim().toLowerCase() ?? "";

		// deteksi table kunci jawaban
		if (firstCellText.includes("no") || firstCellText.includes("kunci")) {
			const rows = Array.from(table.querySelectorAll("tbody tr"));
			rows.forEach((row) => {
				const cells = Array.from(row.querySelectorAll("td"));
				for (let i = 0; i < cells.length; i += 2) {
					const noText = cells[i]?.textContent?.trim().replace(/\./g, "");
					const ansEl = cells[i + 1];
					if (!noText || !ansEl) continue;

					const qNo = parseInt(noText.replace(/\D/g, ""), 10);
					if (isNaN(qNo)) continue;

					let answer = "";
					const li = ansEl.querySelector("li");
					if (li) {
						answer = li.textContent?.trim() ?? "";
					} else {
						answer = ansEl.textContent?.trim() ?? "";
					}

					keyMap[qNo] = answer.replace(/^[a-eA-E][\.\)]\s*/, "").trim();
				}
			});
			break; // stop setelah table kunci jawaban ditemukan
		}
	}

	return keyMap;
}

function GroupIA01({
	groupIndex,
	useForm,
	removeGroupIA01,
}: {
	groupFieldsIA01: FieldArrayWithId<SkemaType, "groups_ia01", "id">[];
	groupIndex: number;
	useForm: {
		control: Control<SkemaType>;
		register: UseFormRegister<SkemaType>;
	};
	removeGroupIA01: UseFieldArrayRemove;
}) {
	const { control, register } = useForm;

	// field array untuk units
	const {
		fields: fieldsIA01,
		append: appendIA01,
		remove: removeIA01,
	} = useFieldArray({
		control,
		name: `groups_ia01.${groupIndex}.units`,
	});

	return (
		<div className="space-y-6 border p-4 rounded-md">
			{/* Header Group */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">
					Kelompok Pekerjaan {groupIndex + 1}
				</h2>
				<button
					type="button"
					onClick={() => removeGroupIA01(groupIndex)}
					className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
				>
					Hapus Kelompok Pekerjaan
				</button>
			</div>

			{/* Units */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Units</h3>
				{fieldsIA01.map((_units, unitIndex) => (
					<UnitFieldIA01
						unitFields={fieldsIA01}
						useForm={{ control, register }}
						removeUnit={removeIA01}
						unitIndex={unitIndex}
						groupIndex={groupIndex}
						key={_units.id}
					/>
				))}
				<button
					type="button"
					onClick={() =>
						appendIA01([{ unit_code: "", title: "", elements: [] }])
					}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
				>
					Tambah Unit
				</button>
			</div>
		</div>
	);
}

function GroupIA02({
	groupIndex,
	useForm,
	removeGroupIA02,
}: {
	groupFieldsIA02: FieldArrayWithId<SkemaType, "groups_ia02", "id">[];
	groupIndex: number;
	useForm: {
		control: Control<SkemaType>;
		register: UseFormRegister<SkemaType>;
	};
	removeGroupIA02: UseFieldArrayRemove;
}) {
	const { control, register } = useForm;

	// field array untuk units
	const {
		fields: fieldsIA02,
		append: appendIA02,
		remove: removeIA02,
	} = useFieldArray({
		control,
		name: `groups_ia02.${groupIndex}.units`,
	});

	// field array untuk tools
	const {
		fields: fieldsTools,
		append: appendTool,
		remove: removeTool,
	} = useFieldArray({
		control,
		name: `groups_ia02.${groupIndex}.tools`,
	});

	return (
		<div className="space-y-6 border p-4 rounded-md">
			{/* Header Group */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">
					Kelompok Pekerjaan {groupIndex + 1}
				</h2>
				<button
					type="button"
					onClick={() => removeGroupIA02(groupIndex)}
					className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
				>
					Hapus Kelompok Pekerjaan
				</button>
			</div>

			{/* Scenario */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Scenario
				</label>
				<textarea
					{...register(`groups_ia02.${groupIndex}.scenario`)}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
					rows={3}
				/>
			</div>

			{/* Duration */}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Duration (menit)
				</label>
				<input
					type="number"
					{...register(`groups_ia02.${groupIndex}.duration`, {
						valueAsNumber: true,
					})}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			{/* Tools */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">Tools</label>
				{fieldsTools.map((tool, toolIndex) => (
					<div key={tool.id} className="flex items-center space-x-2">
						<input
							{...register(`groups_ia02.${groupIndex}.tools.${toolIndex}.name`)}
							className="flex-1 border border-gray-300 rounded-md p-2"
							placeholder={`Tool ${toolIndex + 1}`}
						/>
						<button
							type="button"
							onClick={() => removeTool(toolIndex)}
							className="px-2 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
						>
							Hapus
						</button>
					</div>
				))}
				<button
					type="button"
					onClick={() => appendTool({ name: "" })}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
				>
					Tambah Tool
				</button>
			</div>

			{/* Units */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Units</h3>
				{fieldsIA02.map((_units, unitIndex) => (
					<UnitFieldIA02
						unitFields={fieldsIA02}
						useForm={{ control, register }}
						removeUnit={removeIA02}
						unitIndex={unitIndex}
						groupIndex={groupIndex}
						key={_units.id}
					/>
				))}
				<button
					type="button"
					onClick={() => appendIA02([{ unit_code: "", title: "" }])}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
				>
					Tambah Unit
				</button>
			</div>
		</div>
	);
}

function GroupIA03({
	groupIndex,
	useForm,
	removeGroupIA03,
}: {
	groupFieldsIA03: FieldArrayWithId<SkemaType, "groups_ia03", "id">[];
	groupIndex: number;
	useForm: {
		control: Control<SkemaType>;
		register: UseFormRegister<SkemaType>;
	};
	removeGroupIA03: UseFieldArrayRemove;
}) {
	const { control, register } = useForm;

	// field array untuk units
	const {
		fields: fieldsIA03,
		append: appendIA03,
		remove: removeIA03,
	} = useFieldArray({
		control,
		name: `groups_ia03.${groupIndex}.units`,
	});

	// field array untuk questions
	const {
		fields: fieldsQuestion,
		append: appendQuestion,
		remove: removeQuestion,
	} = useFieldArray({
		control,
		name: `groups_ia03.${groupIndex}.qa_ia03`,
	});

	return (
		<div className="space-y-6 border p-4 rounded-md">
			{/* Header Group */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">
					Kelompok Pekerjaan {groupIndex + 1}
				</h2>
				<button
					type="button"
					onClick={() => removeGroupIA03(groupIndex)}
					className="px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
				>
					Hapus Kelompok Pekerjaan
				</button>
			</div>

			{/* Question */}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					Question
				</label>
				{fieldsQuestion.map((question, questionIndex) => (
					<div key={question.id} className="flex items-center space-x-2">
						<input
							{...register(
								`groups_ia03.${groupIndex}.qa_ia03.${questionIndex}.question`
							)}
							className="flex-1 border border-gray-300 rounded-md p-2"
							placeholder={`Question ${questionIndex + 1}`}
						/>
						<button
							type="button"
							onClick={() => removeQuestion(questionIndex)}
							className="px-2 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
						>
							Hapus
						</button>
					</div>
				))}
				<button
					type="button"
					onClick={() => appendQuestion({ question: "" })}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
				>
					Tambah Tool
				</button>
			</div>
			{/* Units */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Units</h3>
				{fieldsIA03.map((_units, unitIndex) => (
					<UnitFieldIA03
						unitFields={fieldsIA03}
						useForm={{ control, register }}
						removeUnit={removeIA03}
						unitIndex={unitIndex}
						groupIndex={groupIndex}
						key={_units.id}
					/>
				))}
				<button
					type="button"
					onClick={() => appendIA03([{ unit_code: "", title: "" }])}
					className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
				>
					Tambah Unit
				</button>
			</div>
		</div>
	);
}

function OptionsFieldArray({
	control,
	qIndex,
}: {
	control: Control<SkemaType, any, SkemaType>;
	qIndex: number;
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `ia05_questions.${qIndex}.options`,
	});

	return (
		<div className="space-y-2">
			{fields.map((field, oIndex) => (
				<div key={field.id} className="flex items-center space-x-2">
					<input
						{...control.register?.(
							`ia05_questions.${qIndex}.options.${oIndex}.option`
						)}
						className="flex-1 border border-gray-300 rounded-md px-3 py-1"
						placeholder={`Opsi ${oIndex + 1}`}
					/>
					<Controller
						name={`ia05_questions.${qIndex}.options.${oIndex}.is_answer`}
						control={control}
						render={({ field: { onChange, value } }) => (
							<input
								type="radio"
								className="h-4 w-4"
								checked={value}
								onChange={(e) => onChange(e.target.checked)}
							/>
						)}
					/>
					<button
						type="button"
						onClick={() => remove(oIndex)}
						className="px-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
					>
						Hapus
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => append({ option: "", is_answer: false })}
				className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
			>
				Tambah Opsi
			</button>
		</div>
	);
}

export default TambahMUK;
