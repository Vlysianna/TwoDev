import { useState, useEffect } from "react";
import { Filter, Download, Edit, Eye, Trash2 } from "lucide-react";
import Navbar from "@/components/NavAdmin";
import Sidebar from "@/components/SideAdmin";
import axiosInstance from '@/helper/axios';


const KelolaJurusan = () => {
	const [formData, setFormData] = useState({
		name: "",
		scheme_id: ""
	});
	const [jurusanList, setJurusanList] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [addLoading, setAddLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
	const [schemes, setSchemes] = useState<any[]>([]);

	useEffect(() => {
		fetchJurusan();
		fetchSchemes();
	}, []);

	const fetchJurusan = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axiosInstance.get('/occupations');
			if (res.data.success) {
				setJurusanList(res.data.data);
			} else {
				setError('Gagal memuat data jurusan');
			}
		} catch (e) {
			setError('Gagal memuat data jurusan');
		} finally {
			setLoading(false);
		}
	};

	const fetchSchemes = async () => {
		try {
			const res = await axiosInstance.get('/schemes');
			if (res.data.success) {
				setSchemes(res.data.data);
			}
		} catch (e) {
			// ignore
		}
	};

	const handleAddJurusan = async () => {
		if (formData.name && formData.scheme_id) {
			setAddLoading(true);
			setError(null);
			try {
				const res = await axiosInstance.post('/occupations', {
					name: formData.name,
					scheme_id: Number(formData.scheme_id)
				});
				if (res.data.success) {
					fetchJurusan();
					setFormData({ name: '', scheme_id: '' });
				} else {
					setError(res.data.message || 'Gagal menambah jurusan');
				}
			} catch (e) {
				setError('Gagal menambah jurusan');
			} finally {
				setAddLoading(false);
			}
		}
	};

	const handleDelete = async (id: number) => {
		setDeleteLoading(id);
		setError(null);
		try {
			await axiosInstance.delete(`/occupations/${id}`);
			setJurusanList(jurusanList.filter((item) => item.id !== id));
		} catch (e) {
			setError('Gagal menghapus jurusan');
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
						<div className="bg-white rounded-lg shadow-sm border mb-6 p-4 lg:p-6">
							<h2 className="text-lg font-semibold mb-4 text-gray-900">Tambah Jurusan</h2>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Nama Jurusan</label>
									<input
										type="text"
										value={formData.name}
										onChange={e => setFormData({ ...formData, name: e.target.value })}
										placeholder="Masukkan nama jurusan"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Skema</label>
									<select
										value={formData.scheme_id}
										onChange={e => setFormData({ ...formData, scheme_id: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
									>
										<option value="">Pilih Skema</option>
										{schemes.map(s => (
											<option key={s.id} value={s.id}>{s.name}</option>
										))}
									</select>
								</div>
							</div>
							<div className="mt-6">
								<button
									onClick={handleAddJurusan}
									className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
									disabled={addLoading}
								>
									{addLoading ? 'Menambah...' : 'Tambah Jurusan'}
								</button>
							</div>
						</div>
						{/* Data Table Section */}
						<div className="bg-white rounded-lg shadow-sm border">
							<div className="px-4 lg:px-6 py-4 border-b border-gray-200">
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
									<h2 className="text-lg font-semibold text-gray-900">Daftar Jurusan</h2>
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
									<div className="p-6 text-center text-gray-500">Memuat data jurusan...</div>
								) : (
									<table className="w-full min-w-full">
										<thead>
											<tr className="bg-orange-500 text-white">
												<th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">Nama Jurusan</th>
												<th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold uppercase tracking-wider">Skema</th>
												<th className="px-4 lg:px-6 py-4 text-center text-xs lg:text-sm font-semibold uppercase tracking-wider">Aksi</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{jurusanList.map((jurusan, index) => (
												<tr key={jurusan.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
													<td className="px-4 lg:px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">{jurusan.name}</div>
													</td>
													<td className="px-4 lg:px-6 py-4">
														<div className="text-sm text-gray-600">{jurusan.scheme?.name || '-'}</div>
													</td>
													<td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
														<div className="flex justify-center space-x-1 lg:space-x-2">
															<button className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Edit">
																<Edit className="w-4 h-4" />
															</button>
															<button className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Lihat">
																<Eye className="w-4 h-4" />
															</button>
															<button
																onClick={() => handleDelete(jurusan.id)}
																className="inline-flex items-center p-1.5 lg:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
																title="Hapus"
																disabled={deleteLoading === jurusan.id}
															>
																{deleteLoading === jurusan.id ? '...' : <Trash2 className="w-4 h-4" />}
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
										Menampilkan <span className="font-medium">{jurusanList.length}</span> dari <span className="font-medium">{jurusanList.length}</span> entri
									</div>
									<div className="text-sm text-gray-500">Total: {jurusanList.length} jurusan</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
};

export default KelolaJurusan;
