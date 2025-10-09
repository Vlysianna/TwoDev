import { Controller, useForm } from "react-hook-form";
import { DownloadIcon, FileText } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import NavAdmin from "@/components/NavAdmin";
import { useParams } from "react-router-dom";
import api from "@/helper/axios";
import useToast from "@/components/ui/useToast";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

type SuratTugasFormType = {
	number: string;
	LSP_name: string;
	leader_id: number;
	schedule_detail_id: number;
	work_unit: string;
	activity_name: string;
	position: string;
};

type AdminType = {
	id: number;
	user_id: number;
	address: string;
	phone_no: string;
	birth_date: string;
	can_approve: boolean;
	created_at: string;
	updated_at: string;
	full_name: string;
	email: string;
	role_id: number;
};

const STORAGE_KEY = "surat_tugas_form";

const fetcher = (url: string) =>
	api
		.get(url, { params: { page: 1, limit: 1000 } })
		.then((res) => res.data.data);

export default function SuratTugas() {
	const { scheduleDetailId } = useParams();
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const defaultValues: SuratTugasFormType = useMemo(
		() => ({
			number: "123/LSPSMKN24JKT/2025",
			LSP_name: "LSP SMKN 24 Jakarta",
			leader_id: 0,
			schedule_detail_id: Number(scheduleDetailId),
			work_unit: "SMK Negeri 24",
			activity_name: "USK RPL SMK Negeri 24 Jakarta 2025 KELAS-H",
			position: "Asesor Kompetensi",
		}),
		[scheduleDetailId]
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<SuratTugasFormType>({
		defaultValues: defaultValues,
	});

	const { data: admins, isLoading } = useSWR<AdminType[]>("/admins", fetcher);

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				reset({
					...defaultValues,
					...parsed,
					...JSON.parse(saved),
					schedule_detail_id: Number(scheduleDetailId),
				});
			} catch {
				console.warn("Gagal parse data localStorage");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (data: SuratTugasFormType) => {
		try {
			setLoading(true);

			const {
				number,
				LSP_name,
				leader_id,
				work_unit,
				activity_name,
				position,
			} = data;

			const saveData = {
				number,
				LSP_name,
				leader_id,
				work_unit,
				activity_name,
				position,
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
							Surat Tugas
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							{/* Nomor Surat */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nomor Surat <span className="text-red-500">*</span>
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

							{/* Nama LSP */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama LSP <span className="text-red-500">*</span>
								</label>
								<input
									{...register("LSP_name", {
										required: "Nama LSP wajib diisi",
									})}
									type="text"
									placeholder="Nama LSP"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600"
								/>
								{errors.LSP_name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.LSP_name.message}
									</p>
								)}
							</div>

							{/* Admin */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Admin (Ketua LSP) <span className="text-red-500">*</span>
								</label>
								<Controller
									name="leader_id"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600"
											required
										>
											<option value="">Pilih Admin</option>
											{isLoading ? (
												<option>Loading...</option>
											) : (
												admins?.map((admin) => (
													<option key={admin.id} value={admin.id}>
														{admin.full_name}
													</option>
												))
											)}
										</select>
									)}
								/>
							</div>

							{/* Unit Kerja */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Unit Kerja <span className="text-red-500">*</span>
								</label>
								<input
									{...register("work_unit", {
										required: "Unit kerja wajib diisi",
									})}
									type="text"
									placeholder="Unit kerja"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600"
								/>
								{errors.work_unit && (
									<p className="text-red-500 text-xs mt-1">
										{errors.work_unit.message}
									</p>
								)}
							</div>

							{/* Nama Kegiatan */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama Kegiatan <span className="text-red-500">*</span>
								</label>
								<input
									{...register("activity_name", {
										required: "Nama kegiatan wajib diisi",
									})}
									type="text"
									placeholder="Nama kegiatan"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
								{errors.activity_name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.activity_name.message}
									</p>
								)}
							</div>

							{/* Jabatan */}
							<div>
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Jabatan <span className="text-red-500">*</span>
								</label>
								<input
									{...register("position", {
										required: "Jabatan wajib diisi",
									})}
									type="text"
									placeholder="Jabatan"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm text-gray-600"
								/>
								{errors.position && (
									<p className="text-red-500 text-xs mt-1">
										{errors.position.message}
									</p>
								)}
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
