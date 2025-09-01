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
	id_asesi?: string | null;
	id_asesor?: string | null;
	id_result?: string | null;
};

type AssessmentContextType = {
	params: AssessmentParams;
	setParams: React.Dispatch<React.SetStateAction<AssessmentParams>>;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function useAssessmentParams() {
	const ctx = useContext(AssessmentContext);
	if (!ctx)
		throw new Error(
			"useAssessmentParams must be used within AssessmentProvider"
		);
	return ctx;
}

export default function AssessmentAsesorProvider({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	const { id_assessment, id_asesi } = useParams();
	const [params, setParams] = useState<AssessmentParams>({
		id_assessment: id_assessment!,
		id_asesi: id_asesi,
	})

	// const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// contoh validasi: kalau assessment wajib ada, tapi asesi opsional
		if (!id_assessment) {
			navigate(routes.asesor.dashboardAsesor, {
				replace: true,
			});
		}
	}, [id_assessment, id_asesi, navigate, location]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<>
			{loading ? (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
				</div>
			) : (
				<AssessmentContext.Provider
					value={{
						params,
						setParams
					}}
				>
					{children}
				</AssessmentContext.Provider>
			)}
		</>
	);
}
