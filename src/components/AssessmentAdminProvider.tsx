import { useAuth } from "@/contexts/AuthContext";
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

type AssessmentContextType = AssessmentParams;

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function useAssessmentParams() {
    const ctx = useContext(AssessmentContext);
    if (!ctx)
        throw new Error(
            "useAssessmentParams must be used within AssessmentProvider"
        );
    return ctx;
}

export default function AssessmentAdminProvider({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) {
    const { id_assessment, id_asesor, id_asesi } = useParams();
    const [resultData, setResultData] = useState<any[] | undefined>(undefined);

    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const resp = await api.get(`/assessments/result/${id_assessment}/${id_asesor}/${id_asesi}`);
                if (resp.data.success) {
                    const data = resp.data.data;
                    setResultData(data);
                } else {
                    console.error(resp.data.message);
                    setError("Failed to fetch result data");
                }
            } catch (err) {
                console.error("Failed to fetch result data:", err);
                setError("Failed to fetch result data");
            } finally {
                setLoading(false);
            }
        };

        if (id_assessment && id_asesor && id_asesi) fetchResult();
    }, [user, id_assessment, id_asesor, id_asesi]);

    useEffect(() => {
        if (location.pathname == routes.admin.resultAssessment.root) return;
        if (!id_assessment || !id_asesor) {
            navigate(routes.admin.resultAssessment.root, {
                replace: true,
            });
        }
    }, [id_assessment, navigate, location]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <AssessmentContext.Provider
            value={{
                id_assessment: id_assessment!,
                id_asesi: id_asesi || null,
                id_asesor: id_asesor!,
                id_result: resultData && resultData.length > 0
                    ? String(resultData[resultData.length - 1]?.id)
                    : null,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
}