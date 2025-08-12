import React, { useState, useEffect } from "react";
import SidebarAsesi from "@/components/SideAsesi";
import Navbar from "../../components/NavAdmin";
import {
	Eye,
	ListFilter,
	Search,
	LayoutDashboard,
	Clock,
	ChevronRight,
	AlertCircle,
} from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';

export default function AsessmentAktif() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [assessments, setAssessments] = useState<any[]>([]);
	const [filteredAssessments, setFilteredAssessments] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		fetchActiveAssessments();
	}, [user]);

	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredAssessments(assessments);
		} else {
			const filtered = assessments.filter(assessment =>
				assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				assessment.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredAssessments(filtered);
		}
	}, [searchTerm, assessments]);

	const fetchActiveAssessments = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const response = await api.get('/assessment/apl2');
			
			if (response.data.success && response.data.data.length > 0) {
				// Filter only active assessments and map to UI format
				const mappedAssessments = response.data.data
					.filter((item: any) => {
						if (!item.assessment_schedule || item.assessment_schedule.length === 0) return false;
						
						const now = new Date();
						const schedule = item.assessment_schedule[0];
						const start = new Date(schedule.start_date);
						const end = new Date(schedule.end_date);
						
						return now >= start && now <= end; // Only active assessments
					})
					.map((item: any, index: number) => ({
						id: item.id,
						title: item.occupation?.name || `Assessment ${index + 1}`,
						subtitle: item.occupation?.scheme?.name || 'Sertifikasi Kompetensi',
						status: "active",
						statusText: "Aktif",
						startDate: formatDate(item.assessment_schedule[0].start_date),
						endDate: formatDate(item.assessment_schedule[0].end_date),
						avatar: getInitials(item.assessment_schedule[0]?.assessor?.full_name || 'Unknown'),
						avatarBg: getRandomColor(index),
						instructor: item.assessment_schedule[0]?.assessor?.full_name || 'Asesor',
						role: "Asesor",
						borderColor: getBorderColor(index),
					}));
				
				setAssessments(mappedAssessments);
			} else {
				setAssessments([]);
			}
		} catch (error: any) {
			setError('Gagal memuat data asesmen aktif');
			setAssessments([]);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getInitials = (name: string) => {
		return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
	};

	const getRandomColor = (index: number) => {
		const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-gray-500'];
		return colors[index % colors.length];
	};

	const getBorderColor = (index: number) => {
		const colors = ['border-blue-400', 'border-green-400', 'border-purple-400', 'border-red-400', 'border-yellow-400', 'border-gray-400'];
		return colors[index % colors.length];
	};

	const okupasiData = filteredAssessments;

	return (
		<>
			<div className="flex min-h-screen bg-gray-50">
				<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md ">
					<SidebarAsesi />
				</div>

				{/* Main Content Area */}
				<div className="flex-1 lg:ml-0 md:ml-0">
					{/* Navbar - Sticky di atas */}
					<div className="sticky top-0 z-10 bg-white shadow-sm">
						<NavbarAsesi
							title="Overview"
							icon={<LayoutDashboard size={25} />}
						/>
					</div>

					{/* Konten Utama */}
					<div className="p-6">
						{/* Error notification */}
						{error && (
							<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
								<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
								<span className="text-red-800">{error}</span>
							</div>
						)}

						{/* Loading state */}
						{loading && (
							<div className="flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
							</div>
						)}

						{!loading && (
							<>
								{/* Konten Utama ya buyunggggggggggggggggggggggggg */}
								{/* Konten utama */}
								<main className=" ">
									<div className="p-6">
										{/* Header dengan Search dan Filter */}
										<div className="mb-6">
											<div className="flex flex-col md:flex-row md:items-center gap-4">
												{/* Bagian kiri: Selamat datang */}
												<div className="flex items-center space-x-2">
													<span className="text-gray-600">Selamat datang,</span>
													<span className="font-semibold text-gray-900">Asesi</span>
												</div>

												{/* Bagian kanan: Search + Filter */}
												<div className="flex items-center gap-4">
													{/* Search Bar */}
													<div className="relative w-full md:w-100">
														<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
												<input
													type="text"
													value={searchTerm}
													onChange={(e) => setSearchTerm(e.target.value)}
													placeholder="Cari asesmen..."
													className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												/>
											</div>

											{/* Filter Button */}
											<button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50">
												<ListFilter className="w-4 h-4 text-gray-600" />
												<span className="text-gray-600">Filter</span>
											</button>
										</div>
									</div>
								</div>

								{/* Grid Kartu Okupasi */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{okupasiData.map((okupasi) => (
										<div
											key={okupasi.id}
											className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow relative`}
										>
											{/* Garis bawah biru */}
											<div
												className={`absolute bottom-0 left-0 w-full h-1 rounded-b-xl ${okupasi.borderColor}`}
											/>

											{/* Header Kartu */}
											<div className="p-4 border-b border-gray-100">
												<div className="flex justify-between items-start">
													<div>
														<h3 className="font-semibold text-gray-900 mb-1">
															{okupasi.title}
														</h3>
														<p className="text-sm text-gray-600 mb-2">
															{okupasi.subtitle}
														</p>

														{/* Status dengan Icon */}
														<div className="flex items-center space-x-1 text-xs text-gray-500">
															<Clock className="w-3 h-3" />
															<span>{okupasi.statusText}</span>
														</div>
													</div>

													{/* Status Badge di pojok kanan atas */}
													{okupasi.status === "finished" && (
														<div className="absolute top-4 right-4">
															<span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
																Finished
															</span>
														</div>
													)}
												</div>
											</div>

											{/* Tanggal */}
											<div className="px-4 pt-3  pb-20">
												<div className="flex flex-col items-center">
													{/* Tanggal dan waktu */}
													<div className="flex justify-between w-full text-sm text-gray-800 mb-2 font-medium">
														<span>{okupasi.startDate}</span>
														<span>{okupasi.endDate}</span>
													</div>

													{/* Garis dan bulatan */}
													<div className="relative w-full h-4 flex items-center">
														<div className="absolute left-0 right-0 h-[2px] bg-black" />

														<div className="w-4 h-4 bg-white border-2 border-black rounded-full z-2"></div>
														<div className="flex-1"></div>
														<div className="w-4 h-4 bg-white border-2 border-black rounded-full z-2"></div>
													</div>
												</div>
											</div>

											{/* Footer */}
											<div className="px-4 pb-4 pt-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<div
															className={`w-8 h-8 ${okupasi.avatarBg} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
														>
															{okupasi.avatar}
														</div>
														<div>
															<p className="text-sm font-medium text-gray-900">
																{okupasi.instructor}
															</p>
															<p className="text-xs text-gray-500">
																{okupasi.role}
															</p>
														</div>
													</div>

													<button className="text-sm text-gray-700 hover:underline font-medium">
														Lihat selengkapnya
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</main>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
