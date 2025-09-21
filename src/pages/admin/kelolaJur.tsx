import { useState, useEffect } from "react";
import { Download, Edit, Eye, Trash2, AlertTriangle, X, Album } from "lucide-react";
import Navbar from "@/components/NavAdmin";
import Sidebar from "@/components/SideAdmin";
import axiosInstance from "@/helper/axios";
import { useForm } from "react-hook-form";
import type { Scheme } from "@/lib/types";

type FormData = {
	code: string;
	name: string;
};

const KelolaJurusan = () => {
	const { register, handleSubmit, reset } = useForm<FormData>();
	const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setValueEdit } = useForm<FormData>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
	const [schemes, setSchemes] = useState<Scheme[]>([]);
	
	// Modal states
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [schemeToDelete, setSchemeToDelete] = useState<Scheme | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

	useEffect(() => {
		fetchSchemes();
	}, []);

	const fetchSchemes = async () => {
		try {
			const res = await axiosInstance.get("/schemes");
			if (res.data.success) {
				setSchemes(res.data.data);
			} else {
				setError("Gagal memuat data jurusan");
			}
		} catch (e) {
			setError("Gagal memuat data jurusan");
		} finally {
			setLoading(false);
		}
	};

	const handleAddScheme = async (data: FormData) => {
		try {
			setAddLoading(true);
			setError(null);
			
			// Add new scheme only
			const res = await axiosInstance.post("/schemes", data);
			if (res.data.success) {
				fetchSchemes();
				reset();
			} else {
				setError(res.data.message || "Gagal menambah jurusan");
			}
		} catch (e) {
			setError("Gagal menambah jurusan");
		} finally {
			setAddLoading(false);
		}
	};

	const handleDeleteClick = (scheme: Scheme) => {
		setSchemeToDelete(scheme);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!schemeToDelete) return;
		
		setDeleteLoading(schemeToDelete.id);
		setError(null);
		try {
			await axiosInstance.delete(`/schemes/${schemeToDelete.id}`);
			setSchemes(schemes.filter((item) => item.id !== schemeToDelete.id));
			setIsDeleteModalOpen(false);
			setSchemeToDelete(null);
		} catch (e) {
			setError("Gagal menghapus jurusan");
		} finally {
			setDeleteLoading(null);
		}
	};

	const handleEdit = (scheme: Scheme) => {
		setEditingScheme(scheme);
		setValueEdit("code", scheme.code);
		setValueEdit("name", scheme.name);
		setIsEditModalOpen(true);
		setError(null);
	};

	const handleEditScheme = async (data: FormData) => {
		if (!editingScheme) return;
		
		try {
			setAddLoading(true);
			setError(null);
			
			const res = await axiosInstance.put(`/schemes/${editingScheme.id}`, data);
			if (res.data.success) {
				fetchSchemes();
				setIsEditModalOpen(false);
				setEditingScheme(null);
				resetEdit();
			} else {
				setError(res.data.message || "Gagal mengupdate jurusan");
			}
		} catch (e) {
			setError("Gagal mengupdate jurusan");
		} finally {
			setAddLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setIsEditModalOpen(false);
		setEditingScheme(null);
		resetEdit();
		setError(null);
	};

	const handleDetail = (scheme: Scheme) => {
		setSelectedScheme(scheme);
		setIsDetailModalOpen(true);
	};

	const handleExport = async () => {
		try {
			const res = await axiosInstance.get("/schemes/export/excel", {
				responseType: "blob",
			});
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "jurusan.xlsx");
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (e) {
			setError("Gagal mengekspor data");
		}
	}

	return (
		<div className="min-h-screen bg-[#F7FAFC]">
			<Sidebar />
			<div className="lg:ml-64">
				<div className="sticky top-0 z-20 bg-white shadow-sm">
					<Navbar title="Kelola Jurusan" icon={<Album size={20} />} />
				</div>
				<div className="p-4 lg:p-6 pt-20 lg:pt-6">
					<div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
						<span>Dashboard</span>
						<span>/</span>
						<span className="text-[#000000] font-medium">Kelola Jurusan</span>
					</div>
					<h1 className="text-[26px] font-semibold text-gray-900 mb-6">
						Kelola Jurusan
					</h1>
					{/* Error */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
							<span className="text-red-800">{error}</span>
						</div>
					)}
					{/* Add Form Section */}
					<form
						onSubmit={handleSubmit(handleAddScheme)}
						className="bg-white rounded-lg shadow-sm border mb-6 p-4 lg:p-6"
					>
						<div className="mb-4">
							<h2 className="text-lg font-semibold text-gray-900">
								Tambah Jurusan
							</h2>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Kode Jurusan
								</label>
								<input
									type="text"
									{...register("code", { required: true })}
									placeholder="Contoh: RPL, TBS, ULP"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nama Jurusan
								</label>
								<input
									type="text"
									{...register("name", { required: true })}
									placeholder="Contoh: Rekayasa Perangkat Lunak, Tata Busana, Usaha Layanan Pariwisata"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
								/>
							</div>
						</div>
						<div className="mt-6">
							<button
								type="submit"
								className="px-6 py-2 bg-[#E77D35] text-white rounded-lg hover:bg-orange-600 transition-colors"
								disabled={addLoading}
							>
								{addLoading ? "Menambah..." : "Tambah Jurusan"}
							</button>
						</div>
					</form>
					{/* Data Table Section */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="px-4 lg:px-6 py-4 border-b border-gray-200">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
								<h2 className="text-[20px] sm:text-[26px] font-semibold text-[#000000]">
									Daftar Jurusan
								</h2>
								<div className="flex flex-col sm:flex-row gap-3">
									<button onClick={handleExport} className="flex items-center justify-center px-4 py-2 bg-[#E77D35] text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
										<Download className="w-4 h-4 mr-2" />
										Export to Excel
									</button>
								</div>
							</div>
						</div>
						<div className="overflow-x-auto">
							{loading ? (
								<div className="p-6 text-center text-gray-500">
									Memuat data jurusan...
								</div>
							) : (
								<table className="w-full min-w-full">
									<thead>
										<tr className="bg-[#E77D35] text-white">
											<th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">
												Kode Jurusan
											</th>
											<th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">
												Nama Jurusan
											</th>
											<th className="px-4 lg:px-6 py-4 text-center text-xs lg:text-sm font-semibold uppercase tracking-wider">
												Aksi
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{schemes.map((scheme, index) => (
											<tr
												key={scheme.id}
												className={`${
													index % 2 === 0 ? "bg-white" : "bg-gray-50"
												} hover:bg-gray-100 transition-colors`}
											>
												<td className="px-4 lg:px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{scheme.code}
													</div>
												</td>
												<td className="px-4 lg:px-6 py-4">
													<div className="text-sm text-gray-600">
														{scheme.name}
													</div>
												</td>
												<td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
													<div className="flex items-center justify-center space-x-2">
														<button
															onClick={() => handleEdit(scheme)}
															className="p-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
															title="Edit"
														>
															<Edit size={16} />
														</button>
														<button
															onClick={() => handleDetail(scheme)}
															className="p-2 text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
															title="Detail"
														>
															<Eye size={16} />
														</button>
														<button
															onClick={() => handleDeleteClick(scheme)}
															className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
															title="Hapus"
															disabled={deleteLoading === scheme.id}
														>
															{deleteLoading === scheme.id ? (
																"..."
															) : (
																<Trash2 size={16} />
															)}
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
						<div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<div className="text-sm text-gray-700">
									Menampilkan{" "}
									<span className="font-medium">{schemes.length}</span> dari{" "}
									<span className="font-medium">{schemes.length}</span> entri
								</div>
								<div className="text-sm text-gray-500">
									Total: {schemes.length} jurusan
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && schemeToDelete && (
				<div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
						<div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
							<AlertTriangle className="h-6 w-6 text-red-600" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 text-center mb-2">
							Konfirmasi Hapus
						</h3>
						<p className="text-sm text-gray-500 text-center mb-6">
							Apakah Anda yakin ingin menghapus skema "{schemeToDelete.name}"? 
							Tindakan ini tidak dapat dibatalkan.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => {
									setIsDeleteModalOpen(false);
									setSchemeToDelete(null);
								}}
								className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
								disabled={deleteLoading === schemeToDelete.id}
							>
								Batal
							</button>
							<button
								onClick={handleDeleteConfirm}
								className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								disabled={deleteLoading === schemeToDelete.id}
							>
								{deleteLoading === schemeToDelete.id ? "Menghapus..." : "Hapus"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Detail Modal */}
			{isDetailModalOpen && selectedScheme && (
				<div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Detail Skema
							</h3>
							<button
								onClick={() => {
									setIsDetailModalOpen(false);
									setSelectedScheme(null);
								}}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-gray-500">Kode Skema</label>
								<p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
									{selectedScheme.code}
								</p>
							</div>
							
							<div>
								<label className="text-sm font-medium text-gray-500">Nama Skema</label>
								<p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
									{selectedScheme.name}
								</p>
							</div>
							
							<div>
								<label className="text-sm font-medium text-gray-500">Tanggal Dibuat</label>
								<p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
									{new Date(selectedScheme.created_at).toLocaleDateString("id-ID", {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
							
							<div>
								<label className="text-sm font-medium text-gray-500">Terakhir Diperbarui</label>
								<p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
									{new Date(selectedScheme.updated_at).toLocaleDateString("id-ID", {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</div>
						
						<div className="flex justify-end mt-6">
							<button
								onClick={() => {
									setIsDetailModalOpen(false);
									setSelectedScheme(null);
								}}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{isEditModalOpen && editingScheme && (
				<div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Edit Jurusan
							</h3>
							<button
								onClick={handleCancelEdit}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						
						<form onSubmit={handleSubmitEdit(handleEditScheme)} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Kode Jurusan
								</label>
								<input
									type="text"
									{...registerEdit("code", { required: true })}
									placeholder="Masukkan Kode jurusan"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
								/>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nama Jurusan
								</label>
								<input
									type="text"
									{...registerEdit("name", { required: true })}
									placeholder="Masukkan Nama jurusan"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
								/>
							</div>
							
							<div className="flex justify-end gap-3 mt-6">
								<button
									type="button"
									onClick={handleCancelEdit}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
									disabled={addLoading}
								>
									Batal
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
									disabled={addLoading}
								>
									{addLoading ? "Mengupdate..." : "Update Jurusan"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default KelolaJurusan;
