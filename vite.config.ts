import {defineConfig, UserConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({command}) => {
  const generalCfg: UserConfig = {
    publicDir: false,
    base: '/',
    envPrefix: 'REACT_APP_',
    plugins: [react()],
  };
  if (command === 'serve') {
    return {
      ...generalCfg,
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: false,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
    };
  }
  return {
    ...generalCfg,
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              '/node_modules/@tanstack/react-location',
              'react-query',
            ],
          },
        },
      },
    },
  };
});
