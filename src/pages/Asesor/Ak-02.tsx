import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarAsesor from "@/components/NavAsesor";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import paths from "@/routes/paths";
import AK02 from "@/components/section/AK-02";

export default function Ak02() {
	const { id_assessment, id_result, id_asesi, id_asesor } =
		useAssessmentParams();

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
				<AK02
					isAssessee={false}
					id_assessment={id_assessment}
					id_result={id_result!}
					id_asesi={id_asesi!}
					id_asesor={id_asesor!}
				/>
			</div>
		</div>
	);
}
