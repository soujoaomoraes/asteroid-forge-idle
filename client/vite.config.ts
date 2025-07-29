import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    hmr: {
      overlay: false // Desabilitar overlay de erros HMR
    }
  }
}) 