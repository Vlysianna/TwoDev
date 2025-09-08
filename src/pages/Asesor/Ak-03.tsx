import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import NavbarAsesor from "@/components/NavAsesor";
import AK03 from "@/components/section/AK-03";
import paths from "@/routes/paths";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Ak03() {
	const { id_assessment, id_result } = useAssessmentParams();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesor
						title="Rekaman Asesmen Kompetensi - FR.AK.02"
						icon={
							<Link
								to={paths.asesor.assessment.dashboardAsesmenMandiri(
									id_assessment
								)}
              className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>
				<AK03 isAssessee={false} id_result={id_result!} />
			</div>
		</div>
	);
}
