import { useState, useEffect } from "react";
import SidebarAsesi from "@/components/SideAsesi";
import {
	LayoutDashboard,
	Clock,
	ChevronRight,
	Search,
	BookOpen,
	AlertCircle,
	MapPinned,
} from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/helper/initial";
import { formatDate } from "@/helper/format-date";
import type { Schedule } from "@/lib/types";

interface ScheduleResponse {
	id: number;
	assessment: {
		id: number;
		code: string;
		occupation: {
			id: number;
			name: string;
			scheme: {
				id: number;
				code: string;
				name: string;
			};
		};
	};
	start_date: string;
	end_date: string;
	schedule: Schedule;
	schedule_details: Array<{
		id: number;
		assessor: {
			id: number;
			full_name: string;
			phone_no: string;
		}; 
		location: string;
	}>;
}

interface ProgramFilter {
	code: string;
	name: string;
	count: number;
	color: string;
}

export default function DashboardAsesi() {
	const { user } = useAuth();
	const [schedules, setSchedule] = useState<ScheduleResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredSchedules, setFilteredSchedules] = useState<ScheduleResponse[]>([]);
	const [selectedProgram, setSelectedProgram] = useState<string>("ALL");
	const [programFilters, setProgramFilters] = useState<ProgramFilter[]>([]);

	const fetchAssessments = async () => {
		try {
			const response = await api.get("/schedules/active");
			if (response.data.success) {
				setSchedule(response.data.data);
			}
		} catch (error) {
			console.error("Failed to fetch assessments:", error);
			setError("Gagal memuat data asesmen.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAssessments();
	}, [user]);

	useEffect(() => {
		updateProgramFilters();
	}, [schedules]);

	useEffect(() => {
		const filtered = schedules
			.map(schedule => {
				// Filter detail per searchTerm
				const filteredDetails = schedule.schedule_details.filter(detail => {
					const term = searchTerm.toLowerCase();
					return (
						detail.assessor.full_name.toLowerCase().includes(term) ||
						detail.location.toLowerCase().includes(term) ||
						schedule.assessment.occupation.name.toLowerCase().includes(term) ||
						schedule.assessment.occupation.scheme.name.toLowerCase().includes(term)
					);
				});

				// Hanya return schedule kalau ada detail yang match
				if (filteredDetails.length > 0) {
					return { ...schedule, schedule_details: filteredDetails };
				}
				return null;
			})
			.filter(Boolean) as typeof schedules; // buang null

		// Filter berdasarkan selectedProgram juga
		const finalFiltered = selectedProgram === "ALL"
			? filtered
			: filtered.filter(
					sch => sch.assessment.occupation.scheme.code === selectedProgram
				);

		setFilteredSchedules(finalFiltered);
	}, [searchTerm, schedules, selectedProgram]);


	const updateProgramFilters = () => {
		const programCounts = schedules.reduce((acc, sch) => {
			const program = sch.assessment.occupation.scheme.code;
			acc[program] = (acc[program] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const programColors = {
			RPL: "bg-orange-500",
			TBG: "bg-green-500",
			TBS: "bg-pink-500",
			PH: "bg-purple-500",
			ULW: "bg-teal-500",
			TKJ: "bg-indigo-500",
			MM: "bg-red-500",
			OTKP: "bg-yellow-500",
			AKL: "bg-blue-500",
		};

		const filters: ProgramFilter[] = Object.entries(programCounts).map(
			([program, count]) => ({
				code: program,
				name: getProgramFullName(program),
				count,
				color:
					programColors[program as keyof typeof programColors] || "bg-gray-500",
			})
		);

		filters.sort((a, b) => b.count - a.count);
		setProgramFilters(filters);
	};

	const getProgramFullName = (code: string): string => {
		const programNames = {
			RPL: "Rekayasa Perangkat Lunak",
			TBG: "Tata Boga",
			TBS: "Tata Busana",
			PH: "Perhotelan",
			ULW: "Usaha Layanan Wisata",
			OTKP: "Otomatisasi Tata Kelola Perkantoran",
			AKL: "Akuntansi Keuangan Lembaga",
		};
		return programNames[code as keyof typeof programNames] || code;
	};

	const getStatusFromSchedule = (schedule: ScheduleResponse) => {
		const now = new Date();
		const start = new Date(schedule.start_date);
		const end = new Date(schedule.end_date);

		if (now < start) return "Menunggu";
		if (now >= start && now <= end) return "Aktif";
		return "Selesai";
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Aktif":
				return "text-green-600 bg-green-50 border-green-200";
			case "Menunggu":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "Selesai":
				return "text-gray-600 bg-gray-50 border-gray-200";
			default:
				return "text-blue-600 bg-blue-50 border-blue-200";
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-50">
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
				<SidebarAsesi />
			</div>

			<div className="flex-1">
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<NavbarAsesi
						title="Dashboard Asesi"
						icon={<LayoutDashboard size={25} />}
					/>
				</div>

				<div className="p-6">
					{error && (
						<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
							<AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
							<span className="text-yellow-800">{error}</span>
						</div>
					)}

					<main>
						{/* Header */}
						<div className="mb-6 p-4 flex flex-col md:flex-row md:items-center gap-4">
							<div className="flex items-center space-x-2">
								<span className="text-gray-600">Selamat datang,</span>
								<span className="font-semibold text-gray-900">
									{user?.full_name || "Asesi"}!
								</span>
							</div>

							<div className="flex items-center gap-4">
								<div className="relative w-full md:w-80">
									<input
										type="text"
										placeholder="Search..."
										className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
									<Search
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
										size={16}
									/>
								</div>
							</div>
						</div>

						{/* Program Filter */}
						<div className="mb-6 px-4">
							<div className="flex flex-wrap items-center gap-2">
								<button
									onClick={() => setSelectedProgram("ALL")}
									className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
										selectedProgram === "ALL"
											? "bg-blue-500 text-white"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									Semua
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
											selectedProgram === "ALL"
												? "bg-blue-600 text-white"
												: "bg-gray-200 text-gray-600"
										}`}
									>
										{schedules.length}
									</span>
								</button>

								{programFilters.map((filter) => (
									<button
										key={filter.code}
										onClick={() => setSelectedProgram(filter.code)}
										className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all ${
											selectedProgram === filter.code
												? `${filter.color} text-white`
												: "text-gray-700 hover:bg-gray-50"
										}`}
									>
										{filter.code}
										<span
											className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
												selectedProgram === filter.code
													? "text-white"
													: "text-gray-600"
											}`}
										>
											( {filter.count} )
										</span>
									</button>
								))}
							</div>

							{selectedProgram !== "ALL" && (
								<div className="mt-3 text-sm text-gray-600">
									Menampilkan {filteredSchedules.length} assessment dari jurusan{" "}
									<span className="font-semibold">
										{getProgramFullName(selectedProgram)} ({selectedProgram})
									</span>
								</div>
							)}
						</div>

						{/* Content */}
						{loading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="bg-white rounded-lg shadow-sm border animate-pulse"
									>
										<div className="p-4 border-b border-gray-100">
											<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
											<div className="h-3 bg-gray-200 rounded w-1/2"></div>
										</div>
										<div className="p-4">
											<div className="h-20 bg-gray-200 rounded"></div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredSchedules.length > 0 ? (
									filteredSchedules.map((schedule) =>
										schedule.schedule_details.map((detail) => {
											const status = getStatusFromSchedule(schedule);
											return (
												<div
													key={detail.id}
													className="bg-white rounded-lg shadow-sm border-b-4 hover:shadow-md transition-all duration-200 group"
												>
													<div className="p-4 border-b border-gray-100">
														<div className="flex items-start justify-between mb-3">
															<div className="flex-1">
																<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
																	{schedule.assessment.occupation.scheme.name}
																</h3>
																<p className="text-sm text-gray-600 mt-1">
																	{schedule.assessment.occupation.name}
																</p>
															</div>
															<div className="ml-2">
																<span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
																	{schedule.assessment.occupation.scheme.code}
																</span>
															</div>
														</div>

														<div
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
																status
															)}`}
														>
															<Clock className="w-3 h-3 mr-1" />
															{status}
														</div>
													</div>

													<div className="px-4 py-2">
														<div className="flex justify-between text-xs text-gray-500 mb-2">
															<span>
																Mulai: {formatDate(schedule.start_date)}
															</span>
															<span>
																Selesai: {formatDate(schedule.end_date)}
															</span>
														</div>
														{/* Progress Line */}
														<div className="relative">
															<div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
															<div className="flex justify-between items-center relative">
																<div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
																<div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
															</div>
														</div>
														<div className="pt-5 flex items-center">
															<MapPinned className="w-5 h-5 mr-1" />
															<span className="text-sm">{detail.location}</span>
														</div>
													</div>

													<div className="px-4 pb-4 pt-4">
														<div className="flex items-center space-x-3">
															<Avatar>
																<AvatarImage src="" />
																<AvatarFallback>
																	{getInitials(detail.assessor.full_name)}
																</AvatarFallback>
															</Avatar>
															<div className="flex-1">
																<p className="text-sm font-medium text-gray-900">
																	{detail.assessor.full_name}
																</p>
																<p className="text-xs text-gray-500">Asesor</p>
															</div>
															<Link
																to={paths.asesi.assessment.apl01(
																	schedule.id,
																	detail.assessor.id
																)}
																className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group-hover:scale-110 transform"
															>
																<ChevronRight className="w-4 h-4 text-white" />
															</Link>
														</div>
													</div>
												</div>
											);
										})
									)
								) : (
									<div className="col-span-full text-center py-12">
										<BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											{selectedProgram !== "ALL"
												? `Belum ada assessment untuk ${selectedProgram}`
												: "Belum ada assessment"}
										</h3>
										<p className="text-gray-600 mb-4">
											{searchTerm
												? "Tidak ada assessment yang sesuai dengan pencarian Anda."
												: selectedProgram !== "ALL"
												? `Assessment untuk jurusan ${getProgramFullName(
														selectedProgram
												  )} akan muncul di sini.`
												: "Assessment akan muncul di sini setelah Anda mendaftar."}
										</p>
									</div>
								)}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
