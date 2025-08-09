import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import EditAsessi from "@/pages/Admin/EditAsessi";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/edit-asessi" element={<EditAsessi />} />
			</Routes>
		</BrowserRouter>
	);
}
