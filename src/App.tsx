import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Sidebar from "./components/SideAdmin";
import NavLanding from "./components/NavAdmin";
import AppRouter from "./routes/AppRouter";
import FootLanding from "./components/FootLanding";
import SideAsesor from "./components/SideAsesor";
import VerifikasiPage from "./pages/Admin/Verifikasi";
import RegisterPage from "./pages/Admin/Register";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<AppRouter />
			<div className="relative min-h-screen">
				{/* <NavLanding />   */}
				<main>
					<SideAsesor />
				</main>
				{/* <FootLanding /> */}
			</div>
		</>
	);
}

export default App;
