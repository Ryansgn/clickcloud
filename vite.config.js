import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Click Cloud",
        short_name: "Edutainment",
        description: "Um jogo educativo sobre Computação em Nuvem",
        theme_color: "#0b1440",
        background_color: "#142B6F",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "icon192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});