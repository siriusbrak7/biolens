import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // This makes process.env.API_KEY available in the browser
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  }
})