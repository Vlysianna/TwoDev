import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import KelolaAkunAsesi from "@/pages/Admin/KelolaSkema";
import KelolaMUK from "@/pages/Admin/KelolaSkema";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<KelolaMUK />} />
			</Routes>
		</BrowserRouter>
	);
}
