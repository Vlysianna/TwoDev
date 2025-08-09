import { BrowserRouter, Route, Routes } from "react-router";
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";
import KelolaMUK from "@/pages/Admin/KelolaSkema";
import EditAsesor from "@/pages/home/Admin/EditAsesor";
import KelolaAkunAsesor from "@/pages/home/Admin/AkunAsesor";
import EditAsessi from "@/pages/home/Admin/EditAsessi";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/KelolaAkunAsesi" element={<KelolaAkunAsesi />} />
				<Route path="/KelolaMUK" element={<KelolaMUK />} />
				<Route path="/editasesor" element={<EditAsesor />} />
				<Route path="/KelolaAkunAsesor" element={<KelolaAkunAsesor />} />
				<Route path="/EditAsessi" element={<EditAsessi />} />
			</Routes>
		</BrowserRouter>
	);
}
