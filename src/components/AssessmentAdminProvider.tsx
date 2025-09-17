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

type AssessorData = {
    id: number;
    scheme_id: number;
    no_reg_met: string;
};

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
    const { id_assessment, id_asesi } = useParams();
    const [assessorData, setAssessorData] = useState<AssessorData | undefined>(undefined);
    const [resultData, setResultData] = useState<any[] | undefined>(undefined);

    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssessorData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const resp = await api.get(`/assessor/user/${user.id}`);
                if (resp.data?.success) {
                    const data = resp.data.data;
                    setAssessorData(data);

                    if (id_assessment && id_asesi) {
                        await fetchResult(data.id);
                    }
                } else {
                    console.error(resp.data.message);
                    setError("Failed to fetch assessor data");
                }
            } catch (err) {
                console.error("Failed to fetch assessor data:", err);
                setError("Failed to fetch assessor data");
            } finally {
                setLoading(false);
            }
        };

        const fetchResult = async (assessorId: number) => {
            try {
                const resp = await api.get(`/assessments/result/${id_assessment}/${assessorId}/${id_asesi}`);
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
            }
        };

        fetchAssessorData();
    }, [user, id_assessment, id_asesi]);

    useEffect(() => {
        if (!id_assessment) {
            navigate(routes.asesor.dashboardAsesor, {
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
                id_asesor: assessorData ? String(assessorData.id) : null,
                id_result: resultData && resultData.length > 0
                    ? String(resultData[resultData.length - 1]?.id)
                    : null,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
}