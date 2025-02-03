import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from external devices
    port: 5173,      // Optional: You can specify a different port if needed
  },
  build: {
    outDir: 'dist', // Output directory for build files
  },
  base: '/', // Base path for deployment at the root of the server
})
