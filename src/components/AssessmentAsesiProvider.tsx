import api from "@/helper/axios";
import routes from "@/routes/paths";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type JSX,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ChevronLeft, ChevronRight, Circle, CircleAlert, Clock, FileCheck, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import StatusDetailModal from "./StatusDetailModal";

type AssessmentParams = {
	id_schedule: string;
	id_asesor: string;
	id_asesi: string;
	id_result: string;
	mutateNavigation: () => void;
};

export interface AssessmentRoute {
	value: string;
	label: string;
	disabled?: boolean;
	to: string;
	status?: string;
}

const AssessmentContext = createContext<AssessmentParams | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
export function useAssessmentParams() {
	const ctx = useContext(AssessmentContext);
	if (!ctx)
		throw new Error(
			"useAssessmentParams must be used within AssessmentProvider"
		);
	return ctx;
}

const fetcherTabs = (url: string) => api.get(url).then((res) => res.data.data);
const fetcherResult = (url: string) => api.get(url).then((res) => res.data.data[0]);

const StatusIndicator = ({ status }: { status: string }) => {
	let icon = null;

	switch (status) {
		case "Tuntas":
			icon = <CheckCircle className="w-4 h-4 text-green-500" />;
			break;
		case "Belum Tuntas":
			icon = <CircleAlert className="w-4 h-4 text-red-500" />;
			break;
		case "Menunggu":
			icon = <Clock className="w-4 h-4 text-blue-500" />;
			break;
		case "Butuh Persetujuan":
			icon = <FileCheck className="w-4 h-4 text-yellow-500" />;
			break;
		default:
			icon = <Circle className="w-4 h-4 text-gray-400" />;
	}

	return <div title={status}>{icon}</div>;
};


export default function AssessmentAsesiProvider({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { id_schedule, id_asesor, id_unit } = useParams();

	// const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!id_schedule || !id_asesor) {
			navigate(routes.asesi.dashboard);
		}
	}, [id_schedule, id_asesor, navigate]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [approveData, setApproveData] = useState<any[] | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [filterApproveData, setFilterApproveData] = useState<any>(undefined);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	useEffect(() => {
		const fetchApprove = async () => {
			setLoading(true);
			// setError(null);

			try {
				const response = await api.get(
					`/assessments/apl-01/results/${id_schedule}`
				);

				if (response.data.success) {
					setApproveData(response.data.data);
				} else {
					// setError("Gagal mengambil data approve");
				}
			} catch (err) {
				console.error("Failed to fetch approve:", err);
				// setError("Terjadi kesalahan saat mengambil data");
			} finally {
				setLoading(false);
			}
		};

		fetchApprove();
	}, []);

	const { data: result, isLoading: loadingResult, error: errorResult } = useSWR(
		`assessments/result/${id_schedule}/${id_asesor}/0`,
		fetcherResult
	);

	useEffect(() => {
		if (approveData == undefined || !result) return;
		// console.log(approveData, result);
		setFilterApproveData(
			approveData.find((data) => data.result_id == result?.id)
		);
		setLoading(false);
	}, [approveData, result]);

	useEffect(() => {
		// console.log(approveData);
		if (!id_schedule || !id_asesor) {
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
							id_schedule,
							id_asesor,
							id_unit!
						)
					) {
						return null;
					}
					// console.log(
					// 	location.pathname ===
					// 		routes.asesi.assessment.dataSertifikasi(id_assessment, id_asesor)
					// );
					return location.pathname;
				} else {
					return routes.asesi.assessment.dataSertifikasi(
						id_schedule,
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

	const { data: navigation, isLoading: loadingNavigation, error: errorNavigation, mutate: mutateNavigation } = useSWR(
		`/assessments/navigation/assessee/${id_schedule}/${id_asesor}/${result?.assessee?.id}`,
		fetcherTabs
	);

	// console.log(id_assessment, id_asesor, result?.assessee?.id, navigation);

	// tab items
	const tabItems: AssessmentRoute[] = useMemo(() => [
		{
			value: routes.asesi.assessment.apl01(
				id_schedule ?? "",
				id_asesor ?? ""
			),
			label: "APL-01",
			disabled: false,
			to: routes.asesi.assessment.apl01(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.dataSertifikasi(
				id_schedule ?? "",
				id_asesor ?? ""
			),
			label: "Data Sertifikasi",
			disabled: false,
			to: routes.asesi.assessment.dataSertifikasi(
				id_schedule ?? "",
				id_asesor ?? ""
			),
		},
		{
			value: routes.asesi.assessment.apl02(
				id_schedule ?? "",
				id_asesor ?? ""
			),
			label: "APL-02",
			disabled: false,
			to: routes.asesi.assessment.apl02(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak04(id_schedule ?? "", id_asesor ?? ""),
			label: "AK-04",
			disabled: false,
			to: routes.asesi.assessment.ak04(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak01(id_schedule ?? "", id_asesor ?? ""),
			label: "AK-01",
			disabled: false,
			to: routes.asesi.assessment.ak01(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ia02(id_schedule ?? "", id_asesor ?? ""),
			label: "IA-02",
			disabled: false,
			to: routes.asesi.assessment.ia02(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ia01Asesi(
				id_schedule ?? "",
				id_asesor ?? ""
			),
			label: "IA-01",
			disabled: false,
			to: routes.asesi.assessment.ia01Asesi(
				id_schedule ?? "",
				id_asesor ?? ""
			),
		},
		{
			value: routes.asesi.assessment.ia03(id_schedule ?? "", id_asesor ?? ""),
			label: "IA-03",
			disabled: false,
			to: routes.asesi.assessment.ia03(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ia05(id_schedule ?? "", id_asesor ?? ""),
			label: "IA-05",
			disabled: false,
			to: routes.asesi.assessment.ia05(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak02(id_schedule ?? "", id_asesor ?? ""),
			label: "AK-02",
			disabled: false,
			to: routes.asesi.assessment.ak02(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak03(id_schedule ?? "", id_asesor ?? ""),
			label: "AK-03",
			disabled: false,
			to: routes.asesi.assessment.ak03(id_schedule ?? "", id_asesor ?? ""),
		},
		{
			value: routes.asesi.assessment.ak05(id_schedule ?? "", id_asesor ?? ""),
			label: "AK-05",
			disabled: false,
			to: routes.asesi.assessment.ak05(id_schedule ?? "", id_asesor ?? ""),
		},
	], []);

	const filteredTabItems: AssessmentRoute[] = useMemo(() => {
		if (!navigation?.tabs) return [];

		// Dapatkan daftar nama tab yang tersedia dari API
		const availableTabNames = navigation.tabs.map((tab: { name: string; status: string }) => tab.name);

		// Filter tabItems berdasarkan nama yang ada di API
		let filtered = tabItems.filter((tab) =>
			availableTabNames.includes(tab.label)
		);

		// Tambahkan status ke setiap tab
		filtered = filtered.map(tab => {
			const tabData = navigation.tabs.find((t: { name: string }) => t.name === tab.label);
			return {
				...tab,
				status: tabData?.status || "Menunggu"
			};
		});

		const apl02Index = filtered.findIndex((tab) => tab.label === "APL-02");

		if (apl02Index !== -1 && navigation?.enable_other_route === false) {
			filtered = filtered.map((tab, idx) =>
				idx > apl02Index ? { ...tab, disabled: true } : tab
			);
		}

		return filtered;
	}, [navigation, tabItems]);

	const [showStatusModal, setShowStatusModal] = useState(false);

	return (
		<>
			{loading || (loadingResult && !errorResult) || (loadingNavigation && !errorNavigation) ? (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
				</div>
			) : (
				<AssessmentContext.Provider
					value={{
						id_schedule: id_schedule!,
						id_asesor: id_asesor!,
						id_result: result?.id,
						id_asesi: result?.assessee.id,
						mutateNavigation,
					}}
				>
					<div className="relative w-full min-h-screen">
						{/* Floating Tabs */}
						<div className="fixed top-25 left-3 z-200">
							{/* Toggle Button */}
							<motion.button
								onClick={toggleTabs}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className="
									w-8 h-8 bg-white hover:bg-slate-50 border border-slate-200 
									rounded-full shadow-lg flex items-center justify-center
									mb-2 cursor-pointer
								"
							>
								{isTabsOpen ? (
									<ChevronLeft className="w-5 h-5 text-slate-700" />
								) : (
									<ChevronRight className="w-5 h-5 text-slate-700" />
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
											{result?.id ? (
												<div>
													<div
														className="overflow-y-auto space-y-2 max-h-96
													pr-2
													[scrollbar-width:thin] 
													[scrollbar-color:#f97316_transparent] 
													[&::-webkit-scrollbar]:w-1.5 
													[&::-webkit-scrollbar-track]:bg-transparent 
													[&::-webkit-scrollbar-thumb]:rounded-full 
													[&::-webkit-scrollbar-thumb]:bg-orange-400/80
												"
													>
														{filteredTabItems.map((tab: AssessmentRoute, index) => {
															const isActive = location.pathname === tab.value;
															return (
																<Link
																	key={index}
																	to={tab.to}
																	onClick={(e) => {
																		if (tab.disabled) e.preventDefault();
																		else setIsTabsOpen(false);
																	}}
																	className={`group relative flex items-center justify-between space-x-3 px-3 py-2 rounded-xl transition-all duration-300 
																${isActive
																			? "bg-gradient-to-r from-orange-500 to-orange-300 text-white shadow-lg shadow-orange-500/25"
																			: tab.disabled
																				? "text-slate-400 cursor-not-allowed bg-slate-100/50" // style disabled
																				: "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
																		}`}
																>
																	<div className="flex items-center">
																		{/* Active indicator */}
																		{isActive && (
																			<div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
																		)}

																		<span className="font-medium text-sm whitespace-nowrap">
																			{tab.label}
																		</span>
																	</div>

																	{/* Status indicator */}
																	<div className="bg-white p-2 rounded-full flex items-center justify-center">
																		{tab.status && <StatusIndicator status={tab.status} />}
																	</div>

																	{/* Hover effect */}
																	{!isActive && (
																		<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
																	)}
																</Link>
															);
														})}
													</div>

													{/* Footer info */}
													<div className="mt-3 pt-3 border-t border-gray-200">
														<div className="px-2 space-y-2">
															{/* Status Legend */}
															<div className="space-y-1 mb-1">
																<p className="text-xs font-semibold text-slate-700">Keterangan Status:</p>

																<div className="flex items-center gap-2">
																	<CircleAlert className="w-4 h-4 text-red-500" />
																	<span className="text-xs text-slate-600">Belum Tuntas</span>
																</div>

																<div className="flex items-center gap-2">
																	<Clock className="w-4 h-4 text-blue-500" />
																	<span className="text-xs text-slate-600">Menunggu</span>
																</div>

																<div className="flex items-center gap-2">
																	<FileCheck className="w-4 h-4 text-yellow-500" />
																	<span className="text-xs text-slate-600">Butuh Persetujuan</span>
																</div>

																<div className="flex items-center gap-2">
																	<CheckCircle className="w-4 h-4 text-green-500" />
																	<span className="text-xs text-slate-600">Tuntas</span>
																</div>
															</div>
															<div className="mt-2">
																<p className="text-xs font-medium text-slate-500">
																	<button
																		onClick={() => setShowStatusModal(true)}
																		className="underline flex items-center gap-1 cursor-pointer hover:text-slate-600"
																	>
																		<Info className="w-4 h-4" />
																		<span>Lihat Detail Status</span>
																	</button>
																</p>

																{/* Modal */}
																<StatusDetailModal
																	open={showStatusModal}
																	onClose={() => setShowStatusModal(false)}
																/>
															</div>
															{/* <p className="text-xs text-slate-500">
														Assessment ID: {id_assessment}
													</p>
													{result?.id && (
														<p className="text-xs text-slate-500">
															Result ID: {result.id}
														</p>
													)} */}
														</div>
													</div>
												</div>
												) : (
													<div className="p-4 text-center text-sm text-slate-600">
														<p className="font-medium text-red-500">
															Lengkapi data diri Anda terlebih dahulu.
														</p>
													</div>
												)}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Konten dengan padding biar gak ketutup tabs */}
						<div>{children}</div>
					</div>
				</AssessmentContext.Provider>
			)}
		</>
	);
}
