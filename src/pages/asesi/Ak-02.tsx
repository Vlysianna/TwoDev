import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import NavbarAsesi from "@/components/NavbarAsesi";
import AK02 from "@/components/section/AK-02";
import routes from "@/routes/paths";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Ak02() {
	const { id_assessment, id_asesor, id_result, id_asesi } =
		useAssessmentParams();

	useEffect(() => {
		console.log(id_result);
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesi
						title="Asesmen Mandiri"
						icon={
							<Link
								to={routes.asesi.dashboard}
								className="text-gray-500 hover:text-gray-600"
							>
								<ChevronLeft size={20} />
							</Link>
						}
					/>
				</div>
				<AK02
					isAssessee={true}
					id_assessment={id_assessment}
					id_result={id_result}
					id_asesi={id_asesi}
					id_asesor={id_asesor}
				/>
			</div>
		</div>
	);
}
