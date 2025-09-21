import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { ResultAK01 } from "@/model/ak01-model";
import { Check, FileCheck2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import useSWR from "swr";

const evidenceOptions = [
	"Verifikasi Portofolio",
	"Review Produk",
	"Observasi Langsung",
	"Kegiatan Terstruktur",
	"Pertanyaan Lisan",
	"Pertanyaan Tertulis",
	"Pertanyaan Wawancara",
	"Lainnya",
];

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function AK01({ id_result }: { id_result: string }) {
	const { data: result } = useSWR<ResultAK01>(
		`assessments/ak-01/data/${id_result}`,
		fetcher
	);

	const selectedEvidences =
		result?.ak01_header?.rows?.flatMap((row) => row.evidence) ?? [];

	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			{/* Header Section */}
			<div className="mb-4 border-b border-gray-200 pb-4">
				<div className="flex items-center gap-2">
					<FileCheck2 className="text-black-500" size={20} />
					<h2 className="text-lg font-semibold text-gray-800">
						Persetujuan Asesmen dan Kerahasiaan
					</h2>
				</div>
				<p className="text-gray-600 text-sm mt-2">
					Persetujuan Asesmen ini untuk menjamin bahwa Asesi telah diberi arahan
					secara rinci tentang perencanaan dan proses asesmen
				</p>
			</div>

			<div className="pt-6">
				{/* Top grid responsive */}
				<fieldset
					className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
					disabled
				>
					{/* Left column */}
					<div className="lg:col-span-7">
						<h2 className="font-semibold text-gray-800 mb-3">
							Skema Sertifikasi (KKNI/Okupasi/Klaster)
						</h2>
						<div className="text-sm mb-7 flex flex-wrap items-center gap-2">
							<span className="text-gray-700">
								{result?.assessment?.occupation.name}
							</span>
							<span className="bg-orange-100 text-[#E77D35] text-xs rounded px-2 py-1 select-none">
								{result?.assessment?.code}
							</span>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
							<input
								type="text"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
								value={result?.assessee.name}
								readOnly
							/>
							<input
								type="text"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
								value={result?.assessor.name}
								readOnly
							/>
						</div>

						<label className="block mb-2 text-sm font-medium text-gray-700">
							Pelaksanaan asesmen disepakati pada:
						</label>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<input
								type="date"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
								value={
									result?.ak01_header?.created_at &&
									new Date(result?.ak01_header?.created_at)
										.toISOString()
										.split("T")[0]
								}
								readOnly
							/>
							<input
								type="time"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
								value={
									result?.ak01_header?.created_at &&
									new Date(result?.ak01_header?.created_at)
										.toISOString()
										.split("T")[1]
										.split("Z")[0]
								}
								readOnly
							/>
							<input
								type="text"
								className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
								value={result?.tuk}
								readOnly
							/>
						</div>
					</div>

					{/* Right column */}
					<div className="lg:col-span-5">
						<h2 className="font-semibold text-gray-800 mb-3">
							Bukti yang akan dikumpulkan
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm mt-4">
							{evidenceOptions.map((option) => {
								const checked = selectedEvidences?.includes(option) || false;
								return (
									<label
										key={option}
										className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition
                                    ${checked ? "bg-orange-100 " : ""}`}
									>
										<input
											type="checkbox"
											className="hidden cursor-not-allowed"
											checked={checked}
											disabled
											readOnly
										/>
										<span
											className={`w-4 h-4 flex items-center justify-center rounded-xs border-2 opacity-60 cursor-not-allowed
                        ${
													checked
														? "bg-[#E77D35] border-[#E77D35]"
														: "border-[#E77D35]"
												}`}
										>
											{checked && <Check className="w-4 h-4 text-white" />}
										</span>
										<span
											className={checked ? "text-gray-900" : "text-gray-500"}
										>
											{option}
										</span>
									</label>
								);
							})}
						</div>
					</div>
				</fieldset>

				{/* Declaration Sections */}
				<div className="mt-8 border-t border-gray-200 pt-6">
					<div className="flex flex-col lg:flex-row justify-between gap-6">
						{/* Kiri: isi teks */}
						<div className="w-full lg:w-1/2 space-y-6">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
								<p className="text-gray-700 leading-relaxed">
									Bahwa saya telah mendapatkan penjelasan terkait hak dan
									prosedur banding asesmen dari asesor.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Asesor :</h3>
								<p className="text-gray-700 leading-relaxed">
									Menyatakan tidak akan membuka hasil pekerjaan yang saya
									peroleh karena penugasan saya sebagai Asesor dalam pekerjaan
									Asesmen kepada siapapun atau organisasi apapun selain kepada
									pihak yang berwenang sehubungan dengan kewajiban saya sebagai
									Asesor yang ditugaskan oleh LSP.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Asesi :</h3>
								<p className="text-gray-700 leading-relaxed">
									Saya setuju mengikuti asesmen dengan pemahaman bahwa informasi
									yang dikumpulkan hanya digunakan untuk pengembangan
									profesional dan hanya dapat diakses oleh orang tertentu saja.
								</p>
							</div>
						</div>

						{/* Kanan: QR Code Section */}
						<div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* QR Code Asesi */}
							<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-5 flex-col gap-4">
								<h4 className="text-sm font-semibold text-gray-800 text-center">
									QR Code Asesi
								</h4>
								{result?.ak01_header.approved_assessee ? (
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
								{result?.ak01_header.approved_assessor ? (
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
			</div>
		</div>
	);
}
