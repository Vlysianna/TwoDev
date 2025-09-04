import { useState, useEffect } from "react";
import { Filter, Download, Edit, Eye, Trash2 } from "lucide-react";
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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
	const [schemes, setSchemes] = useState<Scheme[]>([]);

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

	const handleDelete = async (id: number) => {
		setDeleteLoading(id);
		setError(null);
		try {
			await axiosInstance.delete(`/schemes/${id}`);
			setSchemes(schemes.filter((item) => item.id !== id));
		} catch (e) {
			setError("Gagal menghapus jurusan");
		} finally {
			setDeleteLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Sidebar />
			<div className="lg:ml-64">
				<div className="sticky top-0 z-20 bg-white shadow-sm">
					<Navbar />
				</div>
				<div className="p-4 lg:p-6 pt-20 lg:pt-6">
					<div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
						<span>Dashboard</span>
						<span>/</span>
						<span className="text-orange-600 font-medium">Kelola Jurusan</span>
					</div>
					<h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
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
						<h2 className="text-lg font-semibold mb-4 text-gray-900">
							Tambah Jurusan
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nama Jurusan
								</label>
								<input
									type="text"
									{...register("code", { required: true })}
									placeholder="Masukkan nama jurusan"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Deskripsi
								</label>
								<input
									type="text"
									{...register("name", { required: true })}
									placeholder="Masukkan nama jurusan"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
								/>
							</div>
						</div>
						<div className="mt-6">
							<button
								type="submit"
								className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
								<h2 className="text-lg font-semibold text-gray-900">
									Daftar Jurusan
								</h2>
								<div className="flex flex-col sm:flex-row gap-3">
									<button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
										<Filter className="w-4 h-4 mr-2" />
										Filter
									</button>
									<button className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
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
										<tr className="bg-orange-500 text-white">
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
												className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
													<div className="flex justify-center space-x-1 lg:space-x-2">
														<button
															className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
															title="Edit"
														>
															<Edit className="w-4 h-4" />
														</button>
														<button
															className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
															title="Lihat"
														>
															<Eye className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleDelete(scheme.id)}
															className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
															title="Hapus"
															disabled={deleteLoading === scheme.id}
														>
															{deleteLoading === scheme.id ? (
																"..."
															) : (
																<Trash2 className="w-4 h-4" />
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
		</div>
	);
};

export default KelolaJurusan;
