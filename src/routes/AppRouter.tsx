import { BrowserRouter, Route, Routes } from "react-router";
import Hasil from "@/pages/asesor/Hasil";
export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Hasil />} />
			</Routes>
		</BrowserRouter>
	);
}
