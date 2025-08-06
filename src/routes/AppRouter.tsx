import { BrowserRouter, Route, Routes } from "react-router";
import Home from "../pages/home/tes";
import LoginForm from "../pages/login/Login";
import RegisterForm from "../pages/register/Register";
import AplZeroOne from "../pages/apl-01/Apl-01";
import LspMediaForm from "../pages/apl-01/LspMedia";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/a" element={<Home />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
				<Route path="/apl-01" element={<AplZeroOne />} />
				<Route path="/lspmedia" element={<LspMediaForm />} />
			</Routes>
		</BrowserRouter>
	);
}
