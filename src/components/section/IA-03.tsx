import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import { Clock, AlertCircle, CheckCircle, Monitor, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { GroupIA03, ResultIA03, QuestionIA03 } from "@/model/ia03-model";
import { QRCodeCanvas } from "qrcode.react";
import useToast from "../ui/useToast";

// Static data
export const header = {
	asesi: "Ananda Keizha Oktavian",
	asesor: "Eva Yeprilianti, S.Kom",
	tanggalMulai: "24 Oktober 2025",
	waktuMulai: "07:00 - 15:00",
	tanggalSelesai: "24 Oktober 2025",
	waktuSelesai: "07:00 - 15:00",
	skema: "Pemrogram Junior ( Junior Coder )",
	kodeSkema: "SKM.RPL.PJ/LSPMK24/2023",
};

export const panduanList = [
	"Formulir ini di isi oleh asesor kompetensi dapat sebelum, pada saat atau setelah melakukan asesmen dengan metode observasi demonstrasi.",
	"Pertanyaan dibuat dengan tujuan untuk menggali jawaban yang berkaitan dengan dimensi Kompetensi, batasan variabel dan aspek kritis yang relevan dengan skenario tugas dan praktik demonstrasi.",
	"Jika pertanyaan disampaikan sebelum asesi melakukan praktik demonstrasi, maka pertanyaan dibuat berkaitan dengan aspek K3, SOP, penggunaan peralatan dan perlengkapan.",
	"Jika setelah asesi melakukan praktik demonstrasi terdapat item pertanyaan pendukung observasi telah terpenuhi maka pertanyaan tersebut tidak perlu ditanyakan lagi dan cukup memberikan catatan bahwa sudah terpenuhi pada saat tugas praktik demonstrasi pada kolom tanggapan.",
	"Jika pada saat observasi ada hal yang perlu dikonfirmasi sedangkan di instrumen dasar pertanyaan pendukung observasi tidak ada, maka asesor dapat memberikan pertanyaan dengan catatan pertanyaan harus berkaitan dengan tugas praktik demonstrasi. Jika dilakukan, asesor harus mencatat dalam instrumen pertanyaan pendukung observasi.",
	"Tanggapan asesi ditulis pada kolom tanggapan.",
];

interface Question {
	id: number;
	text: string;
	pencapaian: string;
	tanggapan: string;
}

export default function IA03({
	isAssessee,
	id_assessment,
	id_result,
	id_asesi,
	id_asesor,
}: {
	isAssessee: boolean;
	id_assessment: string;
	id_result: string;
	id_asesi: string;
	id_asesor: string;
}) {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [groups, setGroups] = useState<GroupIA03[]>([]);
	const [selectedGroup, setSelectedGroup] = useState(0);
	const [assesseeQrValue, setAssesseeQrValue] = useState("");
	const [assessorQrValue, setAssessorQrValue] = useState("");

	const [questions, setQuestions] = useState<Question[]>([]);

	const toast = useToast();

	const [result, setResult] = useState<ResultIA03>({
		id: 0,
		assessment: {
			id: 0,
			code: "N/A",
			occupation: {
				id: 0,
				name: "N/A",
				scheme: {
					id: 0,
					code: "N/A",
					name: "N/A",
					created_at: "0000-00-00T00:00:00.000Z",
					updated_at: "0000-00-00T00:00:00.000Z",
				},
				created_at: "0000-00-00T00:00:00.000Z",
				updated_at: "0000-00-00T00:00:00.000Z",
			},
			created_at: "0000-00-00T00:00:00.000Z",
			updated_at: "0000-00-00T00:00:00.000Z",
		},
		assessee: {
			id: 0,
			name: "N/A",
			email: "N/A",
		},
		assessor: {
			id: 0,
			name: "N/A",
			email: "N/A",
			no_reg_met: "N/A",
		},
		tuk: "N/A",
		is_competent: false,
		created_at: "0000-00-00T00:00:00.000Z",
		ia03_header: {
			id: 0,
			result_id: 0,
			approved_assessee: false,
			approved_assessor: false,
			created_at: "0000-00-00T00:00:00.000Z",
			updated_at: "0000-00-00T00:00:00.000Z",
		},
	});

	// Generate tabs from groups
	const tabs =
		groups.length > 0
			? groups.map((group, index) => ({
				id: group.id.toString(),
				label: `${group.name} (${group.units.length} unit)`,
				active: index === selectedGroup,
			}))
			: [];

	// Generate unit kompetensi from groups
	const unitKompetensi =
		groups.length > 0 && selectedGroup < groups.length
			? groups[selectedGroup].units.map((unit, index) => ({
				id: unit.id,
				title: unit.title,
				code: unit.unit_code,
				status: index === 0 ? "finished" : null,
			}))
			: [];

	// Effect untuk fetch data saat komponen dimount
	useEffect(() => {
		console.log("Component mounted, fetching data...");
		console.log("id_result:", id_result, "id_assessment:", id_assessment);

		if (id_result && id_assessment) {
			fetchResult(id_result);
			fetchUnits(id_result); // PERBAIKAN: Ganti fetchGroups dengan fetchUnits
		} else {
			console.log("Missing required IDs");
		}
	}, [id_result, id_assessment]);

	// Fetch Result IA03 (data utama assessment)
	const fetchResult = async (id_result: string) => {
		try {
			setLoading(true);
			const response = await api.get(`/assessments/ia-03/result/${id_result}`);
			if (response.data.success) {
				setResult(response.data.data);

				// Set QR values jika sudah approved
				if (response.data.data.ia03_header.approved_assessee) {
					setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				}

				if (response.data.data.ia03_header.approved_assessor) {
					setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				}
			}
		} catch (error: any) {
			console.log("Error fetching IA03 result:", error);
			setError("Gagal memuat data hasil asesmen");
		} finally {
			setLoading(false);
		}
	};

	// PERBAIKAN: Ganti fetchGroups dengan fetchUnits
	const fetchUnits = async (id_result: string) => {
		try {
			setLoading(true);
			const response = await api.get(`/assessments/ia-03/units/${id_result}`);
			console.log("Units API response:", response.data); // DEBUG

			if (response.data.success) {
				setGroups(response.data.data);
				console.log("Groups data set:", response.data.data); // DEBUG

				// Set pertanyaan dari group pertama jika ada
				if (response.data.data.length > 0) {
					loadQuestionsForGroup(response.data.data[selectedGroup]);
				}
			}
		} catch (error: any) {
			console.log("Error fetching IA03 units:", error);
			setError("Gagal memuat data unit kompetensi");
		} finally {
			setLoading(false);
		}
	};

	// PERBAIKAN: Fungsi untuk load questions berdasarkan group
	const loadQuestionsForGroup = (group: GroupIA03) => {
		console.log("Loading questions for group:", group); // DEBUG

		if (group.questions && group.questions.length > 0) {
			const groupQuestions = group.questions.map((q: QuestionIA03) => ({
				id: q.id,
				text: q.question, // PERBAIKAN: Ambil dari q.question
				pencapaian: q.result?.approved ? "kompeten" : q.result ? "belum" : "", // PERBAIKAN: Logika approved
				tanggapan: q.result?.answer || "", // PERBAIKAN: Ambil dari q.result.answer
			}));
			setQuestions(groupQuestions);
			console.log("Questions loaded:", groupQuestions); // DEBUG
		} else {
			// Jika tidak ada questions dari API, set default
			setQuestions([{ id: 1, text: "", pencapaian: "", tanggapan: "" }]);
			console.log("No questions from API, setting default"); // DEBUG
		}
	};

	// Simpan jawaban pertanyaan ke API
	const saveQuestionAnswer = async (
		questionId: number,
		answer: string,
		approved: boolean
	) => {
		if (isAssessee) return;
		try {
			const payload = {
				result_id: result.id,
				questions: [
					{
						question_id: questionId,
						answer: answer,
						approved: approved,
					},
				],
			};

			const response = await api.post(
				`/assessments/ia-03/result/send`,
				payload
			);
			if (response.data.success) {
				setSuccess("Jawaban berhasil disimpan");
				fetchUnits(id_result);
				toast.show({
					title: "Berhasil",
					description: "Berhasil menyimpan jawaban",
					type: "success",
					duration: 3000
				});
				return response.data.data;
			}
		} catch (error: any) {
			console.log("Error saving question answer:", error);
			setError("Gagal menyimpan jawaban");
			toast.show({
				title: "Gagal",
				description: "Gagal menyimpan jawaban",
				type: "error",
				duration: 3000
			});
			return null;
		}
	};

	// Approve hasil oleh Asesi
	const approveByAssessee = async () => {
		if (!isAssessee) return;
		try {
			const response = await api.put(
				`/assessments/ia-03/result/assessee/${id_result}/approve`
			);
			if (response.data.success) {
				setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				setSuccess("Hasil berhasil disetujui asesi");

				// Refresh result untuk update approval status
				if (id_result) {
					fetchResult(id_result);
				}
			}
		} catch (error: any) {
			console.log("Error approving by assessee:", error);
			setError("Gagal menyetujui hasil");
		}
	};

	// Approve hasil oleh Asesor
	const approveByAssessor = async () => {
		if (isAssessee) return;
		try {
			const response = await api.put(
				`/assessments/ia-03/result/assessor/${id_result}/approve`
			);
			if (response.data.success) {
				setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				setSuccess("Hasil berhasil disetujui asesor");

				// Refresh result untuk update approval status
				if (id_result) {
					fetchResult(id_result);
				}
			}
		} catch (error: any) {
			console.log("Error approving by assessor:", error);
			setError("Gagal menyetujui hasil");
		}
	};

	// Notifikasi browser
	const showNotification = (message: string) => {
		if ("Notification" in window) {
			if (Notification.permission === "granted") {
				new Notification(message);
			} else if (Notification.permission !== "denied") {
				Notification.requestPermission().then((permission) => {
					if (permission === "granted") {
						new Notification(message);
					}
				});
			}
		}
	};

	// Tambahkan state untuk error tanggapan per pertanyaan
	const [tanggapanErrors, setTanggapanErrors] = useState<{ [key: number]: string }>(
		{}
	);

	// Simpan semua perubahan pertanyaan
	const handleSaveAllQuestions = async () => {
		if (isAssessee) return;
		try {
			setLoading(true);
			let errors: { [key: number]: string } = {};
			let hasError = false;

			questions.forEach((question) => {
				if (!question.tanggapan.trim()) {
					errors[question.id] = "tanggapan harus diisi";
					hasError = true;
				}
			});
			setTanggapanErrors(errors);

			if (hasError) {
				setError("Tanggapan harus diisi pada semua pertanyaan");
				setLoading(false);
				return;
			}

			const promises = questions.map(async (question) => {
				const approved = question.pencapaian === "kompeten";
				return saveQuestionAnswer(question.id, question.tanggapan, approved);
			});

			await Promise.all(promises);
			showNotification("Jawaban berhasil disimpan");
			setSuccess(null); // Tidak tampilkan pesan success di UI
			setError(null);
		} catch (error: any) {
			console.log("Error saving all questions:", error);
			setError("Gagal menyimpan jawaban");
		} finally {
			setLoading(false);
		}
	};

	const updatePencapaian = (id: number, pencapaian: string) => {
		setQuestions(
			questions.map((q) => (q.id === id ? { ...q, pencapaian } : q))
		);
	};

	const updateTanggapan = (id: number, tanggapan: string) => {
		setQuestions(questions.map((q) => (q.id === id ? { ...q, tanggapan } : q)));
	};

	// PERBAIKAN: Update handleTabClick
	const handleTabClick = (index: number) => {
		console.log("Tab clicked:", index);
		setSelectedGroup(index);

		// Load questions untuk group yang dipilih
		if (groups.length > 0 && groups[index]) {
			loadQuestionsForGroup(groups[index]);
		}
	};

	// Helper untuk cek completion satu grup
	const isGroupComplete = (group: GroupIA03) => {
		return group.questions.every(
			(q) => q.result && q.result.answer && q.result.approved !== undefined
		);
	};

	// Helper untuk cek completion semua grup
	const isAllGroupsComplete = groups.length > 0 && groups.every(isGroupComplete);

	// Completion percentage
	const completionCount = groups.filter(isGroupComplete).length;
	const completionPercent =
		groups.length > 0 ? Math.round((completionCount / groups.length) * 100) : 0;

	return (
		<div>
			{/* Error State */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
					<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
					<span className="text-red-800">{error}</span>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-sm p-6">
				{/* Header Info */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
						{/* Kiri */}
						<div className="flex-1">
							<h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
								Skema Sertifikasi ( Okupasi )
								<span className="text-gray-400 text-xs flex items-center gap-1">
									<Clock size={14} />
									Sewaktu
								</span>
							</h2>

							{/* Asesi & Asesor */}
							<div className="text-sm text-gray-500 mt-1">
								Asesi:{" "}
								<span className="text-gray-800">
									{result.assessee.name !== "N/A"
										? result.assessee.name
										: header.asesi}
								</span>{" "}
								&nbsp;|&nbsp; Asesor:{" "}
								<span className="text-gray-800">
									{result.assessor.name !== "N/A"
										? result.assessor.name
										: header.asesor}
								</span>
							</div>
						</div>

						{/* Kanan */}
						<div className="flex-1 text-left sm:text-right">
							<div className="flex flex-col sm:items-end gap-1">
								{/* Skema + kode */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
									<p className="text-sm text-gray-800 font-medium">
										{result.assessment.occupation.name !== "N/A"
											? result.assessment.occupation.name
											: header.skema}
									</p>
									<p className="text-xs text-[#E77D35] bg-[#E77D3533] px-2 py-0.5 rounded w-fit">
										{result.assessment.code !== "N/A"
											? result.assessment.code
											: header.kodeSkema}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Petunjuk */}
				<div className="border-t border-gray-200 pt-4">
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						Panduan Bagi Asesor
					</h3>
					<ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
						{panduanList.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ol>
				</div>
			</div>

			{/* Skenario Tugas Praktik Demonstrasi */}
			<div className="bg-white rounded-lg shadow-sm p-6 mt-4">
				{/* Tabs */}
				{loading ? (
					<div className="flex gap-2 mb-6">
						<div className="px-4 py-2 rounded-sm text-sm bg-gray-200 animate-pulse">
							Loading...
						</div>
					</div>
				) : (
					<div className="flex gap-2 mb-6 overflow-x-auto">
						{tabs.map((tab, index) => (
							<button
								key={tab.id}
								onClick={() => handleTabClick(index)}
								className={`px-4 py-2 rounded-sm text-sm font-medium cursor-pointer whitespace-nowrap ${tab.active
									? "bg-[#E77D35] text-white"
									: "text-gray-600 hover:text-gray-800"
									}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				)}

				{/* Unit Cards Grid */}
				{groups.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						{loading
							? "Memuat unit kompetensi..."
							: "Tidak ada unit kompetensi"}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{unitKompetensi.map((unit, index) => (
							<div
								key={unit.id}
								className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow"
							>
								<div className="flex items-center mb-3">
									<div className="rounded-lg mr-3 flex-shrink-0">
										<Monitor size={16} className="text-[#E77D35]" />
									</div>
									<h4 className="font-medium text-[#E77D35] text-sm">
										Unit kompetensi {index + 1}
									</h4>
								</div>

								<h5 className="font-medium text-gray-800 mb-2 text-sm leading-tight">
									{unit.title}
								</h5>

								<p className="text-xs text-gray-500 mb-4">{unit.code}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Pertanyaan */}
			<div className="bg-white rounded-lg shadow-sm p-6 mt-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
					<h3 className="text-lg font-medium text-gray-800">
						Pertanyaan Observasi
					</h3>
					{/* Completion Progress */}
					<div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">
								Completion: {completionCount} / {groups.length} grup ({completionPercent}%)
							</span>
							<div className="flex-1 h-2 bg-gray-200 rounded w-32">
								<div
									className="h-2 bg-[#E77D35] rounded"
									style={{
										width: `${completionPercent}%`,
									}}
								></div>
							</div>
						</div>
						{completionPercent < 100 && (
							<div className="text-xs text-red-500 mt-1">
								Selesaikan semua pertanyaan di setiap grup untuk mengaktifkan QR!
							</div>
						)}
					</div>
				</div>

				{/* Gabungan Table/Card Responsive */}
				{questions.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						Tidak ada pertanyaan untuk group ini
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-[500px] table-auto border-collapse">
							<thead className="bg-gray-50">
								<tr className="border-b">
									<th className="w-[5%] text-center text-gray-700 font-medium py-3 px-2 text-sm">No</th>
									<th className="w-[30%] text-left text-gray-700 font-medium py-3 px-2 text-sm">Pertanyaan</th>
									<th className="w-[25%] text-center text-gray-700 font-medium py-3 px-2 text-sm">Pencapaian</th>
									<th className="w-[40%] text-center text-gray-700 font-medium py-3 px-2 text-sm">Tanggapan</th>
								</tr>
							</thead>
							<tbody>
								{questions.map((question, index) => (
									<tr key={question.id} className="border-b hover:bg-gray-50">
										{/* No */}
										<td className="py-3 px-2 text-center text-sm">{index + 1}</td>

										{/* Pertanyaan */}
										<td className="py-3 px-2 text-sm text-gray-800">
											{question.text || "Tidak ada pertanyaan"}
										</td>

										{/* Pencapaian */}
										<td className="py-3 px-2">
											<div className="flex justify-center items-center gap-4 flex-wrap">
												{/* Kompeten */}
												<label
													className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm ${question.pencapaian === "kompeten" ? "bg-[#E77D3533]" : ""
														}`}
												>
													<input
														type="radio"
														name={`pencapaian-${question.id}`}
														value="kompeten"
														checked={question.pencapaian === "kompeten"}
														onChange={(e) => updatePencapaian(question.id, e.target.value)}
														className="hidden"
														disabled={isAssessee}
													/>
													<span
														className={`w-4 aspect-square flex items-center justify-center rounded-full border-2
                  ${question.pencapaian === "kompeten" ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}
                  ${isAssessee && "opacity-50 cursor-not-allowed"}`}
													>
														{question.pencapaian === "kompeten" && (
															<Check className="w-4 h-4 text-white" />
														)}
													</span>
													<span className={question.pencapaian === "kompeten" ? "text-gray-900" : "text-gray-500"}>
														Kompeten
													</span>
												</label>

												{/* Belum Kompeten */}
												<label
													className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm ${question.pencapaian === "belum" ? "bg-[#E77D3533]" : ""
														}`}
												>
													<input
														type="radio"
														name={`pencapaian-${question.id}`}
														value="belum"
														checked={question.pencapaian === "belum"}
														onChange={(e) => updatePencapaian(question.id, e.target.value)}
														className="hidden"
														disabled={isAssessee}
													/>
													<span
														className={`w-4 aspect-square flex items-center justify-center rounded-full border-2
                  ${question.pencapaian === "belum" ? "bg-[#E77D35] border-[#E77D35]" : "border-[#E77D35]"}
                  ${isAssessee && "opacity-50 cursor-not-allowed"}`}
													>
														{question.pencapaian === "belum" && (
															<Check className="w-4 h-4 text-white" />
														)}
													</span>
													<span className={question.pencapaian === "belum" ? "text-gray-900" : "text-gray-500"}>
														Belum Kompeten
													</span>
												</label>
											</div>
										</td>

										{/* Tanggapan */}
										<td className="py-3 px-2">
											<textarea
												value={question.tanggapan}
												onChange={(e) => {
													updateTanggapan(question.id, e.target.value);
													setTanggapanErrors((prev) => ({
														...prev,
														[question.id]: e.target.value.trim() ? "" : "tanggapan harus diisi",
													}));
												}}
												placeholder="Tanggapan"
												className={`w-full min-h-[70px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-y ${tanggapanErrors[question.id] ? "border-red-500" : ""
													}`}
												disabled={isAssessee}
											/>
											{tanggapanErrors[question.id] && (
												<span className="text-xs text-red-500 mt-1">{tanggapanErrors[question.id]}</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="flex w-full justify-end mt-2">
					<button
						onClick={handleSaveAllQuestions}
						disabled={loading || isAssessee}
						className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-sm transition-colors disabled:opacity-50 w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed"
					>
						<CheckCircle size={16} />
						{loading ? "Menyimpan..." : "Simpan"}
					</button>
				</div>
			</div>

			{/* Umpan Balik untuk asesi */}
			<div className="bg-white rounded-lg shadow-sm p-6 mt-4">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Kolom Kiri: Form Input Asesi dan Asesor */}
					<div className="flex-1 space-y-6">
						{/* Asesi */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Asesi
							</label>
							<div className="space-y-3">
								<input
									type="text"
									value={
										result.assessee.name !== "N/A" ? result.assessee.name : ""
									}
									readOnly
									placeholder="Nama Asesi"
									className="w-full px-4 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<input
									type="date"
									value={
										result.ia03_header?.updated_at &&
											!isNaN(new Date(result.ia03_header.updated_at).getTime())
											? new Date(result.ia03_header.updated_at)
												.toISOString()
												.split("T")[0]
											: ""
									}
									className="w-full px-4 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						{/* Asesor */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Asesor
							</label>
							<div className="space-y-3">
								<input
									type="text"
									value={
										result.assessor.name !== "N/A" ? result.assessor.name : ""
									}
									readOnly
									placeholder="Nama Asesor"
									className="w-full px-4 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<input
									type="text"
									value={
										result.assessor.no_reg_met !== "N/A"
											? result.assessor.no_reg_met
											: ""
									}
									readOnly
									placeholder="Kode"
									className="w-full px-4 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<input
									type="date"
									value={
										result.ia03_header?.updated_at &&
											!isNaN(new Date(result.ia03_header.updated_at).getTime())
											? new Date(result.ia03_header.updated_at)
												.toISOString()
												.split("T")[0]
											: ""
									}
									className="w-full px-4 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Kolom Kanan: QR Codes dalam 2 Kolom */}
					<div className="flex-1">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* QR Code Asesi */}
							<div className="p-4 bg-white border rounded-lg flex flex-col items-center justify-center py-8 gap-4">
								<h4 className="text-sm font-semibold text-gray-800 text-center">QR Code Asesi</h4>

								{assesseeQrValue && completionPercent === 100 ? (
									<>
										<QRCodeCanvas
											value={assesseeQrValue}
											size={120}
											className="w-40 h-40 object-contain"
										/>
										<div className="text-green-600 font-semibold text-xs text-center">
											Sudah disetujui Asesi
										</div>
									</>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
										<span className="text-gray-400 text-xs text-center">
											Menunggu persetujuan Asesi
										</span>
									</div>
								)}

								<span className="text-sm font-semibold text-gray-800 text-center">
									{result.assessee.name}
								</span>

								{isAssessee &&
									result.ia03_header.approved_assessor &&
									!result.ia03_header.approved_assessee && (
										<button
											onClick={approveByAssessee}
											disabled={completionPercent < 100}
											className={`block text-center bg-[#E77D35] cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${completionPercent < 100
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-orange-600"
												}`}
										>
											Setujui
										</button>
									)}
							</div>

							{/* QR Code Asesor */}
							<div className="p-4 bg-white border rounded-lg flex flex-col items-center justify-center py-8 gap-4">
								<h4 className="text-sm font-semibold text-gray-800 text-center">QR Code Asesor</h4>

								{assessorQrValue && completionPercent === 100 ? (
									<>
										<QRCodeCanvas
											value={assessorQrValue}
											size={120}
											className="w-40 h-40 object-contain"
										/>
										<div className="text-green-600 font-semibold text-xs text-center">
											Sebagai Asesor, Anda sudah setuju
										</div>
									</>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center flex-col gap-1">
										<span className="text-gray-400 text-xs text-center">QR Code Asesor</span>
										<span className="text-gray-400 text-xs text-center">Klik tombol "Generate QR"</span>
									</div>
								)}

								<span className="text-sm font-semibold text-gray-800 text-center">
									{result.assessor.name}
								</span>

								{!isAssessee && !result.ia03_header.approved_assessor && (
									<button
										onClick={approveByAssessor}
										disabled={completionPercent < 100}
										className={`block text-center bg-[#E77D35] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${completionPercent < 100
											? "opacity-50 cursor-not-allowed"
											: "hover:bg-orange-600"
											}`}
									>
										Setujui
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
