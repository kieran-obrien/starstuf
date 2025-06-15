import { defineConfig } from "vite";

export default defineConfig({
  base: "/starstuf/",
  build: {
    target: "esnext",
  },
  esbuild: {
    target: "esnext",
  },
  server: {
    host: "0.0.0.0",
  },
});
