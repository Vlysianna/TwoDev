import { useState, useEffect } from "react";
import { Search, X, AlertCircle, Check } from "lucide-react";
import api from "@/helper/axios";
import { useAuth } from "@/contexts/AuthContext";
import type { AK03Question, AssessmentData } from "@/model/ak03-model";
import { Controller, useForm } from "react-hook-form";

const defaultQuestions: AK03Question[] = [
	{
		id: 1,
		question:
			"Saya mendapatkan penjelasan yang cukup memadai mengenai proses asesmen/uji yasi",
		answer: false,
		comment: "",
	},
	{
		id: 2,
		question:
			"Saya diberikan kesempatan untuk mempelajari standar yasi yang akan diuji dan menilai diri sendiri terhadap pencapaiannya",
		answer: false,
		comment: "",
	},
	{
		id: 3,
		question:
			"Asesor memberikan kesempatan untuk mendiskusikan/menegosiasikan metoda, instrumen dan sumber asesmen serta jadwal asesmen",
		answer: false,
		comment: "",
	},
	{
		id: 4,
		question:
			"Asesor berusaha menggali seluruh bukti pendukung yang sesuai dengan latar belakang pelatihan dan pengalaman yang saya miliki",
		answer: false,
		comment: "",
	},
	{
		id: 5,
		question:
			"Saya sepenuhnya diberikan kesempatan untuk mendemonstrasikan yasi yang saya miliki selama asesmen",
		answer: false,
		comment: "",
	},
	{
		id: 6,
		question:
			"Saya mendapatkan penjelasan yang memadai mengenai keputusan asesmen",
		answer: false,
		comment: "",
	},
	{
		id: 7,
		question:
			"Asesor memberikan umpan balik yang mendukung setelah asesmen serta tindak lanjutnya",
		answer: false,
		comment: "",
	},
	{
		id: 8,
		question:
			"Asesor bersama saya mempelajari semua dokumen asesmen serta menandatanganinya",
		answer: false,
		comment: "",
	},
	{
		id: 9,
		question:
			"Saya mendapatkan jaminan kerahasiaan hasil asesmen serta penjelasan penanganan dokumen asesmen",
		answer: false,
		comment: "",
	},
	{
		id: 10,
		question:
			"Asesor menggunakan keterampilan komunikasi yang efektif selama asesmen",
		answer: false,
		comment: "",
	},
];

export default function AK03({
	isAssessee,
	id_result,
}: {
	isAssessee: boolean;
	id_result: string;
}) {
	const { user } = useAuth();

	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState<AssessmentData | null>(null);
	const [questions, setQuestions] = useState<AK03Question[]>([]);
	const [filteredData, setFilteredQuestions] = useState<AK03Question[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterKompeten, setFilterKompeten] = useState("all");
	const [catatanUmum, setCatatanUmum] = useState("");
	const [showNotif, setShowNotif] = useState(false);

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { isSubmitting },
	} = useForm({
		defaultValues: {
			answers: defaultQuestions.map((q) => ({
				id: q.id,
				answer: "",
				comment: "",
			})),
			catatanUmum: "",
		},
	});

	useEffect(() => {
		if (user) fetchData();
	}, [user, id_result]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setErrorMessage("");

			const response = await api.get(`/assessments/ak-03/${id_result}`);
			const rawData = response.data;

			if (rawData.success) {
				setFormData(rawData.data);
				const answers =
					rawData.data.result_ak03?.answers?.map((a: AK03Question) => ({
						id: a.id,
						answer: a.answer ? "ya" : "tidak",
						comment: a.comment || "",
					})) ||
					defaultQuestions.map((q) => ({ id: q.id, answer: "", comment: "" }));

				setQuestions(
					rawData.data.result_ak03?.answers.length == 0
						? defaultQuestions
						: rawData.data.result_ak03?.answers
				);
				setCatatanUmum(rawData.data.result_ak03?.comment || "");
				reset({
					answers,
					catatanUmum: rawData.data.result_ak03?.comment || "",
				});
			}
		} catch (error: any) {
			setErrorMessage(
				error.response?.data?.message || "Gagal memuat data AK-03"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setFilteredQuestions(
			questions.filter((item) => {
				const val = getValues(`answers.${item.id - 1}.answer`);
				const matchesSearch = item.question
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
				const matchesFilter =
					filterKompeten === "all" || filterKompeten === val;
				return matchesSearch && matchesFilter;
			})
		);
	}, [questions, searchTerm, filterKompeten, getValues]);

	const onSubmit = async (data: any) => {
		if (!isAssessee) return;
		try {
			const unanswered = data.answers.filter((a: any) => !a.answer);
			if (unanswered.length > 0) {
				setErrorMessage("Harap jawab semua pertanyaan sebelum menyimpan");
				return;
			}

			const payload = {
				result_id: parseInt(id_result),
				comment: data.catatanUmum || "Tidak ada",
				items: data.answers.map((a: any, i: number) => ({
					question: questions[i].question,
					answer: a.answer === "ya",
					comment: a.comment || "-",
				})),
			};

			const response = await api.post("/assessments/ak-03/answer", payload);
			if (!response.data.success) {
				setErrorMessage(response.data.message || "Gagal menyimpan data.");
			} else {
				setShowNotif(true); // Tampilkan notifikasi
				setTimeout(() => setShowNotif(false), 2500); // Sembunyikan setelah 2.5 detik
			}
		} catch (error: any) {
			setErrorMessage(error.response?.data?.message || "Gagal menyimpan data.");
		}
	};

	const handleFilterChange = (value: string) => {
		if (!isAssessee) return;
		setFilterKompeten(value);
		if (value === "ya" || value === "tidak") {
			questions.forEach((_q, idx) => setValue(`answers.${idx}.answer`, value));
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	if (errorMessage && !questions.length)
		return (
			<div className="min-h-screen flex items-center justify-center text-center">
				<AlertCircle size={48} className="text-red-500 mb-4" />
				<p>{errorMessage}</p>
				<button onClick={fetchData}>Coba Lagi</button>
			</div>
		);

	return (
		<div className="">
			{/* Notifikasi Simpan */}
			{showNotif && (
				<div className="fixed top-6 right-6 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded shadow flex items-center animate-fade-in">
					<Check size={20} className="mr-2" />
					Data berhasil disimpan!
				</div>
			)}

			{errorMessage && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
					<AlertCircle size={20} className="mr-2" />
					{errorMessage}
					<button
						type="button"
						className="ml-auto text-red-500 hover:text-red-600 focus:outline-none"
						onClick={() => setErrorMessage("")}
					>
						<X size={20} />
					</button>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-sm p-4 mb-4 space-y-4">
				{/* Baris 1 */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<span className="block text-sm font-medium text-gray-800">
						Skema Sertifikasi ( Okupasi )
					</span>

					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 whitespace-nowrap">
						<span className="text-sm font-medium text-gray-800">
							Okupasi Junior Coder
						</span>
						<span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
							{formData?.assessment?.code || "Tidak Diketahui"}
						</span>
					</div>
				</div>

				{/* Baris 2 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Asesi
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
							defaultValue={formData?.assessee?.name || "Tidak Diketahui"}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Asesor
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
							defaultValue={formData?.assessor?.name || "Tidak Diketahui"}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							TUK
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
							defaultValue={formData?.tuk || "Tidak Diketahui"}
							readOnly
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Tanggal Mulai
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
							readOnly
							defaultValue={
								formData?.schedule?.start_date
									? new Date(formData?.schedule?.start_date)
											.toISOString()
											.split("T")[0]
									: ""
							}
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">
							Tanggal Selesai
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
							readOnly
							defaultValue={
								formData?.schedule?.end_date
									? new Date(formData?.schedule?.end_date)
											.toISOString()
											.split("T")[0]
									: ""
							}
						/>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-sm px-5 py-7">
				{/* Header with search and filter */}
				<div className="pb-7">
					<div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center w-full gap-4 md:gap-6">
						{/* Search */}
						<div className="relative w-full sm:flex-1 min-w-[200px]">
							<input
								type="text"
								placeholder="Search..."
								className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<Search
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={16}
							/>
						</div>

						{/* Filter Kompeten with Select All options */}
						<div className="flex flex-wrap items-center gap-3 md:gap-6 sm:flex-none">
							{[
								{ value: "ya", label: "Semua ya" },
								{ value: "tidak", label: "Semua tidak" },
							].map((opt) => (
								<label
									key={opt.value}
									className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition disabled:opacity-50
										${filterKompeten === opt.value ? "bg-[#E77D3533]" : ""}`}
								>
									<input
										type="radio"
										name="filter"
										value={opt.value}
										checked={filterKompeten === opt.value}
										onChange={(e) => handleFilterChange(e.target.value)}
										className="hidden"
										disabled={!isAssessee}
									/>
									<span
										className={`w-4 h-4 flex items-center justify-center rounded-full border-2
											${
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
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Table */}
					<div className="w-full overflow-x-auto border border-gray-200 rounded-sm">
						<div className="max-h-96 overflow-y-auto">
							<table className="w-full min-w-[600px] lg:min-w-[800px] table-auto border-collapse">
								<thead className="bg-gray-50 sticky top-0 z-10">
									<tr>
										<th className="w-[5%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
											No
										</th>
										<th className="w-[40%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
											Komponen
										</th>
										<th className="w-[25%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
											Hasil
										</th>
										<th className="w-[30%] p-3 py-4 text-center text-xs sm:text-sm font-medium text-gray-700">
											Catatan/Komentar Asesi
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredData.map((item, idx) => (
										<tr key={item.id} className="border-t border-gray-200">
											<td className="px-2 py-2 text-xs sm:text-sm text-gray-900 text-center">
												{item.id}
											</td>
											<td className="px-2 py-2 text-xs sm:text-sm text-gray-900 break-words">
												{item.question}
											</td>
											<td className="px-2 py-2 text-center">
												<div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 sm:gap-4">
													{/* Radio Ya/Tidak */}
													<Controller
														control={control}
														name={`answers.${idx}.answer`}
														render={({ field }) => (
															<>
																{["Ya", "Tidak"].map((val) => (
																	<label
																		className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition text-xs sm:text-sm 
																			${!isAssessee ? "text-gray-400" : "text-gray-700"}
																			${field.value === val.toLowerCase() ? "bg-[#E77D3533]" : ""}`}
																		key={val.toLowerCase()}
																	>
																		<input
																			type="radio"
																			value={val.toLowerCase()}
																			checked={
																				field.value === val.toLowerCase()
																			}
																			onChange={() =>
																				field.onChange(val.toLowerCase())
																			}
																			className="hidden"
																			disabled={!isAssessee}
																		/>
																		<span
																			className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
																				!isAssessee &&
																				"opacity-50 cursor-not-allowed"
																			}
																			${
																				field.value === val.toLowerCase()
																					? "bg-[#E77D35] border-[#E77D35]"
																					: "border-[#E77D35]"
																			}`}
																		>
																			{field.value === val.toLowerCase() && (
																				<Check className="w-4 h-4 text-white" />
																			)}
																		</span>
																		<span
																			className={
																				field.value === val.toLowerCase()
																					? "text-gray-900"
																					: "text-gray-500"
																			}
																		>
																			{val}
																		</span>
																	</label>
																))}
															</>
														)}
													/>
												</div>
											</td>
											<td className="px-2 py-2">
												<Controller
													control={control}
													name={`answers.${idx}.comment`}
													render={({ field }) => (
														<textarea
															className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
															{...field}
															placeholder="Masukkan catatan..."
															rows={3}
															disabled={!isAssessee}
														/>
													)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Catatan/komentar lainnya (apabila ada) :
						</label>

						<textarea
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E77D35] text-sm"
							placeholder="Catatan"
							rows={4}
							value={catatanUmum}
							onChange={(e) => setCatatanUmum(e.target.value)}
						/>

						<div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 w-full">
							<button
								type="submit"
								disabled={loading || isSubmitting || !isAssessee}
								className="w-full sm:w-auto px-30 py-2 bg-[#E77D35] text-sm text-white rounded hover:bg-orange-600 transition cursor-pointer disabled:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Menyimpan..." : "Simpan"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
