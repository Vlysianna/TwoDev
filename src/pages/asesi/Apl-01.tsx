import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import NavbarAsesi from "../../components/NavbarAsesi";
import { Link, useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import { Controller, useForm } from "react-hook-form";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import type { AssesseeRequest } from "@/model/assessee-model";
import useToast from "@/components/ui/useToast";

export default function AplZeroOne() {
	const { id_assessment, id_asesor, id_result } = useAssessmentParams();

	const { user } = useAuth();

	const toast = useToast();

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<AssesseeRequest>({
		defaultValues: {
			user_id: user?.id ?? 0,
			full_name: user?.full_name,
		},
	});

	const onSubmit = async (data: AssesseeRequest) => {
		try {
			setLoading(true);
			setError(null);
			setSuccess(null);

			const payload: AssesseeRequest = {
				...data,
				user_id: user?.id ?? 0,
				birth_date: new Date(data.birth_date),
				jobs: [
					{
						institution_name: data.jobs?.[0]?.institution_name || "",
						address: data.jobs?.[0]?.address || "",
						postal_code: data.jobs?.[0]?.postal_code || "",
						position: data.jobs?.[0]?.position || "",
						phone_no: data.jobs?.[0]?.phone_no || "",
						job_email: data.jobs?.[0]?.job_email || "",
					},
				],
			};

			const result = await api.post(
				"/assessments/apl-01/create-self-data",
				payload
			);

			console.log(result.data);

			localStorage.setItem("asesiId", result.data.data.id);

			setSuccess("Data berhasil disimpan.");
			navigate(
				paths.asesi.assessment.dataSertifikasi(
					id_assessment ?? 0,
					id_asesor ?? 0
				)
			);
			if (result.data.success) {
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
		} catch (err: any) {
			setError("Gagal menyimpan data. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchAssesseeData = async () => {
			api
				.get(`/assessments/apl-01/result/${id_result}`)
				.then(
					(response) =>
						response.data.success &&
						reset({
							...response.data.data,
							gender:
								response.data.data.gender == "male" ? "Laki-laki" : "Perempuan",
							jobs: [response.data.data.jobs || {}],
							birth_date: response.data.data.birth_date.split("T")[0],
						})
				)
				.catch((error) => console.error(error));
		};

		fetchAssesseeData();
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesi
						title="Permohonan Sertifikasi Kompetensi"
						icon={
							<Link
								to={paths.asesi.dashboard}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>

				<div className="space-y-8 mx-4 sm:mx-6 lg:px-8 xl:px-40 py-4 sm:py-8">
					{/* Notifications */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
							<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
							<span className="text-red-800">{error}</span>
						</div>
					)}
					{success && (
						<div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
							<CheckCircle className="w-5 h-5 text-green-600 mr-3" />
							<span className="text-green-800">{success}</span>
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						{/* Data Pribadi */}
						<div>
							<h2 className="text-2xl font-semibold text-gray-900 mb-2">
								Data Pribadi
							</h2>
							<p className="text-gray-600 text-sm mb-6">
								Isi biodata Anda dengan akurat untuk memastikan proses
								sertifikasi yang lancar. Semua informasi akan digunakan
								semata-mata untuk keperluan administrasi dan verifikasi Uji
								Sertifikasi Kompetensi (USK).
							</p>
							<div className="flex flex-col gap-4 md:flex-row mb-4">
								<div className="flex flex-col md:flex-[3] gap-2">
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Nama
										</label>
										<input
											{...register("full_name", { required: true })}
											placeholder="Masukkan nama anda"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
										{errors.full_name && (
											<span className="text-red-500 text-sm">Wajib diisi</span>
										)}
									</div>
									<div className="flex md:flex-row w-full gap-4">
										<div className="flex-[2]">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tempat Lahir
											</label>
											<input
												{...register("birth_location", { required: true })}
												placeholder="Masukkan tempat lahir"
												className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tanggal Lahir
											</label>
											<input
												type="date"
												{...register("birth_date", { required: true })}
												placeholder="Masukkan tanggal lahir"
												className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
									</div>
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Kewarganegaraan
										</label>
										<input
											{...register("nationality", { required: true })}
											placeholder="Masukkan kewarganegaraan"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Alamat
										</label>
										<textarea
											{...register("address", { required: true })}
											placeholder="Masukkan alamat"
											rows={3}
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											No. HP
										</label>
										<input
											{...register("phone_no", { required: true })}
											placeholder="Masukkan no. HP"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
								</div>
								<div className="flex flex-col flex-2 gap-2">
									<div className="w-full">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											No. KTP/NIK
										</label>
										<input
											{...register("identity_number", { required: true })}
											placeholder="Masukkan no. KTP/NIK"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="mb-3">
										<label className="block text-sm font-medium text-gray-700 py-2">
											Jenis Kelamin
										</label>
										<Controller
											name="gender"
											control={control}
											render={({ field: { onChange, value } }) => (
												<div className="flex gap-4 align-middle">
													<div className="flex items-center">
														<input
															id="male"
															type="radio"
															value="Laki-laki"
															checked={value === "Laki-laki"}
															onChange={onChange}
															className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
														/>
														<label
															htmlFor="male"
															className="ml-2 text-sm text-gray-700"
														>
															Laki-laki
														</label>
													</div>
													<div className="flex items-center">
														<input
															id="female"
															type="radio"
															value="Perempuan"
															checked={value === "Perempuan"}
															onChange={onChange}
															className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
														/>
														<label
															htmlFor="female"
															className="ml-2 text-sm text-gray-700"
														>
															Perempuan
														</label>
													</div>
												</div>
											)}
										/>
									</div>
									<div className="">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											No. Telp Rumah
										</label>
										<input
											{...register("house_phone_no")}
											placeholder="Masukkan no. telp rumah"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											No. Telp Kantor
										</label>
										<input
											{...register("office_phone_no")}
											placeholder="Masukkan no. telp kantor"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Kode Pos
										</label>
										<input
											{...register("postal_code", { required: true })}
											placeholder="Masukkan kode pos"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
								</div>
							</div>
							<div className="">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Kualifikasi Pendidikan
								</label>
								<select
									{...register("educational_qualifications", {
										required: true,
									})}
									className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="">Pilih</option>
									<option value="SMP">SMP</option>
									<option value="SMA">SMA/Sederajat</option>
									<option value="S1">S1</option>
								</select>
							</div>
						</div>

						{/* Data Pekerjaan */}
						<div>
							<h2 className="text-2xl font-semibold text-gray-900 mb-2">
								Data Pekerjaan
							</h2>
							<p className="text-gray-600 text-sm mb-6">
								Informasi ini penting untuk mencocokkan profil Anda dengan skema
								Uji Sertifikasi Kompetensi (USK) dan tim penilai yang tepat.
							</p>
							<div className="flex flex-col gap-4 md:flex-row mb-4">
								<div className="flex flex-col md:flex-[3] gap-2">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Nama Institusi
										</label>
										<input
											{...register("jobs.0.institution_name")}
											placeholder="Masukkan nama institusi"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div className="flex flex-col md:flex-row gap-2">
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Jabatan
											</label>
											<input
												{...register("jobs.0.position")}
												placeholder="Masukkan jabatan"
												className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Kode Pos
											</label>
											<input
												{...register("jobs.0.postal_code")}
												placeholder="Masukkan kode pos"
												className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
									</div>
								</div>
								<div className="flex flex-col md:flex-[2] gap-2">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Email
										</label>
										<input
											type="email"
											{...register("jobs.0.job_email")}
											placeholder="Masukkan email"
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											No. Telp Kantor
										</label>
										<input
											{...register("jobs.0.phone_no")}
											className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											placeholder="Masukkan no. telp kantor"
										/>
									</div>
								</div>
							</div>
							<div className="">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Alamat Kantor
								</label>
								<textarea
									{...register("jobs.0.address")}
									rows={3}
									className="w-full px-3 py-2 bg-[#DADADA33] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Masukkan alamat kantor"
								/>
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="bg-[#E77D35] hover:bg-orange-600 text-white py-2 px-8 rounded-md"
							>
								{loading ? "Menyimpan..." : "Simpan"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
