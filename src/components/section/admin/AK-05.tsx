import api from "@/helper/axios";
import { getAssessorUrl } from "@/lib/hashids";
import { type AK05ResponseData } from "@/model/ak05-model";
import { Clock } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function AK05({ id_result }: { id_result: string }) {
	const { data } = useSWR<AK05ResponseData>(
		`/assessments/ak-05/${id_result}`,
		fetcher
	);

	return (
		<>
			<section className="mb-1">
				<div className="w-full">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
						{/* Header Skema */}
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
							{/* Kiri */}
							<div className="flex items-center space-x-3 flex-wrap">
								<h2 className="text-lg font-bold text-gray-800">
									Skema Sertifikasi {data?.result.assessment.occupation.name}
								</h2>
								<div className="flex items-center space-x-2">
									<Clock className="w-5 h-5 text-gray-400" />
									<span className="text-sm text-gray-600">
										{data?.result.tuk || "Sewaktu"}
									</span>
								</div>
							</div>

							{/* Kanan */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
								<span className="px-3 py-1 w-fit rounded text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
									{data?.result.assessment.code}
								</span>
							</div>
						</div>

						{/* Detail Asesi - Asesor - Waktu */}
						<div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mt-2 text-sm text-gray-600">
							{/* Asesi & Asesor */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
								<div className="flex flex-wrap">
									<span className="xs-text mr-1">Asesi:</span>
									<span>{data?.result.assessee.name || "N/A"}</span>
								</div>
								<div className="flex flex-wrap">
									<span className="xs-text mr-1">Asesor:</span>
									<span>{data?.result.assessor.name || "N/A"}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Tabel Asesi --- */}
			<section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
				<div className="overflow-x-auto">
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
									{data?.result.assessee.name || "N/A"}
								</td>
								<td className="p-3 border text-center">
									{data?.result.result_ak05.is_competent ? "K" : "BK"}
								</td>
								<td className="p-3 border text-center">{data?.result?.result_ak05?.description || "-"}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			{/* --- Form & QR --- */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Kiri: Form Catatan */}
				<div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
					<h2 className="text-sm font-medium">
						Aspek Negatif dan Positif dalam Asesemen
					</h2>
					<textarea
						className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
						rows={2}
						placeholder="Aspek negatif dan positif"
						value={data?.result?.result_ak05?.negative_positive_aspects}
						disabled
					/>
					<h2 className="text-sm font-medium">
						Pencatatan Penolakan Hasil Asesmen
					</h2>
					<textarea
						className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
						rows={2}
						placeholder="Pencatatan penolakan"
						value={data?.result?.result_ak05?.rejection_notes || ""}
						disabled
					/>
					<h2 className="text-sm font-medium">
						Saran Perbaikan: (Asesor/Personil Terkait)
					</h2>
					<textarea
						className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
						rows={2}
						placeholder="Saran perbaikan"
						value={data?.result?.result_ak05?.improvement_suggestions}
						disabled
					/>
					<h2 className="text-sm font-medium">Catatan</h2>
					<textarea
						className="w-full border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
						rows={3}
						placeholder="Catatan..."
						value={data?.result?.result_ak05?.notes || ""}
						disabled
					/>
				</div>

				{/* Kanan: Asesor & QR */}
				<div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
					<div>
						<h2 className="text-sm font-medium mb-3">Asesor</h2>
						<input
							type="text"
							value={data?.result.assessor.name || "N/A"}
							disabled
							className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
						/>
					</div>
					<div>
						<h2 className="text-sm font-medium mb-3">Nomor Registrasi</h2>
						<input
							type="text"
							value={data?.result.assessor.no_reg_met || "N/A"}
							disabled
							className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
						/>
					</div>
					<div>
						<h2 className="text-sm font-medium mb-3">Tanggal</h2>
						<input
							type="text"
							value={
								data?.result?.result_ak05?.updated_at
									? new Date(
											data?.result?.result_ak05?.updated_at
									  ).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
									  })
									: ""
							}
							disabled
							className="border rounded-lg p-2 text-sm bg-gray-100 text-gray-500 w-full mb-3"
						/>
					</div>

					<div className="flex flex-col items-center justify-center border rounded-lg py-10 bg-gray-50 mb-3">
						{data?.result?.result_ak05?.approved_assessor ? (
							<>
								<QRCodeCanvas
									value={getAssessorUrl(Number(data?.result?.assessor.id))}
									size={100}
								/>
								<p className="text-xs text-gray-400 mt-2">
									{data?.result.assessor.name || "Nama Asesor"}
								</p>
							</>
						) : (
							<p className="text-gray-400 text-sm">Belum Generate QR</p>
						)}
						{data?.result?.result_ak05?.approved_assessor && (
							<p className="text-green-600 text-sm font-semibold mt-2 text-center">
								Sudah disetujui asesor
							</p>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
