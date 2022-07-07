import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin('all', {prefix: 'REACT_APP_'}),
    tsconfigPaths(),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
