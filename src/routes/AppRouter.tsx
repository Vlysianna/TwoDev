import { BrowserRouter, Route, Routes } from "react-router";
import LoginForm from "@/pages/login/Login";
import RegisterForm from "@/pages/register/Register";
import AplZeroOne from "@/pages/asesi/Apl-01";
import LandingPage from "@/pages/LandingPage/LandingPage";
import TentangLSP from "@/pages/LandingPage/TentangLSP";
import Skema from "@/pages/LandingPage/Skema";
import StrukturLSP from "@/pages/LandingPage/StrukturLSP";
import PengelolaSDM from "@/pages/LandingPage/PengelolaSDM";
import Tempatuji from "@/pages/LandingPage/Tempatuji";
import Asesor from "@/pages/LandingPage/Asesor";
import Prosedur from "@/pages/LandingPage/Prosedur";
import Berita from "@/pages/LandingPage/Berita";
import Galeri from "@/pages/LandingPage/Galeri";
import Dokumen from "@/pages/LandingPage/Dokumen";
import KelolaAkunAsesi from "@/pages/admin/AkunAsesi";
import KelolaMUK from "@/pages/admin/KelolaSkema";
import EditAsesor from "@/pages/admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/admin/AkunAsesor";
import VerifikasiPage from "@/pages/admin/verifikasi";
import RegisterPage from "@/pages/admin/register";
import EditAsesi from "@/pages/admin/EditAsessi";
import KelolaOkupasi from "@/pages/admin/okupasi/KelolaOkupasi";
import TambahOkupasi from "@/pages/admin/okupasi/TambahOkupasi";
import EditOkupasi from "@/pages/admin/okupasi/EditOkupasi";
import AplZeroTwo from "@/pages/asesi/Apl-02";
import DataSertifikasi from "@/pages/asesi/DataSertifikasi";
import DashboardAsesi from "@/pages/asesi/DashboardAsesi";
import AsessmentAktif from "@/pages/asesi/AsesmentAktif";
import AssassmentMandiri from "@/pages/asesi/AsassmentMandiri";
import AsassmentMandiriDetail from "@/pages/asesi/AssasmentMandiriDetail";
import PersetujuanAsesmenKerahasiaan from "@/pages/asesi/PersetujuanAsesmenKerahasiaan";
import AsessementPilihanGanda from "@/pages/asesi/AsessmentPilihanGanda";

// import LandingPage from "../pages/LandingPage/LandingPage";


import Test from "../pages/LandingPage/Test";
import TambahSkema from "@/pages/admin/TambahSkema";
import KelolaJurusan from "@/pages/admin/kelolaJur";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/KelolaAkunAsesi" element={<KelolaAkunAsesi />} />
				<Route path="/KelolaMUK" element={<KelolaMUK />} />
				<Route path="/editasesor" element={<EditAsesor />} />
				<Route path="/KelolaAkunAsesor" element={<KelolaAkunAsesor />} />
				<Route path="/EditAsessi" element={<EditAsesi />} />
				<Route path="/" element={<KelolaAkunAsesor />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register-asesi" element={<RegisterForm />} />
				<Route path="/apl-01" element={<AplZeroOne />} />
				<Route path="/apl-02" element={<AplZeroTwo />} />
				<Route path="/data-sertifikasi" element={<DataSertifikasi />} />
				<Route path="/tambahskema" element={<TambahSkema />} />
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<TentangLSP />} />
				<Route path="/struktur" element={<StrukturLSP />} />
				<Route path="/pengelola-sdm" element={<PengelolaSDM />} />
				<Route path="/skema" element={<Skema />} />
				<Route path="/tempat-uji" element={<Tempatuji />} />
				<Route path="/asesor" element={<Asesor />} />
				<Route path="/prosedur-pendaftaran" element={<Prosedur />} />
				<Route path="/berita" element={<Berita />} />
				<Route path="/galeri" element={<Galeri />} />
				<Route path="/dokumen" element={<Dokumen />} />
				<Route path="/test" element={<Test />} />
				<Route path="/verifikasi" element={<VerifikasiPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/okupasi" element={<KelolaOkupasi />} />
				<Route path="/tambah-okupasi" element={<TambahOkupasi />} />
				<Route path="/edit-okupasi/:id" element={<EditOkupasi />} />
				<Route path="/verifikasi" element={<VerifikasiPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/dashboard-asesi" element={<DashboardAsesi />} />
				<Route path="/asesmen-aktif-asesi" element={<AsessmentAktif />} />
				<Route path="/asesmen-mandiri" element={<AssassmentMandiri />} />
				<Route
					path="/asesmen-mandiri-detail"
					element={<AsassmentMandiriDetail />}
				/>
				<Route
					path="/persetujuan-asesmen-kerahasiaan"
					element={<PersetujuanAsesmenKerahasiaan />}
				/>
				<Route
					path="/asesmen-pilihan-ganda"
					element={<AsessementPilihanGanda />}
				/>
				<Route path="/asesmen-mandiri-detail" element={<AsassmentMandiriDetail />} />
				<Route path="/persetujuan-asesmen-kerahasiaan" element={<PersetujuanAsesmenKerahasiaan />} />
				<Route path="/asesmen-pilihan-ganda" element={<AsessementPilihanGanda />} />
				<Route path="/kelola-muk" element={<KelolaMUK />} />
				<Route path="/kelola-akun-asesi" element={<KelolaAkunAsesi />} />
				<Route path="/edit-asesor" element={<EditAsesor />} />
				<Route path="/" element={<LandingPage />} />
				<Route path="/kelolaJur" element={<KelolaJurusan />} />
				<Route path="/test" element={<Test />} />
				<Route path="/akun-asesor" element={<KelolaAkunAsesor />} />
			</Routes>
		</BrowserRouter>
	);
}
