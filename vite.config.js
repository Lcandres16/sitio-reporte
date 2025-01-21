import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "assets/*",
          "public/*",
        ],
        name: "Reportes",
        short_name: "Reports",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/Logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/Logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
});
