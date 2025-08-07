import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import KelolaAkunAsesi from "@/pages/Admin/AkunAsesi";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<KelolaAkunAsesi />} />
			</Routes>
		</BrowserRouter>
	);
}
