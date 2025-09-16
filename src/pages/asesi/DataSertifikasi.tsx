import React, { useEffect, useRef, useState } from "react";
import { Upload, ChevronLeft, AlertCircle } from "lucide-react";
import NavbarAsesi from "../../components/NavbarAsesi";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import api from "@/helper/axios";
import { useForm, Controller } from "react-hook-form";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import useToast from "@/components/ui/useToast";

type FormValues = {
	purpose: string;
	school_report_card: File | null;
	field_work_practice_certificate: File | null;
	student_card: File | null;
	family_card: File | null;
	id_card: File | null;
};

export default function DataSertifikasi() {
	const { id_assessment, id_asesor, id_result } = useAssessmentParams();
	const asesiId = localStorage.getItem("asesiId");

	// const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

	const toast = useToast();

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

			await api
				.post(`/assessments/apl-01/create-certificate-docs`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					if (response.data.success) {
						toast.show({
							title: "Berhasil",
							description: "Berhasil menyimpan data",
							type: "success",
						});
					} else {
						toast.show({
							title: "Gagal",
							description: "Gagal menyimpan data",
							type: "error",
						});
					}
				});

			// setSuccess("Data berhasil disimpan! Melanjutkan ke tahap berikutnya...");

			// setModalStep(1);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError("Gagal menyimpan data. Silakan coba lagi. " + error.message);
		} finally {
			setLoading(false);
		}
	};

	// fetch result docs if id_result changes
	const [resultDocs, setResultDocs] = useState<{
		purpose: string;
		family_card?: string | null;
		id_card?: string | null;
		student_card?: string | null;
		school_report_card?: string | null;
		field_work_practice_certificate?: string | null;
	} | null>(null);

	useEffect(() => {
		const fetchResultDocs = async () => {
			try {
				const res = await api.get(
					`/assessments/apl-01/result/docs/${id_result}`
				);

				if (res.data.success && res.data.data) {
					const {
						purpose,
						family_card,
						field_work_practice_certificate,
						id_card,
						school_report_card,
						student_card,
					} = res.data.data;

					const getFileName = (url: string | null | undefined) =>
						url ? url.split("/").pop() : null;

					setResultDocs({
						purpose: purpose || "",
						family_card: getFileName(family_card),
						field_work_practice_certificate: getFileName(
							field_work_practice_certificate
						),
						id_card: getFileName(id_card),
						school_report_card: getFileName(school_report_card),
						student_card: getFileName(student_card),
					});
				} else {
					setResultDocs(null);
				}
			} catch (err) {
				console.error("Failed to fetch result data:", err);
			}
		};

		if (id_result) {
			fetchResultDocs();
		}
	}, [id_result]);

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
												render={({ field }) => {
													const checked = resultDocs?.purpose === option;
													return (
														<input
															type="radio"
															name={field.name}
															value={option}
															defaultChecked={checked}
															onChange={(e) => field.onChange(e.target.value)}
															className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
														/>
													);
												}}
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
									{supportingFilesStatic.map((file, index) => {
										const existingFile = resultDocs
											? resultDocs[file.name as keyof typeof resultDocs]
											: null;

										return (
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
																value: existingFile
																	? new File([], existingFile)
																	: (field.value as File | null),
																onChange: field.onChange,
															}}
														/>
													)}
												/>
											</div>
										);
									})}
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
										{administrativeFilesStatic.map((file, index) => {
											const existingFile = resultDocs
												? resultDocs[file.name as keyof typeof resultDocs]
												: null;

											return (
												<div key={index} className="space-y-3">
													<p className="text-gray-700 text-sm font-medium">
														{file.title}
													</p>
													<Controller
														name={file.name as keyof FormValues}
														control={control}
														render={({ field }) => (
															<FileUploadArea
																field={{
																	value: existingFile
																		? new File([], existingFile)
																		: (field.value as File | null),
																	onChange: field.onChange,
																}}
															/>
														)}
													/>
												</div>
											);
										})}
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
											{loading ? "Menyimpan..." : "Simpan"}
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
