import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Dirname is:", path.resolve(__dirname, "./src"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // No trailing slash here
    },
  },
});
