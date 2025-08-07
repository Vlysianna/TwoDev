import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import EditAsesor from "@/pages/home/Admin/EditAsesor";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<EditAsesor />} />
			</Routes>
		</BrowserRouter>
	);
}
