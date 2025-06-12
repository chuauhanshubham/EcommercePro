import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Use async function to allow dynamic imports safely
export default async () => {
  // Optional Replit plugin
  const isReplit = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;
  const replitPlugins = isReplit
    ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
    : [];

  return defineConfig({
    root: path.resolve(import.meta.dirname, "client"),
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...replitPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  });
};
