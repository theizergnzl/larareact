import "./bootstrap";
import "../css/app.css";
import { ThemeProvider } from "@/Components/theme-provider";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App {...props} />
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    );
  },
  progress: {
    color: "#4B5563",
  },
});

