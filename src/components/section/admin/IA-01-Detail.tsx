import api from "@/helper/axios";
import type { IA01ResponseElement } from "@/model/ia01-model";
import { Check, Monitor, Search } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function IA01Detail({
	id_result,
	id_unit,
}: {
	id_result: string;
	id_unit: string;
}) {
	const { data: elements, isLoading: loading } = useSWR<IA01ResponseElement[]>(
		`/assessments/ia-01/units/${id_result}/elements/${id_unit}`,
		fetcher
	);

	const detailRef = useRef<HTMLDivElement | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredData = useMemo(
		() =>
			elements?.filter(
				(item) =>
					item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.details.some((det) =>
						det.description.toLowerCase().includes(searchTerm.toLowerCase())
					)
			),
		[elements, searchTerm]
	);

	const pencapaian = useMemo(() => {
		const result: Record<number, "kompeten" | "belum"> = {};

		elements?.forEach((el) => {
			el.details?.forEach((det) => {
				if (det.result) {
					result[Number(det.id)] = det.result.is_competent
						? "kompeten"
						: "belum";
				}
			});
		});

		return result;
	}, [elements]);

	useEffect(() => {
		if (elements && !loading) {
			detailRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [elements, loading]);

	return (
		<div className="bg-white rounded-lg shadow-sm p-6" ref={detailRef}>
			{/* Header */}
			<div className="pb-7 flex flex-wrap items-center gap-4 md:gap-6">
				<div className="flex items-center gap-2 text-[#00809D]">
					<Monitor size={20} />
					<span className="font-medium">
						Unit kompetensi {id_unit} (View Only)
					</span>
				</div>

				{/* Search - Read Only */}
				<div className="relative flex-1 min-w-[200px]">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={16}
					/>
					<input
						type="text"
						placeholder="Search..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Filter Kompeten - Read Only */}
				{/* <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 md:gap-6 flex-none">
					<label
						className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed
                ${filterKompeten ? "bg-[#E77D3533]" : ""}`}
					>
						<input
							type="radio"
							name="filter"
							value="kompeten"
							checked={filterKompeten === "kompeten"}
							className="hidden"
							disabled
						/>
						<span
							className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${
										filterKompeten === "kompeten"
											? "bg-[#E77D35] border-[#E77D35]"
											: "border-[#E77D35] opacity-50"
									}`}
						>
							{filterKompeten === "kompeten" && (
								<Check className="w-4 h-4 text-white" />
							)}
						</span>
						<span
							className={
								filterKompeten === "kompeten"
									? "text-gray-900"
									: "text-gray-400"
							}
						>
							Ceklis Semua Ya
						</span>
					</label>

					<label
						className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed
                ${filterKompeten === "belum" ? "bg-[#E77D3533]" : ""}`}
					>
						<input
							type="radio"
							name="filter"
							value="belum"
							checked={filterKompeten === "belum"}
							className="hidden"
							disabled
						/>
						<span
							className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                  ${
										filterKompeten === "belum"
											? "bg-[#E77D35] border-[#E77D35]"
											: "border-[#E77D35] opacity-50"
									}`}
						>
							{filterKompeten === "belum" && (
								<Check className="w-4 h-4 text-white" />
							)}
						</span>
						<span
							className={
								filterKompeten === "belum" ? "text-gray-900" : "text-gray-400"
							}
						>
							Ceklis Semua Tidak
						</span>
					</label>
				</div> */}
			</div>

			{/* Table */}
			<div className="overflow-x-auto border border-gray-200 rounded-sm">
				<table className="w-full min-w-[800px]">
					<thead className="bg-gray-50">
						<tr>
							<th className="p-4 text-left text-sm font-medium text-gray-700">
								No
							</th>
							<th className="p-4 text-left text-sm font-medium text-gray-700"></th>
							<th className="p-4 text-left text-sm font-medium text-gray-700">
								Kriteria Untuk Kerja
							</th>
							<th className="p-4 text-left text-sm font-medium text-gray-700">
								Standar Industri atau Tempat Kerja
							</th>
							<th className="p-4 text-center text-sm font-medium text-gray-700">
								Pencapaian
							</th>
							<th className="p-4 text-center text-sm font-medium text-gray-700">
								Penilaian Lanjut
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData?.map((item, i) => (
							<React.Fragment key={item.id}>
								{item.details.map((det, idx) => {
									return (
										<tr key={det.id} className="border-t border-gray-200">
											{idx === 0 && (
												<td
													rowSpan={item.details.length}
													className="px-4 py-3 text-sm text-gray-900 align-top"
												>
													{i + 1}
												</td>
											)}
											{idx === 0 && (
												<td
													rowSpan={item.details.length}
													className="px-4 py-3 text-sm text-gray-900 align-top"
												>
													{item.title}
												</td>
											)}
											<td className="px-4 py-3 text-sm text-gray-900">
												<div className="flex items-start gap-2">
													<span className="font-medium text-blue-600 min-w-8">
														{det.id}
													</span>
													<span>{det.description}</span>
												</div>
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{det.benchmark}
											</td>
											<td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
												<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
													{/* Kompeten - Read Only */}
													<label
														className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm
                              ${
																pencapaian[Number(det.id)] === "kompeten"
																	? "bg-[#E77D3533]"
																	: "opacity-50"
															}`}
													>
														<input
															type="radio"
															name={`pencapaian-${det.id}`}
															value="kompeten"
															checked={
																pencapaian[Number(det.id)] === "kompeten"
															}
															onChange={() => {}}
															className="hidden"
															disabled
														/>
														<span
															className={`w-4 h-4 flex items-center justify-center rounded-full border-2 opacity-60 cursor-not-allowed
                                ${
																	pencapaian[Number(det.id)] === "kompeten"
																		? "bg-[#E77D35] border-[#E77D35]"
																		: "border-gray-300"
																}`}
														>
															{pencapaian[Number(det.id)] === "kompeten" && (
																<Check className="w-4 h-4 text-white" />
															)}
														</span>
														<span
															className={
																pencapaian[Number(det.id)] === "kompeten"
																	? "text-gray-900"
																	: "text-gray-400"
															}
														>
															Ya
														</span>
													</label>
													{/* Belum Kompeten - Read Only */}
													<label
														className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-not-allowed transition text-sm opacity-60 cursor-not-allowed
                              ${
																pencapaian[Number(det.id)] === "belum"
																	? "bg-[#E77D3533]"
																	: "opacity-50"
															}`}
													>
														<input
															type="radio"
															name={`pencapaian-${det.id}`}
															value="belum"
															checked={pencapaian[Number(det.id)] === "belum"}
															onChange={() => {}}
															className="hidden"
															disabled
														/>
														<span
															className={`w-4 h-4 flex items-center justify-center rounded-full border-2
                                ${
																	pencapaian[Number(det.id)] === "belum"
																		? "bg-[#E77D35] border-[#E77D35]"
																		: "border-gray-300"
																}`}
														>
															{pencapaian[Number(det.id)] === "belum" && (
																<Check className="w-4 h-4 text-white" />
															)}
														</span>
														<span
															className={
																pencapaian[Number(det.id)] === "belum"
																	? "text-gray-900"
																	: "text-gray-400"
															}
														>
															Tidak
														</span>
													</label>
												</div>
											</td>

											<td className="px-4 py-3 text-center">
												<p
													className="text-gray-700 cursor-pointer min-h-[24px]"
												>
													{det.result?.evaluation}
												</p>
											</td>
										</tr>
									);
								})}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
			{/* HAPUS Tombol Save */}
		</div>
	);
}
