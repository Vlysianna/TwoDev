import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import AsesmenMandiri from "../pages/Asesor/AsesmenMandiri";
import PersetujuanKerahasiaan from "../pages/Asesor/PersetujuanKerahasiaan";
import LembarJawaban from "../pages/Asesor/LembarJawaban";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/asesmen-mandiri" element={<AsesmenMandiri />} />
				<Route path="/persetujuan-kerahasiaan" element={<PersetujuanKerahasiaan />} />
				<Route path="/lembar-jawaban" element={<LembarJawaban />} />
			</Routes>
		</BrowserRouter>
	);
}	