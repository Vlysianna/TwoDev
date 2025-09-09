import React, { useEffect, useRef, useState } from "react";
import { Upload, ChevronLeft, AlertCircle, CheckCircle, X } from "lucide-react";
import NavbarAsesi from "../../components/NavbarAsesi";
import { Link, useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import api from "@/helper/axios";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import useSWR from "swr";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";

type FormValues = {
	purpose: string;
	school_report_card: File | null;
	field_work_practice_certificate: File | null;
	student_card: File | null;
	family_card: File | null;
	id_card: File | null;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function DataSertifikasi() {
	const { id_assessment, id_asesor, id_result } = useAssessmentParams();
	const asesiId = localStorage.getItem("asesiId");

	// const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [modalStep, setModalStep] = useState<number | null>(null);
	const [filterApproveData, setFilterApproveData] = useState<any>(undefined);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			purpose: "",
			school_report_card: null,
			field_work_practice_certificate: null,
			student_card: null,
			family_card: null,
			id_card: null,
		},
	});

	const assessmentOptions = [
		"Sertifikasi",
		"Sertifikasi Ulang",
		"Pengakuan Kompetensi Terkini ( PKT )",
		"Rekognisi Pembelajaran Lampau",
		"Lainnya",
	];

	const administrativeFilesStatic = [
		{
			title: "Copy Kartu Pelajar",
			name: "student_card",
		},
		{
			title: "Copy Kartu Keluarga/Copy KTP",
			name: "family_card",
		},
		{
			title: "Pas foto 3 x 4 berwarna sebanyak 2 lembar",
			name: "id_card",
		},
	];

	const supportingFilesStatic = [
		{
			title:
				"Copy Raport SMK pada Konsentrasi Keahlian Rekayasa Perangkat Lunak semester 1 s.d. 5",
			name: "school_report_card",
		},
		{
			title:
				"Copy sertifikat/Surat Keterangan Praktik Kerja Lapangan (PKL) pada bidang Software Development",
			name: "field_work_practice_certificate",
		},
	];

	const { data: approveData, mutate } = useSWR(
		`/assessments/apl-01/results/${id_assessment}`,
		fetcher
	);

	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			setError(null);

			const formData = new FormData();

			// Object.entries(data).forEach(([key, value]) => {
			// 	if (value) {
			// 		formData.append(key, value);
			// 	}
			// });
			formData.append("purpose", data.purpose);
			formData.append("assessor_id", String(id_asesor));
			formData.append("assessee_id", String(asesiId));
			formData.append("assessment_id", String(id_assessment));

			if (data.school_report_card) {
				formData.append("school_report_card", data.school_report_card);
			}
			if (data.field_work_practice_certificate) {
				formData.append(
					"field_work_practice_certificate",
					data.field_work_practice_certificate
				);
			}
			if (data.student_card) {
				formData.append("student_card", data.student_card);
			}
			if (data.family_card) {
				formData.append("family_card", data.family_card);
			}
			if (data.id_card) {
				formData.append("id_card", data.id_card);
			}

			await api.post(`/assessments/apl-01/create-certificate-docs`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setSuccess("Data berhasil disimpan! Melanjutkan ke tahap berikutnya...");

			setModalStep(1);
		} catch (error: any) {
			setError("Gagal menyimpan data. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
	};

	const handleNext = () => {
		if (modalStep === 1) {
			setModalStep(2);
		} else if (modalStep === 3) {
			// setModalStep(null);
			localStorage.removeItem("asesiId");
			navigate(
				paths.asesi.assessment.apl02(id_assessment ?? 0, id_asesor ?? 0)
			);
		}
	};

	useEffect(() => {
		if (approveData == undefined) return;
		console.log(approveData);
		setFilterApproveData(
			approveData.find((data: any) => data.result_id == id_result)
		);
		setLoading(false);
	}, [approveData]);

	useEffect(() => {
		// console.log(filterApproveData);
		if (filterApproveData) {
			const approved = filterApproveData.approved;
			setModalStep(approved ? 3 : 1);
		}
	}, [filterApproveData]);

	const handleRefresh = () => mutate();

	useEffect(() => {
		handleRefresh();
	}, []);

	// Komponen File Upload dengan Controller
	const FileUploadArea = ({
		field,
	}: {
		field: {
			value: File | null;
			onChange: (file: File | null) => void;
		};
	}) => {
		const fileRef = useRef<HTMLInputElement | null>(null);
		const fileData = field.value;
		const [dragActive, setDragActive] = useState(false);

		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setDragActive(false);
			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				field.onChange(e.dataTransfer.files[0]);
			}
		};

		return (
			<div
				onDrop={handleDrop}
				onDragOver={(e) => {
					e.preventDefault();
					setDragActive(true);
				}}
				onDragLeave={() => setDragActive(false)}
				className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-lg px-4 py-3 transition-colors ${
					dragActive
						? "border-blue-500 bg-blue-50"
						: "border-gray-300 bg-white hover:border-gray-400"
				}`}
			>
				{/* Info Upload */}
				<div className="flex items-start sm:items-center space-x-3 flex-1">
					<div className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-gray-50 shrink-0">
						<Upload className="w-5 h-5 text-gray-500" />
					</div>
					<div className="flex flex-col">
						{fileData ? (
							<p className="text-gray-700 text-sm font-medium break-all">
								{fileData.name} ({(fileData.size / 1024 / 1024).toFixed(1)} MB)
							</p>
						) : (
							<>
								<p className="text-gray-700 text-sm font-medium">
									{dragActive
										? "Lepaskan file di sini..."
										: "Choose a file or drag & drop it here"}
								</p>
								<p className="text-gray-400 text-xs">
									PNG, JPEG, JPG, GIF, BMP
								</p>
							</>
						)}
					</div>
				</div>

				{/* Tombol Aksi */}
				<div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
					{fileData && (
						<button
							type="button"
							onClick={() => field.onChange(null)}
							className="flex-1 sm:flex-none px-3 py-2 border border-red-300 rounded-md text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium cursor-pointer"
						>
							Hapus
						</button>
					)}
					<button
						type="button"
						onClick={() => fileRef.current?.click()}
						className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 text-sm font-medium cursor-pointer"
					>
						{fileData ? "Ganti" : "Browse"}
					</button>
				</div>

				<input
					type="file"
					ref={fileRef}
					className="hidden"
					accept=".jpg,.jpeg,.png,"
					onChange={(e) => field.onChange(e.target.files?.[0] || null)}
				/>
			</div>
		);
	};

	return (
		<div className="max-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesi
						title="Data Sertifikasi"
						icon={
							<Link
								to={paths.asesi.assessment.apl01(
									id_assessment ?? 0,
									id_asesor ?? 0
								)}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>

				<div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-4 sm:px-6 pb-7 items-stretch"
					>
						{error && (
							<div className="lg:col-span-5 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
								<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
								<span className="text-red-800">{error}</span>
							</div>
						)}

						{success && (
							<div className="lg:col-span-5 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
								<CheckCircle className="w-5 h-5 text-green-600 mr-3" />
								<span className="text-green-800">{success}</span>
							</div>
						)}

						{/* Left */}
						<div className="space-y-6 md:col-span-3 flex flex-col h-full">
							<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 h-full">
								<h3 className="text-gray-900 font-medium mb-4">
									Tujuan Asesmen
								</h3>
								<div className="space-y-3">
									{assessmentOptions.map((option) => (
										<label
											key={option}
											className="flex items-center space-x-3 cursor-pointer"
										>
											<Controller
												name="purpose"
												control={control}
												rules={{ required: "Harap pilih tujuan asesmen" }}
												render={({ field }) => (
													<input
														type="radio"
														value={option}
														checked={field.value === option}
														onChange={(e) => field.onChange(e.target.value)}
														className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
													/>
												)}
											/>
											<span className="text-gray-700 text-sm sm:text-base">
												{option}
											</span>
										</label>
									))}
								</div>
								{errors.purpose && (
									<p className="text-red-600 text-sm mt-2">
										{errors.purpose.message}
									</p>
								)}
							</div>

							<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 h-full">
								<h3 className="text-gray-900 font-medium mb-4 sm:mb-6">
									Bukti Persyaratan Dasar
								</h3>
								<div className="space-y-6">
									{supportingFilesStatic.map((file, index) => (
										<div key={index} className="space-y-3">
											<p className="text-gray-700 text-sm leading-relaxed">
												{file.title}
											</p>
											<Controller
												name={file.name as keyof FormValues}
												control={control}
												render={({ field }) => (
													<FileUploadArea
														field={{
															value: field.value as File | null,
															onChange: field.onChange as (
																file: File | null
															) => void,
														}}
													/>
												)}
											/>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right */}
						<div className="md:col-span-1 lg:col-span-2 flex flex-col h-full">
							<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 h-full flex flex-col">
								<div className="flex-1">
									<h3 className="text-gray-900 font-medium mb-4 sm:mb-6">
										Bukti Administratif
									</h3>
									<div className="space-y-6">
										{administrativeFilesStatic.map((fileName, index) => (
											<div key={index} className="space-y-3">
												<p className="text-gray-700 text-sm font-medium">
													{fileName.title}
												</p>
												<Controller
													name={fileName.name as keyof FormValues}
													control={control}
													render={({ field }) => (
														<FileUploadArea
															field={{
																value: field.value as File | null,
																onChange: field.onChange as (
																	file: File | null
																) => void,
															}}
														/>
													)}
												/>
											</div>
										))}
									</div>
								</div>

								<div className="mt-auto pt-4 space-y-3">
									<hr className="border-gray-300" />
									<div className="w-full">
										<button
											type="submit"
											disabled={loading}
											className="w-full bg-[#E77D35] hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-normal py-2 sm:py-3 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base cursor-pointer"
										>
											{loading ? "Menyimpan..." : "Lanjut"}
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
					{/* Modal */}
					{modalStep !== null && (
						<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
							<div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center flex flex-col relative">
								<button
									onClick={() => setModalStep(null)}
									className="absolute top-4 right-4 text-gray-700 hover:text-black cursor-pointer"
								>
									<X size={24} />
								</button>
								{modalStep === 1 && (
									<>
										<img
											src="/img/modal-persetujuan.svg"
											alt="Generate QR"
											className="mx-auto mb-4 w-40"
										/>
										<h2 className="text-lg font-semibold">Generate QR</h2>
										<button
											onClick={handleNext}
											className="bg-[#E77D35] text-white w-full py-2 rounded mt-6"
										>
											Lanjut
										</button>
									</>
								)}
								{modalStep === 2 && (
									<div>
										<img
											src="/img/menunggu-persetujuan.svg"
											alt="Menunggu admin"
											className="mx-auto mb-4 w-40"
										/>
										<h2 className="text-lg font-semibold">
											Menunggu persetujuan admin
										</h2>
									</div>
								)}
								{modalStep === 3 && (
									<>
										<motion.img
											src="/img/setuju.svg"
											alt="Berhasil"
											className="mx-auto mb-4 w-24"
											initial={{ opacity: 0, scale: 0.5 }}
											animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
											transition={{ duration: 0.6 }}
										/>
										<h2 className="text-lg font-semibold mt-4">
											Pengajuan Anda berhasil disetujui.
										</h2>
										<button
											onClick={handleNext}
											className="bg-[#E77D35] text-white w-full py-2 rounded mt-6"
										>
											Lanjut
										</button>
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
