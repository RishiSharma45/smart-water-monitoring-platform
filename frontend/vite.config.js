import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/users": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/api/tanks": {
        target: "http://localhost:3001",
        changeOrigin: true
      },
      "/api/alerts": {
        target: "http://localhost:3002",
        changeOrigin: true
      },
      "/health/user": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: () => "/health/ready"
      },
      "/health/tank": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: () => "/health/ready"
      },
      "/health/notification": {
        target: "http://localhost:3002",
        changeOrigin: true,
        rewrite: () => "/health/ready"
      }
    }
  }
});
