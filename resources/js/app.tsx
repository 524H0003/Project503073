import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { configureEcho } from "@laravel/echo-react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

configureEcho({
	broadcaster: "reverb",
});

window.Pusher = Pusher as any;

window.Echo = new Echo({
	broadcaster: "reverb",
	key: import.meta.env.VITE_REVERB_APP_KEY,
	wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
	wsPort: import.meta.env.VITE_REVERB_PORT
		? Number(import.meta.env.VITE_REVERB_PORT)
		: 8080,
	wssPort: import.meta.env.VITE_REVERB_PORT
		? Number(import.meta.env.VITE_REVERB_PORT)
		: 8080,

	forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",

	enabledTransports: ["ws", "wss"],
});

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
