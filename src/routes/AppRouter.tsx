import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import Dashboard from "@/pages/Admin/DashboardAdmin";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}