import { LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
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

interface TabResponse {
	assessment_id: number;
	assessment_code: string;
	tabs: Tab[];
}

interface Tab {
	name: string;
	status: "Belum Tuntas" | "Menunggu Asesi" | "Tuntas";
}

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function ResultAsesiAssessment() {
	const { id_assessment, id_asesor, id_result } = useAssessmentParams();
	const tabsContainerRef = useRef<HTMLDivElement>(null);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(true);
	const [selectedTab, setSelectedTab] = useState<string>(
		localStorage.getItem("selectedTab") || "apl-01"
	);
	const [selectedDetailTab, setSelectedDetailTab] = useState<string>("");
	const [idUnit, setIdUnit] = useState<string>("");

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
				return <APL01 id_result={id_result} />;
			case "data sertifikasi":
				return <DataSertifikasi id_result={id_result} />;
			case "apl-02":
				return <APL02 id_result={id_result} handleDetail={handleDetail} />;
			case "ia-01":
				return <IA01 id_result={id_result} />;
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
				// return <IA01Detail id_unit={idUnit} />;
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
										{tab.name}
									</button>
								))}
						</div>
					</div>

					<div className="text-gray-800 font-semibold text-lg mb-2">
						Nama Asesi: {localStorage.getItem("assessee_name")}
					</div>

					{/* Content */}
					<div className="bg-white rounded-md shadow">{tabPage}</div>

					{/* Detail Content */}
					<div className="bg-white rounded-md shadow mt-4">{tabDetailPage}</div>
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
