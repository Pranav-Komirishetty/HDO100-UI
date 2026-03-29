import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_SHORT_NAME,
          display: "standalone",
          theme_color: "#6366f1"
        }
      }),
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});