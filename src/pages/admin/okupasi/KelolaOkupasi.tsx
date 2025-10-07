import React, { useEffect, useState } from "react";
import { Edit, Trash2, X, ChevronDown, Calendar, FileText, Eye, Download } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import axiosInstance from "@/helper/axios";
import NavAdmin from "@/components/NavAdmin";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ApprovalConfirmModal from "@/components/ApprovalConfirmModal";
import useToast from "@/components/ui/useToast";

interface OkupasiData {
	id: number;
	name: string;
	uploaded_file?: string | null;
	scheme?: { id: number; name: string; code?: string } | null;
	tanggalMulai?: string;
	tanggalSelesai?: string;
}

const KelolaOkupasi: React.FC = () => {
	// navigation is not used in this page (detail/edit handled inline)

	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [editingOkupasi, setEditingOkupasi] = useState<OkupasiData | null>(
		null
	);

	// form stores name and selected scheme id as string
	const [formData, setFormData] = useState({ name: "", schemeId: "" });
	const [editFormData, setEditFormData] = useState({
		name: "",
		schemeId: "",
		file: null as File | null,
		currentPdfUrl: null as string | null
	});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

	const [okupasiData, setOkupasiData] = useState<OkupasiData[]>([]);
	const [schemes, setSchemes] = useState<{ id: number; name: string }[]>([]);
	const [error, setError] = useState<string | null>(null);
	const toast = useToast();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [approvalOpen, setApprovalOpen] = useState<boolean>(false);
	const [, setApprovalData] = useState<{ approver_admin_id: number; second_approver_admin_id: number; comment: string } | null>(null);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleJurusanSelect = (value: string) => {
		setFormData((prev) => ({ ...prev, schemeId: value }));
		setIsDropdownOpen(false);
	};

	const handleEditJurusanSelect = (value: string) => {
		setEditFormData((prev) => ({ ...prev, schemeId: value }));
		setIsEditDropdownOpen(false);
	};

	const handleTambahOkupasi = () => {
		// create via API
		if (formData.name && formData.schemeId) {
			setError(null);
			axiosInstance
				.post("/occupations", {
					name: formData.name,
					scheme_id: Number(formData.schemeId),
				})
				.then(() => {
					fetchOccupations();
					setFormData({ name: "", schemeId: "" });
				})
				.catch(() => setError("Gagal menambah okupasi"));
		}
	};

	const handleEdit = (id: number) => {
		const occ = okupasiData.find((o: any) => o.id === id);
		if (!occ) return;

		setEditingOkupasi(occ);
		setEditFormData({
			name: occ.name,
			schemeId: occ.scheme?.id ? String(occ.scheme.id) : "",
			file: null, // file baru selalu null waktu buka modal
			currentPdfUrl: occ.uploaded_file || null // URL PDF yang sudah diupload
		});
		setIsEditModalOpen(true);
	};

	const handleView = async (id: number) => {
		try {
			const response = await axiosInstance.get(
				`/occupations/${id}/pdf`,
				{
					responseType: "blob",
				}
			);

			// Create blob and open in new tab
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			window.open(url, "_blank");

			// Clean up after a delay
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
			}, 100);
		} catch (error) {
			console.error("Error viewing PDF:", error);
			setError("Gagal membuka PDF");
		}
	};

	const handleViewCurrentPdf = () => {
		if (editFormData.currentPdfUrl && editingOkupasi) {
			handleView(editingOkupasi.id);
		}
	};

	const openDelete = (id: number) => {
		setDeletingId(id);
		setIsDeleteModalOpen(true);
	};

	const performDelete = async (id: number, approval: { approver_admin_id: number; second_approver_admin_id: number; comment: string }) => {
		try {
			setDeleteLoading(true);
			setError(null);
			await axiosInstance.delete(`/occupations/${id}`, {
				headers: {
					"x-approver-admin-id": approval.approver_admin_id,
					"x-second-approver-admin-id": approval.second_approver_admin_id,
					"x-approval-comment": approval.comment || "hapus okupasi",
				},
			});
			await fetchOccupations();
			toast.show({ title: "Berhasil", description: "Permintaan penghapusan dikirim untuk persetujuan", type: "success" });
		} catch (e) {
			setError("Gagal menghapus okupasi");
			toast.show({ title: "Gagal", description: "Gagal menghapus okupasi", type: "error" });
		} finally {
			setDeleteLoading(false);
			setIsDeleteModalOpen(false);
			setDeletingId(null);
			setApprovalData(null);
		}
	};

	const handleSaveEdit = async () => {
		if (!editingOkupasi) return;
		setError(null);

		try {
			const formData = new FormData();
			formData.append("name", editFormData.name);
			formData.append("scheme_id", String(editFormData.schemeId));

			// kalau ada file PDF baru yang dipilih user
			if (editFormData.file) {
				formData.append("pdf", editFormData.file);
			}

			await axiosInstance.put(`/occupations/${editingOkupasi.id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			fetchOccupations();
			setIsEditModalOpen(false);
			setEditingOkupasi(null);
			setEditFormData({ name: "", schemeId: "", file: null, currentPdfUrl: null });
		} catch (e) {
			console.error("Error updating occupation:", e);
			setError("Gagal memperbarui okupasi");
		}
	};

	const fetchOccupations = async () => {
		setError(null);
		try {
			const res = await axiosInstance.get("/occupations");
			if (res.data?.success) {
				setOkupasiData(res.data.data || []);
			} else {
				setError("Gagal memuat okupasi");
			}
		} catch (e) {
			setError("Gagal memuat okupasi");
		}
	};

	const fetchSchemes = async () => {
		try {
			const res = await axiosInstance.get("/schemes");
			if (res.data?.success) setSchemes(res.data.data || []);
		} catch (_) {
			// ignore
		}
	};

	const handleExport = async () => {
		try {
			const res = await axiosInstance.get("/occupations/export/excel", {
				responseType: "blob",
			});
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "occupations.xlsx");
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (e) {
			setError("Gagal mengekspor data");
		}
	};

	useEffect(() => {
		fetchOccupations();
		fetchSchemes();
	}, []);

	return (
		<div className="flex min-h-screen bg-gray-50">
			<Sidebar />

			<div className="flex-1 flex flex-col min-w-0">
				<NavAdmin title="Kelola Okupasi" icon={<Calendar size={20} />} />

				<div className="p-3 sm:p-4 lg:p-6">
					<div className="mb-4 sm:mb-6">
						<div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
							<span>Dashboard</span>
							<span className="mx-1 sm:mx-2">/</span>
							<span className="text-gray-900 font-medium">Kelola Okupasi</span>
						</div>
						<h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
							Kelola Okupasi
						</h1>
					</div>

					{/* Error Alert */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
							<span className="text-red-800">{error}</span>
						</div>
					)}

					<div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 hover:shadow-md">
						<h2 className="text-base sm:text-lg font-semibold mb-4">
							Tambah Okupasi
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
							<div className="order-1 lg:order-1">
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Pilih Jurusan
								</label>
								<div className="relative">
									<button
										type="button"
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:bg-gray-50"
									>
										<div className="flex items-center justify-between">
											{formData.schemeId ? (
												<div className="flex items-center gap-2 sm:gap-3">
													<span className="font-medium text-gray-900 text-sm sm:text-base truncate">
														{schemes.find(
															(s) => String(s.id) === formData.schemeId
														)?.name || formData.schemeId}
													</span>
												</div>
											) : (
												<span className="text-gray-500 text-sm sm:text-base">
													Pilih Jurusan
												</span>
											)}
											<ChevronDown
												className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""
													}`}
											/>
										</div>
									</button>

									{isDropdownOpen && (
										<div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
											{schemes.map((s) => (
												<button
													key={s.id}
													type="button"
													onClick={() => handleJurusanSelect(String(s.id))}
													className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-orange-50 hover:text-orange-600 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm sm:text-base"
												>
													<span className="font-medium">{s.name}</span>
												</button>
											))}
										</div>
									)}

									{/* Confirm Delete Modal (top-level) */}
									<ConfirmDeleteModal
										isOpen={isDeleteModalOpen}
										onClose={() => { if (!deleteLoading) { setIsDeleteModalOpen(false); setDeletingId(null); } }}
										onConfirm={() => { setIsDeleteModalOpen(false); setApprovalOpen(true); }}
										loading={deleteLoading}
										title="Hapus Okupasi?"
										message="Apakah Anda yakin ingin menghapus okupasi ini? Tindakan ini tidak dapat dibatalkan."
									/>
									{approvalOpen && (
										<ApprovalConfirmModal
											isOpen={approvalOpen}
											onClose={() => { if (!deleteLoading) { setApprovalOpen(false); setApprovalData(null); } }}
											onConfirm={(data) => { const id = deletingId; setApprovalOpen(false); if (id) { void performDelete(id, data); } }}
											title={'Persetujuan Penghapusan Okupasi'}
											subtitle="Pilih 2 admin untuk menyetujui penghapusan okupasi ini."
											loading={deleteLoading}
										/>
									)}
								</div>
							</div>
							<div className="order-2 lg:order-2">
								<label className="block text-sm font-medium mb-2 text-gray-700">
									Nama Okupasi
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleFormChange}
									placeholder="Contoh: Junior Programmer, Junior Custom Made, Booker"
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
								/>
							</div>
						</div>
						<button
							onClick={handleTambahOkupasi}
							className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${!formData.name || !formData.schemeId
								? "bg-[#E77D35] text-white hover:bg-gray-400 hover:cursor-not-allowed"
								: "bg-[#E77D35] hover:bg-[#E77D35]/90 text-white hover:shadow-md"
								}`}
						>
							Tambah Okupasi
						</button>
					</div>

					<div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
						<div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
							<h3 className="text-base sm:text-lg font-semibold">
								Daftar Okupasi
							</h3>
							<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
								<button onClick={handleExport} className="bg-[#E77D35] hover:bg-[#E77D35]/90 text-white px-3 sm:px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md">
									Export ke Excel
								</button>
							</div>
						</div>

						<div className="sm:hidden">
							{okupasiData.map((item, index) => (
								<div
									key={item.id}
									className={`p-4 border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
								>
									<div className="flex justify-between items-start mb-2">
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-gray-900 truncate">
												{item.name}
											</h4>
											<p className="text-sm text-gray-600 mt-1">
												{item.scheme?.name || "-"}
											</p>
										</div>
									</div>

									{/* Tombol aksi utama */}
									<div className="flex justify-end gap-1 mt-3">
										<button
											onClick={() => handleEdit(item.id)}
											className="p-2 text-[#E77D35] hover:bg-[#E77D35]/10 rounded-lg transition-colors"
											title="Edit"
										>
											<Edit size={16} />
										</button>
										<button
											onClick={() => openDelete(item.id)}
											className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
											title="Delete"
										>
											<Trash2 size={16} />
										</button>
									</div>

									{/* PDF Section */}
									<div className="mt-3 text-right">
										{item.uploaded_file ? (
											<button
												onClick={() => handleView(item.id)}
												className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-blue-100 rounded-lg transition-colors"
												title="Lihat PDF"
											>
												<FileText size={16} className="text-gray-600" />
												<span className="text-sm">Lihat Skema</span>
											</button>
										) : (
											<span className="text-gray-400 italic text-sm">
												Tidak ada file
											</span>
										)}
									</div>
								</div>
							))}
						</div>

						<div className="hidden sm:block overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-gradient-to-r from-[#E77D35] to-[#E77D35] text-white">
										<th className="px-4 lg:px-6 py-4 text-left font-semibold">
											Nama Jurusan
										</th>
										<th className="px-4 lg:px-6 py-4 text-left font-semibold">
											Okupasi
										</th>
										<th className="px-4 lg:px-6 py-4 text-center font-semibold">
											Aksi
										</th>
										<th className="px-4 lg:px-6 py-4 text-center font-semibold">
											File
										</th>
									</tr>
								</thead>
								<tbody>
									{okupasiData.map((item, index) => (
										<tr
											key={item.id}
											className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
												} hover:bg-[#E77D35]/10 transition-colors`}
										>
											<td className="px-4 lg:px-6 py-4">
												<span className="font-medium text-gray-900">
													{item.scheme?.name || "-"}
												</span>
											</td>
											<td className="px-4 lg:px-6 py-4 font-medium text-gray-900">
												{item.name}
											</td>
											<td className="px-4 lg:px-6 py-4">
												<div className="flex justify-center gap-1">
													{/* Tombol Edit & Delete */}
													<button
														onClick={() => handleEdit(item.id)}
														className="p-2 text-[#E77D35] hover:bg-[#E77D35]/10 rounded-lg transition-colors"
														title="Edit"
													>
														<Edit size={16} />
													</button>
													<button
														onClick={() => openDelete(item.id)}
														className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
														title="Delete"
													>
														<Trash2 size={16} />
													</button>
												</div>
											</td>

											{/* Kolom baru untuk PDF */}
											<td className="px-4 lg:px-6 py-4 text-center">
												{item.uploaded_file ? (
													<button
														onClick={() => handleView(item.id)}
														className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-blue-100 rounded-lg transition-colors"
														title="Lihat PDF"
													>
														<FileText size={16} className="text-gray-600" />
														<span className="text-sm">Lihat Skema</span>
													</button>
												) : (
													<span className="text-gray-400 italic text-sm">Tidak ada file</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			{isEditModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
					<div className="absolute inset-0 bg-black/40 pointer-events-auto" />
					<div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto">
						<div className="p-4 sm:p-6">
							<div className="flex justify-between items-center mb-4 sm:mb-6">
								<h3 className="text-lg sm:text-xl font-semibold text-gray-900">
									Edit Okupasi
								</h3>
								<button
									onClick={() => setIsEditModalOpen(false)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X size={20} className="text-gray-500" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-gray-700">
										Pilih Jurusan
									</label>
									<div className="relative">
										<button
											type="button"
											onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] transition-all duration-200 hover:bg-gray-50"
										>
											<div className="flex items-center justify-between">
												{editFormData.schemeId ? (
													<div className="flex items-center gap-2 sm:gap-3">
														<span className="font-medium text-gray-900 text-sm sm:text-base truncate">
															{schemes.find(
																(s) => String(s.id) === editFormData.schemeId
															)?.name || editFormData.schemeId}
														</span>
													</div>
												) : (
													<span className="text-gray-500 text-sm sm:text-base">
														Pilih Jurusan
													</span>
												)}
												<ChevronDown
													className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isEditDropdownOpen ? "rotate-180" : ""
														}`}
												/>
											</div>
										</button>

										{isEditDropdownOpen && (
											<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
												{schemes.map((s) => (
													<button
														key={s.id}
														type="button"
														onClick={() =>
															handleEditJurusanSelect(String(s.id))
														}
														className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-[#E77D35]/10 hover:text-[#E77D35] transition-colors first:rounded-t-lg last:rounded-b-lg text-sm sm:text-base"
													>
														<span className="font-medium">{s.name}</span>
													</button>
												))}
											</div>
										)}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-gray-700">
										Nama Okupasi
									</label>
									<input
										type="text"
										name="name"
										value={editFormData.name}
										onChange={handleEditFormChange}
										placeholder="Masukkan nama okupasi"
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] transition-all duration-200"
									/>
								</div>

								{/* Section untuk PDF yang sudah diupload */}
								{editFormData.currentPdfUrl && (
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-700">
											Skema Saat Ini
										</label>
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
											<FileText size={20} className="text-gray-600 flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													Skema Okupasi.pdf
												</p>
												<p className="text-xs text-gray-500">
													File PDF yang sudah diupload
												</p>
											</div>
											<div className="flex gap-2">
												<button
													onClick={handleViewCurrentPdf}
													className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
													title="Lihat PDF"
												>
													<Eye size={16} />
												</button>
												<button
													onClick={handleViewCurrentPdf}
													className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
													title="Download PDF"
												>
													<Download size={16} />
												</button>
											</div>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											Upload file baru di bawah untuk mengganti skema ini
										</p>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium mb-2 text-gray-700">
										{editFormData.currentPdfUrl ? "Upload Skema Baru (PDF)" : "Upload Skema (PDF)"}
									</label>
									{/* Input File */}
									<div className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm">
										<input
											type="file"
											accept="application/pdf"
											onChange={(e) => {
												const file = e.target.files?.[0] || null;
												setEditFormData((prev: any) => ({
													...prev,
													file,
												}));
											}}
											className="block w-full text-sm text-gray-600
                 file:mr-4 file:py-2.5 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-medium
                 file:bg-gray-100 file:text-gray-700
                 hover:file:bg-gray-200
                 cursor-pointer"
										/>
									</div>
									{editFormData.file && (
										<p className="text-xs text-green-600 mt-1">
											File baru dipilih: {editFormData.file.name}
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4 sm:mt-6">
								{/* Tombol Batal */}
								<button
									onClick={() => setIsEditModalOpen(false)}
									className="w-full sm:w-auto px-4 sm:px-6 py-2.5 
               bg-gray-100 hover:bg-gray-200 text-gray-700 
               rounded-lg transition-colors font-medium 
               flex items-center justify-center"
								>
									Batal
								</button>

								{/* Tombol Simpan */}
								<button
									onClick={handleSaveEdit}
									className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 
                rounded-lg font-medium shadow-sm transition-colors 
                flex items-center justify-center
                ${!editFormData.name || !editFormData.schemeId
											? "bg-[#E77D35] text-white hover:bg-gray-400 hover:cursor-not-allowed"
											: "bg-[#E77D35] hover:bg-[#E77D35]/90 text-white hover:shadow-md"
										}`}
								>
									Simpan Perubahan
								</button>
							</div>

						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default KelolaOkupasi;