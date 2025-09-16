import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: '/twodev-fe/',  // <- Set base path untuk subfolder
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// Pastikan public assets dihandle dengan benar
	publicDir: 'public',
});
