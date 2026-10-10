import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/admin/',
  server: {
    port: 5173,
    proxy: {
      // gate-mgt has no CORS policy of its own beyond the dev-origin allowlist added to
      // CorsConfig, so this proxy keeps the browser from ever seeing a cross-origin request.
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://169.58.150.148:8087',
        changeOrigin: true,
      },
    },
  },
})
