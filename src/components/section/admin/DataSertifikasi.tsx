import api from "@/helper/axios";
import type { ResultDocs } from "@/model/apl01-model";
import { AlertCircle, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

const assessmentOptions = [
	"Sertifikasi",
	"Sertifikasi Ulang",
	"Pengakuan Kompetensi Terkini (PKT)",
	"Rekognisi Pembelajaran Lampau",
	"Lainnya",
];

const administrativeFilesStatic = [
	{
		title: "Fotokopi Kartu Pelajar",
		name: "student_card" as keyof ResultDocs,
	},
	{
		title: "Fotokopi Kartu Keluarga / KTP",
		name: "family_card" as keyof ResultDocs,
	},
	{
		title: "Pasfoto berwarna ukuran 3 x 4 sebanyak 2 lembar",
		name: "id_card" as keyof ResultDocs,
	},
];

const supportingFilesStatic = [
	{
		title:
			"Fotokopi Rapor SMK Konsentrasi Keahlian Rekayasa Perangkat Lunak semester 1 sampai dengan 5",
		name: "school_report_card" as keyof ResultDocs,
	},
	{
		title:
			"Fotokopi Sertifikat / Surat Keterangan Praktik Kerja Lapangan (PKL) pada bidang Software Development",
		name: "field_work_practice_certificate" as keyof ResultDocs,
	},
];

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function DataSertifikasi({ id_result }: { id_result: string }) {
	const { data: resultDocs, error } = useSWR(
		`/assessments/apl-01/result/docs/${id_result}`,
		fetcher
	);

	const {
		control,
		formState: { errors },
		reset,
	} = useForm<ResultDocs>({
		defaultValues: {
			purpose: "",
			school_report_card: null,
			field_work_practice_certificate: null,
			student_card: null,
			family_card: null,
			id_card: null,
		},
	});

	useEffect(() => {
		reset(resultDocs);
	}, [resultDocs, reset]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
			<fieldset disabled={true} className="contents">
				{error && (
					<div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
						<AlertCircle className="w-5 h-5 text-red-600 mr-3" />
						<span className="text-red-800">{error}</span>
					</div>
				)}

				{/* Left Column - Tujuan Asesmen & Bukti Persyaratan Dasar */}
				<div className="space-y-6 md:col-span-2 lg:col-span-3">
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-gray-900 font-medium mb-4">Tujuan Asesmen</h3>
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
												name={field.name}
												value={option}
												checked={field.value === option}
												onChange={(e) => field.onChange(e.target.value)}
												className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
												disabled={true}
											/>
										)}
									/>
									<span className="text-gray-700 text-sm">{option}</span>
								</label>
							))}
						</div>
						{errors.purpose && (
							<p className="text-red-600 text-sm mt-2">
								{errors.purpose.message}
							</p>
						)}
					</div>

					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-gray-900 font-medium mb-6">
							Bukti Persyaratan Dasar
						</h3>
						<div className="space-y-6">
							{supportingFilesStatic.map((file, index) => {
								const existingFile = resultDocs ? resultDocs[file.name] : null;

								return (
									<div key={index} className="space-y-3">
										<p className="text-gray-700 text-sm leading-relaxed">
											{file.title}
										</p>
										<Controller
											name={file.name}
											control={control}
											render={({ field }) => (
												<FileUploadArea
													field={field}
													existingFileName={existingFile}
													isLocked={true}
												/>
											)}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Right Column - Bukti Administratif */}
				<div className="md:col-span-1 lg:col-span-2">
					<div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
						<div className="flex-1">
							<h3 className="text-gray-900 font-medium mb-6">
								Bukti Administratif
							</h3>
							<div className="space-y-6">
								{administrativeFilesStatic.map((file, index) => {
									const existingFile = resultDocs
										? resultDocs[file.name]
										: null;

									return (
										<div key={index} className="space-y-3">
											<p className="text-gray-700 text-sm font-medium">
												{file.title}
											</p>
											<Controller
												name={file.name}
												control={control}
												render={({ field }) => (
													<FileUploadArea
														field={field}
														existingFileName={existingFile}
														isLocked={true}
													/>
												)}
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</fieldset>
		</div>
	);
}

const FileUploadArea = ({
	field,
	existingFileName,
	isLocked,
}: {
	field: {
		value: string | File | null;
		onChange: (file: File | null) => void;
	};
	existingFileName?: string | null;
	isLocked?: boolean;
}) => {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const fileData = field.value instanceof File ? field.value : null;
	const [dragActive, setDragActive] = useState(false);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(false);
		if (!isLocked && e.dataTransfer.files && e.dataTransfer.files[0]) {
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
			<div className="flex items-start sm:items-center space-x-3 flex-1">
				<div className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-gray-50 shrink-0">
					<Upload className="w-5 h-5 text-gray-500" />
				</div>
				<div className="flex flex-col">
					{fileData ? (
						<p className="text-gray-700 text-sm font-medium break-all">
							{fileData.name} ({(fileData.size / 1024 / 1024).toFixed(1)} MB)
						</p>
					) : existingFileName ? (
						<p className="text-gray-700 text-sm font-medium break-all">
							{existingFileName}
						</p>
					) : (
						<>
							<p className="text-gray-700 text-sm font-medium">
								{dragActive
									? "Lepaskan file di sini..."
									: "Pilih file atau seret & lepas di sini"}
							</p>
							<p className="text-gray-400 text-xs">
								PNG, JPEG, JPG, PDF, up to 5MB
							</p>
						</>
					)}
				</div>
			</div>

			<div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
				{(fileData || existingFileName) && (
					<button
						type="button"
						onClick={() => !isLocked && field.onChange(null)}
						className="flex-1 sm:flex-none px-3 py-2 border border-red-300 rounded-md text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium cursor-pointer"
						disabled={isLocked}
					>
						Hapus
					</button>
				)}
				<button
					type="button"
					onClick={() => !isLocked && fileRef.current?.click()}
					className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 text-sm font-medium cursor-pointer"
					disabled={isLocked}
				>
					{fileData || existingFileName ? "Ganti" : "Pilih File"}
				</button>
			</div>

			<input
				type="file"
				ref={fileRef}
				className="hidden"
				accept=".jpg,.jpeg,.png,.pdf"
				onChange={(e) =>
					!isLocked && field.onChange(e.target.files?.[0] || null)
				}
			/>
		</div>
	);
};
