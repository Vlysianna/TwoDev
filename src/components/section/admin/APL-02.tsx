import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { Assessment } from "@/lib/types";
import { type APL02UnitAssessee, type ResultAPL02 } from "@/model/apl02-model";
import routes from "@/routes/paths";
import { AlertCircle, ChevronRight, Monitor } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function APL02({ id_result }: { id_result: string }) {
	const {
		data: result = {} as ResultAPL02,
		isLoading: loadingResult,
		error: errorResult,
	} = useSWR<ResultAPL02>(`/assessments/apl-02/result/${id_result}`, fetcher);

	const {
		data: assessments = {} as Assessment,
		isLoading: loadingAssessments,
		error: errorAssessments,
	} = useSWR<Assessment>(
		!loadingResult ? `/assessments/${result?.assessment?.id}` : null,
		fetcher
	);

	const {
		data: unitCompetencies = [] as APL02UnitAssessee[],
		isLoading: loadingUnitCompetencies,
		error: errorUnitCompetencies,
	} = useSWR<APL02UnitAssessee[]>(
		!loadingResult ? `/assessments/apl-02/units/${result?.id}` : null,
		fetcher
	);
	console.log(unitCompetencies);

	const completedUnits = useMemo(() => {
		if (unitCompetencies) {
			const completed = unitCompetencies.filter((unit) => unit.finished);
			return completed.length;
		} else {
			return 0;
		}
	}, [unitCompetencies]);

	const isCompletionFull = useMemo(() => {
		return (
			completedUnits > 0 &&
			unitCompetencies.length > 0 &&
			completedUnits === unitCompetencies.length
		);
	}, [completedUnits, unitCompetencies.length]);

	const isQrGenerated = result?.apl02_header?.approved_assessee;

	const isAssessorApproved = result?.apl02_header?.approved_assessor;

	const assesseeQrValue = isQrGenerated
		? getAssesseeUrl(Number(result?.assessee?.id))
		: "";
	const assessorQrValue = isAssessorApproved
		? getAssessorUrl(Number(result?.assessor?.id))
		: "";

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
			{/* Error notification */}
			{errorResult ||
				errorAssessments ||
				(errorUnitCompetencies && (
					<div className="lg:col-span-5 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
						<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
						<span className="text-red-800">{errorResult}</span>
					</div>
				))}

			{/* Loading state */}
			{loadingResult ||
				loadingAssessments ||
				(loadingUnitCompetencies && (
					<div className="lg:col-span-5 flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
					</div>
				))}

			{!loadingResult && (
				<>
					{/* Left Section - Certification Scheme */}
					<div className="lg:col-span-3 h-full">
						<div className="bg-white rounded-lg shadow-sm border p-6 h-full">
							<div className="mb-6">
								<div className="flex justify-between items-start flex-wrap gap-5">
									{/* Left */}
									<div>
										<h2 className="text-lg font-semibold text-gray-800 mb-1">
											Skema Sertifikasi{" "}
											{assessments?.occupation?.name
												?.replace(/Sertifikasi/gi, "")
												.trim()}
										</h2>
										<span className="bg-[#E77D3533] text-[#E77D35] text-sm px-3 py-1 rounded-md font-sm">
											{assessments?.code || "SKMLRPLPJR/LSPSMK24/2023"}
										</span>
									</div>
								</div>
							</div>

							{/* Competency Units Grid */}
							<div className="max-h-[500px] overflow-y-auto">
								{unitCompetencies!.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{unitCompetencies?.map((unit, index) => (
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
														<span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
															Belum selesai
														</span>
													)}

													<Link
														to={routes.asesi.assessment.apl02_detail(
															String(result?.assessment?.id),
															String(result?.assessor?.id),
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
										{completedUnits > 0 && unitCompetencies!.length > 0
											? `${Math.round(
													(completedUnits / unitCompetencies!.length) * 100
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
													? `${
															(completedUnits / unitCompetencies.length) * 100
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
									{result?.apl02_header?.is_continue !== undefined ? (
										<>
											<div className="flex items-start space-x-3">
												<input
													type="radio"
													name="recommendation"
													checked={result?.apl02_header?.is_continue === true}
													onChange={() => {}}
													disabled
													className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] disabled:cursor-not-allowed"
												/>
												<span
													className={`text-sm leading-relaxed ${
														result?.apl02_header?.is_continue === false
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
													checked={result?.apl02_header?.is_continue === false}
													onChange={() => {}}
													disabled
													className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] disabled:cursor-not-allowed"
												/>
												<span
													className={`text-sm leading-relaxed ${
														result?.apl02_header?.is_continue === true
															? "line-through opacity-50"
															: "text-gray-700"
													} cursor-not-allowed text-gray-400`}
												>
													Assessment{" "}
													<strong className="text-red-600">
														tidak dapat dilanjutkan
													</strong>
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
									<h4 className="text-sm font-semibold text-gray-800">
										QR Code Asesi
									</h4>
									{isQrGenerated ? (
										<>
											<QRCodeCanvas
												key={isQrGenerated ? "generated" : "not-generated"} // Force re-render
												value={assesseeQrValue}
												size={100}
												className="w-32 h-32 object-contain"
											/>
											<div className="text-green-600 font-semibold text-xs">
												Sudah disetujui Asesi
											</div>
										</>
									) : (
										<div className="w-32 h-32 bg-gray-100 flex items-center justify-center flex-col">
											<span className="text-gray-400 text-xs text-center mb-2">
												QR Code Asesi
											</span>
											<span className="text-gray-400 text-xs text-center">
												{isCompletionFull && !isAssessorApproved
													? "Menunggu persetujuan asesor"
													: isCompletionFull
													? "Klik generate untuk membuat QR Code"
													: "Selesaikan semua unit"}
											</span>
										</div>
									)}
								</div>

								{/* QR Code Asesor */}
								<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
									<h4 className="text-sm font-semibold text-gray-800">
										QR Code Asesor
									</h4>
									{isAssessorApproved ? (
										<>
											<QRCodeCanvas
												value={assessorQrValue}
												size={100}
												className="w-32 h-32 object-contain"
											/>
											<div className="text-green-600 font-semibold text-xs">
												Sudah disetujui Asesor
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
						</div>
					</div>
				</>
			)}
		</div>
	);
}
