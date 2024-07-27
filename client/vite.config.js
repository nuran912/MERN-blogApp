import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  //any time the an address has /api , we weill target this
        secure: false,  //cuz we're using http and not https
      },
    },
  },
  plugins: [react()],
})
