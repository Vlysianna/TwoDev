import api from "@/helper/axios";
import routes from "@/routes/paths";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type JSX,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type AssessmentParams = {
	id_assessment: string;
	id_asesor: string;
	id_asesi: string;
	id_result: string;
};

const AssessmentContext = createContext<AssessmentParams | null>(null);

export function useAssessmentParams() {
	const ctx = useContext(AssessmentContext);
	if (!ctx)
		throw new Error(
			"useAssessmentParams must be used within AssessmentProvider"
		);
	return ctx;
}

export default function AssessmentAsesiProvider({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { id_assessment, id_asesor, id_unit } = useParams();

	// const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!id_assessment || !id_asesor) {
			navigate(routes.asesi.dashboard);
		}
	}, [id_assessment, id_asesor, navigate]);

	const [approveData, setApproveData] = useState<any[] | undefined>(undefined); // sesuaikan type
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filterApproveData, setFilterApproveData] = useState<any>(undefined);

	useEffect(() => {
		const fetchApprove = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await api.get(
					`/assessments/apl-01/results/${id_assessment}`
				);

				if (response.data.success) {
					setApproveData(response.data.data);
				} else {
					setError("Gagal mengambil data approve");
				}
			} catch (err) {
				console.error("Failed to fetch approve:", err);
				setError("Terjadi kesalahan saat mengambil data");
			}
		};

		fetchApprove();
	}, []);

	useEffect(() => {
		if (approveData == undefined) return;
		setFilterApproveData(
			approveData.find((data) => data.result.assessor_id == id_asesor)
		);
		setLoading(false);
	}, [approveData]);

	useEffect(() => {
		if (!id_assessment || !id_asesor) {
			navigate(routes.asesi.dashboard, { replace: true });
			return;
		}

		if (!approveData || filterApproveData == undefined) return;

		const navigateTo = () => {
			if (approveData.length > 0) {
				if (filterApproveData.approved) {
					if (
						location.pathname ===
						routes.asesi.assessment.apl02_detail(
							id_assessment,
							id_asesor,
							id_unit!
						)
					) {
						return null;
					}
					return routes.asesi.assessment.apl02(id_assessment, id_asesor);
				} else {
					return routes.asesi.assessment.dataSertifikasi(
						id_assessment,
						id_asesor
					);
				}
			} else {
				return routes.asesi.dashboard;
			}
		};

		const path = navigateTo();

		if (path) navigate(path, { replace: true });
	}, [filterApproveData]);

	return (
		<>
			{loading ? (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
				</div>
			) : (
				<AssessmentContext.Provider
					value={{
						id_assessment: id_assessment!,
						id_asesor: id_asesor!,
						id_result: filterApproveData?.result_id,
						id_asesi: filterApproveData?.result.assessee_id,
					}}
				>
					{children}
				</AssessmentContext.Provider>
			)}
		</>
	);
}
