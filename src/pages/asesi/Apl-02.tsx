import { useState, useEffect } from "react";
import { Monitor, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarAsesi from "@/components/NavbarAsesi";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";

export default function Apl02() {
	const { id_assessment, id_asesor, id_result, id_asesi } =
		useAssessmentParams();

	console.log("Assessment params:", { id_assessment, id_asesor, id_result, id_asesi });

	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [assessments, setAssessments] = useState<any>();
	const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
	const [completedUnits, setCompletedUnits] = useState<number>(0);
	const [resultData, setResultData] = useState<any>(null);
	const [generatingQr, setGeneratingQr] = useState(false);
	const [qrError, setQrError] = useState<string | null>(null);

	useEffect(() => {
		if (id_assessment && id_result) {
			fetchAssessment();
			fetchUnitCompetencies();
		} else {
			console.error("Missing required params:", { id_assessment, id_result });
			setError("Parameter asesmen tidak lengkap");
		}
	}, [user, id_assessment, id_result]);

	useEffect(() => {
		if (unitCompetencies) {
			const completed = unitCompetencies.filter((unit: any) => unit.finished);
			setCompletedUnits(completed.length);
		}
	}, [unitCompetencies]);

	const fetchAssessment = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/assessments/${id_assessment}`);
			if (response.data.success) {
				setAssessments(response.data.data);
			}
		} catch (error: any) {
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
		} catch (error: any) {
			console.log("Error fetching unit competencies:", error);
			setError("Gagal memuat unit kompetensi");
		}
	};

	const handleGenerateQRCode = async () => {
		if (!isCompletionFull) return;
		if (!id_result) {
			setQrError("ID result tidak valid");
			return;
		}

		setGeneratingQr(true);
		setQrError(null);

		try {
			console.log("Mengenerate QR code untuk result:", id_result);

			const response = await api.put(
				`/assessments/apl-02/result/assessee/${id_result}/approve`
			);

			console.log("Response generate QR:", response.data);

			if (response.data.success && response.data.data) {
				console.log("✅ QR code berhasil digenerate");

				// 🔥 PAKAI DATA DARI RESPONSE APPROVE SAJA!
				setResultData(prev => ({
					...prev,
					approved_assessee: response.data.data.approved_assessee,
					approved_assessor: response.data.data.approved_assessor,
					is_continue: response.data.data.is_continue,
					assessee: response.data.data.assessee
				}));

			} else {
				setQrError(response.data.message || "Gagal menghasilkan QR Code");
			}
		} catch (error: any) {
			console.log("Error generating QR code:", error);
			const errorMessage = error.response?.data?.message ||
				error.message ||
				"Gagal menghasilkan QR Code";
			setQrError(errorMessage);
		} finally {
			setGeneratingQr(false);
		}
	};

	// Tambahkan useEffect untuk fetch result data
	useEffect(() => {
		if (id_result) {
			fetchResultData();
		}
	}, [id_result]);

	// Fungsi ambil result data
	const fetchResultData = async () => {
		try {
			const response = await api.get(`/assessments/apl-02/result/${id_result}`);
			if (response.data.success) {
				const data = response.data.data;

				// simpan ke state resultData
				setResultData({
					approved_assessee: data.apl02_header?.approved_assessee,
					approved_assessor: data.apl02_header?.approved_assessor,
					is_continue: data.apl02_header?.is_continue,
					assessee: data.assessee,
				});
			}
		} catch (err: any) {
			console.error("Gagal fetch result data:", err);
		}
	};


	// Cek apakah completion sudah penuh (100%)
	const isCompletionFull = completedUnits > 0 && unitCompetencies.length > 0 &&
		completedUnits === unitCompetencies.length;

	// Cek apakah QR sudah digenerate
	const isQrGenerated = resultData?.approved_assessee;

	// Generate URL untuk QR code
	const assesseeQrValue = isQrGenerated ? getAssesseeUrl(Number(id_asesi)) : "";
	const assessorQrValue = resultData?.approved_assessor ? getAssessorUrl(Number(id_asesor)) : "";

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesi
						title="Asesmen Mandiri"
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

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 pb-7 items-stretch">
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
								<div className="bg-white rounded-lg p-6 h-full">
									<div className="mb-6">
										<div className="flex justify-between items-start flex-wrap gap-5">
											{/* Left */}
											<div>
												<h2 className="text-lg font-semibold text-gray-800 mb-1">
													Skema Sertifikasi
												</h2>
												<p className="text-sm text-gray-600">Okupasi</p>
											</div>

											{/* Right */}
											<div className="lg:text-right sm:text-start">
												<h3 className="font-medium text-gray-800 mb-2">
													{assessments?.occupation?.name ||
														"Pemrogram Junior ( Junior Coder )"}
												</h3>
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
												{unitCompetencies.map((unit) => (
													<div
														key={unit.id}
														className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow"
													>
														<div className="flex items-center mb-3">
															<div className="rounded-lg mr-3 flex-shrink-0">
																<Monitor size={16} className="text-[#E77D35]" />
															</div>
															<h4 className="font-medium text-[#E77D35] text-sm">
																Unit kompetensi {unit.id}
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
																	Finished
																</span>
															) : (
																<div></div>
															)}

															<Link
																to={paths.asesi.assessment.apl02_detail(
																	id_assessment,
																	id_asesor,
																	unit.id
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
												{!id_result ? "Parameter tidak lengkap" : "Tidak ada unit kompetensi"}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Right Section - Assessment Review */}
							<div className="lg:col-span-2 h-full">
								<div className="bg-white rounded-lg p-6 h-full">
									{/* Progress Bar */}
									<div className="mb-6">
										<h3 className="text-xl font-medium text-gray-900 mb-4">Progress Asesmen</h3>
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-gray-700">
												Completion
											</span>
											<span className="text-sm font-medium text-[#E77D35]">
												{completedUnits > 0 && unitCompetencies.length > 0
													? `${Math.round((completedUnits / unitCompetencies.length) * 100)}%`
													: "0%"}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div
												className="bg-[#E77D35] h-3 rounded-full transition-all duration-300"
												style={{
													width: completedUnits > 0 && unitCompetencies.length > 0
														? `${(completedUnits / unitCompetencies.length) * 100}%`
														: "0%",
												}}
											></div>
										</div>

										{/* Informasi status completion */}
										{isCompletionFull ? (
											<div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
												<p className="text-sm text-green-800 text-center">
													Anda dapat melanjutkan dengan generate QR Code.
												</p>
											</div>
										) : (
											<div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
												<p className="text-sm text-yellow-800 text-center">
													⚠️ Silakan selesaikan semua unit kompetensi terlebih dahulu
													sebelum generate QR Code.
												</p>
											</div>
										)}
									</div>

									{/* Rekomendasi Section (Read-only) */}
									<div className="mb-6">
										<h3 className="text-xl font-medium text-gray-900 mb-4">Rekomendasi Asesor</h3>
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
															className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
														/>
														<span className={`text-sm text-gray-700 leading-relaxed ${resultData.is_continue === false ? 'line-through opacity-50' : ''
															}`}>
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
															className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
														/>
														<span className={`text-sm text-gray-700 leading-relaxed ${resultData.is_continue === true ? 'line-through opacity-50' : ''
															}`}>
															Assessment <strong>tidak dapat dilanjutkan</strong>
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
									<div className="mb-6 flex justify-center gap-4 flex-col md:flex-row">
										{/* QR Code Asesi */}
										<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
											<h4 className="text-sm font-semibold text-gray-800">QR Code Asesi</h4>
											{isQrGenerated ? (
												<>
													<QRCodeCanvas
														key={isQrGenerated ? "generated" : "not-generated"} // Force re-render
														value={assesseeQrValue}
														size={100}
														className="w-32 h-32 object-contain"
													/>
													<div className="text-green-600 font-semibold text-xs">
														Sebagai Asesi, Anda sudah setuju
													</div>
												</>
											) : (
												<div className="w-32 h-32 bg-gray-100 flex items-center justify-center flex-col">
													<span className="text-gray-400 text-xs text-center mb-2">
														QR Code Asesi
													</span>
													<span className="text-gray-400 text-xs text-center">
														{isCompletionFull
															? "Klik generate untuk membuat QR Code"
															: "Selesaikan semua unit"}
													</span>
												</div>
											)}
											<button
												onClick={handleGenerateQRCode}
												disabled={!isCompletionFull || isQrGenerated || generatingQr || !id_result}
												className={`block text-center bg-[#E77D35] text-white font-medium py-2 px-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm ${!isCompletionFull || isQrGenerated || generatingQr || !id_result
													? "cursor-not-allowed opacity-50"
													: "hover:bg-orange-600 cursor-pointer"
													}`}
											>
												{generatingQr
													? "Generating..."
													: isQrGenerated
														? "Telah Digenerate"
														: "Generate QR"}
											</button>
											{qrError && (
												<div className="text-red-500 text-xs mt-1">{qrError}</div>
											)}
										</div>

										{/* QR Code Asesor */}
										<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
											<h4 className="text-sm font-semibold text-gray-800">QR Code Asesor</h4>
											{resultData?.approved_assessor ? (
												<>
													<QRCodeCanvas
														value={assessorQrValue}
														size={100}
														className="w-32 h-32 object-contain"
													/>
													<div className="text-green-600 font-semibold text-xs">
														✅ Telah disetujui
													</div>
												</>
											) : (
												<div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
													<span className="text-gray-400 text-xs text-center">
														Menunggu persetujuan asesor
													</span>
												</div>
											)}
										</div>
									</div>
{/* 
									{process.env.NODE_ENV === 'development' && (
										<div className="mb-4 p-3 bg-gray-100 rounded-lg">
											<h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
											<p className="text-xs text-gray-600">ID Asesi: {id_asesi}</p>
											<p className="text-xs text-gray-600">ID Result: {id_result}</p>
											<p className="text-xs text-gray-600">approved_assessee: {resultData?.approved_assessee ? 'true' : 'false'}</p>
											<p className="text-xs text-gray-600">QR Value: {assesseeQrValue}</p>
										</div>
									)} */}

									{/* Submit Button - Hanya aktif jika asesor sudah approve */}
									<div className="w-full">
										<Link
											to={paths.asesi.assessment.ak04(id_assessment, id_asesor)}
											className={`w-full block text-center ${resultData?.approved_assessor
												? "bg-[#E77D35] hover:bg-orange-600 cursor-pointer"
												: "bg-gray-300 cursor-not-allowed"
												} text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
										>
											{resultData?.approved_assessor
												? "Lanjut"
												: "Menunggu persetujuan asesor"}
										</Link>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}