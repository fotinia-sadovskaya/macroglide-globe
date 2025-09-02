import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/macrogilde_globe/", // 👈 Це ключовий рядок!
  plugins: [react()],
});
