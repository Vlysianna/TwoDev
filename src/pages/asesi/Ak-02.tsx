import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import ConfirmModal from "@/components/ConfirmModal";
import NavbarAsesi from "@/components/NavbarAsesi";
import AK02 from "@/components/section/AK-02";
import paths from "@/routes/paths";
import { ChevronLeft, House } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Ak02() {
	const { id_assessment, id_asesor, id_result, id_asesi, mutateNavigation } =
		useAssessmentParams();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesi
						title="Rekaman Asesmen Kompetensi - FR.AK.02"
						icon={
							<Link to={paths.asesi.dashboard} onClick={(e) => {
								e.preventDefault(); // cegah auto navigasi
								setIsConfirmOpen(true);
							}}
								className="text-gray-500 hover:text-gray-600"
							>
								<House size={20} />
							</Link>
						}
					/>
					<ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
						onConfirm={() => {
							setIsConfirmOpen(false);
							navigate(paths.asesi.dashboard); // manual navigate setelah confirm
						}}
						title="Konfirmasi"
						message="Apakah Anda yakin ingin kembali ke Dashboard?"
						confirmText="Ya, kembali"
						cancelText="Batal"
						type="warning"
					/>
				</div>

				<main className='m-4'>
					<AK02
						isAssessee={true}
						id_assessment={id_assessment}
						id_result={id_result}
						id_asesi={id_asesi}
						id_asesor={id_asesor}
						mutateNavigation={mutateNavigation}
					/>
				</main>
			</div>
		</div>
	);
}
