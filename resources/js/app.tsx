import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { TooltipProvider } from "./components/ui/tooltip.js";
import { AppSidebar } from "./components/appsidebar.js";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar.js";

createInertiaApp({
  resolve: (name: string) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    createRoot(el).render(
      <TooltipProvider>
        <SidebarProvider defaultOpen>
          <AppSidebar />
          <SidebarInset>
            <SidebarTrigger></SidebarTrigger>
            <App {...props} />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>,
    );
  },
  progress: {
    color: "#4B5563",
  },
});
