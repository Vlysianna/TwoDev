import { BrowserRouter, Route, Routes } from "react-router";
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";
import KelolaMUK from "@/pages/Admin/KelolaSkema";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<KelolaAkunAsesi />} />
				<Route path="/b" element={<KelolaMUK />} />
			</Routes>
		</BrowserRouter>
	);
}
