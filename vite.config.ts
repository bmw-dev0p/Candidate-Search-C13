import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  envDir: './environment',
  plugins: [react()],
  //added server config for render
  server: {
    port: 3000,
    open: true,
  },
});
