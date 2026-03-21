import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
  // Sử dụng resolvePageComponent để hỗ trợ code-splitting và TS tốt hơn
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    // el là HTMLElement, App là Component, props là dữ liệu từ server
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: "#4B5563", // Thanh loading nhỏ ở trên cùng khi chuyển trang
  },
});
