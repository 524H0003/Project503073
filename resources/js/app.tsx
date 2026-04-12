import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = "Efficia Note";

createInertiaApp({
	title: (title) => (title ? `${title} - ${appName}` : appName),
	resolve: async (name: string) => {
		const pages = import.meta.glob("./Pages/**/*.tsx");

		let path = `./Pages/${name}.tsx`;

		if (!pages[path]) {
			path = `./Pages/${name}/Index.tsx`;
		}

		return resolvePageComponent(path, pages);
	},
	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
	progress: {
		color: "#4B5563",
	},
});
