import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { Plus, Trash2, AlertCircle, CheckCircle, File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import axiosInstance from "@/helper/axios";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { MukType } from "@/lib/types";

interface Scheme {
	id: number;
	code: string;
	name: string;
}

interface Occupation {
	id: number;
	name: string;
	scheme: Scheme;
}

interface Assessor {
	id: number;
	name: string;
}

interface ScheduleDetailForm {
	assessor_id: number;
	location: string;
}

interface ScheduleForm {
	assessment_id: number;
	start_date: string;
	end_date: string;
	schedule_details: ScheduleDetailForm[];
}

const TambahJadwal: React.FC = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
		watch,
	} = useForm<ScheduleForm>({
		defaultValues: {
			assessment_id: 0,
			start_date: "",
			end_date: "",
			schedule_details: [{ assessor_id: 0, location: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "schedule_details",
	});

	const [assessments, setAssessments] = useState<MukType[]>([]);
	const [assessors, setAssessors] = useState<Assessor[]>([]);
	const [assessorsLoading, setAssessorsLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Watch schedule details to handle dynamic fields
	const scheduleDetails = watch("schedule_details");

	// initial load: assessments + assessors
	useEffect(() => {
		(async () => {
			try {
				const assessmentResp = await axiosInstance.get("/assessments");
				if (assessmentResp.data?.success) {
					setAssessments(assessmentResp.data.data);
				}
			} catch (err) {
				console.error("Error fetching assessments:", err);
				setError("Gagal memuat daftar assessment");
			}

			try {
				setAssessorsLoading(true);
				const resp = await axiosInstance.get("/assessor");
				if (resp.data && resp.data.success) {
					const list: Assessor[] = resp.data.data;
					setAssessors(list);
				}
			} catch (err) {
				console.error("Error fetching assessors:", err);
				setError("Gagal memuat daftar asesor dari server");
			} finally {
				setAssessorsLoading(false);
			}
		})();
	}, []);

	// Set default assessor for the first field when assessors are loaded
	useEffect(() => {
		if (assessors.length > 0 && scheduleDetails && scheduleDetails.length > 0) {
			const firstDetail = scheduleDetails[0];
			if (!firstDetail.assessor_id || firstDetail.assessor_id === 0) {
				setValue("schedule_details.0.assessor_id", assessors[0].id);
			}
		}
	}, [assessors, scheduleDetails, setValue]);

	const addScheduleDetail = () => {
		append({ assessor_id: 0, location: "" });
	};

	const removeScheduleDetail = (index: number) => {
		if (fields.length > 1) {
			remove(index);
		}
	};

	const onSubmit = async (data: ScheduleForm) => {
		try {
			setLoading(true);
			setError(null);
			setSuccess(null);

			// Validasi tambahan
			if (!data.assessment_id || data.assessment_id === 0) {
				setError("Assessment wajib dipilih");
				setLoading(false);
				return;
			}

			if (!data.start_date || !data.end_date) {
				setError("Tanggal mulai dan selesai wajib diisi");
				setLoading(false);
				return;
			}

			if (new Date(data.start_date) >= new Date(data.end_date)) {
				setError("Tanggal selesai harus setelah tanggal mulai");
				setLoading(false);
				return;
			}

			// Validasi setiap detail jadwal
			const invalidDetails = data.schedule_details.filter(
				detail => !detail.assessor_id || detail.assessor_id === 0 || !detail.location.trim()
			);

			if (invalidDetails.length > 0) {
				setError("Semua asesor dan TUK harus diisi");
				setLoading(false);
				return;
			}

			// Format data untuk API
			const formattedData = {
				assessment_id: Number(data.assessment_id),
				start_date: new Date(data.start_date).toISOString(),
				end_date: new Date(data.end_date).toISOString(),
				schedule_details: data.schedule_details.map(detail => ({
					assessor_id: Number(detail.assessor_id),
					location: detail.location.trim()
				}))
			};

			// console.log("Submitting data:", formattedData);

			const scheduleResponse = await axiosInstance.post("/schedules", formattedData);

			if (scheduleResponse.data.success) {
				setSuccess("Jadwal berhasil ditambahkan!");
				setTimeout(() => {
					navigate(paths.admin.kelolaJadwal);
				}, 1500);
			} else {
				setError(scheduleResponse.data.message || "Gagal membuat jadwal");
			}
		} catch (error: unknown) {
			console.error("Error creating schedule:", error);
			const err = error as any;
			const msg = err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Gagal membuat jadwal. Silakan coba lagi.";
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate(paths.admin.kelolaJadwal);
	};

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar title="Tambah Jadwal" icon={<File size={20} />} />
				<main className="flex-1 overflow-auto p-6">
					{/* Alerts */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
							<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
							<span className="text-red-800">{error}</span>
						</div>
					)}

					{success && (
						<div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
							<CheckCircle className="w-5 h-5 text-green-600 mr-3" />
							<span className="text-green-800">{success}</span>
						</div>
					)}

					{/* Breadcrumb */}
					<div className="mb-6">
						<nav className="flex text-sm text-gray-500">
							<span>Kelola Jadwal</span>
							<span className="mx-2">/</span>
							<span className="text-black">Tambah Jadwal</span>
						</nav>
					</div>

					{/* Main Form */}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="bg-white rounded-lg shadow-sm border border-gray-200">
							{/* Header */}
							<div className="p-6">
								<h2 className="text-[20px] sm:text-[26px] font-semibold text-black">
									Tambah Jadwal Asesmen
								</h2>
								<div className="border-b border-gray-200 mt-4"></div>
							</div>

							{/* Form Content */}
							<div className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Data Asesmen */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-4">
											Data Asesmen
										</h3>
										<div className="space-y-4">
											{/* Pilih Assessment */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Pilih Assessment{" "}
													<span className="text-red-500">*</span>
												</label>
												<select
													{...register("assessment_id", {
														required: "Assessment wajib dipilih",
														validate: value => value !== 0 || "Assessment wajib dipilih"
													})}
													className={`w-full border ${errors.assessment_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none`}
												>
													<option value={0}>Pilih Assessment</option>
													{assessments.map((assessment) => (
														<option key={assessment.id} value={assessment.id}>
															{assessment.code} - {assessment.occupation.name}
														</option>
													))}
												</select>
												{errors.assessment_id && (
													<span className="text-red-500 text-sm">
														{errors.assessment_id.message}
													</span>
												)}
											</div>

											{/* Tanggal Mulai */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Tanggal Mulai <span className="text-red-500">*</span>
												</label>
												<input
													type="datetime-local"
													{...register("start_date", {
														required: "Tanggal mulai wajib diisi",
													})}
													className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none`}
												/>
												{errors.start_date && (
													<span className="text-red-500 text-sm">
														{errors.start_date.message}
													</span>
												)}
											</div>

											{/* Tanggal Selesai */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Tanggal Selesai{" "}
													<span className="text-red-500">*</span>
												</label>
												<input
													type="datetime-local"
													{...register("end_date", {
														required: "Tanggal selesai wajib diisi",
													})}
													className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none`}
												/>
												{errors.end_date && (
													<span className="text-red-500 text-sm">
														{errors.end_date.message}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Data Asesor */}
									<div>
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-lg font-medium text-gray-900">
												Data Asesor
											</h3>
											<button
												type="button"
												onClick={addScheduleDetail}
												className="flex items-center gap-2 px-3 py-1.5 bg-[#E77D35] text-white rounded-md text-sm hover:bg-orange-600"
											>
												<Plus size={16} />
												Tambah Asesor
											</button>
										</div>

										<div className="space-y-4">
											{fields.map((field, index) => (
												<div
													key={field.id}
													className="p-4 border border-gray-200 rounded-md space-y-3"
												>
													<div className="flex items-center justify-between">
														<h4 className="font-medium text-gray-900">
															Asesor {index + 1}
														</h4>
														{fields.length > 1 && (
															<button
																type="button"
																onClick={() => removeScheduleDetail(index)}
																className="text-red-500 hover:text-red-700"
															>
																<Trash2 size={16} />
															</button>
														)}
													</div>

													<div>
														<label className="block text-sm font-medium text-gray-700 mb-1">
															Pilih Asesor <span className="text-red-500">*</span>
														</label>
														<select
															{...register(`schedule_details.${index}.assessor_id` as const, {
																required: "Asesor wajib dipilih",
																validate: value => value !== 0 || "Asesor wajib dipilih"
															})}
															className={`w-full border ${errors.schedule_details?.[index]?.assessor_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none`}
															disabled={assessorsLoading}
														>
															{assessorsLoading ? (
																<option value={0}>Memuat asesor...</option>
															) : (
																<>
																	<option value={0}>Pilih Asesor</option>
																	{assessors.length === 0 ? (
																		<option value={0}>Tidak ada asesor</option>
																	) : (
																		assessors.map((assessor) => (
																			<option
																				key={assessor.id}
																				value={assessor.id}
																			>
																				{assessor.name}
																			</option>
																		))
																	)}
																</>
															)}
														</select>
														{errors.schedule_details?.[index]?.assessor_id && (
															<span className="text-red-500 text-sm">
																{errors.schedule_details[index]?.assessor_id?.message}
															</span>
														)}
														<label className="block text-sm font-medium text-red-500 mb-1 italic">
															*Asesor yang muncul di sini adalah asesor yang sudah melengkapi persyaratan.
														</label>
													</div>

													<div>
														<label className="block text-sm font-medium text-gray-700 mb-1">
															TUK <span className="text-red-500">*</span>
														</label>
														<input
															type="text"
															{...register(`schedule_details.${index}.location` as const, {
																required: "TUK wajib diisi",
																minLength: {
																	value: 2,
																	message: "TUK minimal 2 karakter"
																}
															})}
															placeholder="Contoh: Ruang Lab 1"
															className={`w-full border ${errors.schedule_details?.[index]?.location ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#E77D35] focus:border-[#E77D35] outline-none`}
														/>
														{errors.schedule_details?.[index]?.location && (
															<span className="text-red-500 text-sm">
																{errors.schedule_details[index]?.location?.message}
															</span>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Submit Button */}
								<div className="mt-8 pt-6 border-t border-gray-200">
									<div className="flex gap-4">
										<button
											type="submit"
											disabled={loading}
											className="bg-[#E77D35] text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{loading ? "Menyimpan..." : "Simpan Jadwal"}
										</button>
										<button
											type="button"
											onClick={handleCancel}
											className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
										>
											Batal
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default TambahJadwal;