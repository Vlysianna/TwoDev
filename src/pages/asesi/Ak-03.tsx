import { House } from "lucide-react";
import NavbarAsesi from "@/components/NavbarAsesi";
import { Link, useNavigate } from "react-router-dom";
import { useAssessmentParams } from "@/components/AssessmentAsesiProvider";
import AK03 from "@/components/section/AK-03";
import paths from "@/routes/paths";
import ConfirmModal from "@/components/ConfirmModal";
import { useState } from "react";

export default function Ak03() {
	const { id_result, mutateNavigation } = useAssessmentParams();
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const navigate = useNavigate();

	if (!id_result)
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77D35]"></div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto">
				<div className="bg-white rounded-lg shadow-sm">
					<NavbarAsesi
						title="Umpan Balik dan Catatan Asesmen - FR.AK.03"
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
					<AK03 isAssessee={true} id_result={id_result} mutateNavigation={mutateNavigation} />
				</main>
			</div>
		</div>
	);
}
