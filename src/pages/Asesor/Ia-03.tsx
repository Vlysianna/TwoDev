import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import paths from "@/routes/paths";
import NavbarAsesor from "@/components/NavAsesor";
import { useAssessmentParams } from "@/components/AssessmentAsesorProvider";
import IA03 from "@/components/section/IA-03";

export default function Ia03() {
	const { id_result, id_assessment, id_asesi, id_asesor } =
		useAssessmentParams();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesor
						title="Pertanyaan Untuk Mendukung Observasi - FR.IA.03"
						icon={
							<Link
								to={paths.asesor.assessment.dashboardAsesmenMandiri(id_assessment)}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>

				<main className='m-4'>
					<IA03
						isAssessee={false}
						id_assessment={id_assessment}
						id_result={id_result!}
						id_asesi={id_asesi!}
						id_asesor={id_asesor!}
					/>
				</main>
			</div>
		</div>
	);
}
