import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import KelolaAkunAsesor from "@/pages/home/Admin/AkunAsesor";
import EditAsessi from "@/pages/home/Admin/EditAsessi";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<KelolaAkunAsesor />} />
				<Route path="/b" element={<EditAsessi />} />
			</Routes>
		</BrowserRouter>
	);
}
