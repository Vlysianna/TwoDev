import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import LandingPage from "../pages/LandingPage/LandingPage";
import TentangLSP from "../pages/LandingPage/TentangLSP";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/" element={<LandingPage />} />
				<Route path="/about" element={<TentangLSP />} />
			</Routes>
		</BrowserRouter>
	);
}
