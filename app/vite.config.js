import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // El catálogo de roles vive en ../roles (lo comparten la app y el motor)
  server: { fs: { allow: ['..'] } },
})
