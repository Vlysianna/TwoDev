import { BrowserRouter, Route, Routes } from "react-router";
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";
import KelolaMUK from "@/pages/Admin/KelolaSkema";
import EditAsesor from "@/pages/home/Admin/EditAsesor";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<KelolaAkunAsesi />} />
				<Route path="/b" element={<KelolaMUK />} />
				<Route path="/" element={<EditAsesor />} />
			</Routes>
		</BrowserRouter>
	);
}
