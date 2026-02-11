import {
	LayoutDashboard,
	ChevronLeft,
	ChevronRight,
	Download,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "@/helper/axios";
import paths from "@/routes/paths";
import { useAssessmentParams } from "@/components/AssessmentAdminProvider";
import NavAdmin from "@/components/NavAdmin";
import Sidebar from "@/components/SideAdmin";
import APL02 from "@/components/section/admin/APL-02";
import APL01 from "@/components/section/admin/APL-01";
import useSWR from "swr";
import DataSertifikasi from "@/components/section/admin/DataSertifikasi";
import AK01 from "@/components/section/admin/AK-01";
import IA02 from "@/components/section/admin/IA-02";
import IA01 from "@/components/section/admin/IA-01";
import IA03 from "@/components/section/admin/IA-03";
import IA05 from "@/components/section/admin/IA-05";
import AK02 from "@/components/section/admin/AK-02";
import AK03 from "@/components/section/admin/AK-03";
import AK05 from "@/components/section/admin/AK-05";
import APL02Detail from "@/components/section/admin/APL-02-Detail";
import IA01Detail from "@/components/section/admin/IA-01-Detail";
import useToast from "@/components/ui/useToast";
import { handleViewPDF } from "@/helper/ia02";

interface TabResponse {
	assessment_id: number;
	assessment_code: string;
	tabs: Tab[];
}

interface Tab {
	name: string;
	status: "Belum Tuntas" | "Menunggu Asesi" | "Tuntas";
}

const EXPORTABLE_TABS = ["apl-01", "apl-02", "ia-01", "ia-02", "ia-03", "ia-05", "ak-01", "ak-02", "ak-03", "ak-05"];

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function ResultAsesiAssessment() {
	const { id_schedule: id_assessment, id_asesor, id_result } = useAssessmentParams();
	const tabsContainerRef = useRef<HTMLDivElement>(null);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(true);
	const [selectedTab, setSelectedTab] = useState<string>(
		localStorage.getItem("selectedTab") || "apl-01"
	);
	const [selectedDetailTab, setSelectedDetailTab] = useState<string>("");
	const [loadingExport, setLoadingExport] = useState(false);
	const [idUnit, setIdUnit] = useState<string>("");

  const [generatingPdfIA02, setGeneratingPdfIA02] = useState(false);

	const toast = useToast();

	useEffect(() => {
		// fetchAssesseeData(selectedTab.toLowerCase());
		localStorage.setItem("selectedTab", selectedTab);
	}, [selectedTab]);

	const { data: tabData } = useSWR<TabResponse>(
		`/assessments/navigation/admin/${id_result}`,
		fetcher
	);

	useEffect(() => {
		const checkScroll = () => {
			if (tabsContainerRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } =
					tabsContainerRef.current;
				setShowLeftScroll(scrollLeft > 0);
				setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
			}
		};

		if (tabsContainerRef.current) {
			tabsContainerRef.current.addEventListener("scroll", checkScroll);
			checkScroll(); // Check initial state
		}

		return () => {
			if (tabsContainerRef.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				tabsContainerRef.current.removeEventListener("scroll", checkScroll);
			}
		};
	}, []);

	const handleDetail = (name: string, id: string) => {
		setSelectedDetailTab(name);
		setIdUnit(id);
	};

	const scrollTabs = (direction: "left" | "right") => {
		if (tabsContainerRef.current) {
			const scrollAmount = 200;
			tabsContainerRef.current.scrollBy({
				left: direction === "right" ? scrollAmount : -scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const tabPage = useMemo(() => {
		setSelectedDetailTab("");
		if (!id_result || !id_assessment) return <></>;
		switch (selectedTab.toLowerCase()) {
			case "apl-01":
				return (
					<>
						<APL01 id_result={id_result} />
						<DataSertifikasi id_result={id_result} />
					</>
				)
			case "apl-02":
				return <APL02 id_result={id_result} handleDetail={handleDetail} />;
			case "ia-01":
				return <IA01 id_result={id_result} handleDetail={handleDetail} />;
				break;
			case "ia-02":
				return <IA02 id_result={id_result} />;
				break;
			case "ia-03":
				return <IA03 id_result={id_result} />;
				break;
			case "ia-05":
				return <IA05 id_result={id_result} />;
				break;
			case "ak-01":
				return <AK01 id_result={id_result} />;
				break;
			case "ak-02":
				return <AK02 id_result={id_result} />;
				break;
			case "ak-03":
				return <AK03 id_result={id_result} />;
				break;
			case "ak-05":
				return <AK05 id_result={id_result} />;
				break;
		}
	}, [selectedTab, id_result, id_assessment]);

	const tabDetailPage = useMemo(() => {
		if (!idUnit || !id_result) return <></>;
		switch (selectedDetailTab.toLowerCase()) {
			case "apl-02-detail":
				return <APL02Detail id_unit={idUnit} id_result={id_result} />;
			case "ia-01-detail":
				return <IA01Detail id_unit={idUnit} id_result={id_result} />;
				return <></>;
			default:
				<></>;
		}
	}, [selectedDetailTab, idUnit, id_result]);

	// const statusClasses: Record<string, string> = {
	// 	"Belum Selesai": "text-red-500",
	// 	"Menunggu Asesi": "text-blue-500",
	// 	Selesai: "text-green-500",
	// };

	// const statusIcons: Record<string, JSX.Element> = {
	// 	"Belum Selesai": <SquareX size={14} />,
	// 	"Menunggu Asesi": <Loader size={14} />,
	// 	Selesai: <CheckCircle size={14} />,
	// };

	const handleExport = async (tab: string) => {
		try {
			setLoadingExport(true);

			const res = await api.get(
				`/assessments/${tab}/result/${id_result}/export`,
				{ responseType: "blob" }
			);
			
			// Ambil nama asesi dari localStorage dan sanitize untuk nama file
			const assesseeName = localStorage.getItem("assessee_name") || "";
			const sanitizedName = assesseeName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
			const fileName = sanitizedName ? `${tab.toUpperCase()}_${sanitizedName}.pdf` : `${tab.toUpperCase()}.pdf`;
			
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
			toast.show({
				title: "Berhasil",
				description: `${tab.toUpperCase()}${assesseeName ? ` - ${assesseeName}` : ""} berhasil diunduh`,
				type: "success",
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			toast.show({
				title: "Gagal",
				description: e?.response?.data?.message || "Terjadi kesalahan",
				type: "error",
			});
		} finally {
			setLoadingExport(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
				<Sidebar />
			</div>

			{/* Main Content */}
			<div className="flex-1 min-w-0">
				{/* Navbar */}
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<NavAdmin
						title="Asesmen Mandiri"
						icon={<LayoutDashboard size={25} />}
					/>
				</div>

				{/* Breadcrumb + Content */}
				<div className="p-4">
					<div className="flex justify-between">
						<div className="p-4">
							<div className="text-sm text-gray-500 mb-4">
								<Link
									to={paths.admin.resultAssessment.root}
									className="hover:underline"
								>
									Hasil Asesmen
								</Link>
								<span className="mx-2">/</span>
								<Link
									to={paths.admin.resultAssessment.dashboard(
										id_assessment,
										id_asesor!
									)}
									className="hover:underline"
								>
									Asesmen Mandiri
								</Link>
								<span className="mx-2">/</span>
								<span className="text-gray-700">Asesi</span>
							</div>
						</div>
						<div className="p-4">
							{EXPORTABLE_TABS.includes(selectedTab.toLowerCase()) ? (
								<>
								 {selectedTab.toLowerCase() !== "ia-02" ? (
									<button
										onClick={() => handleExport(selectedTab)}
										disabled={loadingExport}
										className="flex items-center justify-center px-4 py-2 bg-[#E77D35] text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loadingExport ? (
											<>
												<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Mengunduh...
											</>
										) : (
											<>
												<Download className="w-4 h-4 mr-2" />
												Export
											</>
										)}
									</button>
								 ) : (
									<div className="flex flex-col sm:flex-row gap-3">
										<button
											onClick={() => handleExport(selectedTab)}
											disabled={loadingExport}
											className="flex items-center justify-center px-4 py-2 bg-[#E77D35] text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{loadingExport ? (
												<>
													<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													Mengunduh...
												</>
											) : (
												<>
													<Download className="w-4 h-4 mr-2" />
													Export
												</>
											)}
										</button>
										<button
											onClick={() => handleViewPDF(setGeneratingPdfIA02, id_assessment, true)}
											disabled={generatingPdfIA02}
											className="flex items-center justify-center gap-2 bg-[#E77D35] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Lihat PDF
										</button>
									</div>
								 )}
								</>
							) : (
								<button
									disabled
									className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
									title="Export PDF belum tersedia untuk form ini"
								>
									<Download className="w-4 h-4 mr-2" />
									Export
								</button>
							)}
						</div>
					</div>

					{/* Tab Buttons dengan Scroll Horizontal */}
					<div className="relative mb-6">
						{/* Scroll buttons */}
						{showLeftScroll && (
							<button
								onClick={() => scrollTabs("left")}
								className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
							>
								<ChevronLeft size={20} />
							</button>
						)}

						{showRightScroll && (
							<button
								onClick={() => scrollTabs("right")}
								className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
							>
								<ChevronRight size={20} />
							</button>
						)}

						{/* Container tab dengan scroll horizontal */}
						<div
							ref={tabsContainerRef}
							className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2"
							style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
						>
							{tabData &&
								tabData.tabs.map((tab) => (
									<button
										key={tab.name}
										onClick={() => setSelectedTab(tab.name)}
										className={`flex-shrink-0 px-3 py-2 cursor-pointer rounded-md border-b-2 transition-all duration-200
										${
											selectedTab.toLowerCase() === tab.name.toLowerCase()
												? "border-orange-800 bg-[#E77D35] text-white font-semibold"
												: tab.status === "Tuntas"
												? "border-green-500 text-green-700 font-medium"
												: tab.status === "Menunggu Asesi"
												? "border-blue-500 text-blue-600 font-medium"
												: "border-gray-300 text-gray-600"
										}`}
									>
										{tab.name === "IA-05" ? "IA-05-C" : tab.name}
									</button>
								))}
						</div>
					</div>

					<div className="text-gray-800 font-semibold text-lg mb-2">
						Nama Asesi: {localStorage.getItem("assessee_name")}
					</div>

					{/* Content */}
					<div className="">{tabPage}</div>

					{/* Detail Content */}
					<div className="mt-4">{tabDetailPage}</div>
				</div>
			</div>
		</div>
	);
}

// Tambahkan style untuk menyembunyikan scrollbar
const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);
