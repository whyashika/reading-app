import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { APP_NAME, APP_SHORT_NAME, APP_TAGLINE } from "./src/config";

/** Builds the PWA manifest and page title from src/config.ts, so the app name lives in one place. */
function appIdentity(): Plugin {
  const manifest = JSON.stringify(
    {
      name: APP_NAME,
      short_name: APP_SHORT_NAME,
      description: APP_TAGLINE,
      start_url: "./",
      scope: "./",
      display: "standalone",
      orientation: "portrait",
      background_color: "#F7F1E6",
      theme_color: "#F7F1E6",
      icons: [
        { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2,
  );
  return {
    name: "app-identity",
    transformIndexHtml: (html) =>
      html.replace(/%APP_NAME%/g, APP_NAME).replace(/%APP_TAGLINE%/g, APP_TAGLINE),
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith("/manifest.webmanifest")) {
          res.setHeader("Content-Type", "application/manifest+json");
          res.end(manifest);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "manifest.webmanifest", source: manifest });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), appIdentity()],
});
