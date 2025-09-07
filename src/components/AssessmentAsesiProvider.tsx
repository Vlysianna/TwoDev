import api from "@/helper/axios";
import routes from "@/routes/paths";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type JSX,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type AssessmentParams = {
	id_assessment: string;
	id_asesor: string;
	id_asesi: string;
	id_result: string;
};

const AssessmentContext = createContext<AssessmentParams | null>(null);

export function useAssessmentParams() {
	const ctx = useContext(AssessmentContext);
	if (!ctx)
		throw new Error(
			"useAssessmentParams must be used within AssessmentProvider"
		);
	return ctx;
}

export default function AssessmentAsesiProvider({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { id_assessment, id_asesor, id_unit } = useParams();

	// const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!id_assessment || !id_asesor) {
			navigate(routes.asesi.dashboard);
		}
	}, [id_assessment, id_asesor, navigate]);

	const [approveData, setApproveData] = useState<any[] | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filterApproveData, setFilterApproveData] = useState<any>(undefined);

	const [result, setResult] = useState<any>(null);

	useEffect(() => {
		const fetchApprove = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await api.get(
					`/assessments/apl-01/results/${id_assessment}`
				);

				if (response.data.success) {
					setApproveData(response.data.data);
				} else {
					setError("Gagal mengambil data approve");
				}
			} catch (err) {
				console.error("Failed to fetch approve:", err);
				setError("Terjadi kesalahan saat mengambil data");
			}
		};

		fetchApprove();
	}, []);

	useEffect(() => {
		const fetchResult = async () => {
			setLoading(true);
			await api
				.get(
					`assessments/result/${id_assessment}/${id_asesor}/${result?.assessee.id}`
				)
				.then((res) => {
					if (res.data.success) {
						setResult(res.data.data[0]);
					}
				})
				.catch((err) => {
					console.error("Failed to fetch result:", err);
				})
				.finally(() => {
					setLoading(false);
				});
		};

		if (id_assessment && id_asesor) {
			fetchResult();
		}
	}, [id_assessment, id_asesor]);

	useEffect(() => {
		// console.log(approveData);
		if (approveData == undefined || !result) return;
		setFilterApproveData(
			approveData.find((data) => data.result.result_id == result?.id)
		);
		setLoading(false);
	}, [approveData, result]);

	useEffect(() => {
		if (!id_assessment || !id_asesor) {
			navigate(routes.asesi.dashboard, { replace: true });
			return;
		}

		if (!approveData || filterApproveData == undefined) {
			// console.log("Navigating to APL 01 due to missing data");
			// navigate(routes.asesi.assessment.apl01(id_assessment, id_asesor), {
			// 	replace: true,
			// });
			return;
		}

		const navigateTo = () => {
			if (approveData.length > 0) {
				if (filterApproveData.approved) {
					if (
						location.pathname ===
						routes.asesi.assessment.apl02_detail(
							id_assessment,
							id_asesor,
							id_unit!
						)
					) {
						return null;
					}
					return routes.asesi.assessment.apl02(id_assessment, id_asesor);
				} else {
					return routes.asesi.assessment.dataSertifikasi(
						id_assessment,
						id_asesor
					);
				}
			} else {
				return routes.asesi.dashboard;
			}
		};

		const path = navigateTo();

		if (path) navigate(path, { replace: true });
	}, [filterApproveData]);
	// console.log(location.pathname);

	const [isTabsOpen, setIsTabsOpen] = useState(true);

	const toggleTabs = () => {
		setIsTabsOpen(!isTabsOpen);
	};

	const tabItems = [
		{
			value: routes.asesi.assessment.apl01(
				id_assessment ?? "",
				id_asesor ?? ""
			),
			label: "APL 01",
			disabled: false,
			to: routes.asesi.assessment.apl01(id_assessment ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.dataSertifikasi(
				id_assessment ?? "",
				id_asesor ?? ""
			),
			label: "Data Sertifikasi",
			disabled: false,
			to: routes.asesi.assessment.dataSertifikasi(
				id_assessment ?? "",
				id_asesor ?? ""
			),
		},
		{
			value: routes.asesi.assessment.apl02(
				id_assessment ?? "",
				id_asesor ?? ""
			),
			label: "APL 02",
			disabled: false,
			to: routes.asesi.assessment.apl02(id_assessment ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak04(id_assessment ?? "", id_asesor ?? ""),
			label: "AK 04",
			disabled: false,
			to: routes.asesi.assessment.ak04(id_assessment ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak01(id_assessment ?? "", id_asesor ?? ""),
			label: "AK 01",
			disabled: false,
			to: routes.asesi.assessment.ak01(id_assessment ?? "", id_asesor ?? ""),
		},
		// {
		// 	value: routes.asesi.assessment.ia01(id_assessment ?? "", id_asesor ?? ""),
		// 	label: "IA 01",
		// 	disabled: false,
		// 	to: routes.asesi.assessment.ia01(id_assessment ?? "", id_asesor ?? ""),
		// },
		{
			value: routes.asesi.assessment.ia02(id_assessment ?? "", id_asesor ?? ""),
			label: "IA 02",
			disabled: false,
			to: routes.asesi.assessment.ia02(id_assessment ?? "", id_asesor ?? ""),
		},
		// {
		// 	value: routes.asesi.assessment.ia03(id_assessment ?? "", id_asesor ?? ""),
		// 	label: "IA 03",
		// 	disabled: false,
		// 	to: routes.asesi.assessment.ia03(id_assessment ?? "", id_asesor ?? ""),
		// },
		{
			value: routes.asesi.assessment.ia05(id_assessment ?? "", id_asesor ?? ""),
			label: "IA 05",
			disabled: false,
			to: routes.asesi.assessment.ia05(id_assessment ?? "", id_asesor ?? ""),
		},
		// {
		// 	value: routes.asesi.assessment.ak02(id_assessment ?? "", id_asesor ?? ""),
		// 	label: "AK 02",
		// 	disabled: false,
		// 	to: routes.asesi.assessment.ak02(id_assessment ?? "", id_asesor ?? ""),
		// },
		// {
		// 	value: routes.asesi.assessment.ak03(id_assessment ?? "", id_asesor ?? ""),
		// 	label: "AK 03",
		// 	disabled: false,
		// 	to: routes.asesi.assessment.ak03(id_assessment ?? "", id_asesor ?? ""),
		// },
		// {
		// 	value: routes.asesi.assessment.ak05(id_assessment ?? "", id_asesor ?? ""),
		// 	label: "AK 05",
		// 	disabled: false,
		// 	to: routes.asesi.assessment.ak05(id_assessment ?? "", id_asesor ?? ""),
		// },
	];

	return (
		<>
			{loading ? (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
				</div>
			) : (
				<AssessmentContext.Provider
					value={{
						id_assessment: id_assessment!,
						id_asesor: id_asesor!,
						id_result: result?.id,
						id_asesi: result?.assessee.id,
					}}
				>
					<div className="relative w-full min-h-screen">
						{/* Floating Tabs */}
						<div className="fixed top-25 left-3 z-100">
							{/* Toggle Button */}
							<motion.button
								onClick={toggleTabs}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className="
									w-8 h-8 bg-white hover:bg-slate-50 border border-slate-200 
									rounded-full shadow-lg flex items-center justify-center
								"
							>
								{isTabsOpen ? (
									<ChevronLeft className="w-4 h-4 text-slate-600" />
								) : (
									<ChevronRight className="w-4 h-4 text-slate-600" />
								)}
							</motion.button>

							{/* Tabs Card */}
							<AnimatePresence>
								{isTabsOpen && (
									<motion.div
										initial={{ opacity: 0, x: -80, scale: 0.95 }}
										animate={{ opacity: 1, x: 0, scale: 1 }}
										exit={{ opacity: 0, x: -80, scale: 0.95 }}
										transition={{ duration: 0.4, ease: "easeInOut" }}
										className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl"
									>
										<div className="p-3">
											{/* Header */}
											<div className="mb-4 px-2">
												<h3 className="text-sm font-semibold text-slate-700">
													Navigation
												</h3>
												<div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full mt-1"></div>
											</div>

											{/* Tab Items */}
											<div
												className="max-h-[40vh] overflow-y-auto space-y-2
													pr-2
													[scrollbar-width:thin] 
													[scrollbar-color:#f97316_transparent] 
													[&::-webkit-scrollbar]:w-1.5 
													[&::-webkit-scrollbar-track]:bg-transparent 
													[&::-webkit-scrollbar-thumb]:rounded-full 
													[&::-webkit-scrollbar-thumb]:bg-orange-400/80
												"
											>
												{tabItems.map((tab) => {
													const isActive = location.pathname === tab.value;
													return (
														<Link
															key={tab.value}
															to={tab.to}
															onClick={(e) =>
																tab.disabled && e.preventDefault()
															}
															className={`group relative flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${
																isActive
																	? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/25"
																	: "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
															}`}
														>
															{/* Active indicator */}
															{isActive && (
																<div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
															)}

															<span className="font-medium text-sm whitespace-nowrap">
																{tab.label}
															</span>

															{/* Hover effect */}
															{!isActive && (
																<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
															)}
														</Link>
													);
												})}
											</div>

											{/* Footer info */}
											<div className="mt-4 pt-3 border-t border-slate-100">
												<div className="px-2">
													<p className="text-xs text-slate-500">
														Assessment ID: {id_assessment}
													</p>
													{result?.id && (
														<p className="text-xs text-slate-500">
															Result ID: {result.id}
														</p>
													)}
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Konten dengan padding biar gak ketutup tabs */}
						<div className="">{children}</div>
					</div>
				</AssessmentContext.Provider>
			)}
		</>
	);
}
