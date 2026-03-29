import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_SHORT_NAME,
          start_url: "/",
          display: "standalone",
          background_color: "#0f172a",
          theme_color: "#6366f1",
          orientation: "portrait",
          icons: [
            {
              src: "/icons/logo.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/logo.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
