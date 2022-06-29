import {defineConfig} from 'vitest/config';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [EnvironmentPlugin('all', {prefix: 'REACT_APP_'})],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
