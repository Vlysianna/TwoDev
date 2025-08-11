import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import Dashboard from "../pages/Asesor/dashboard";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/dashboard-asesor" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}	