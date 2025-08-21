import { useAuth } from "@/contexts/AuthContext";
import api from "@/helper/axios";
import routes from "@/routes/paths";
import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function IsApproveApl01({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { id_assessment, id_asesor } = useParams();

	const { user } = useAuth();
	const navigate = useNavigate();

	if (!id_assessment || !id_asesor) {
		navigate(routes.asesi.dashboard);
		return <></>;
	}

	const [approveData, setApproveData] = useState<any[]>([]); // sesuaikan type
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
			} finally {
				setLoading(false);
			}
		};

		fetchApprove();
	}, []);

	useEffect(() => {
		const asesiId = localStorage.getItem("asesiId");

		if (!id_assessment || !id_asesor) return;

		const navigateTo = () => {
			if (!loading) {
				if (approveData.length > 0 && approveData[0].approved) {
					return routes.asesi.assessment.asesmenMandiri(
						id_assessment,
						id_asesor
					);
				}

				if (asesiId) {
					return routes.asesi.assessment.dataSertifikasi(
						id_assessment,
						id_asesor
					);
				} else {
					return routes.asesi.assessment.apl01(id_assessment, id_asesor);
				}
			} else {
				return routes.asesi.assessment.apl01(id_assessment, id_asesor);
			}
		};

		navigate(navigateTo());
	}, [approveData]);

	return (
		<>
			{loading ? (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
				</div>
			) : (
				children
			)}
		</>
	);
}
