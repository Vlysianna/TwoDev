import { BrowserRouter, Route, Routes } from "react-router";
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";
import KelolaMUK from "@/pages/Admin/KelolaSkema";
import EditAsesor from "@/pages/Admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/Admin/AkunAsesor";
import EditAsessi from "@/pages/Admin/EditAsessi";
import Skema from "@/pages/LandingPage/Skema";
import StrukturLSP from "@/pages/LandingPage/StrukturLSP";
import PengelolaSDM from "@/pages/LandingPage/PengelolaSDM";
import Tempatuji from "@/pages/LandingPage/Tempatuji";
import Asesor from "@/pages/LandingPage/Asesor";
import Prosedur from "@/pages/LandingPage/Prosedur";
import Berita from "@/pages/LandingPage/Berita";
import Galeri from "@/pages/LandingPage/Galeri";
import Dokumen from "@/pages/LandingPage/Dokumen";
import TambahSkema from "@/pages/Admin/TambahSkema";
import LoginForm from "@/pages/login/Login";
import RegisterForm from "@/pages/register/Register";
import AplZeroOne from "@/pages/apl-01/Apl-01";
import LspMediaForm from "@/pages/apl-01/LspMedia";
import LandingPage from "@/pages/LandingPage/LandingPage";
import TentangLSP from "@/pages/LandingPage/TentangLSP";
import Test from "@/pages/LandingPage/Test";
import VerifikasiPage from "@/pages/Admin/Verifikasi";
import RegisterPage from "@/pages/Admin/Register";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/KelolaAkunAsesi" element={<KelolaAkunAsesi />} />
				<Route path="/KelolaMUK" element={<KelolaMUK />} />
				<Route path="/editasesor" element={<EditAsesor />} />
				<Route path="/KelolaAkunAsesor" element={<KelolaAkunAsesor />} />
				<Route path="/EditAsessi" element={<EditAsessi />} />
				<Route path="/" element={<KelolaAkunAsesor />} />
				<Route path="/b" element={<EditAsessi />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/registerAsesi" element={<RegisterForm />} />
				<Route path="/apl-01" element={<AplZeroOne />} />
				<Route path="/lspmedia" element={<LspMediaForm />} />
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
			</Routes>
		</BrowserRouter>
	);
}
