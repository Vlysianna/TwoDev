import { useFieldArray, useForm } from "react-hook-form";
import { DownloadIcon, FileText, Trash2 } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import NavAdmin from "@/components/NavAdmin";
import { useParams } from "react-router-dom";
import api from "@/helper/axios";
import useToast from "@/components/ui/useToast";
import { useEffect, useState } from "react";

type SuratTugasFormType = {
	number: string;
	LSP_name: string;
	assigner_name: string;
	position: string;
	assessor_id: string;
	assessment_id: string;
	activity_name: string;
	work_unit: string;
	tuk: string;
	location: string;
	address: string;
	date: string[];
	time: {
		start: string;
		end: string;
	};
	issued_in: string;
};

const STORAGE_KEY = "surat_tugas_form";

export default function SuratTugas() {
	const { id_assessment, assessor_id } = useParams();
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const defaultValues: SuratTugasFormType = {
		number: "",
		LSP_name: "LSP SMKN 24 Jakarta",
		assigner_name: "",
		position: "Asesor Kompetensi",
		assessor_id: assessor_id!,
		assessment_id: id_assessment!,
		activity_name: "",
		work_unit: "SMK Negeri 24 Jakarta",
		tuk: "TUK RPL SMKN 24 Jakarta",
		location: "",
		address: "",
		date: [""],
		time: { start: "", end: "" },
		issued_in: "Jakarta",
	};

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<SuratTugasFormType>({
		defaultValues: defaultValues,
	});

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				reset({
					...defaultValues,
					...parsed,
					...JSON.parse(saved),
					assessor_id,
					assessment_id: id_assessment,
				});
			} catch {
				console.warn("Gagal parse data localStorage");
			}
		}
	}, [assessor_id, defaultValues, id_assessment, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "date",
	});

	const onSubmit = async (data: SuratTugasFormType) => {
		try {
			setLoading(true);

			const {
				number,
				activity_name,
				assigner_name,
				tuk,
				location,
				date,
				time,
				address,
				issued_in,
			} = data;

			const saveData = {
				number,
				activity_name,
				assigner_name,
				tuk,
				location,
				date,
				time,
				address,
				issued_in,
			};

			localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));

			const res = await api.post(
				"/schedules/letter-assignment/pdf?type=assessor",
				data,
				{ responseType: "blob" }
			);
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "surat_tugas.pdf");
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
			toast.show({
				title: "Berhasil",
				description: "Surat tugas berhasil diunduh",
				type: "success",
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			toast.show({
				title: "Gagal",
				description: e?.response?.data?.message || "Terjadi kesalahan",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
				<NavAdmin title="Surat Tugas" icon={<FileText size={20} />} />
				<main className="flex-1 overflow-auto p-4 md:p-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md"
					>
						<h2 className="text-lg font-semibold mb-6 border-b pb-3">
							Tambah Surat Tugas
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							{/* Nomor Surat */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nomor Surat
								</label>
								<input
									{...register("number", {
										required: "Nomor surat wajib diisi",
									})}
									type="text"
									placeholder="123/LSPSMKN24JKT/2025"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.number && (
									<p className="text-red-500 text-xs mt-1">
										{errors.number.message}
									</p>
								)}
							</div>

							{/* Penandatangan */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama Penandatangan
								</label>
								<input
									{...register("assigner_name", {
										required: "Nama penandatangan wajib diisi",
									})}
									type="text"
									placeholder="Dwi Safitri, S.Pd."
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.assigner_name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.assigner_name.message}
									</p>
								)}
							</div>

							{/* Nama Kegiatan */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama Kegiatan
								</label>
								<input
									{...register("activity_name", {
										required: "Nama kegiatan wajib diisi",
									})}
									type="text"
									placeholder="USK RPL SMK Negeri 24 Jakarta 2025"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.activity_name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.activity_name.message}
									</p>
								)}
							</div>

							{/* Tempat Uji Kompetensi */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									TUK
								</label>
								<input
									{...register("tuk", { required: "TUK wajib diisi" })}
									type="text"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.tuk && (
									<p className="text-red-500 text-xs mt-1">
										{errors.tuk.message}
									</p>
								)}
							</div>

							{/* Lokasi */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Lokasi
								</label>
								<input
									{...register("location", { required: "Lokasi wajib diisi" })}
									type="text"
									placeholder="SMK Negeri 24 Jakarta"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.location && (
									<p className="text-red-500 text-xs mt-1">
										{errors.location.message}
									</p>
								)}
							</div>

							{/* Alamat */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Alamat
								</label>
								<input
									{...register("address", { required: "Alamat wajib diisi" })}
									type="text"
									placeholder="Jl. Hankam Raya No.89, Cilangkap, Cipayung"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.address && (
									<p className="text-red-500 text-xs mt-1">
										{errors.address.message}
									</p>
								)}
							</div>
							{/* Nama LSP */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama LSP
								</label>
								<input
									{...register("LSP_name")}
									type="text"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600 cursor-not-allowed"
								/>
							</div>

							{/* Posisi */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Jabatan
								</label>
								<input
									{...register("position")}
									type="text"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600 cursor-not-allowed"
								/>
							</div>

							{/* Unit Kerja */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Unit Kerja
								</label>
								<input
									{...register("work_unit")}
									type="text"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600 cursor-not-allowed"
								/>
							</div>

							{/* Dikeluarkan di (Issued In) */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Dikeluarkan di
								</label>
								<input
									{...register("issued_in", {
										required: "Lokasi penerbitan wajib diisi",
									})}
									type="text"
									placeholder="Jakarta"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.issued_in && (
									<p className="text-red-500 text-xs mt-1">
										{errors.issued_in.message}
									</p>
								)}
							</div>

							{/* --- Daftar Tanggal --- */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Tanggal Asesmen
								</label>
								<div className="space-y-2">
									{fields.map((field, index) => (
										<div key={field.id} className="flex gap-2">
											<input
												{...register(`date.${index}` as const, {
													required: "Tanggal wajib diisi",
												})}
												type="date"
												className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 flex-1"
											/>
											<button
												type="button"
												onClick={() => remove(index)}
												className="text-red-500 hover:text-red-700"
											>
												<Trash2 size={16} />
											</button>
										</div>
									))}
									<button
										type="button"
										onClick={() => append("")}
										className="flex items-center gap-2 px-3 py-1.5 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600"
									>
										+ Tambah Tanggal
									</button>
								</div>
							</div>

							{/* Jam Mulai & Selesai */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Jam Mulai
								</label>
								<input
									{...register("time.start", {
										required: "Jam mulai wajib diisi",
									})}
									type="time"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Jam Selesai
								</label>
								<input
									{...register("time.end", {
										required: "Jam selesai wajib diisi",
									})}
									type="time"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
							</div>
						</div>

						{/* Submit */}
						<div className="flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[#E77D35] hover:bg-[#E77D35]/90 text-white shadow-sm hover:shadow-md transition-all"
							>
								{loading ? (
									"Sedang mengunduh..."
								) : (
									<>
										<span>Export Surat Tugas</span>
										<DownloadIcon size={16} />
									</>
								)}
							</button>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
}
