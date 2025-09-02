import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/macroglide-globe/", // ← назва репозиторію на GitHub
  plugins: [react()],
});

