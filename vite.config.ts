import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		laravel({
			input: "resources/js/app.tsx",
			refresh: true,
		}),
		react(),
		tailwindcss(),
	],
	server: {
		host: "127.0.0.1",
		watch: {
			usePolling: true,
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./resources/js"),
			"ziggy-js": resolve("vendor/tightenco/ziggy"),
		},
	},
});
