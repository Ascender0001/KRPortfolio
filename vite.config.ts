import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // three.js lives in its own lazily loaded chunk (~130 kB gzipped); that size is expected.
  build: { chunkSizeWarningLimit: 600 },
  plugins: [react()],
})
