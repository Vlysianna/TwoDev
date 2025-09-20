import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { ResultIA02 } from "@/model/ia02-model";
import { Clock } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

const petunjukList = [
	"Baca dan pelajari setiap instruksi kerja di bawah ini dengan cermat sebelum melaksanakan praktek",
	"Klarifikasi kepada assessor kompetensi apabila ada hal-hal yang belum jelas",
	"Laksanakan pekerjaan sesuai dengan urutan proses yang sudah ditetapkan",
	"Seluruh proses kerja mengacu kepada SOP/WI yang dipersyaratkan (Jika Ada)",
];

export default function IA02({
	id_result,
}: {
	id_result: string;
}) {
	const { data: result } = useSWR<ResultIA02>(
		`/assessments/ia-02/result/${id_result}`,
		fetcher
	);

	const [generatingPdf, setGeneratingPdf] = useState(false);

	const handleViewPDF = async () => {
		try {
			setGeneratingPdf(true);
			const response = await api.get(
				`/assessments/ia-02/pdf/${result?.assessment.id}`,
				{
					responseType: "blob",
				}
			);

			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			window.open(url, "_blank");

			setTimeout(() => {
				window.URL.revokeObjectURL(url);
			}, 100);
		} catch (error) {
			console.error("Error viewing PDF:", error);
		} finally {
			setGeneratingPdf(false);
		}
	};

	return (
		<>
			<div className="bg-white rounded-lg shadow-sm p-6">
				{/* Header Info */}
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
						{/* Kiri */}
						<div className="flex-1">
							<h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
								Skema Sertifikasi ( Okupasi )
								<span className="text-gray-400 text-xs flex items-center gap-1">
									<Clock size={14} />
									{result?.tuk}
								</span>
							</h2>

							{/* Asesi & Asesor */}
							<div className="text-sm text-gray-500 mt-1">
								Asesi:{" "}
								<span className="text-gray-800">{result?.assessee.name}</span>{" "}
								&nbsp;|&nbsp; Asesor:{" "}
								<span className="text-gray-800">{result?.assessor.name}</span>
							</div>
						</div>

						{/* Kanan */}
						<div className="flex-1 text-left sm:text-right">
							<div className="flex flex-col sm:items-end gap-1">
								{/* Skema + kode */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
									<p className="text-sm text-gray-800 font-medium">
										{result?.assessment.occupation.name}
									</p>
									<p className="text-xs text-[#E77D35] bg-[#E77D3533] px-2 py-0.5 rounded w-fit">
										{result?.assessment.code}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Petunjuk */}
				<div className="border-t border-gray-200 pt-4">
					<h3 className="text-sm font-medium text-gray-800 mb-2">
						A. Petunjuk
					</h3>
					<ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
						{petunjukList.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ol>
					{/* PDF Options */}
					<div className="mt-3 flex flex-col sm:flex-row gap-2">
						<button
							onClick={handleViewPDF}
							disabled={generatingPdf}
							className="flex items-center justify-center gap-2 bg-[#E77D35] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Lihat PDF
						</button>
					</div>
				</div>
			</div>

			{/* Validasi */}
			<div className="bg-white rounded-lg shadow-sm p-6 mt-4">
				<div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
					{/* Bagian kiri (2 kolom) */}
					<div className="lg:col-span-4 space-y-4">
						{/* Asesi */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Asesi
							</label>
							<div className="flex flex-col sm:flex-row sm:items-center gap-3">
								<input
									type="text"
									placeholder="Nama Asesi"
									className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									value={result?.assessee.name}
									readOnly
								/>
								<input
									type="date"
									placeholder="Tanggal"
									className="w-full sm:w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 sm:mt-0"
									value={result?.ia02_header.updated_at.split("T")[0]}
									disabled
								/>
							</div>
						</div>

						{/* Asesor */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Asesor
							</label>
							<div className="flex flex-col sm:flex-row sm:items-center gap-3">
								<input
									type="text"
									placeholder="Nama Asesor"
									className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									value={result?.assessor.name}
									readOnly
								/>
								<input
									type="date"
									placeholder="Tanggal"
									className="w-full sm:w-48 px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2 sm:mt-0"
									value={result?.ia02_header.updated_at.split("T")[0]}
									disabled
								/>
							</div>
						</div>

						{/* Kode */}
						<div>
							<input
								type="text"
								placeholder="No. Reg MET"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={result?.assessor.no_reg_met}
								readOnly
							/>
						</div>
					</div>

					{/* Kanan: QR Code Section */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
						{/* QR Code Asesi */}
						<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
							<h4 className="text-sm font-semibold text-gray-800 text-center">
								QR Code Asesi
							</h4>
							{result?.ia02_header.approved_assessee ? (
								<>
									<QRCodeCanvas
										value={getAssesseeUrl(Number(result?.assessee.id))}
										size={120}
										className="w-40 h-40 object-contain"
									/>
								</>
							) : (
								<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
									<span className="text-gray-400 text-xs text-center">
										Menunggu persetujuan asesi
									</span>
								</div>
							)}
							<div className="text-green-600 font-semibold text-xs text-center">
								Sudah disetujui Asesi
							</div>
							<span className="text-sm font-semibold text-gray-800 text-center">
								{result?.assessee.name}
							</span>
						</div>

						{/* QR Code Asesor */}
						<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
							<h4 className="text-sm font-semibold text-gray-800 text-center">
								QR Code Asesor
							</h4>
							{result?.ia02_header.approved_assessor ? (
								<>
									<QRCodeCanvas
										value={getAssessorUrl(Number(result?.assessor.id))}
										size={120}
										className="w-40 h-40 object-contain"
									/>
									<div className="text-green-600 font-semibold text-xs text-center">
										Sudah disetujui Asesor
									</div>
								</>
							) : (
								<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
									<span className="text-gray-400 text-xs text-center">
										Menunggu persetujuan asesor
									</span>
								</div>
							)}
							<span className="text-sm font-semibold text-gray-800 text-center">
								{result?.assessor.name}
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
