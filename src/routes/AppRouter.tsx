import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import LandingPage from "../pages/LandingPage/LandingPage";
import TentangLSP from "../pages/LandingPage/TentangLSP";
import Sidebar from "../components/SideAdmin";
import Test from "../pages/LandingPage/Test";
import VerifikasiPage from "../pages/admin/verifikasi";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<TentangLSP />} />
				<Route path="/test" element={<Test />} />
				<Route path="/verifikasi" element={<VerifikasiPage/>} />
			</Routes>
		</BrowserRouter>
	);
}
