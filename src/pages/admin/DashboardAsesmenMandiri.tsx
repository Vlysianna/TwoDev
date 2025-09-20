import {
	Search,
	LayoutDashboard,
	ChevronLeft,
	ChevronRight,
    SquareX,
    Loader,
    CheckCircle,
} from "lucide-react";
import SideAdmin from "@/components/SideAdmin";
import NavAdmin from "@/components/NavAdmin";
import { useEffect, useState, useRef, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/helper/axios";
import { useAssessmentParams } from "@/components/AssessmentAdminProvider";
import paths from "@/routes/paths";
import routes from "@/routes/paths";

interface AssesseeData {
	result_id: number;
	assessee_id: number;
	full_name: string;
	status: "Sedang Berjalan" | "Belum Kompeten" | "Kompeten";
	created_at: string;
}

export default function DashboardAsesmenMandiriAdmin() {
	const { id_assessment, id_asesor } = useAssessmentParams();
	const navigate = useNavigate();
	const tabsContainerRef = useRef<HTMLDivElement>(null);

	const [showLeftScroll, setShowLeftScroll] = useState(false);
	const [showRightScroll, setShowRightScroll] = useState(true);

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [assesseeData, setAssesseeData] = useState<AssesseeData[]>([]);

	useEffect(() => {
		fetchAssesseeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		assesseeData.filter((assessee) => {
			return assessee.full_name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm]);

	const fetchAssesseeData = async () => {
		try {
			setLoading(true);
			const response = await api.get(
				`/assessments/results/status/admin/assessees/${id_assessment}/${id_asesor}`
			);
			if (response.data.success) {
				setAssesseeData(
					response.data.data.sort((a: AssesseeData, b: AssesseeData) => {
						const order = {
							"Belum Kompeten": 0,
							"Sedang Berjalan": 1,
							Kompeten: 2,
						};

						// Bandingkan status dulu
						const statusDiff = order[a.status] - order[b.status];
						if (statusDiff !== 0) return statusDiff;

						// Kalau status sama, bandingkan huruf pertama dari nama asesi
						const nameA = a.full_name.toUpperCase();
						const nameB = b.full_name.toUpperCase();
						if (nameA < nameB) return -1;
						if (nameA > nameB) return 1;
						return 0;
					})
				);
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
				// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const statusClasses: Record<string, string> = {
		"Belum Kompeten": "text-red-500",
		"Sedang Berjalan": "text-blue-500",
		Kompeten: "text-green-500",
	};

	const statusIcons: Record<string, JSX.Element> = {
		"Belum Selesai": <SquareX size={14} />,
		"Sedang Berjalan": <Loader size={14} />,
		Selesai: <CheckCircle size={14} />,
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md flex-shrink-0">
				<SideAdmin />
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
					<div className="text-sm text-gray-500 mb-4">
						<Link
							to={paths.admin.resultAssessment.root}
							className="hover:underline"
						>
							Hasil Asesmen
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
										<th className="px-4 py-3 border-b text-center text-sm font-medium text-gray-700 min-w-[200px]">
											Status
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
													{asesi.full_name}
												</td>
												<td className="px-4 py-3 text-sm text-gray-700 text-center">
													<span
														className={`inline-flex items-center gap-1 px-2 py-1 text-center rounded-full text-xs font-medium ${
															statusClasses[asesi.status]
														}`}
													>
														{statusIcons[asesi.status]}
														{asesi.status}
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<button
														onClick={() => {
															localStorage.setItem(
																"assessee_name",
																asesi.full_name
															);
															navigate(
																routes.admin.resultAssessment.resultAsesi(
																	id_assessment,
																	id_asesor!,
																	asesi.assessee_id
																)
															);
														}}
														className="text-[#E77D35] underline text-sm hover:text-orange-600 cursor-pointer"
													>
														{"Lihat Hasil >"}
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
