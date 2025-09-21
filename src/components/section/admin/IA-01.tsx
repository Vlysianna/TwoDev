import api from "@/helper/axios";
import { getAssesseeUrl, getAssessorUrl } from "@/lib/hashids";
import type { IA01Group, ResultIA01 } from "@/model/ia01-model";
import { Calendar, ChevronRight, Clock, Monitor } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function IA01({
	id_result,
	handleDetail,
}: {
	id_result: string;
	handleDetail: (name: string, id: string) => void;
}) {
	const { data: result } = useSWR<ResultIA01>(
		`/assessments/ia-01/result/${id_result}`,
		fetcher
	);

	const { data: unitData } = useSWR<IA01Group[]>(
		`/assessments/ia-01/units/${id_result}`,
		fetcher
	);

	const [selectedKPekerjaan, setSelectedKPekerjaan] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();

	const formattedDate = useMemo(
		() =>
			result?.ia01_header?.updated_at
				? new Date(result?.ia01_header?.updated_at).toLocaleDateString(
						"id-ID",
						{
							day: "numeric",
							month: "long",
							year: "numeric",
						}
				  )
				: "Tanggal | Jam",
		[result]
	);

	const completedUnits = useMemo(() => {
		if (unitData && unitData.length > 0) {
			const completed = unitData.filter(
				(unit) => unit.units.flatMap((u) => u.finished).length
			);
			return completed.length;
		} else {
			return 0;
		}
	}, [unitData]);
	const filteredData = useMemo(
		() => unitData?.filter((unit) => unit.name === selectedKPekerjaan),
		[unitData, selectedKPekerjaan]
	);
	const groupList = useMemo(
		() => unitData?.map((group) => group.name),
		[unitData]
	);

	useEffect(() => {
		if (selectedKPekerjaan) {
			searchParams.set("group", selectedKPekerjaan);
			setSearchParams(searchParams);
		}
	}, [selectedKPekerjaan, searchParams, setSearchParams]);

	useEffect(() => {
		if (unitData) setSelectedKPekerjaan(unitData[0]?.name);
	}, [unitData]);

	return (
		<>
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
						<h2 className="text-lg font-medium whitespace-nowrap">
							Skema Sertifikasi (Okupasi)
						</h2>
						<div className="flex items-center space-x-2">
							<Clock className="w-5 h-5 text-gray-400" />
							<span className="text-sm text-gray-600">Sewaktu</span>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
						<span className="text-sm text-gray-600">
							{result?.assessment?.occupation?.name ||
								"Pemrogram Junior ( Junior Coder )"}
						</span>
						<div className="bg-[#E77D3533] text-[#E77D35] px-3 py-1 rounded text-sm font-medium w-fit">
							{result?.assessment?.code || "SMK RPL PJ/SPSMK24/2023"}
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
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
					<span className="text-sm text-gray-500">{formattedDate}</span>
				</div>
			</div>
			<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
				<div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
					<div className="flex flex-wrap gap-2">
						{groupList?.map((tab, idx) => (
							<button
								key={tab}
								onClick={() => setSelectedKPekerjaan(tab)}
								className={`px-3 lg:px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
									selectedKPekerjaan === tab
										? "bg-[#E77D35] text-white shadow-sm"
										: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
								}`}
								{...(selectedKPekerjaan === "" && idx === 0
									? { autoFocus: true }
									: {})}
							>
								{tab}
							</button>
						))}
					</div>
					<div className="flex flex-col items-end gap-1">
						<div className="flex items-center justify-between w-full min-w-[220px]">
							<span className="text-sm text-gray-600">Penyelesaian</span>
							<span className="text-sm font-medium text-gray-900">
								{unitData && unitData.flatMap((unit) => unit.units).length > 0
									? `${Math.round((completedUnits / unitData.flatMap((unit) => unit.units).length) * 100)}%`
									: "0%"}
							</span>
						</div>
						<div className="w-full">
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-[#E77D35] h-2 rounded-full"
									style={{
										width:
											unitData && unitData.flatMap((unit) => unit.units).length > 0
												? `${(completedUnits / unitData.flatMap((unit) => unit.units).length) * 100}%`
												: "0%",
									}}
								></div>
							</div>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
					{filteredData?.length === 0 ? (
						<div className="col-span-full text-center text-gray-400 py-8">
							{unitData?.length === 0
								? "Memuat data..."
								: "Belum ada unit yang dikerjakan."}
						</div>
					) : (
						filteredData?.map((group) =>
							group.units.map((unit, index: number) => (
								<div
									key={unit.id}
									className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-2">
											<div className="w-5 h-5 flex items-center justify-center">
												<Monitor size={16} className="text-[#E77D35]" />
											</div>
											<span className="text-sm font-medium text-[#E77D35]">
												Unit kompetensi {index + 1}
											</span>
										</div>
									</div>
									<h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">
										{unit.title}
									</h3>
									{/* <p className="text-xs text-gray-500 mb-1">{""}</p> */}
									<p className="text-xs text-gray-400 italic">{group.name}</p>

									<div className="flex items-center justify-between mt-3">
										{unit.finished ? (
											<span className="bg-[#E77D3533] text-[#E77D35] px-2 py-1 rounded text-xs font-medium">
												Selesai
											</span>
										) : (
											<span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
												Belum Selesai
											</span>
										)}
										<button
											onClick={() =>
												handleDetail("ia-01-detail", unit.id.toString())
											}
											className="text-[#E77D35] hover:text-[#E77D35] text-sm flex items-center hover:underline transition-colors"
										>
											Lihat detail
											<ChevronRight size={14} className="ml-1" />
										</button>
									</div>
								</div>
							))
						)
					)}
				</div>
			</div>
			<div className="bg-white mt-4 rounded-lg shadow-sm border p-6">
				<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_0.8fr] gap-6 lg:gap-8 items-start">
					<div className="lg:col-span-1 h-full flex flex-col">
						<h3 className="text-xl font-medium text-gray-900 mb-4">
							Rekomendasi
						</h3>
						<div className="space-y-3 mb-6">
							<label className="flex items-start space-x-3 cursor-not-allowed">
								<input
									type="radio"
									name="recommendation"
									checked={result?.ia01_header?.is_competent === true}
									onChange={() => {}}
									disabled
									className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] cursor-not-allowed"
								/>
								<span
									className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
										result?.ia01_header?.is_competent === false
											? "line-through opacity-50"
											: ""
									}`}
								>
									Asesi telah memenuhi pencapaian seluruh kriteria unjuk kerja,
									direkomendasikan <strong>KOMPETEN</strong>
								</span>
							</label>
							<label className="flex items-start space-x-3 cursor-not-allowed">
								<input
									type="radio"
									name="recommendation"
									checked={result?.ia01_header?.is_competent === false}
									onChange={() => {}}
									disabled
									className="mt-1 w-4 h-4 text-[#E77D35] border-gray-300 focus:ring-[#E77D35] cursor-not-allowed"
								/>
								<span
									className={`text-sm text-gray-700 leading-relaxed transition-all duration-300 ${
										result?.ia01_header?.is_competent === true
											? "line-through opacity-50"
											: ""
									}`}
								>
									Asesi belum memenuhi pencapaian seluruh kriteria unjuk kerja,
									direkomendasikan <strong>BELUM KOMPETEN</strong>
								</span>
							</label>

							{/* Tambahan untuk kasus belum ada rekomendasi */}
							{result?.ia01_header?.is_competent === null && (
								<div className="text-gray-500 italic">
									Asesor belum memberikan rekomendasi
								</div>
							)}
						</div>
						<div className="mb-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Pada :
							</label>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Kelompok Pekerjaan
								</label>
								<input
									type="text"
									value={result?.ia01_header?.group || ""}
									disabled
									className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Unit
								</label>
								<input
									type="text"
									value={result?.ia01_header?.unit || ""}
									disabled
									className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Elemen
								</label>
								<input
									type="text"
									value={result?.ia01_header?.element || ""}
									disabled
									className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									KUK
								</label>
								<input
									type="text"
									value={result?.ia01_header?.kuk || ""}
									disabled
									className="w-full rounded-lg px-3 py-2 text-sm bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
								/>
							</div>
						</div>
						<div className="flex-grow"></div>
					</div>
					<div className="h-full flex flex-col">
						<div className="mb-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Asesi</h3>
							<div className="mb-3">
								<input
									type="text"
									value={result?.assessee?.name || "-"}
									className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
									readOnly
									disabled
								/>
							</div>
							<div className="relative">
								<input
									type="text"
									value={formattedDate}
									className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
									readOnly
									disabled
								/>
								<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
							</div>
						</div>
						<div className="mb-auto">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Asesor</h3>
							<div className="mb-3">
								<input
									type="text"
									value={result?.assessor?.name || "-"}
									className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
									readOnly
									disabled
								/>
							</div>
							<div className="mb-3">
								<input
									type="text"
									value={result?.assessor?.no_reg_met || "-"}
									className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
									readOnly
									disabled
								/>
							</div>
							<div className="relative">
								<input
									type="text"
									value={formattedDate}
									className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-700"
									readOnly
									disabled
								/>
								<Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
							</div>
						</div>
						<div className="flex-grow"></div>
					</div>
					<div className="px-2 h-full flex flex-col">
						<div className="grid grid-cols-1 gap-4">
							{/* QR Asesor */}
							<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
								{result?.ia01_header?.approved_assessor ? (
									<QRCodeCanvas
										value={getAssessorUrl(Number(result?.assessor?.id))}
										size={100}
										className="w-40 h-40 object-contain"
									/>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
										<span className="text-gray-400 text-sm text-center">
											{result?.ia01_header?.approved_assessor
												? "Menunggu persetujuan asesor"
												: "QR Asesor belum tersedia"}
										</span>
									</div>
								)}
								<span className="text-sm font-semibold text-gray-800">
									{result?.assessor?.name || "-"}
								</span>
								{result?.ia01_header?.approved_assessor && (
									<span className="text-green-600 font-semibold text-sm mt-2">
										Sudah disetujui asesor
									</span>
								)}
							</div>
							{/* QR Asesi */}
							<div className="p-4 bg-white border rounded-lg w-full flex items-center justify-center py-10 flex-col gap-4">
								{result?.ia01_header?.approved_assessee ? (
									<QRCodeCanvas
										value={getAssesseeUrl(Number(result?.assessee?.id))}
										size={100}
										className="w-40 h-40 object-contain"
									/>
								) : (
									<div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
										<span className="text-gray-400 text-sm">
											QR Code akan muncul di sini
										</span>
									</div>
								)}
								<span className="text-sm font-semibold text-gray-800">
									{result?.assessee?.name || "-"}
								</span>
								{result?.ia01_header?.approved_assessee && (
									<span className="text-green-600 font-semibold text-sm mt-2">
										Sebagai Asesi, Anda sudah setuju
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
