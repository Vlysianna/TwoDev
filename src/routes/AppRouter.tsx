import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import KelolaAkunAsesor from "@/pages/Admin/AkunAsesor";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/akun-asesor" element={<KelolaAkunAsesor />} />
			</Routes>
		</BrowserRouter>
	);
}
