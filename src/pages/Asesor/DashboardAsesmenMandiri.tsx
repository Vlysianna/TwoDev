import {
	Search,
	LayoutDashboard,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import SidebarAsesor from "@/components/SideAsesor";
import NavAsesor from "@/components/NavAsesor";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";

interface AssesseeData {
	result_id: number;
	assessment_id: number;
	assessee_id: number;
	assessee_name: string;
	status: boolean;
}

interface TabResponse {
	assessment_id: number;
	assessment_code: string;
	tabs: Tab[];
}

interface Tab {
	name: string;
	status: 'Not Started' | 'Waiting' | 'Completed';
}

export default function DashboardAsesmenMandiri() {
	const { user } = useAuth();
	const { id_assessment, id_asesor } = useAssessmentParams();
	const navigate = useNavigate();
	const tabsContainerRef = useRef<HTMLDivElement>(null);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(true);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [tabData, setTabData] = useState<TabResponse | null>();
	const [selectedTab, setSelectedTab] = useState<string>("apl-02");
	const [assesseeData, setAssesseeData] = useState<AssesseeData[]>([]);

	useEffect(() => {
		fetchAssesseeData(selectedTab.toLowerCase());
	}, [selectedTab]);

	useEffect(() => {
		assesseeData.filter((assessee) => {
			return assessee.assessee_name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		});
	}, [searchTerm]);

	useEffect(() => {
		fetchTabs();
	}, [user]);

	const fetchTabs = async () => {
		try {
			setLoading(true);
			const response = await api.get(
				`/assessments/navigation/assessor/${id_assessment}`
			);
			if (response.data.success) {
				setTabData(response.data.data);
			} else {
				setError(response.data.message);
			}
		} catch (error) {
			console.error("Failed to fetch tabs:", error);
			setError("Gagal memuat data tab");
		} finally {
			setLoading(false);
		}
	};

	const fetchAssesseeData = async (tab: string) => {
		try {
			setLoading(true);
			const response = await api.get(
				`/dashboard/assessor/${id_asesor}/${id_assessment}/${tab}`
			);
			if (response.data.success) {
				setAssesseeData(response.data.data);
			} else {
				setError(response.data.message);
			}
		} catch (error) {
			console.error("Failed to fetch assessee data:", error);
			setError("Gagal memuat data asesi");
		} finally {
			setLoading(false);
		}
	};

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
				tabsContainerRef.current.removeEventListener("scroll", checkScroll);
			}
		};
	}, []);

	const scrollTabs = (direction: "left" | "right") => {
		if (tabsContainerRef.current) {
			const scrollAmount = 200;
			tabsContainerRef.current.scrollBy({
				left: direction === "right" ? scrollAmount : -scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const getActionText = () => {
		switch (selectedTab.toLowerCase()) {
			case "apl-02":
				return "Cek APL-02 >";
			case "ia-01":
				return "Cek IA-01 >";
			case "ia-02":
				return "Cek IA-02 >";
			case "ia-03":
				return "Cek IA-03 >";
			case "ia-05":
				return "Cek IA-05 >";
			case "ia-07":
				return "Cek IA-07 >";
			case "ak-01":
				return "Cek AK-01 >";
			case "ak-02":
				return "Cek AK-02 >";
			case "ak-03":
				return "Cek AK-03 >";
			case "ak-05":
				return "Cek AK-05 >";
			default:
				return "Cek >";
		}
	};

	const handleActionClick = (assesseeId: number) => {
		switch (selectedTab.toLowerCase()) {
			case "apl-02":
				navigate(paths.asesor.assessment.cekApl02(id_assessment, assesseeId));
				break;
			case "ia-01":
				navigate(paths.asesor.assessment.ia01(id_assessment, assesseeId));
				break;
			case "ia-02":
				navigate(paths.asesor.assessment.ia02(id_assessment, assesseeId));
				break;
			case "ia-03":
				navigate(paths.asesor.assessment.ia03(id_assessment, assesseeId));
				break;
			case "ia-05":
				navigate(paths.asesor.assessment.ia05(id_assessment, assesseeId));
				break;
			case "ak-01":
				navigate(paths.asesor.assessment.ak01(id_assessment, assesseeId));
				break;
			case "ak-02":
				navigate(paths.asesor.assessment.ak02(id_assessment, assesseeId));
				break;
			case "ak-03":
				navigate(paths.asesor.assessment.ak03(id_assessment, assesseeId));
				break;
			case "ak-05":
				navigate(paths.asesor.assessment.ak05(id_assessment, assesseeId));
				break;
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
				<SidebarAsesor />
			</div>

			{/* Main Content */}
			<div className="flex-1 min-w-0">
				{/* Navbar */}
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<NavAsesor
						title="Asesmen Mandiri"
						icon={<LayoutDashboard size={25} />}
					/>
				</div>

				{/* Breadcrumb + Content */}
				<div className="p-4">
					<div className="text-sm text-gray-500 mb-4">
						<Link to="/asesor" className="hover:underline">
							Asesor
						</Link>
						<span className="mx-2">/</span>
						<span className="text-gray-700">Asesmen Mandiri</span>
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
										className={`flex-shrink-0 px-3 py-2 cursor-pointer rounded-md ${
											selectedTab.toLowerCase() === tab.name.toLowerCase()
												? "bg-[#E77D35] text-white" 
												: (tab.status === "Completed") 
												? "bg-green-200 text-green-700 hover:bg-green-300"
												: (tab.status === "Waiting")
												? "bg-gray-300 text-gray-700 hover:bg-gray-400"
												: "text-gray-600 hover:bg-gray-100"
										}`}
									>
										{tab.name}
									</button>
								))}
						</div>
					</div>

					{/* Search + Generate */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
						{/* Search Bar */}
						<div className="relative flex-1">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search..."
								className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md"
							/>
							<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						</div>
					</div>

					{/* Tabel Responsif - Fixed Container */}
					<div className="bg-white rounded-md shadow">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[60px]">
											No
										</th>
										<th className="px-4 py-3 border-b text-left text-sm font-medium text-gray-700 min-w-[200px]">
											Nama Asesi
										</th>
										<th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[120px]">
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr>
											<td
												colSpan={3}
												className="px-4 py-6 text-center text-sm text-gray-500"
											>
												Loading...
											</td>
										</tr>
									) : error ? (
										<tr>
											<td
												colSpan={3}
												className="px-4 py-6 text-center text-sm text-red-500"
											>
												{error}
											</td>
										</tr>
									) : assesseeData.length === 0 ? (
										<tr>
											<td
												colSpan={3}
												className="px-4 py-6 text-center text-sm text-gray-500"
											>
												Tidak ada data
											</td>
										</tr>
									) : (
										assesseeData.map((asesi, index) => (
											<tr
												key={asesi.assessee_id}
												className="hover:bg-gray-50 border-b border-gray-200"
											>
												<td className="px-4 py-3 text-sm text-gray-700">
													{index + 1}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{asesi.assessee_name}
												</td>
												<td className="px-4 py-3 text-center">
													<button
														onClick={() => handleActionClick(asesi.assessee_id)}
														className="text-[#E77D35] underline text-sm hover:text-orange-600 cursor-pointer"
													>
														{getActionText()}
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
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
