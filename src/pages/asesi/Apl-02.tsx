import { useState, useEffect } from "react";
import { Monitor, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarAsesi from "@/components/NavbarAsesi";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/IsApproveApl01";
import { QRCodeCanvas } from "qrcode.react";
import { getAssesseeUrl } from "@/lib/hashids";

export default function Apl02() {
	const { id_assessment, id_asesor, id_result, id_asesi } =
		useAssessmentParams();

	const { user } = useAuth();
	const [loading, setLoading] = useState(false); // Changed to false for demo
	const [error, setError] = useState<string | null>(null);
	const [assessments, setAssessments] = useState<any>();
	const [unitCompetencies, setUnitCompetencies] = useState<any[]>([]);
	const [completedUnits, setCompletedUnits] = useState<number>(0);

	const [valueQr, setValueQr] = useState("");

	useEffect(() => {
		fetchAssessment();
		fetchUnitCompetencies();
	}, [user]);

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
				console.log(response.data.data);
			}
		} catch (error: any) {
			setError("Gagal memuat data asesmen");
		} finally {
			setLoading(false);
		}
	};

	const fetchUnitCompetencies = async () => {
		try {
			const response = await api.get(`/assessments/apl-02/units/${id_result}`);

			if (response.data.success) {
				setUnitCompetencies(response.data.data);
			}
		} catch (error: any) {
			console.log("Error fetching unit competencies:", error);
		}
	};

	const handleGenerateQRCode = async (id: number) => {
		try {
			const response = await api.put(
				`/assessments/apl-02/result/assessee/${id_result}/approve`
			);

			console.log(response.data);
			if (response.data.success) {
				setValueQr(getAssesseeUrl(id));
			}
		} catch (error) {
			console.log("Error fetching unit competencies:", error);
		}
	};

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
									</div>
								</div>
							</div>

							{/* Right Section - Assessment Review */}
							<div className="lg:col-span-2 h-full">
								<div className="bg-white rounded-lg p-6 h-full">
									{/* Progress Bar */}
									<div className="mb-6">
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-gray-700">
												Completion
											</span>
											<span className="text-sm font-medium text-[#E77D35]">
												{100 * (unitCompetencies.length / completedUnits)}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div
												className="bg-[#E77D35] h-3 rounded-full transition-all duration-300"
												style={{
													width:
														completedUnits > 0
															? `${
																	100 *
																	(unitCompetencies.length / completedUnits)
															  }%`
															: "0%",
												}}
											></div>
										</div>
									</div>

									{/* QR Code Section */}
									<div className="mb-6 flex justify-center">
										<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
											{valueQr && (
												<QRCodeCanvas
													value={valueQr}
													size={256}
													className="w-40 h-40 object-contain"
												>
													{valueQr}
												</QRCodeCanvas>
											)}
											<button
												onClick={(_) => handleGenerateQRCode(Number(id_asesi))}
												className="block text-center bg-[#E77D35] hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
											>
												Generate QR Code
											</button>
										</div>
									</div>

									{/* Submit Button */}
									<div className="w-full">
										<Link
											to={paths.asesi.assessment.frak03(
												id_assessment,
												id_asesor
											)} // arahkan ke route yang kamu mau
											className={`w-full block text-center bg-[#E77D35] hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
										>
											Lanjut
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
