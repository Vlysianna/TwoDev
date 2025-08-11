import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import Hasil from "@/pages/asesor/Hasil";
import AssessmentRecord from "@/pages/assesi/AssessmentRecord";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<Hasil />} />
				<Route path="/aa" element={<AssessmentRecord />} />
			</Routes>
		</BrowserRouter>
	);
}
