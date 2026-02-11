import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import NavbarAsesi from "@/components/NavbarAsesi";
import paths from "@/routes/paths";
import { House } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import IA03 from "@/components/section/IA-03";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

export default function Ia03() {
	const { id_result, mutateNavigation } =
		useAssessmentParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesi
						title="Pertanyaan Untuk Mendukung Observasi - FR.IA.03"
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
					<IA03
						isAssessee={true}
						id_result={id_result}
						mutateNavigation={mutateNavigation}
					/>
				</main>
			</div>
		</div>
	);
}
