import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/helper/axios";
import paths from '@/routes/paths';

import {
	LayoutDashboard,
	Users,
	CheckCircle,
	XCircle,
	Clock,
	MapPin,
	Calendar,
	Award,
	FileText,
} from "lucide-react";
import SidebarAsesor from "@/components/SideAsesor";
import NavbarAsesor from "@/components/NavAsesor";
import { formatDate } from "@/helper/format-date";

interface Assessee {
	id: number;
	name: string;
	status: "Competent" | "Not Competent" | "On Going";
}

interface AssessmentSummary {
	total_assessees: number;
	total_competent: number;
	total_incompetent: number;
	total_ongoing: number;
}

interface Schedule {
	id: number;
	start_date: string;
	end_date: string;
	location: string;
	assessor: {
		id: number;
	};
}

interface Assessment {
	id: number;
	code: string;
	tuk: string;
	schedule: Schedule;
	assessees: Assessee[];
	summary: AssessmentSummary;
}

interface RecapData {
	assessment: Assessment;
}

const RecapAssessment: React.FC = () => {
	const { scheduleDetailId } = useParams<{ scheduleDetailId: string }>();
	const [data, setData] = useState<RecapData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRecapData = async () => {
			if (!scheduleDetailId) return;
			
			setLoading(true);
			try {
				// Using the actual backend endpoint
				const response = await api.get(`/assessments/assessment-recapt/${scheduleDetailId}`);
				if (response.data.success) {
					setData(response.data.data);
				} else {
					setError(response.data.message || "Gagal memuat data rekap");
				}
			} catch (err) {
				console.error("Error fetching recap data:", err);
				setError("Gagal memuat data dari server");
			} finally {
				setLoading(false);
			}
		};

		fetchRecapData();
	}, [scheduleDetailId]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Competent":
				return "bg-green-100 text-green-800 border-green-200";
			case "Not Competent":
				return "bg-red-100 text-red-800 border-red-200";
			case "On Going":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "Competent":
				return <CheckCircle className="w-4 h-4" />;
			case "Not Competent":
				return <XCircle className="w-4 h-4" />;
			case "On Going":
				return <Clock className="w-4 h-4" />;
			default:
				return null;
		}
	};

	// Tambahkan fungsi untuk translate status ke bahasa Indonesia
	const getStatusLabel = (status: string) => {
		switch (status) {
			case "Competent":
				return "Kompeten";
			case "Not Competent":
				return "Belum Kompeten";
			case "On Going":
				return "Sedang Berlangsung";
			default:
				return status;
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen bg-gray-50">
				<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
					<SidebarAsesor />
				</div>
				<div className="flex-1">
					<div className="sticky top-0 z-10 bg-white shadow-sm">
						<NavbarAsesor
							title="Rekap Asesmen"
							icon={<FileText size={25} />}
						/>
					</div>
					<main className="p-4">
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen bg-gray-50">
				<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
					<SidebarAsesor />
				</div>
				<div className="flex-1">
					<div className="sticky top-0 z-10 bg-white shadow-sm">
						<NavbarAsesor
							title="Rekap Asesmen"
							icon={<FileText size={25} />}
						/>
					</div>
					<main className="p-4">
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
							<span className="text-red-800">{error}</span>
						</div>
					</main>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex min-h-screen bg-gray-50">
				<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
					<SidebarAsesor />
				</div>
				<div className="flex-1">
					<div className="sticky top-0 z-10 bg-white shadow-sm">
						<NavbarAsesor
							title="Rekap Asesmen"
							icon={<FileText size={25} />}
						/>
					</div>
					<main className="p-4">
						<div className="text-center py-12">
							<p className="text-gray-600">Data tidak ditemukan</p>
						</div>
					</main>
				</div>
			</div>
		);
	}

	const { assessment } = data;

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="inset-y-0 left-0 lg:w-64 md:w-0 bg-white shadow-md">
				<SidebarAsesor />
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Navbar */}
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<NavbarAsesor
						title="Rekap Asesmen"
						icon={<FileText size={25} />}
					/>
				</div>

				{/* Main Body */}
				<main className="p-4 space-y-6">
					<div className="mb-6">
						<nav className="flex text-sm text-gray-500">
							<Link to={paths.asesor.dashboardAsesor} className="hover:underline">
								Dashboard
							</Link>
							<span className="mx-2">/</span>
							<span className="text-[#000000]">Rekap Asesmen</span>
						</nav>
					</div>
					{/* Assessment Header Information */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 items-center mb-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Informasi Asesmen
							</h2>
							<div className="flex items-center justify-start sm:justify-end space-x-2 mt-2 sm:mt-0">
								<Award className="w-5 h-5 text-orange-500" />
								<span className="text-sm font-medium text-orange-600">
									{assessment.code}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="flex items-center space-x-3">
								<Calendar className="w-5 h-5 text-gray-500" />
								<div>
									<p className="text-sm text-gray-500">Periode Asesmen</p>
									<p className="font-medium">
										{formatDate(assessment.schedule.start_date)} -{" "}
										{formatDate(assessment.schedule.end_date)}
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-3">
								<MapPin className="w-5 h-5 text-gray-500" />
								<div>
									<p className="text-sm text-gray-500">Lokasi</p>
									<p className="font-medium">{assessment.schedule.location}</p>
								</div>
							</div>

							<div className="flex items-center space-x-3">
								<Users className="w-5 h-5 text-gray-500" />
								<div>
									<p className="text-sm text-gray-500">TUK</p>
									<p className="font-medium capitalize">{assessment.tuk}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="bg-white rounded-lg shadow-sm border p-6">
							<div className="flex items-center">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Users className="w-6 h-6 text-blue-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">
										Total Asesi
									</p>
									<p className="text-2xl font-semibold text-gray-900">
										{assessment.summary.total_assessees}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border p-6">
							<div className="flex items-center">
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">Kompeten</p>
									<p className="text-2xl font-semibold text-gray-900">
										{assessment.summary.total_competent}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border p-6">
							<div className="flex items-center">
								<div className="p-2 bg-red-100 rounded-lg">
									<XCircle className="w-6 h-6 text-red-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">
										Belum Kompeten
									</p>
									<p className="text-2xl font-semibold text-gray-900">
										{assessment.summary.total_incompetent}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm border p-6">
							<div className="flex items-center">
								<div className="p-2 bg-yellow-100 rounded-lg">
									<Clock className="w-6 h-6 text-yellow-600" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500">
										Sedang Berlangsung
									</p>
									<p className="text-2xl font-semibold text-gray-900">
										{assessment.summary.total_ongoing}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Assessees Table */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								Daftar Asesi
							</h3>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											No
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Nama Asesi
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{assessment.assessees.map((assessee, index) => (
										<tr key={assessee.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{index + 1}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{assessee.name}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
														assessee.status
													)}`}
												>
													{getStatusIcon(assessee.status)}
													<span>{getStatusLabel(assessee.status)}</span>
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{assessment.assessees.length === 0 && (
							<div className="text-center py-12">
								<p className="text-gray-600">Belum ada data asesi</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default RecapAssessment;