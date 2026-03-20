import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "100 Days Challenge",
        short_name: "100Days",
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
});


