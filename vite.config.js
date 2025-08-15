import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This rule says: if a request starts with "/api",
      // send it to the backend server at "http://localhost:5000"
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})