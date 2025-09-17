import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import {
	ListFilter,
	Search,
	LayoutDashboard,
	Clock,
	ChevronRight,
	MapPinned,
	FileBarChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import SidebarAsesor from "@/components/SideAsesor";
import NavbarAsesor from "@/components/NavAsesor";

const DashboardAsesor: React.FC = () => {
	const { user } = useAuth();

	interface ScheduleDetail {
		id: number;
		assessor?: { id: number; full_name?: string };
		location?: string;
	}

	interface AssessmentOccupation {
		name?: string;
		scheme?: { name?: string; code?: string };
	}

	interface Schedule {
		start_date?: string;
		end_date?: string;
		assessment?: { id: number; occupation?: AssessmentOccupation };
		schedule_details?: ScheduleDetail[];
	}

	interface Card {
		id: number;
		title: string;
		subtitle?: string;
		status?: string;
		startDate?: string;
		endDate?: string;
		avatar: string;
		avatarBg?: string;
		instructor?: string;
		role?: string;
		borderColor?: string;
		schemeCode?: string;
		schemeName?: string;
		location?: string;
		idAssessment?: number;
	}

	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedProgram, setSelectedProgram] = useState<string>("ALL");
	const [programFilters, setProgramFilters] = useState<
		Array<{ code: string; name: string; count: number; color: string }>
	>([]);

	const getStatusFromSchedule = useCallback((schedule: Schedule) => {
		const now = new Date();
		const start = new Date(schedule.start_date || "");
		const end = new Date(schedule.end_date || "");

		if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Menunggu";
		if (now < start) return "Menunggu";
		if (now >= start && now <= end) return "Aktif";
		return "Selesai";
	}, []);

	useEffect(() => {
		const load = async () => {
			if (!user) return;
			setLoading(true);
			try {
				// Get assessor record for current user
				const assessorResp = await api.get(`/assessor/user/${user.id}`);
				const assessor = assessorResp.data?.data;

				// Fetch schedules (unprotected endpoint) and filter locally for assessor
				const schedulesResp = await api.get("/schedules/active-assessor");
				const schedules: Schedule[] = schedulesResp.data?.data || [];

				// Flatten schedule details assigned to this assessor
				const assigned: Card[] = [];
				schedules.forEach((sch) => {
					(sch.schedule_details || []).forEach((detail) => {
						if (assessor && detail.assessor?.id === assessor.id) {
							assigned.push({
								id: detail.id,
								title:
									sch.assessment?.occupation?.scheme?.name ||
									sch.assessment?.occupation?.name ||
									"Okupasi",
								subtitle: sch.assessment?.occupation?.name || "",
								status: getStatusFromSchedule(sch),
								startDate: formatDate(sch.start_date || ""),
								endDate: formatDate(sch.end_date || ""),
								avatar: getInitials(
									detail.assessor?.full_name || user.email || "AS"
								),
								avatarBg: "bg-[#60B5FF]",
								instructor: detail.assessor?.full_name || user.email,
								role: "Asesor",
								borderColor: "border-[#60B5FF]",
								location: detail.location || "TBD",
								schemeCode: sch.assessment?.occupation?.scheme?.code,
								schemeName: sch.assessment?.occupation?.scheme?.name,
								idAssessment: sch.assessment?.id,
							});
						}
					});
				});

				setCards(assigned);
			} catch (err) {
				console.error("Error loading assessor dashboard data", err);
				setError("Gagal memuat data dari server");
			} finally {
				setLoading(false);
			}
		};

		load();
	}, [user, getStatusFromSchedule]);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	// Program (jurusan) helpers
	const programColors = React.useMemo(
		() => ({
			RPL: "bg-orange-500",
			TBG: "bg-green-500",
			TBS: "bg-pink-500",
			PH: "bg-purple-500",
			ULW: "bg-teal-500",
			TKJ: "bg-indigo-500",
			MM: "bg-red-500",
			OTKP: "bg-yellow-500",
			AKL: "bg-blue-500",
		}),
		[]
	);

	const getProgramFullName = (code: string) => {
		const programNames: Record<string, string> = {
			RPL: "Rekayasa Perangkat Lunak",
			TBG: "Tata Boga",
			TBS: "Tata Busana",
			PH: "Perhotelan",
			ULW: "Usaha Layanan Wisata",
			OTKP: "Otomatisasi Tata Kelola Perkantoran",
			AKL: "Akuntansi Keuangan Lembaga",
		};
		return programNames[code] || code;
	};

	// Compute program filters when cards update
	useEffect(() => {
		const counts: Record<string, number> = {};
		cards.forEach((c) => {
			const code = c.schemeCode || "UNKNOWN";
			counts[code] = (counts[code] || 0) + 1;
		});

		const filters = Object.entries(counts).map(([code, count]) => ({
			code,
			name: getProgramFullName(code),
			count,
			color: programColors[code as keyof typeof programColors] || "bg-gray-500",
		}));

		filters.sort((a, b) => b.count - a.count);
		setProgramFilters(filters);
	}, [cards, programColors]);

	// Apply search + program filter
	const visibleCards = cards.filter((c) => {
		if (selectedProgram !== "ALL") {
			if ((c.schemeCode || "UNKNOWN") !== selectedProgram) return false;
		}

		if (!searchTerm) return true;
		const q = searchTerm.toLowerCase();
		return (
			(c.title || "").toLowerCase().includes(q) ||
			(c.subtitle || "").toLowerCase().includes(q) ||
			(c.instructor || "").toLowerCase().includes(q) ||
			(c.schemeCode || "").toLowerCase().includes(q) ||
			(c.schemeName || "").toLowerCase().includes(q)
		);
	});

	const formatDate = (dateString: string) => {
		if (!dateString) return "TBD";
		try {
			const d = new Date(dateString);
			return d.toLocaleDateString("id-ID", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateString;
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
				<SidebarAsesor />
			</div>

			{/* Main Content */}
			<div className="flex-1">
				{/* Navbar */}
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<NavbarAsesor
						title="Dashboard Asesor"
						icon={<LayoutDashboard size={25} />}
					/>
				</div>

				{/* Main Body */}
				<main className="p-4">
					{/* Header Welcome + Search + Filter */}
					<div className="mb-6">
						<div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
							<div className="flex items-center space-x-2">
								<span className="text-gray-600">Selamat datang,</span>
								<span className="font-semibold text-gray-900">
									{user?.email || "Asesor"}
								</span>
							</div>

							<div className="flex items-center gap-4">
								<div className="relative w-full md:w-80">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Search..."
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50">
									<ListFilter className="w-4 h-4 text-gray-600" />
									<span className="text-gray-600">Filter</span>
								</button>
							</div>
						</div>

						{/* Tabs */}
						<div className="flex items-center space-x-2 mt-6">
							<button
								onClick={() => setSelectedProgram("ALL")}
								className={`px-4 py-2 rounded-md ${
									selectedProgram === "ALL"
										? "bg-blue-500 text-white"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								Semua ({cards.length})
							</button>
							{programFilters.map((p) => (
								<button
									key={p.code}
									onClick={() => setSelectedProgram(p.code)}
									className={`px-4 py-2 rounded-md ${
										selectedProgram === p.code
											? `${p.color} text-white`
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									{p.code} ({p.count})
								</button>
							))}
						</div>
					</div>

					{/* Grid Okupasi */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{loading && (
							<div className="lg:col-span-3 flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
							</div>
						)}

						{!loading && error && (
							<div className="lg:col-span-3 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
								<span className="text-red-800">{error}</span>
							</div>
						)}

						{!loading && !error && visibleCards.length === 0 && (
							<div className="lg:col-span-3 text-center py-12">
								<p className="text-gray-600">
									Belum ada tugas asesmen untuk Anda.
								</p>
							</div>
						)}

						{!loading &&
							!error &&
							visibleCards.length > 0 &&
							visibleCards.map((card) => {
								return (
									<div
										key={card.id}
										className={`bg-white rounded-lg shadow-sm border-b-4 ${card.borderColor} hover:shadow-md transition-shadow`}
									>
										{/* Header */}
										<div className="p-4 border-b border-gray-100">
											<div className="flex items-center justify-between">
												<h3 className="font-semibold text-gray-900">
													{card.title}
												</h3>
											</div>
											<p className="text-sm text-gray-600 mb-2">
												{card.subtitle}
											</p>
											<div className="flex items-center space-x-1 text-xs text-gray-500">
												<Clock className="w-4 h-4" />
												<span>{card.status}</span>
											</div>
										</div>

										{/* Lokasi */}
										<div className="flex items-center justify-center mt-3 text-sm">
											<MapPinned className="w-5 h-5 mr-1" />
											<span>{card.location}</span>
										</div>

										{/* Timeline */}
										<div className="px-4 pt-3 pb-10">
											<div className="flex flex-col items-center">
												<div className="flex justify-between w-full text-sm text-gray-500 mb-2">
													<span>{card.startDate}</span>
													<span>{card.endDate}</span>
												</div>
												<div className="relative w-full h-4 flex items-center">
													<div className="absolute left-0 right-0 h-[2px] bg-gray-300" />
													<div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
													<div className="flex-1"></div>
													<div className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full z-2"></div>
												</div>
											</div>
										</div>

										{/* Footer */}
										<div className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<div
														className={`w-8 h-8 ${card.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-medium`}
													>
														{card.avatar}
													</div>
													<div>
														<p className="text-sm font-medium text-gray-900">
															{card.instructor}
														</p>
														<p className="text-xs text-gray-500">{card.role}</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													<Link
														to={paths.asesor.recapAssessment(card.id)}
														className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
														title="Recap Assessment"
													>
														<FileBarChart className="w-4 h-4 text-white" />
													</Link>
													<Link
														to={paths.asesor.assessment.dashboardAsesmenMandiri(
															card.idAssessment || 0
														)}
														className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
														title="Dashboard Assessment"
													>
														<ChevronRight className="w-4 h-4 text-white" />
													</Link>
												</div>
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardAsesor;
