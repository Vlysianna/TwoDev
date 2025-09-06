// TambahMUK.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Filter } from "lucide-react";
import Sidebar from "@/components/SideAdmin";
import Navbar from "@/components/NavAdmin";
import {
	type MukDetailType,
	type MukTypeInput,
	type Scheme,
} from "@/lib/types";
import api from "@/helper/axios";
import { useNavigate, useParams } from "react-router-dom";
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

const EditMUK: React.FC = () => {
	const { id_assessment } = useParams();
	const navigate = useNavigate();

	const [schemes, setSchemes] = useState<Scheme[]>([]);
	const [dataMuk, setDataMuk] = useState<MukDetailType>();
	const [loading, setLoading] = useState(true);

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
			} catch (err) {
				setSchemes([]);
				setDataMuk(undefined);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
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
				occupation_name: dataMuk?.occupation.name,
				...dataMuk,
			});
		}
	}, [dataMuk]);

	return (
		<div className="min-h-screen bg-[#F7FAFC] flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />

				<main className="flex-1 overflow-auto p-6">
					{/* Breadcrumb */}
					<div className="mb-4 text-sm text-gray-500">
						Kelola Database &rarr; Tambah MUK
					</div>

					{/* Card container mirip contoh KelolaMUK */}
					<form>
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

									<div className="flex gap-3">
										<button
											type="button"
											onClick={() => console.log("filter")}
											className="flex items-center gap-2 px-4 py-2 border border-[#E77D35] rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
										>
											<Filter size={16} className="text-[#E77D35]" /> Filter
										</button>
										<button
											type="button"
											onClick={() => console.log("export")}
											className="bg-[#E77D35] text-white rounded-md text-sm px-4 py-2 hover:bg-orange-600 transition-colors"
										>
											Export ke Excel
										</button>
									</div>
								</div>
							</div>

							{/* full border line */}
							<div className="border-b border-gray-200" />

							{/* Body */}
							<FormMuk
								schemes={schemes}
								form={form}
								submitting={false}
								disabled={true}
								id_assessment={id_assessment ?? ""}
							/>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default EditMUK;
