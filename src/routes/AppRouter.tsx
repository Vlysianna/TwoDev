import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import KelolaJurusan from "../pages/admin/kelolaJur";


// import LandingPage from "../pages/LandingPage/LandingPage";


import Test from "../pages/LandingPage/Test";

import AssessmentRecord from "../pages/assesi/AssessmentRecord";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				{/* <Route path="/" element={<LandingPage />} /> */}
				<Route path="/kelolaJur" element={<KelolaJurusan />} />
				<Route path="/test" element={<Test />} />
				<Route path="/assesi/assessment-record" element={<AssessmentRecord />} />
			</Routes>
		</BrowserRouter>
	);
}
