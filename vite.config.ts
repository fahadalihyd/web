import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Project site: https://fahadalihyd.github.io/web/
  base: command === 'build' ? '/web/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
}))
