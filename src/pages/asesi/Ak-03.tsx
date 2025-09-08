import { ChevronLeft } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link } from "react-router-dom";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import AK03 from "@/components/section/AK-03";
import routes from "@/routes/paths";

export default function Ak03() {
	const { id_result } = useAssessmentParams();

	if (!id_result)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm mb-8">
					<NavbarAsesi
						title="Umpan balik dan catatan asesmen"
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
				<AK03 isAssessee={true} id_result={id_result} />
			</div>
		</div>
	);
}
