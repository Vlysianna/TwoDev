import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import Dashboard from "@/pages/home/admin/dashboardAdmin";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}
