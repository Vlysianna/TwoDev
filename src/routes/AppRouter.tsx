import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import FRAK05 from "../pages/home/FRAK05";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/FRAK05" element={<FRAK05/>} />
		
			</Routes>
		</BrowserRouter>
	);
}
