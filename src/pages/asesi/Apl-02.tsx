import { useState, useEffect } from "react";
import { Monitor, ChevronRight, AlertCircle, House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NavbarAsesi from "@/components/NavbarAsesi";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider"; import ConfirmModal from "@/components/ConfirmModal";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl } from "@/lib/hashids";

export default function Apl02() {
	const { id_schedule: id_assessment, id_asesor, id_result, id_asesi, mutateNavigation } =
		useAssessmentParams();

	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [assessments, setAssessments] = useState<any>();
	const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
	const [completedUnits, setCompletedUnits] = useState<number>(0);
	const [resultData, setResultData] = useState<any>();
	const [generatingQr, setGeneratingQr] = useState(false);
	const [qrError, setQrError] = useState<string | null>(null);
	const [assesseeQrValue, setAssesseeQrValue] = useState("");
	const [assessorQrValue, setAssessorQrValue] = useState("");

	useEffect(() => {
		if (id_assessment && id_result) {
			fetchUnitCompetencies();
		} else {
			console.error("Missing required params:", { id_assessment, id_result });
			// setError("Parameter asesmen tidak lengkap");
		}
	}, [user, id_assessment, id_result]);

	useEffect(() => {
		if (resultData) {
			fetchAssessment();
		}
	}, [resultData]);

	useEffect(() => {
		if (unitCompetencies) {
			const completed = unitCompetencies.filter((unit: any) => unit.finished);
			setCompletedUnits(completed.length);
		}
	}, [unitCompetencies]);

	const fetchAssessment = async () => {
		try {
			setLoading(true);
			// console.log(resultData);
			const response = await api.get(`/assessments/${resultData.assessment.id}`);
			if (response.data.success) {
				setAssessments(response.data.data);
			}
		} catch {
			setError("Gagal memuat data asesmen");
		} finally {
			setLoading(false);
		}
	};

	const fetchUnitCompetencies = async () => {
		if (!id_result) {
			console.error("id_result is undefined");
			return;
		}

		try {
			const response = await api.get(`/assessments/apl-02/units/${id_result}`);
			if (response.data.success) {
				setUnitCompetencies(response.data.data);
			}
		} catch {
			// console.log("Error fetching unit competencies:", error);
			setError("Gagal memuat unit kompetensi");
		}
	};

	// Fungsi ambil result data
	const fetchResultData = async () => {
		try {
			const response = await api.get(`/assessments/apl-02/result/${id_result}`);
			if (response.data.success) {
				const data = response.data.data;

				const newData = {
					schedule: data.schedule,
					approved_assessee: data.apl02_header?.approved_assessee,
					approved_assessor: data.apl02_header?.approved_assessor,
					is_continue: data.apl02_header?.is_continue,
					assessee: data.assessee,
					assessor: data.assessor,
					assessment: data.assessment,
				};

				setResultData(newData);

				if (newData.approved_assessee) setAssesseeQrValue(getAssesseeUrl(newData.assessee.id));
				if (newData.approved_assessor) setAssessorQrValue(getAssesseeUrl(newData.assessor.id));
			}
		} catch (err: any) {
			console.error("Gagal fetch result data:", err);
		}
	};

	useEffect(() => {
		if (id_result) {
			fetchResultData();
		}
	}, [id_result]);

	const handleGenerateQRCode = async () => {
		if (!isCompletionFull || !id_result || !assessorQrValue || assesseeQrValue) {
			console.warn("Kondisi belum terpenuhi untuk generate QR Code");
			return;
		}

		setGeneratingQr(true);
		setQrError(null);

		try {
			const response = await api.put(`/assessments/apl-02/result/assessee/${id_result}/approve`);

			if (response.data.success) {
				setAssesseeQrValue(getAssesseeUrl(Number(id_asesi)));

				setResultData((prev: any) => ({
					...prev,
					approved_assessee: true,
				}));
				mutateNavigation();
			}
		} catch (error: any) {
			console.error("Error generating QR:", error);
			setQrError(error.response?.data?.message || "Gagal menghasilkan QR Code");
		} finally {
			setGeneratingQr(false);
		}
	};

	// Cek apakah completion sudah penuh (100%)
	const isCompletionFull =
		completedUnits > 0 &&
		unitCompetencies.length > 0 &&
		completedUnits === unitCompetencies.length;

	// PERUBAHAN: Cek apakah asesor sudah approve
	const isAssessorApproved = resultData?.approved_assessor;

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesi
						title="Asesmen Mandiri"
						icon={
							<Link to={paths.asesi.dashboard} onClick={(e) => {
								e.preventDefault(); // cegah auto navigasi
								setIsConfirmOpen(true);
							}}
								className="text-gray-500 hover:text-gray-600"
							>
								<House size={20} />
							</Link>
						}
					/>
					<ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
						onConfirm={() => {
							setIsConfirmOpen(false);
							navigate(paths.asesi.dashboard); // manual navigate setelah confirm
						}}
						title="Konfirmasi"
						message="Apakah Anda yakin ingin kembali ke Dashboard?"
						confirmText="Ya, kembali"
						cancelText="Batal"
						type="warning"
					/>
				</div>

				<main className='m-4'>
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
						{/* Error notification */}
						{error && (
							<div className="lg:col-span-5 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
								<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
								<span className="text-red-800">{error}</span>
							</div>
						)}

						{/* Loading state */}
						{loading && (
							<div className="lg:col-span-5 flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
							</div>
						)}

						{!loading && (
							<>
								{/* Left Section - Certification Scheme */}
								<div className="lg:col-span-3 h-full">
									<div className="bg-white rounded-lg shadow-sm border p-6 h-full">
										<div className="mb-6">
											<div className="flex justify-between items-start flex-wrap gap-5">
												{/* Left */}
												<div>
													<h2 className="text-lg font-semibold text-gray-800 mb-1">
														Skema Sertifikasi {assessments?.occupation?.name?.replace(/Sertifikasi/gi, "").trim()}
													</h2>
													<span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
														{assessments?.code || "SKMLRPLPJR/LSPSMK24/2023"}
													</span>
												</div>
											</div>
										</div>

										{/* Competency Units Grid */}
										<div className="max-h-[500px] overflow-y-auto">
											{unitCompetencies.length > 0 ? (
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													{unitCompetencies.map((unit, index) => (
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

															<h5 className="font-medium text-gray-800 mb-2 text-md leading-tight">
																{unit.title}
															</h5>

															<p className="text-xs text-gray-500 mb-4">
																{unit.unit_code}
															</p>

															<div className="flex items-center justify-between">
																{unit.finished ? (
																	<span className="px-3 py-1 bg-[#E77D3533] text-[#E77D35] text-xs rounded">
																		Selesai
																	</span>
																) : (
																	<span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">Belum selesai</span>
																)}

																<Link
																	to={paths.asesi.assessment.apl02_detail(
																		id_assessment,
																		id_asesor,
																		unit.id,
																		index + 1 // Tambahkan nomor urut sebagai argumen baru
																	)}
																	className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
																>
																	Lihat detail
																	<ChevronRight size={14} className="ml-1" />
																</Link>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-8 text-gray-500">
													{!id_result
														? "Parameter tidak lengkap"
														: "Tidak ada unit kompetensi"}
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Right Section - Assessment Review */}
								<div className="lg:col-span-2 h-full">
									<div className="bg-white rounded-lg shadow-sm border p-6 h-full">
										{/* Progress Bar */}
										<div className="mb-6">
											<h3 className="text-xl font-medium text-gray-900 mb-4">
												Progress Asesmen
											</h3>
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm font-medium text-gray-700">
													Penyelesaian
												</span>
												<span className="text-sm font-medium text-[#E77D35]">
													{completedUnits > 0 && unitCompetencies.length > 0
														? `${Math.round(
															(completedUnits / unitCompetencies.length) * 100
														)}%`
														: "0%"}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3">
												<div
													className="bg-[#E77D35] h-3 rounded-full transition-all duration-300"
													style={{
														width:
															completedUnits > 0 && unitCompetencies.length > 0
																? `${(completedUnits / unitCompetencies.length) *
																100
																}%`
																: "0%",
													}}
												></div>
											</div>

											{/* Informasi status completion */}
											{isCompletionFull ? (
												<div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
													<p className="text-sm text-green-800 text-center">
														{isAssessorApproved
															? "Anda dapat melanjutkan dengan generate QR Code."
															: "Menunggu persetujuan asesor terlebih dahulu."}
													</p>
												</div>
											) : (
												<div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
													<p className="text-sm text-yellow-800 text-center">
														⚠️ Silakan selesaikan semua unit kompetensi terlebih
														dahulu sebelum generate QR Code.
													</p>
												</div>
											)}
										</div>

										{/* Rekomendasi Section (Read-only) */}
										<div className="mb-6">
											<h3 className="text-xl font-medium text-gray-900 mb-4">
												Rekomendasi Asesor
											</h3>
											<div className="space-y-3">
												{resultData?.is_continue !== undefined ? (
													<>
														<div className="flex items-start space-x-3">
															<input
																type="radio"
																name="recommendation"
																checked={resultData.is_continue === true}
																onChange={() => { }}
																disabled
																className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] disabled:cursor-not-allowed"
															/>
															<span
																className={`text-sm leading-relaxed ${resultData.is_continue === false
																	? "line-through opacity-50"
																	: "text-gray-700"
																	} cursor-not-allowed text-gray-400`}
															>
																Assessment <strong>dapat dilanjutkan</strong>
															</span>
														</div>

														<div className="flex items-start space-x-3">
															<input
																type="radio"
																name="recommendation"
																checked={resultData.is_continue === false}
																onChange={() => { }}
																disabled
																className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] disabled:cursor-not-allowed"
															/>
															<span
																className={`text-sm leading-relaxed ${resultData.is_continue === true
																	? "line-through opacity-50"
																	: "text-gray-700"
																	} cursor-not-allowed text-gray-400`}
															>
																Assessment <strong className="text-red-600">tidak dapat dilanjutkan</strong>
															</span>
														</div>
													</>
												) : (
													<div className="text-gray-500 text-sm">
														Asesor belum memberikan rekomendasi
													</div>
												)}
											</div>
										</div>

										{/* QR Code Section - Asesi dan Asesor */}
										<div className="mb-6">
											<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
												{/* QR Code Asesi */}
												<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
													<h4 className="text-sm font-semibold text-gray-800 text-center">
														QR Code Asesi
													</h4>

													{assesseeQrValue ? (
														<>
															<QRCodeCanvas
																value={assesseeQrValue}
																size={120}
																className="w-40 h-40 object-contain"
															/>
															<div className="text-green-600 font-semibold text-xs text-center">
																Sebagai Asesi, Anda sudah setuju
															</div>
														</>
													) : (
														<div className="w-40 h-40 bg-gray-100 flex items-center justify-center flex-col gap-1">
															<span className="text-gray-400 text-xs text-center">
																QR Code Asesi
															</span>
															<span className="text-gray-400 text-xs text-center">
																Klik tombol "Setujui"
															</span>
														</div>
													)}

													<span className="text-sm font-semibold text-gray-800 text-center">
														{resultData?.assessee?.name}
													</span>

													{/* Tombol Setujui */}
													{!assesseeQrValue && (
														<button
															disabled={!assessorQrValue || generatingQr || !isCompletionFull}
															onClick={handleGenerateQRCode}
															className={`flex items-center justify-center w-full bg-[#E77D35] text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${assessorQrValue && !generatingQr && isCompletionFull
																? "hover:bg-orange-600 cursor-pointer"
																: "cursor-not-allowed opacity-50"
																}`}
														>
															{generatingQr ? "Memproses..." : "Setujui"}
														</button>
													)}

													{/* Error Message */}
													{qrError && (
														<div className="text-red-600 text-xs text-center">
															{qrError}
														</div>
													)}
												</div>

												{/* QR Code Asesor */}
												<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
													<h4 className="text-sm font-semibold text-gray-800 text-center">
														QR Code Asesor
													</h4>

													{assessorQrValue ? (
														<>
															<QRCodeCanvas
																value={assessorQrValue}
																size={120}
																className="w-40 h-40 object-contain"
															/>
															<div className="text-green-600 font-semibold text-xs text-center">
																Sudah disetujui Asesor
															</div>
														</>
													) : (
														<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
															<span className="text-gray-400 text-xs text-center">
																Menunggu persetujuan asesor
															</span>
														</div>
													)}

													<span className="text-sm font-semibold text-gray-800 text-center">
														{resultData?.assessor?.name}
													</span>
												</div>
											</div>
										</div>

									</div>
								</div>
							</>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}