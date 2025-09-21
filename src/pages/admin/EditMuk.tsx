// TambahMUK.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { File } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { type Occupation, type Scheme } from "@/lib/types";
import { type MukDetailType, type MukTypeInput } from "@/model/muk-model";
import api from "@/helper/axios";
import { useNavigate, useParams } from "react-router-dom";
import routes from "@/routes/paths";
import FormMuk from "@/components/section/FormMuk";
import useToast from "@/components/ui/useToast";

const defaultValues: MukTypeInput = {
	scheme_id: 0,
	occupation_id: 0,
	code: "",
	uc_apl02s: [],
	groups_ia01: [],
	groups_ia02: [],
	groups_ia03: [],
};

const EditMUK: React.FC = () => {
	const { id_assessment } = useParams();
	const navigate = useNavigate();

	const toast = useToast();

	const [schemes, setSchemes] = useState<Scheme[]>([]);
	const [occupations, setOccupations] = useState<Occupation[]>([]);
	const [dataMuk, setDataMuk] = useState<MukDetailType>();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	
	const [fileIA02, setFileIA02] = useState<File | null>(null);

	const form = useForm<MukTypeInput>({ defaultValues });

	useEffect(() => {
		if (typeof id_assessment !== "string") return;
		const fetchData = async () => {
			setLoading(true);
			try {
				const [resSchemes, resMuk] = await Promise.all([
					api.get("/schemes"),
					api.get(`/assessments/${id_assessment}`),
				]);

				setSchemes(resSchemes.data.data || []);
				setDataMuk(resMuk.data.data);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				setSchemes([]);
				setDataMuk(undefined);
				toast.show({ title: "Gagal", description: "Gagal memuat schema dan MUK. " + err?.response?.data?.message || err.message });
			} finally {
				setLoading(false);
			}
		};

		const fetchOccupations = async () => {
			try {
				const res = await api.get("/occupations");
				if (res?.data?.success) {
					setOccupations(res.data.data);
				}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toast.show({ title: "Gagal", description: "Gagal memuat occupation. " + err?.response?.data?.message || err.message });
			}
		};

		fetchData();
		fetchOccupations();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id_assessment]);

	useEffect(() => {
		if (loading) {
			return;
		}
		console.log(dataMuk);
		if (dataMuk === undefined) {
			navigate(routes.admin.muk.root);
		} else {
			form.reset({
				scheme_id: dataMuk?.occupation.scheme_id,
				occupation_id: dataMuk?.occupation.id,
				...dataMuk,
			});
		}
	}, [dataMuk, form, loading, navigate]);

	const handleSubmitIA02 = async (id_assessment: string) => {
		console.log(fileIA02, id_assessment);
		await api
			.post(
				`/assessments/ia-02/upload-pdf/${id_assessment}`,
				{ pdf: fileIA02 },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((res) => {
				if (res?.data?.success) {
					toast.show({
						title: "Berhasil",
						description: "IA02 berhasil diupload",
					});
				} else {
					toast.show({ title: "Gagal", description: "Gagal mengupload IA02" + res?.data?.message });
				}
				navigate(routes.admin.muk.root);
			})
			.catch((err) => toast.show({ title: "Gagal", description: "Gagal mengupload IA02. " + err?.response?.data?.message || err.message }))
			.finally(() => setSubmitting(false));
	};

	const onSubmit = async (data: MukTypeInput) => {
		try {
			setSubmitting(true);
			// POST to /assessments/create (app mounts assessmentRoutes on /api/assessments)
			const res = await api.put(`/assessments/${id_assessment}`, {
				...data,
				scheme_id: Number(data.scheme_id),
			});
			if (res?.data?.success) {
				toast.show({
					title: "Berhasil",
					description: "MUK berhasil diupload. HARAP TUNGGU IA02 TERUPLOAD (Jika mengupload)",
				});
			} else {
				toast.show({ title: "Gagal", description: "Gagal membuat MUK" });
			}
			if (fileIA02 === null) navigate(routes.admin.muk.root);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.show({ title: "Gagal", description: ". " + err?.response?.data?.message || err.message });
		} finally {
			if (fileIA02 === null) setSubmitting(false);
			// console.log(id_assessment, fileIA02);
			if (id_assessment && fileIA02 !== null) handleSubmitIA02(id_assessment);
		}
	};

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar title="Edit MUK" icon={<File size={20} />} />

				<main className="flex-1 overflow-auto p-6">
					{/* Breadcrumb */}
					<div className="mb-4 text-sm text-gray-500">
						Kelola Database &rarr; Tambah MUK
					</div>

					{/* Card container mirip contoh KelolaMUK */}
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6 space-y-6">
							{/* Header */}
							<div>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<h1 className="text-2xl font-semibold text-gray-900">
											Tambah Kelengkapan MUK
										</h1>
										<p className="text-sm text-gray-500 mt-1">
											Isi data unit dan elemen, atau import dari .docx
										</p>
									</div>
								</div>
							</div>

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Body */}
							<FormMuk
								schemes={schemes}
								occupations={occupations}
								form={form}
								submitting={submitting}
								setFileIA02={setFileIA02}
							/>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default EditMUK;
