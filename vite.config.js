// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "esnext",
  },
  server: {
    host: "0.0.0.0", // allows access from other devices on the network
  },
});
