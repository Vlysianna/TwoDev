import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ToastProvider } from "./components/ui/Toast";

// By TwoDev
console.log("APP BY TWODEV");
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</AuthProvider>
	</StrictMode>
);
