import { defineConfig } from 'vite'
import path from "path" 
import react from '@vitejs/plugin-react'
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {},
    host: true, 
    port: 5173,
    strictPort: true,
  },

  // Pre-bundling optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },

  logLevel: 'info',
}
)
