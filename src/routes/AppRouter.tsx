import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import LoginForm from "../pages/login/Login";
import RegisterForm from "../pages/register/Register";
import AplZeroOne from "../pages/apl-01/Apl-01";
import LspMediaForm from "../pages/apl-01/LspMedia";
import TambahSkema from "../pages/admin/TambahSkema";
import LandingPage from "../pages/LandingPage/LandingPage";
import TentangLSP from "../pages/LandingPage/TentangLSP";
import Sidebar from "../components/SideAdmin";
import Test from "../pages/LandingPage/Test";
import StrukturLSP from "../pages/LandingPage/StrukturLSP";
import Skema from "../pages/LandingPage/Skema";
import Tempatuji from "../pages/LandingPage/Tempatuji";
import Asesor from "../pages/LandingPage/Asesor";
import Prosedur from "../pages/LandingPage/Prosedur";
import Berita from "../pages/LandingPage/Berita";
import Galeri from "../pages/LandingPage/Galeri";
import Dokumen from "../pages/LandingPage/Dokumen";
import PengelolaSDM from "../pages/LandingPage/PengelolaSDM";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
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
			</Routes>
		</BrowserRouter>
	);
}
