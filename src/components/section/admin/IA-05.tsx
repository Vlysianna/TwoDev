import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type {
	AssesseeAnswer,
	ResultIA05,
} from "@/model/ia05c-model";
import { Calendar, Clock } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo } from "react";
import useSWR from "swr";
import { formatDateJakartaUS24 } from "@/helper/format-date";

const feedbackOptions = [
	{ key: "tercapai", label: "Tercapai" },
	{ key: "belum-tercapai", label: "Belum Tercapai" },
];

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function IA05({ id_result }: { id_result: string }) {
	const { data: result } = useSWR<ResultIA05>(
		`/assessments/ia-05/result/${id_result}`,
		fetcher
	);

	const { data: assesseeAnswers } = useSWR<AssesseeAnswer[]>(
		`/assessments/ia-05/result/answers/${id_result}`,
		fetcher
	);

	const selectedAnswers = useMemo(() => {
		const initialAnswers: Record<number, string> = {};
		assesseeAnswers?.forEach((answer: AssesseeAnswer) => {
			initialAnswers[answer.id] = answer.answers.approved ? "Ya" : "Tidak";
		});

		return initialAnswers;
	}, [assesseeAnswers]);

	const formattedDate = useMemo(
		() =>
			result?.ia05_header.updated_at
				? formatDateJakartaUS24(result.ia05_header.updated_at) : "",
		[result]
	);

	const feedbackResult = useMemo(
		() => result?.ia05_header.is_achieved,
		[result]
	);

	return (
		<>
			<div className="bg-white rounded-lg shadow-sm border p-6">
				{/* Header Info & Progress */}
				<div className="border-gray-200 mb-6">
					{/* Top Row */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
						{/* Left */}
						<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
							<h2 className="text-sm font-medium text-gray-800">
								Skema Sertifikasi (Okupasi)
							</h2>
							<div className="flex items-center text-xs md:text-sm text-gray-500">
								<Clock size={16} className="text-gray-500 mr-2" />
								<span className="text-gray-600 capitalize">
									{result?.tuk ?? "N/A"}
								</span>
							</div>
						</div>

						{/* Right */}
						<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
							<div className="text-sm text-gray-700">
								{result?.assessment.occupation.name ?? "N/A"}
							</div>
							<div className="px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium text-[#E77D35] bg-[#E77D3533]">
								{result?.assessment.code ?? "N/A"}
							</div>
						</div>
					</div>

					{/* Filter Row + Progress */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
						<div className="flex flex-col sm:flex-row sm:items-center gap-4">
							<span className="text-sm text-gray-500">
								<span className="font-bold">Asesi:</span>{" "}
								{result?.assessee?.name || "-"}
							</span>
							<span className="text-sm text-gray-500">
								<span className="font-bold">Asesor:</span>{" "}
								{result?.assessor?.name || "-"}
							</span>
						</div>
						<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto justify-end">
							{/* Teks Asesmen Awal */}
							<span className="text-sm font-medium text-gray-400">
								Asesmen awal: {assesseeAnswers?.length} /{" "}
								{assesseeAnswers?.length}
							</span>
							{/* Progress Bar */}
							<div className="w-full md:w-48 bg-gray-200 rounded-full h-2 ml-0 md:ml-4">
								<div
									className="bg-[#E77D35] h-2 rounded-full"
									style={{ width: "100%" }}
								></div>
							</div>
							{/* Persen */}
							<span className="text-sm font-medium text-[#E77D35]">100%</span>
						</div>
					</div>
				</div>

				{/* Table - Readonly for assessee */}
				<div className="overflow-x-auto p-3 md:p-6 border border-gray-200 rounded-sm">
					<div className="w-full overflow-x-auto">
						<div className="min-w-[600px]">
							<table className="w-full text-xs md:text-sm border-collapse">
								<thead>
									<tr className="bg-gray-0 text-sm md:text-[16px]">
										<th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[10%]">
											No
										</th>
										<th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-900 border-b border-gray-200 w-[30%]">
											Soal
										</th>
										<th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
											Jawaban
										</th>
										<th className="px-2 md:px-4 py-2 md:py-3 text-center font-medium text-gray-900 border-b border-gray-200 w-[30%]">
											Pencapaian
										</th>
									</tr>
								</thead>
								<tbody>
									{assesseeAnswers?.map((answer, index) => (
										<tr key={answer.id} className="hover:bg-gray-50">
											<td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">
												{index + 1}
											</td>
											<td className="px-2 md:px-4 py-2 md:py-4 border-b border-gray-200 text-gray-700">
												{answer.question}
											</td>
											<td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200 text-gray-700">
												{answer.answers.option}
											</td>
											<td className="px-2 md:px-4 py-2 md:py-4 text-center border-b border-gray-200">
												<div className="flex justify-center gap-3 md:gap-6">
													{["Ya", "Tidak"].map((option) => (
														<label
															key={option}
															className={`flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-sm cursor-default transition ${
																selectedAnswers[answer.id] === option
																	? "bg-[#E77D3533]"
																	: ""
															}`}
														>
															<input
																type="radio"
																name={`q-${answer.id}`}
																value={option}
																className="w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
																checked={selectedAnswers[answer.id] === option}
																disabled
															/>
															<span
																className={`${
																	selectedAnswers[answer.id] === option
																		? "text-gray-900"
																		: "text-gray-500"
																} whitespace-nowrap text-xs md:text-sm`}
															>
																{option}
															</span>
														</label>
													))}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			{/* Umpan Balik Section - Readonly for assessee */}
			<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
				<div className="flex flex-col">
					{/* Umpan Balik Untuk Asesi */}
					<h3 className="text-xl font-medium text-gray-900 mb-4">
						Umpan Balik Untuk Asesi
					</h3>
					<p className="text-sm text-gray-600 mb-6">
						Aspek pengetahuan seluruh unit kompetensi yang diujikan
					</p>

					{/* Radio Buttons */}
					<div className="flex flex-col gap-4 mb-6">
						{feedbackOptions.map((option) => (
							<label
								key={option.key}
								className="flex items-center space-x-3 cursor-default"
							>
								<input
									type="radio"
									name="feedbackResult"
									value={option.key}
									checked={feedbackResult === (option.key === "tercapai")}
									className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35]"
									disabled
								/>
								<span
									className={`text-sm leading-relaxed transition-all duration-300 font-bold
              ${option.key === "tercapai" ? "text-gray-700" : "text-red-600"}
              ${
								feedbackResult !== (option.key === "tercapai")
									? "opacity-50 line-through"
									: ""
							}
            `}
								>
									{option.key === "tercapai" ? "Tercapai" : "Belum Tercapai"}
								</span>
							</label>
						))}
					</div>

					{/* Dua Kolom */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
						{/* Left Column */}
						<div className="lg:col-span-1 h-full flex flex-col">
							{/* Unit/Elemen/KUK */}
							<div className="mb-4">
								<p className="text-sm text-gray-700 mb-3">
									Tuliskan unit/elemen/KUK jika belum tercapai:
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Unit
										</label>
										<input
											type="text"
											value={result?.ia05_header.unit}
											readOnly
											className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 border border-gray-300 text-gray-700"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Elemen
										</label>
										<input
											type="text"
											value={result?.ia05_header.element}
											readOnly
											className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 border border-gray-300 text-gray-700"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										KUK
									</label>
									<input
										type="text"
										value={result?.ia05_header.kuk}
										readOnly
										className="w-full rounded-lg px-3 py-2 text-sm bg-gray-100 border border-gray-300 text-gray-700"
									/>
								</div>
							</div>

							{/* Asesi */}
							<div className="mb-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Asesi
								</h3>
								<div className="mb-3">
									<input
										type="text"
										value={result?.assessee.name ?? "N/A"}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="relative">
									<input
										type="text"
										value={formattedDate}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
										readOnly
									/>
									<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
								</div>
							</div>

							{/* Asesor */}
							<div className="mb-auto">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Asesor
								</h3>
								<div className="mb-3">
									<input
										type="text"
										value={result?.assessor.name ?? "N/A"}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="mb-3">
									<input
										type="text"
										value={result?.assessor.no_reg_met ?? "N/A"}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
										readOnly
									/>
								</div>
								<div className="relative">
									<input
										type="text"
										value={formattedDate}
										className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
										readOnly
									/>
									<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
								</div>
							</div>
						</div>

						{/* Right Column: QR */}
						<div className="h-full flex flex-col justify-center">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* QR Asesi */}
								<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
									<span className="text-sm font-semibold text-gray-800">
										QR Code Asesi
									</span>
									{result?.ia05_header?.approved_assessee ? (
										<QRCodeCanvas
											value={getAssesseeUrl(Number(result?.ia05_header.approved_assessee))}
											size={100}
											className="w-40 h-40 object-contain"
										/>
									) : (
										<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
											<span className="text-gray-400 text-sm text-center">
												{result?.ia05_header?.approved_assessee
													? "QR Asesi sudah disetujui"
													: "QR Code akan muncul di sini"}
											</span>
										</div>
									)}
									<span className="text-sm font-semibold text-gray-800">
										{result?.assessee?.name || "-"}
									</span>
									{result?.ia05_header?.approved_assessee && (
										<span className="text-green-600 font-semibold text-sm mt-2">
											Sebagai Asesi, Anda sudah menyetujui
										</span>
									)}
								</div>

								{/* QR Asesor */}
								<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
									<span className="text-sm font-semibold text-gray-800">
										QR Code Asesor
									</span>
									{result?.ia05_header?.approved_assessor ? (
										<QRCodeCanvas
											value={getAssessorUrl(Number(result?.ia05_header.approved_assessor))}
											size={100}
											className="w-40 h-40 object-contain"
										/>
									) : (
										<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
											<span className="text-gray-400 text-sm text-center">
												Menunggu persetujuan asesor
											</span>
										</div>
									)}
									<span className="text-sm font-semibold text-gray-800">
										{result?.assessor?.name || "-"}
									</span>
									{result?.ia05_header?.approved_assessor === true && (
										<span className="text-green-600 font-semibold text-sm mt-2">
											Asesor sudah menyetujui
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
