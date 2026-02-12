import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    watch: {
      // Ignore certain file patterns to prevent excessive reloads
      ignored: ['**/node_modules/**', '**/.git/**', '**/logs/**']
    }
  },
  optimizeDeps: {
    // Optimize dependencies to reduce file watching overhead
    include: ['react', 'react-dom']
  }
})
