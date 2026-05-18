import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { configureEcho } from "@laravel/echo-react";
import Echo from "laravel-echo";

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
		const broadcastConfig = (props.initialPage.props as any).broadcast_config;

		if (broadcastConfig && broadcastConfig.driver === "reverb") {
			configureEcho({
				broadcaster: "reverb",
			});

			window.Echo = new Echo({
				broadcaster: "reverb",
				key: broadcastConfig.key,
				wsHost: broadcastConfig.host,
				wsPort: 443,
				forceTLS: false,
				enabledTransports: ["ws"],
			});
		}

		createRoot(el).render(<App {...props} />);
	},
	progress: {
		color: "#4B5563",
	},
});
