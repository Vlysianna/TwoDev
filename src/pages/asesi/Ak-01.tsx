import React, { useState, useEffect } from "react";
import { FileCheck2, ChevronLeft, AlertCircle, Check } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link, useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import type { ResultAK01 } from "@/model/ak01-model";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import { QRCodeCanvas } from "qrcode.react";
import useToast from "@/components/ui/useToast";

export default function Ak01() {
	const { id_result, id_assessment, id_asesi, id_asesor } =
		useAssessmentParams();

	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tukError, setTukError] = useState<string | null>(null); // State untuk error TUK

	const [data, setData] = useState<ResultAK01>({
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
		locations: [],
		ak01_header: {
			id: 0,
			approved_assessee: false,
			approved_assessor: false,
			created_at: "N/A",
			updated_at: "N/A",
		},
	});

	const [selectedTUK, setSelectedTUK] = useState("");
	const [selectedEvidences, setSelectedEvidences] = useState<string[]>([]);
	const [assesseeQrValue, setAssesseeQrValue] = useState("");
	const [assessorQrValue, setAssessorQrValue] = useState("");
	const [selectedTime, setSelectedTime] = useState("07:00");

	useEffect(() => {
		fetchData();
	}, [user]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get(`assessments/ak-01/data/${id_result}`);
			const rawData = response.data;
			if (rawData.success) {
				setData(rawData.data);

				if (rawData.data.ak01_header.rows.length > 0) {
					setSelectedEvidences(
						rawData.data.ak01_header.rows.flatMap((row: any) => row.evidence)
					);
					setSelectedTUK(
						rawData.data.locations[rawData.data.locations.length - 1] || ""
					);
				}

				if (rawData.data.ak01_header.approved_assessor) {
					setAssessorQrValue(getAssessorUrl(Number(id_asesor)));
				}

				if (rawData.data.ak01_header.approved_assessee) {
					setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
				}
			} else {
				setError(response?.data?.message || "Gagal memuat data");
			}
		} catch (error) {
			setError("Terjadi kesalahan saat memuat data");
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerateQRCode = async () => {
		try {
			const response = await api.put(
				`/assessments/ak-01/result/assessee/${id_result}/approve`
			);
			if (response.data.success) {
				setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));
			}
		} catch (error) {
			console.log("Error fetching unit competencies:", error);
		}
	};

	const navigate = useNavigate();
	const handleOnSubmit = async () => {
		// Validasi TUK
		if (!selectedTUK) {
			setTukError("TUK harus dipilih");
			return;
		}

		setTukError(null); // Hapus error jika validasi berhasil

		const requestData = {
			result_id: id_result,
			evidences: selectedEvidences,
		};

		try {
			const response = await api.post(`/assessments/ak-01/`, requestData);
			if (response.data.success) {
				toast.show({
					title: "Berhasil",
					description: "Berhasil menyimpan data",
					type: "success",
				});
			} else {
				toast.show({
					title: "Gagal",
					description: "Gagal menyimpan data",
					type: "error",
				});
			}
		} catch (error) {
			console.log("Error fetching unit competencies:", error);
		}
	};

	const evidenceOptions = [
		"Verifikasi Portofolio",
		"Review Produk",
		"Observasi Langsung",
		"Kegiatan Terstruktur",
		"Pertanyaan Lisan",
		"Pertanyaan Tertulis",
		"Pertanyaan Wawancara",
		"Lainnya",
	];

	const toast = useToast();

	const handleCheckboxChange = (evidence: string) => {
		setSelectedEvidences((prev) => {
			if (prev.includes(evidence)) {
				return prev.filter((item) => item !== evidence);
			} else {
				return [...prev, evidence];
			}
		});
	};

	const handleTUKChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTUK(e.target.value);
		// Hapus error ketika pengguna mulai memilih TUK
		if (tukError) {
			setTukError(null);
		}
	};

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
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesi
						title="Persetujuan Asesmen dan Kerahasiaan"
						icon={
							<Link
								to={paths.asesi.dashboard}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>

				<main className='m-4'>
					<div className="bg-white rounded-lg shadow-sm p-6">
						{/* Header Section */}
						<div className="mb-4 border-b border-gray-200 pb-4">
							<div className="flex items-center gap-2">
								<FileCheck2 className="text-black-500" size={20} />
								<h2 className="text-lg font-semibold text-gray-800">
									Persetujuan Asesmen dan Kerahasiaan
								</h2>
							</div>
							<p className="text-gray-600 text-sm mt-2">
								Persetujuan Asesmen ini untuk menjamin bahwa Asesi telah diberi
								arahan secara rinci tentang perencanaan dan proses asesmen
							</p>
						</div>

						<div className="pt-6">
							{/* Top grid 2 columns */}
							{/* Top grid responsive */}
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
								{/* Left column */}
								<div className="lg:col-span-7">
									<h2 className="font-semibold text-gray-800 mb-3">
										Skema Sertifikasi (KKNI/Okupasi/Klaster)
									</h2>
									<div className="text-sm mb-7 flex flex-wrap items-center gap-2">
										<span className="text-gray-700">
											{data.assessment.occupation.name}
										</span>
										<span className="bg-orange-100 text-[#E77D35] text-xs rounded px-2 py-1 select-none">
											{data.assessment.code}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
										<input
											type="text"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
											value={data.assessee.name}
											readOnly
										/>
										<input
											type="text"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
											value={data.assessor.name}
											readOnly
										/>
									</div>

									<label className="block mb-2 text-sm font-medium text-gray-700">
										Pelaksanaan asesmen disepakati pada:
									</label>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<input
											type="date"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
											value={new Date().toISOString().split("T")[0]}
											readOnly
										/>
										<input
											type="time"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
											value={selectedTime}
											readOnly // Kolom jam dibuat read-only
										/>
										<div>
											<select
												className={`w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 cursor-pointer ${tukError ? "border border-red-500" : ""
													}`}
												value={selectedTUK}
												onChange={handleTUKChange}
												onBlur={() => {
													if (!selectedTUK) setTukError("TUK harus dipilih");
												}}
											>
												<option value="">Pilih TUK</option>
												{data.locations &&
													Array.from(new Set(data.locations))
														.sort()
														.map((location, index) => (
															<option key={index} value={location}>
																{location}
															</option>
														))}
											</select>

											{/* Pesan error */}
											{tukError && (
												<p className="text-red-500 text-xs mt-1">{tukError}</p>
											)}

											{/* Keterangan wajib memilih */}
											<p className="text-gray-400 text-xs mt-1 italic">
												*Anda harus memilih TUK sebelum melanjutkan
											</p>
										</div>
									</div>
								</div>

								{/* Right column */}
								<div className="lg:col-span-5">
									<h2 className="font-semibold text-gray-800 mb-3">
										Bukti yang akan dikumpulkan
									</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm mt-4">
										{evidenceOptions.map((option) => {
											const checked =
												selectedEvidences?.includes(option) || false;
											return (
												<label
													key={option}
													className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition
                                    ${checked ? "bg-orange-100 " : ""}`}
												>
													<input
														type="checkbox"
														className="hidden"
														checked={checked}
														onChange={() => handleCheckboxChange(option)}
													/>
													<span
														className={`w-4 h-4 flex items-center justify-center rounded-xs border-2
                                    ${checked
																? "bg-[#E77D35] border-[#E77D35]"
																: "border-[#E77D35]"
															}`}
													>
														{checked && (
															<Check className="w-4 h-4 text-white" />
														)}
													</span>
													<span
														className={
															checked ? "text-gray-900" : "text-gray-500"
														}
													>
														{option}
													</span>
												</label>
											);
										})}
									</div>
								</div>
							</div>

							{/* Declaration Sections */}
							<div className="mt-8 border-t border-gray-200 pt-6">
								<div className="flex flex-col lg:flex-row justify-between gap-6">
									{/* Kiri: isi teks */}
									<div className="flex-1 space-y-6">
										<div>
											<h3 className="font-semibold text-gray-900 mb-2">
												Asesi :
											</h3>
											<p className="text-gray-700 leading-relaxed">
												Bahwa saya telah mendapatkan penjelasan terkait hak dan
												prosedur banding asesmen dari asesor.
											</p>
										</div>

										<div>
											<h3 className="font-semibold text-gray-900 mb-2">
												Asesor :
											</h3>
											<p className="text-gray-700 leading-relaxed">
												Menyatakan tidak akan membuka hasil pekerjaan yang saya
												peroleh karena penugasan saya sebagai Asesor dalam
												pekerjaan Asesmen kepada siapapun atau organisasi apapun
												selain kepada pihak yang berwenang sehubungan dengan
												kewajiban saya sebagai Asesor yang ditugaskan oleh LSP.
											</p>
										</div>

										<div>
											<h3 className="font-semibold text-gray-900 mb-2">
												Asesi :
											</h3>
											<p className="text-gray-700 leading-relaxed">
												Saya setuju mengikuti asesmen dengan pemahaman bahwa
												informasi yang dikumpulkan hanya digunakan untuk
												pengembangan profesional dan hanya dapat diakses oleh
												orang tertentu saja.
											</p>
										</div>
									</div>

									{/* QR Code Section */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
										<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
											{assesseeQrValue && (
												<QRCodeCanvas
													value={assesseeQrValue}
													size={156}
													className="w-40 h-40 object-contain"
												>
													{assesseeQrValue}
												</QRCodeCanvas>
											)}
											<span className="text-sm font-semibold text-gray-800">
												{data.assessee.name}
											</span>
											{!assesseeQrValue && (
												<button
													disabled={assesseeQrValue !== ""}
													onClick={() => {
														if (!assesseeQrValue && assessorQrValue)
															handleGenerateQRCode();
													}}
													className={`block text-center cursor-pointer bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${!assesseeQrValue && assessorQrValue
														? "hover:bg-orange-600"
														: "cursor-not-allowed opacity-50"
														}`}
												>
													Setujui
												</button>
											)}
										</div>
										<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
											{assessorQrValue && (
												<QRCodeCanvas
													value={assessorQrValue}
													size={156}
													className="w-40 h-40 object-contain"
												>
													{assessorQrValue}
												</QRCodeCanvas>
											)}
											<span className="text-sm font-semibold text-gray-800">
												{data.assessor.name}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-10 border-t border-gray-200 pt-6 flex flex-col items-center sm:items-end">
								<button
									type="submit"
									className={`w-full sm:w-auto bg-[#E77D35] text-white py-2 px-30 rounded transition-colors ${!selectedTUK ||
										!selectedTime ||
										!selectedEvidences ||
										selectedEvidences.length === 0
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-orange-600 cursor-pointer"
										}`}
									onClick={(e) => {
										if (
											!selectedTUK ||
											!selectedTime ||
											!selectedEvidences ||
											selectedEvidences.length === 0
										)
											e.preventDefault();
										handleOnSubmit();
									}}
									disabled={
										!selectedTUK ||
										!selectedTime ||
										!selectedEvidences ||
										selectedEvidences.length === 0
									}
								>
									Simpan
								</button>
								{tukError && (
									<p className="text-red-500 text-xs mt-2">{tukError}</p>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}