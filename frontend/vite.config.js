import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginEnvCompatible from 'vite-plugin-env-compatible';

// https://vite.dev/config/
export default defineConfig({
  envPrefix: "REACT_APP_",
  build: {
    rollupOptions: {
      external: ['jspdf'], // Add jspdf to external to prevent build errors
    },
  },
  plugins: [react(),
    vitePluginEnvCompatible(),
  ],
})
