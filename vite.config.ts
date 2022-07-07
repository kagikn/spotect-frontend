import {defineConfig, UserConfig} from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({command}) => {
  const generalCfg: UserConfig = {
    base: '/',
    envPrefix: 'REACT_APP_',
    plugins: [
      react(),
      EnvironmentPlugin('all', {prefix: 'REACT_APP_'}),
      tsconfigPaths(),
    ],
  };
  if (command === 'serve') {
    return {
      ...generalCfg,
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
