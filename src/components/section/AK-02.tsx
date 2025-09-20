import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { ResultAK02, UnitCompetensi } from "@/model/ak02-model";
import routes from "@/routes/paths";
import { AlertCircle, Calendar, Check, FileText, QrCode, Save } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ConfirmModal";
import useToast from "../ui/useToast";

// Evidence types
export const evidenceTypes = [
	"Observasi Demonstrasi",
	"Portofolio",
	"Pernyataan Pihak Ketiga",
	"Pernyataan Wawancara",
	"Pertanyaan Lisan",
	"Pertanyaan Tertulis",
	"Proyek Kerja",
	"Lainnya",
];

export default function AK02({
	isAssessee,
	id_assessment,
	id_result,
	id_asesi,
	id_asesor,
	mutateNavigation,
}: {
	isAssessee: boolean;
	id_assessment: string;
	id_result: string;
	id_asesi: string;
	id_asesor: string;
	mutateNavigation?: () => void;
}) {
	const { user } = useAuth();
	const navigate = useNavigate();
	// Loading and error states
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Data state
	const [data, setData] = useState<ResultAK02>({
		id: 0,
		assessment: {
			id: 0,
			code: "N/A",
			occupation: {
				id: 0,
				name: "N/A",
				scheme: {
					id: 0,
					name: "N/A",
					code: "N/A",
				},
			},
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
		created_at: "N/A",
		ak02_headers: {
			id: 0,
			approved_assessee: false,
			approved_assessor: false,
			is_competent: null,
			follow_up: "",
			comment: "",
			rows: [],
		},
	});

	const [units, setUnits] = useState<UnitCompetensi[]>([]);

	// Form state
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, boolean>
	>({});
	const [assessmentResult, setAssessmentResult] = useState<string>("");
	const [followUp, setFollowUp] = useState<string>("");
	const [assessorComments, setAssessorComments] = useState<string>("");

	// QR Code states
	const [assesseeQrValue, setAssesseeQrValue] = useState("");
	const [assessorQrValue, setAssessorQrValue] = useState("");

	// Modal state
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [pendingValue, setPendingValue] = useState<string>("");

	const [saveHeaderError, setSaveHeaderError] = useState<string | null>(null);
	const toast = useToast();


	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			await loadUnits();
			await loadAK02Data();
		} catch (error) {
			setError("Terjadi kesalahan saat memuat data");
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadUnits = async () => {
		try {
			console.log("Loading units for result ID:", id_result);
			const response = await api.get(`/assessments/ak-02/units/${id_result}`);
			console.log("Units API response:", response.data);

			if (response.data.success) {
				const apiUnits = response.data.data.units;
				console.log("API units:", apiUnits);

				const mappedUnits = apiUnits.map((unit: any) => ({
					id: unit.id,
					code: unit.code,
					title: unit.title,
				}));
				console.log("Mapped units:", mappedUnits);

				setUnits(mappedUnits);
				return mappedUnits;
			}
			return [];
		} catch (error) {
			console.error("Failed to load units:", error);
			throw error;
		}
	};

	const loadAK02Data = async (preserveFormState = false) => {
		try {
			const response = await api.get(`/assessments/ak-02/result/${id_result}`);
			const rawData = response.data;

			if (rawData.success) {
				setData(rawData.data);

				if (!preserveFormState) {
					const ak02Headers = rawData.data.ak02_headers;
					if (ak02Headers.is_competent !== null) {
						setAssessmentResult(
							ak02Headers.is_competent ? "kompeten" : "belum-kompeten"
						);
					}
					setFollowUp(ak02Headers.follow_up || "");
					setAssessorComments(ak02Headers.comment || "");
				}

				// Generate QR codes if already approved
				if (rawData.data.ak02_headers.approved_assessor) {
					setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				}

				if (rawData.data.ak02_headers.approved_assessee) {
					setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				}
			} else {
				setError(rawData?.message || "Gagal memuat data AK02");
			}
		} catch (error) {
			console.error("Failed to load AK02 data:", error);
			throw error;
		}
	};

	useEffect(() => {
		if (units.length > 0 && data.ak02_headers.rows.length > 0) {
			const newSelectedOptions: Record<string, boolean> = {};

			data.ak02_headers.rows.forEach((row: any) => {
				// Find unit index by matching unit ID
				const unitIndex = units.findIndex((unit) => unit.id === row.unit_id);
				if (unitIndex !== -1) {
					// For each evidence in this row
					row.evidences.forEach((evidence: any) => {
						// Find evidence type index
						const evidenceIndex = evidenceTypes.indexOf(evidence.evidence);
						if (evidenceIndex !== -1) {
							const key = `${unitIndex}-${evidenceIndex}`;
							newSelectedOptions[key] = true;
						}
					});
				}
			});
			setSelectedOptions(newSelectedOptions);
		}
	}, [units, data.ak02_headers.rows]);

	const handleCheckboxChange = (unitIndex: number, evidenceIndex: number) => {
		if (isAssessee) return;
		const key = `${unitIndex}-${evidenceIndex}`;
		setSelectedOptions((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const isChecked = (unitIndex: number, evidenceIndex: number): boolean => {
		const key = `${unitIndex}-${evidenceIndex}`;
		return !!selectedOptions[key];
	};

	const handleAssessmentResultChange = (value: string) => {
		if (isAssessee) return;
		if (assessmentResult === value) {
			setAssessmentResult("");
		} else {
			setAssessmentResult(value);
			if (value === "kompeten") {
				setFollowUp("");
			}
		}
	};

	const handleSubmit = async () => {
		if (isAssessee) return;
		if (!user || user.role_id !== 2) {
			alert("Hanya asesor yang dapat mengirim data asesmen.");
			return;
		}

		if (!validateForm()) {
			return;
		}

		try {
			const rows: any[] = [];

			Object.entries(selectedOptions).forEach(([key, isSelected]) => {
				if (isSelected) {
					const [unitIndexStr, evidenceIndexStr] = key.split("-");
					const unitIndex = parseInt(unitIndexStr);
					const evidenceIndex = parseInt(evidenceIndexStr);

					// Use units from API
					const unit = units[unitIndex];
					const evidenceType = evidenceTypes[evidenceIndex];

					if (unit && evidenceType) {
						const existingRow = rows.find((row) => row.uc_id === unit.id);
						if (existingRow) {
							existingRow.evidences.push(evidenceType);
						} else {
							rows.push({
								uc_id: unit.id,
								evidences: [evidenceType],
							});
						}
					}
				}
			});

			if (rows.length === 0) {
				alert("Pilih minimal satu bukti untuk unit kompetensi.");
				return;
			}

			const submitData = {
				result_id: Number(id_result),
				is_competent: assessmentResult === "kompeten",
				follow_up: followUp,
				comment: assessorComments,
				rows: rows,
			};

			console.log("Submit data:", submitData);

			const response = await api.post(
				"/assessments/ak-02/result/send",
				submitData
			);

			if (response.data.success) {
				toast?.show({
					type: "success",
					title: "Berhasil",
					description: "Data asesmen berhasil disimpan!",
				});
			} else {
				toast?.show({
					type: "error",
					title: "Gagal",
					description: response.data.message || "Terjadi kesalahan",
				});
			}
		} catch (error: any) {
			console.error("Submit error:", error);

			// Show detailed error message
			if (error.response?.data?.message) {
				alert(`Error: ${error.response.data.message}`);
			} else if (error.response?.data?.error) {
				alert(`Error: ${error.response.data.error}`);
			} else {
				alert("Terjadi kesalahan saat menyimpan data");
			}
		}
	};

	const handleGenerateQRCode = async () => {
		if (isAssessee) return;
		try {
			const response = await api.put(
				`/assessments/ak-02/result/assessor/${id_result}/approve`
			);
			if (response.data.success) {
				setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				if (mutateNavigation) mutateNavigation();
				// Reload data but preserve form state
				await loadAK02Data(true);
			}
		} catch (error) {
			console.log("Error Generating QR Code:", error);
		}
	};

	const handleAssesseeApproval = async () => {
		if (!isAssessee) return;
		try {
			const response = await api.put(
				`/assessments/ak-02/result/assessee/${id_result}/approve`
			);
			if (response.data.success) {
				setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				if (mutateNavigation) mutateNavigation();
				// Reload data but preserve form state
				await loadAK02Data(true);
			}
		} catch (error) {
			console.log("Error approving assessee:", error);
		}
	};

	// Handler tombol simpan: buka modal dulu
	const handleSaveClick = () => {
		setPendingValue(
			assessmentResult === "kompeten"
				? "Kompeten"
				: assessmentResult === "belum-kompeten"
					? "Belum Kompeten"
					: ""
		);
		setShowConfirmModal(true);
	};

	// Handler konfirmasi modal
	const handleConfirmSave = async () => {
		setShowConfirmModal(false);
		await handleSubmit();
	};

	// Fungsi untuk memeriksa apakah setiap unit memiliki minimal satu bukti
	const validateAllUnitsHaveEvidence = (): boolean => {
		// Untuk setiap unit, periksa apakah ada minimal satu bukti yang dicentang
		for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
			let hasEvidence = false;

			// Periksa semua evidence types untuk unit ini
			for (let evidenceIndex = 0; evidenceIndex < evidenceTypes.length; evidenceIndex++) {
				const key = `${unitIndex}-${evidenceIndex}`;
				if (selectedOptions[key]) {
					hasEvidence = true;
					break;
				}
			}

			// Jika tidak ada bukti untuk unit ini, return false
			if (!hasEvidence) {
				return false;
			}
		}

		return true;
	};

	// Modifikasi fungsi validateForm
	const validateForm = () => {
		if (!assessmentResult) {
			alert("Pilih hasil asesmen: Kompeten atau Belum Kompeten");
			return false;
		}

		if (!assessorComments.trim()) {
			alert("Komentar asesor wajib diisi");
			return false;
		}

		if (assessmentResult === "belum-kompeten" && !followUp.trim()) {
			alert('Tindak lanjut wajib diisi untuk hasil "Belum Kompeten"');
			return false;
		}

		// Validasi bahwa setiap unit memiliki minimal satu bukti
		if (units.length > 0) {
			// Periksa apakah semua unit memiliki minimal satu bukti
			if (!validateAllUnitsHaveEvidence()) {
				alert("Setiap unit kompetensi harus memiliki minimal satu bukti yang dipilih");
				return false;
			}
		}

		return true;
	};

	// Opsi: Tambahkan juga fungsi untuk menandai unit yang belum memiliki bukti
	// (ini akan berguna untuk memberikan visual feedback)
	const getUnitValidationStatus = (unitIndex: number): { isValid: boolean, message: string } => {
		let hasEvidence = false;

		for (let evidenceIndex = 0; evidenceIndex < evidenceTypes.length; evidenceIndex++) {
			const key = `${unitIndex}-${evidenceIndex}`;
			if (selectedOptions[key]) {
				hasEvidence = true;
				break;
			}
		}

		return {
			isValid: hasEvidence,
			message: hasEvidence ? "" : "Pilih minimal satu bukti untuk unit ini"
		};
	};

	{
		units.map((unit, unitIndex) => {
			const validationStatus = getUnitValidationStatus(unitIndex);

			return (
				<tr
					key={unit.id}
					className={`border-b border-gray-100 hover:bg-gray-50 ${!validationStatus.isValid ? "bg-red-50" : ""
						}`}
				>
					<td className="py-4 px-4 text-gray-800 font-medium">
						<div className="text-sm text-gray-500 mb-1">
							{unit.code}
						</div>
						<div>{unit.title}</div>
						{!validationStatus.isValid && (
							<div className="text-red-500 text-xs mt-1">
								{validationStatus.message}
							</div>
						)}
					</td>
					{evidenceTypes.map((_, evidenceIndex) => (
						<td key={evidenceIndex} className="py-4 px-3 text-center">
							<label className="inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={isChecked(unitIndex, evidenceIndex)}
									onChange={() => handleCheckboxChange(unitIndex, evidenceIndex)}
									disabled={isAssessee || !!data.ak02_headers?.approved_assessor} // Disable jika asesi atau asesor sudah approve
									className="hidden peer"
								/>
								<span
									className={`w-5 h-5 flex items-center justify-center rounded border-2 border-gray-300 transition
          ${isAssessee || !!data.ak02_headers?.approved_assessor
											? "opacity-60 cursor-not-allowed"
											: "peer-checked:bg-[#E77D35] peer-checked:border-[#E77D35] hover:border-gray-400"
										}
          ${isChecked(unitIndex, evidenceIndex) && (isAssessee || !!data.ak02_headers?.approved_assessor)
											? "bg-gray-300 border-gray-300" // Tampilan checked tapi disabled
											: ""
										}
        `}
								>
									<Check
										className={`w-4 h-4 text-white ${isChecked(unitIndex, evidenceIndex) ? "block" : "hidden"
											}`}
									/>
								</span>
							</label>
						</td>
					))}
				</tr>
			);
		})
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
					<h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchData}
						className="bg-[#E77D35] text-white px-4 py-2 rounded hover:bg-orange-600"
					>
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header Info Section */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
					<div className="flex items-center space-x-3 flex-wrap">
						<h2 className="text-sm font-medium text-gray-800">
							Skema Sertifikasi (Okupasi)
						</h2>
						<div className="flex items-center space-x-2">
							<FileText className="w-5 h-5 text-gray-400" />
							<span className="text-sm text-gray-600">Sewaktu</span>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
						<div className="text-sm text-gray-700">
							{data.assessment.occupation.name}
						</div>
						<div className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] sm:ml-5">
							{data.assessment.code}
						</div>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
						<div className="flex flex-wrap">
							<span className="font-semibold mr-1">Asesi:</span>
							<span>{data.assessee.name}</span>
						</div>
						<div className="flex flex-wrap">
							<span className="font-semibold mr-1">Asesor:</span>
							<span>{data.assessor.name}</span>
						</div>
					</div>

					<div className="flex flex-col xl:flex-row xl:items-center space-y-1 xl:space-y-0 xl:space-x-2 text-gray-600 text-sm lg:ml-auto">
						<span className="whitespace-nowrap">
							{new Date(data.created_at).toLocaleDateString("id-ID")} | TUK:{" "}
							{data.tuk}
						</span>
					</div>
				</div>
			</div>

			{/* Unit Kompetensi Table - Only show for assessor, using API units */}
			{units.length > 0 && (
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
					<div className="p-6 border-b border-gray-200">
						<p className="text-gray-700">
							Beri tanda centang (✓) di kolom yang sesuai untuk mencerminkan
							bukti yang sesuai untuk setiap Unit Kompetensi.
						</p>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-64">
										Unit Kompetensi
									</th>
									{evidenceTypes.map((evidence, index) => (
										<th
											key={index}
											className="text-center py-4 px-3 font-semibold text-gray-700 min-w-24 text-xs"
										>
											{evidence}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{units.map((unit, unitIndex) => (
									<tr
										key={unit.id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-4 px-4 text-gray-800 font-medium">
											<div className="text-sm text-gray-500 mb-1">
												{unit.code}
											</div>
											<div>{unit.title}</div>
										</td>
										{evidenceTypes.map((_, evidenceIndex) => (
											<td key={evidenceIndex} className="py-4 px-3 text-center">
												<label className="inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={isChecked(unitIndex, evidenceIndex)}
														onChange={() => handleCheckboxChange(unitIndex, evidenceIndex)}
														disabled={isAssessee || !!data.ak02_headers?.approved_assessor} // Disable jika asesi atau asesor sudah approve
														className="hidden peer"
													/>
													<span
														className={`w-5 h-5 flex items-center justify-center rounded border-2 border-gray-300 transition
          ${isAssessee || !!data.ak02_headers?.approved_assessor
																? "opacity-60 cursor-not-allowed"
																: "peer-checked:bg-[#E77D35] peer-checked:border-[#E77D35] hover:border-gray-400"
															}
          ${isChecked(unitIndex, evidenceIndex) && (isAssessee || !!data.ak02_headers?.approved_assessor)
																? "bg-[#E77D35] border-orange-500" // Tampilan checked tapi disabled
																: ""
															}
        `}
													>
														<Check
															className={`w-4 h-4 text-white ${isChecked(unitIndex, evidenceIndex) ? "block" : "hidden"
																}`}
														/>
													</span>
												</label>

											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Bottom form */}
			<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
				{/* Bagian Rekomendasi - Full Width */}
				<div className="mb-6">
					<h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi</h3>
					<div className="space-y-3">
						{!data ? (
							<div className="text-gray-500">Memuat rekomendasi...</div>
						) : (
							<>
								<label
									className={`flex items-start space-x-3 transition
    ${isAssessee || !!data.ak02_headers?.approved_assessor ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `}
								>
									<input
										type="radio"
										name="recommendation"
										checked={assessmentResult === "kompeten"}
										onChange={() => handleAssessmentResultChange("kompeten")}
										className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
										disabled={isAssessee || !!data.ak02_headers?.approved_assessor}
									/>
									<span
										className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
      ${assessmentResult === "belum-kompeten" ? "line-through opacity-50" : ""}
    `}
									>
										Asesi telah memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan{" "}
										<strong>KOMPETEN</strong>
									</span>
								</label>

								<label
									className={`flex items-start space-x-3 transition
    ${isAssessee || !!data.ak02_headers?.approved_assessor ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `}
								>
									<input
										type="radio"
										name="recommendation"
										checked={assessmentResult === "belum-kompeten"}
										onChange={() => handleAssessmentResultChange("belum-kompeten")}
										className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
										disabled={isAssessee || !!data.ak02_headers?.approved_assessor}
									/>
									<span
										className={`text-sm text-gray-700 leading-relaxed transition-all duration-300
      ${assessmentResult === "kompeten" ? "line-through opacity-50" : ""}
    `}
									>
										Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja, direkomendasikan{" "}
										<strong className="text-red-600">BELUM KOMPETEN</strong>
									</span>
								</label>
							</>
						)}
					</div>
				</div>

				{/* Tindak Lanjut */}
				<div className="mb-6">
					<label className={`block text-sm font-medium mb-2 ${isAssessee || assessmentResult === 'kompeten' ? "text-gray-400" : "text-gray-700"
						}`}>
						Tindak lanjut yang dibutuhkan
						{assessmentResult === 'belum-kompeten' && !isAssessee && (
							<span className="text-red-500 ml-1">*</span>
						)}
					</label>
					<p className="text-xs text-gray-500 mb-2">
						(Masukkan pekerjaan tambahan dan asesmen yang diperlukan untuk mencapai kompetensi)
					</p>
					<div className={`border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#E77D35] ${isAssessee || assessmentResult === 'kompeten' ? 'bg-gray-100' : ''
						}`}>
						<textarea
							value={followUp}
							onChange={(e) => setFollowUp(e.target.value)}
							disabled={isAssessee || assessmentResult === 'kompeten' || !!data.ak02_headers?.approved_assessor} // Tambahkan kondisi approved_assessor
							className={`w-full resize-none border-none outline-none text-sm ${isAssessee || assessmentResult === 'kompeten' || !!data.ak02_headers?.approved_assessor
								? 'bg-gray-100 text-gray-500 cursor-not-allowed'
								: ''
								}`}
							rows={3}
							placeholder={
								assessmentResult === 'kompeten'
									? 'Tidak diperlukan untuk hasil kompeten'
									: ''
							}
						/>
					</div>
				</div>

				{/* Komentar Asesor */}
				<div className="mb-6">
					<label className={`block text-sm font-medium mb-2 ${isAssessee ? "text-gray-400" : "text-gray-700"
						}`}>
						Komentar/ Observasi oleh asesor
						{!isAssessee && <span className="text-red-500 ml-1">*</span>}
					</label>
					<div className={`border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#E77D35] ${isAssessee ? 'bg-gray-100' : ''
						}`}>
						<textarea
							value={assessorComments}
							onChange={(e) => setAssessorComments(e.target.value)}
							disabled={isAssessee || !!data.ak02_headers?.approved_assessor} // Tambahkan kondisi approved_assessor
							className={`w-full resize-none border-none outline-none text-sm ${isAssessee || !!data.ak02_headers?.approved_assessor
								? 'text-gray-500 cursor-not-allowed'
								: ''
								}`}
							rows={3}
							placeholder=""
						/>
					</div>
				</div>

				{/* Dua Kolom: Asesi/Asesor dan QR Code */}
				<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start">
					{/* Kolom Kiri - Asesi dan Asesor */}
					<div className="h-full flex flex-col">
						<div className='mb-2'>
							<label className="block text-sm font-medium text-gray-700 mb-2">Pada :</label>
						</div>

						{/* Bagian Asesi dan Asesor */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Asesi */}
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
								<div className="mb-3">
									<input
										type="text"
										value={data?.assessee?.name || '-'}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="relative mb-4">
									<input
										type="text"
										value={new Date().toLocaleDateString('id-ID')}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
										readOnly
									/>
									<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
								</div>
							</div>

							{/* Asesor */}
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
								<div className="mb-3">
									<input
										type="text"
										value={data?.assessor?.name || '-'}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="mb-3">
									<input
										type="text"
										value={data?.assessor?.no_reg_met || '-'}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="relative">
									<input
										type="text"
										value={new Date().toLocaleDateString('id-ID')}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
										readOnly
									/>
									<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
								</div>
							</div>
						</div>
					</div>

					{/* Kolom Kanan - QR Code */}
					<div className="h-full flex flex-col">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* QR Asesi */}
							<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
								{data?.ak02_headers?.approved_assessee && assesseeQrValue ? (
									<QRCodeCanvas
										value={assesseeQrValue}
										size={100}
										className="w-40 h-40 object-contain"
									/>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
										<span className="text-gray-400 text-sm text-center">
											{data?.ak02_headers?.approved_assessee
												? "QR Asesi sudah disetujui"
												: "QR Code Asesi"}
										</span>
									</div>
								)}
								<span className="text-sm font-semibold text-gray-800">
									{data?.assessee?.name || "-"}
								</span>
								{data?.ak02_headers?.approved_assessee && (
									<span className="text-green-600 font-semibold text-sm mt-2">
										Sudah disetujui asesi
									</span>
								)}
								{/* Tambahkan tombol approval untuk asesi */}
								{isAssessee && !data?.ak02_headers?.approved_assessee && (
									<button
										onClick={handleAssesseeApproval}
										disabled={!data?.ak02_headers?.approved_assessor}
										className={`mt-4 px-4 py-2 rounded transition font-medium shadow-sm
      											${!data?.ak02_headers?.approved_assessor
												? "bg-gray-300 text-gray-500 cursor-not-allowed"
												: "bg-[#E77D35] text-white hover:bg-orange-600 cursor-pointer"}`}
									>
										Setujui sebagai Asesi
									</button>
								)}
							</div>

							{/* QR Asesor */}
							<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
								{assessorQrValue ? (
									<QRCodeCanvas
										value={assessorQrValue}
										size={100}
										className="w-40 h-40 object-contain"
									/>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
										<span className="text-gray-400 text-sm text-center">
											QR Code Asesor
										</span>
									</div>
								)}
								<span className="text-sm font-semibold text-gray-800">
									{data?.assessor?.name || "-"}
								</span>
								{data?.ak02_headers?.approved_assessor === true && (
									<span className="text-green-600 font-semibold text-sm mt-2 text-center">
										{isAssessee
											? "Asesor sudah menyetujui"
											: "Sebagai Asesor, Anda sudah setuju"}
									</span>
								)}
							</div>

							{/* Section bawah tombol (full width, col-span-2) */}
							{!isAssessee && (
								<div className="col-span-1 sm:col-span-2 mt-8 flex flex-col items-center gap-4">
									{saveHeaderError && (
										<span className="text-red-500 text-sm text-center">{saveHeaderError}</span>
									)}

									{/* Tombol Simpan Rekomendasi */}
									<div className="w-full flex flex-col gap-4">
										<div>
											<div className="text-gray-500 text-xs mb-2 text-center">
												{!assessmentResult
													? "Pilih rekomendasi terlebih dahulu"
													: assessorQrValue
														? "Setelah generate QR, rekomendasi tidak dapat diubah"
														: "Simpan rekomendasi sebelum generate QR"}
											</div>
											<button
												onClick={handleSaveClick}
												disabled={isAssessee || !assessmentResult || assessorQrValue}
												className={`flex items-center justify-center w-full bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isAssessee || !assessmentResult || assessorQrValue
													? "cursor-not-allowed opacity-50"
													: "hover:bg-green-700 cursor-pointer"
													}`}
											>
												<Save size={18} className="mr-2" />
												Simpan Rekomendasi
											</button>
										</div>

										{/* Generate QR */}
										<div>
											<button
												onClick={handleGenerateQRCode}
												disabled={isAssessee || assessorQrValue || !data.ak02_headers}
												className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isAssessee || assessorQrValue || !data.ak02_headers
													? "cursor-not-allowed opacity-50"
													: "hover:bg-orange-600 cursor-pointer"
													}`}
											>
												<QrCode size={18} className="mr-2" />
												{assessorQrValue
													? "QR Sudah Digenerate"
													: "Generate QR"}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>


			{/* Modal Konfirmasi */}
			<ConfirmModal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={handleConfirmSave}
				title="Konfirmasi Simpan"
				message={
					<>
						<div>Anda akan menyimpan pilihan berikut:</div>
						<div className="mt-2 font-bold">{pendingValue}</div>
					</>
				}
				confirmText="Simpan"
				cancelText="Batal"
				type="warning"
			/>
		</div>
	);
}
