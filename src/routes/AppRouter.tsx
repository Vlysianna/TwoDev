import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}
