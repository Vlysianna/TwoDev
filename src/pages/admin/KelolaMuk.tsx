import React, { useState, useEffect } from "react";
import { Edit3, Eye, Trash2, AlertCircle, File } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import paths from "@/routes/paths";
import axiosInstance from "@/helper/axios";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { MukType } from "@/lib/types";

const KelolaMUK: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [exportLoading] = useState<boolean>(false);
	const [muks, setMuks] = useState<MukType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		fetchMuk();
	}, []);

	const fetchMuk = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axiosInstance.get("/assessments");
			if (response.data.success) {
				setMuks(response.data.data);
			} else {
				setError("Gagal memuat data muk");
			}
		} catch (error) {
			setError("Gagal memuat data muk");
		} finally {
			setLoading(false);
		}
	};



	const handleEdit = (id: number) => {
		console.log("Edit user:", id);
		navigate(paths.admin.muk.edit(id));
	};
	const handleView = (id: number) => console.log("View user:", id);

	const confirmDelete = async () => {
		if (!deletingId) return;
		try {
			setDeleteLoading(true);
			await axiosInstance.delete(`/assessments/${deletingId}`);
			// optimistic update
			setMuks((prev) => prev.filter((muk) => muk.id !== deletingId));
			setDeleteModalOpen(false);
			setDeletingId(null);
		} catch (error: unknown) {
			console.error("Error deleting assessment:", error);
			setError("Gagal menghapus MUK");
		} finally {
			setDeleteLoading(false);
		}
	};
	const handleExport = async () => {
		// setExportLoading(true);
		// setError(null);
		// try {
		// 	const response = await axiosInstance.get("/schemes/export/excel", {
		// 		responseType: "blob",
		// 	});
		// 	const url = window.URL.createObjectURL(new Blob([response.data]));
		// 	const link = document.createElement("a");
		// 	link.href = url;
		// 	link.setAttribute("download", "schemes.xlsx");
		// 	document.body.appendChild(link);
		// 	link.click();
		// 	link.parentNode?.removeChild(link);
		// } catch (error) {
		// 	setError("Gagal mengekspor data ke Excel");
		// } finally {
		// 	setExportLoading(false);
		// }
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F7FAFC] flex">
				<Sidebar />
				<div className="flex-1 flex flex-col min-w-0">
					<Navbar title="Kelola MUK" icon={<File size={20} />} />
					<main className="flex-1 overflow-auto p-6">
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E77D35] mx-auto mb-4"></div>
								<p className="text-gray-600">Memuat data skema...</p>
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar title="Kelola MUK" icon={<File size={20} />} />

				<main className="flex-1 overflow-auto p-6">
					{/* Error Alert */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
							<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
							<span className="text-red-800">{error}</span>
						</div>
					)}

					{/* Breadcrumb */}
					<div className="mb-6">
						<nav className="flex text-sm text-gray-500">
							<span>Dashboard</span>
							<span className="mx-2">/</span>
							<span className="text-[#000000]">Kelola MUK</span>
						</nav>
					</div>
					{/* Confirm Delete Modal */}
					<ConfirmDeleteModal
						isOpen={deleteModalOpen}
						onClose={() => {
							setDeleteModalOpen(false);
							setDeletingId(null);
						}}
						onConfirm={confirmDelete}
						loading={deleteLoading}
						title="Hapus Skema"
						message="Apakah Anda yakin ingin menghapus skema ini? Tindakan ini tidak dapat dibatalkan."
					/>

					{/* Page Title */}
					<div className="mb-6">
						<h1 className="text-[26px] font-semibold text-gray-900 mb-4">
							Kelola MUK
						</h1>

						{/* Buttons */}
						<div className="flex space-x-3">
							<Link to={paths.admin.muk.tambah}>
								<button className="w-[191px] h-[41px] bg-[#E77D35] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors">
									Tambah MUK
								</button>
							</Link>

							<Link to={paths.admin.kelolaJurusan}>
								<button className="w-[151px] h-[41px] border border-[#E77D35] text-[#E77D35] text-sm font-medium rounded-md hover:bg-orange-50 transition-colors">
									Kelola Jurusan
								</button>
							</Link>
						</div>
					</div>

					{/* Main Content Card - This is the box container like in Figma */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						{/* Card Header with full border line */}
						<div className="p-6">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
								<h2 className="text-[20px] sm:text-[26px] font-semibold text-[#000000]">
									Kelola MUK
								</h2>
								{/* <div className="flex flex-wrap gap-3 sm:space-x-3 items-center">
									<button
										onClick={handleExport}
										className="bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600 transition-colors w-full sm:w-[152px] h-[41px] flex items-center justify-center"
										disabled={exportLoading}
									>
										{exportLoading ? (
											<span className="flex items-center">
												<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
												Exporting...
											</span>
										) : (
											<>Export ke Excel</>
										)}
									</button>
								</div> */}
							</div>
							{/* Full width border line */}
							<div className="border-b border-gray-200"></div>
						</div>

						{/* Table Container with padding */}
						<div className="px-6 pb-6">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-[#E77D35] text-white">
											<th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
												Kode MUK
											</th>
											<th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
												Nama Okupasi
											</th>
											<th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
												Skema
											</th>
											<th className="px-6 py-4 text-center text-sm font-medium tracking-wider">
												Aksi
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{muks.map((muk, index) => (
											<tr
												key={muk.id}
												className={`${
													index % 2 === 0 ? "bg-white" : "bg-gray-50"
												} hover:bg-gray-100 transition-colors`}
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{muk.code}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{muk.occupation.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{muk.occupation.scheme.code}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-center">
													<div className="flex items-center justify-center space-x-2">
														<button
															onClick={() => handleEdit(muk.id)}
															className="p-2 text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
															title="Edit"
														>
															<Edit3 size={16} />
														</button>
														{/* <button
															onClick={() => handleView(muk.id)}
															className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
															title="View"
														>
															<Eye size={16} />
														</button> */}
														<button
															onClick={() => {
																setDeletingId(muk.id);
																setDeleteModalOpen(true);
															}}
															className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
															title="Delete"
														>
															<Trash2 size={16} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default KelolaMUK;
