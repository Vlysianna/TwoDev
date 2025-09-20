// TambahMUK.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { File, Filter } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import { type MukTypeInput, type Occupation, type Scheme } from "@/lib/types";
import api from "@/helper/axios";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/paths";
import FormMuk from "@/components/section/FormMuk";

const defaultValues: MukTypeInput = {
	scheme_id: 0,
	occupation_name: "",
	code: "",
	uc_apl02s: [],
	groups_ia01: [],
	groups_ia02: [],
	groups_ia03: [],
};

const TambahMUK: React.FC = () => {
	const navigate = useNavigate();
	const form = useForm<MukTypeInput>({ defaultValues });
	const { handleSubmit } = form;

	const [schemes, setSchemes] = useState<Scheme[]>([]);
	const [occupations, setOccupations] = useState<Occupation[]>([]);
	const [submitting, setSubmitting] = useState(false);

	const [idAssessment, setIdAssessment] = useState<number | null>(null);

	useEffect(() => {
		fetchSchemes();
		fetchOccupations();
	}, []);

	const fetchSchemes = async () => {
		try {
			const res = await api.get("/schemes");
			if (res?.data?.success) {
				setSchemes(res.data.data);
			}
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const fetchOccupations = async () => {
		try {
			const res = await api.get("/occupations");
			if (res?.data?.success) {
				setOccupations(res.data.data);
			}
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const onSubmit = async (data: MukTypeInput) => {
		try {
			setSubmitting(true);
			// POST to /assessments/create (app mounts assessmentRoutes on /api/assessments)
			const res = await api.post("/assessments/create", {
				...data,
				scheme_id: Number(data.scheme_id),
			});
			if (res?.data?.success) {
				alert("MUK berhasil diupload");
				setIdAssessment(res.data.data.id);
			} else {
				alert("Gagal membuat APL");
			}
		} catch (err: unknown) {
			console.error(err);
			// try to read axios response message if present
			// @ts-expect-error - err may come from axios with response structure
			const message = err?.response?.data?.message || "Terjadi kesalahan";
			alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar title="Kelola MUK" icon={<File size={20} />} />

				<main className="flex-1 overflow-auto p-6">
					{/* Breadcrumb */}
					<div className="mb-4 text-sm text-gray-500">
						Kelola Database &rarr; Tambah MUK
					</div>

					{/* Card container mirip contoh KelolaMUK */}
					<form onSubmit={handleSubmit(onSubmit)}>
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
								id_assessment={idAssessment ?? ""}
							/>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default TambahMUK;
