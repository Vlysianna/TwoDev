import React, { useState, useEffect } from "react";
import { NotepadText, ChevronLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { QRCodeCanvas } from "qrcode.react";
import { getAssessorUrl } from "@/lib/hashids";
import type { AK05ApiResponse, AK05ResponseData } from "@/model/ak05-model";
import NavbarAsesi from "@/components/NavbarAsesi";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";

export default function CekAk05() {
	const { id_assessment, id_result, id_asesor } = useAssessmentParams();
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<AK05ResponseData | null>(null);
	const [qrValue, setQrValue] = useState("");

	const [catatan, setCatatan] = useState("");
	const [negatifPositif, setNegatifPositif] = useState("");
	const [penolakan, setPenolakan] = useState("");
	const [saran, setSaran] = useState("");
	const [isCompetent, setIsCompetent] = useState<boolean | null>(null);
	const [deskripsi, setDeskripsi] = useState("");

	useEffect(() => {
		fetchData();
	}, [user]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.get(`/assessments/ak-05/${id_result}`);
			const rawData = response.data;
			if (rawData.success) {
				setData(rawData.data);
				console.log(rawData.data);

				// Set form values from API data
				setNegatifPositif(
					rawData.data.result.result_ak05.negative_positive_aspects || ""
				);
				setPenolakan(rawData.data.result.result_ak05.rejection_notes || "");
				setSaran(rawData.data.result.result_ak05.improvement_suggestions || "");
				setCatatan(rawData.data.result.result_ak05.notes || "");
				setIsCompetent(rawData.data.result.result_ak05.is_competent);
				setDeskripsi(rawData.data.result.result_ak05.description || "");

				// jika sudah approve, langsung set QR
				if (rawData.data.result.result_ak05.approved_assessor) {
					setQrValue(getAssessorUrl(Number(id_asesor)));
				}
			} else {
				setError("Gagal memuat data");
			}
		} catch (err) {
			console.error("Error fetching data:", err);
			setError("Terjadi kesalahan saat memuat data");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
					<h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchData}
						className="bg-[#E77D35] text-white px-4 py-2 rounded hover:bg-orange-600"
					>
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navbar */}
			<NavbarAsesi
				title="Laporan Asesmen - FR.AK.05"
				icon={
					<Link
						to={paths.asesi.dashboard}
						className="text-gray-500 hover:text-gray-600"
					>
						<ChevronLeft size={20} />
					</Link>
				}
			/>

			<main className="pt-4 px-4 sm:px-6 pb-10 max-w-7xl mx-auto space-y-8">
				{/* --- Skema Sertifikasi --- */}
				<section className="px-6 pb-6">
					<div className="max-w-7xl mx-auto">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
							{/* Header Skema */}
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
								{/* Kiri */}
								<div className="flex items-center space-x-3 flex-wrap">
									<h2 className="text-sm font-medium text-gray-800">
										Skema Sertifikasi (Okupasi)
									</h2>
									<div className="flex items-center space-x-2">
										<svg
											className="w-5 h-5 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<circle cx="12" cy="12" r="10" strokeWidth="2" />
											<polyline points="12,6 12,12 16,14" strokeWidth="2" />
										</svg>
										<span className="text-sm text-gray-600">Sewaktu</span>
									</div>
								</div>

								{/* Kanan */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
									<span className="text-sm text-gray-700">
										Pemrogram Junior (Junior Coder)
									</span>
									<span className="px-3 py-1 rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533] sm:ml-5">
										SMK.RPL.PJ/LSPSMK24/2023
									</span>
								</div>
							</div>

							{/* Detail Asesi - Asesor - Waktu */}
							<div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
								{/* Asesi & Asesor */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
									<div className="flex flex-wrap">
										<span className="xs-text mr-1">Asesi:</span>
										<span>{data.result.assessee.name || "N/A"}</span>
									</div>
									<div className="flex flex-wrap">
										<span className="xs-text mr-1">Asesor:</span>
										<span>{data.result.assessor.name || "N/A"}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* --- Tabel Asesi --- */}
				<section className="overflow-x-auto">
					<table className="w-full border rounded-xl bg-white text-sm min-w-[600px]">
						<thead>
							<tr>
								<th className="p-3 border text-center">No.</th>
								<th className="p- border text-center xs-text">Nama Asesi</th>
								<th className="p-3 border text-center">Rekomendasi</th>
								<th className="p-3 border text-center">Keterangan</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="p-3 border text-center">1</td>
								<td className="p-3 border text-center">
									{" "}
									{data.result.assessee.name || "N/A"}
								</td>
								<td className="p-3 border">
									{data.result.result_ak05.is_competent
										? "Kompeten"
										: "Belum Kompeten"}
								</td>
								<td className="p-3 border text-center">{deskripsi || "-"}</td>
							</tr>
						</tbody>
					</table>
				</section>

				{/* --- Form & QR --- */}
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Kiri: Form Catatan */}
					<div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
						<textarea
							className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
							rows={2}
							placeholder="Aspek negatif dan positif"
							disabled
							value={negatifPositif}
						/>
						<textarea
							className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
							rows={2}
							placeholder="Pencatatan penolakan"
							disabled
							value={penolakan}
						/>
						<textarea
							className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
							rows={2}
							placeholder="Saran perbaikan"
							disabled
							value={saran}
						/>
						<textarea
							className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
							rows={3}
							placeholder="Catatan..."
							disabled
							value={catatan}
						/>
					</div>

					{/* Kanan: Asesor & QR */}
					<div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
						<div>
							<h2 className="text-sm font-medium mb-3">Asesor</h2>
							<input
								type="text"
								value={data.result.assessor.name || "N/A"}
								disabled
								className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
							/>
						</div>
						<div>
							<h2 className="text-sm font-medium mb-3">Nomor Registrasi</h2>
							<input
								type="text"
								value={data.result.assessor.no_reg_met || "N/A"}
								disabled
								className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
							/>
						</div>
						<div>
							<h2 className="text-sm font-medium mb-3">Tanggal</h2>
							<input
								type="text"
								value={data.result.result_ak05.updated_at || "N/A"}
								disabled
								className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
							/>
						</div>

						<div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50 mb-3 h-40">
							{qrValue ? (
								<QRCodeCanvas value={qrValue} size={100} />
							) : (
								<p className="text-gray-400 text-sm">Belum Generate QR</p>
							)}
							{qrValue && (
								<p className="text-xs text-gray-400 mt-2">{qrValue}</p>
							)}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
