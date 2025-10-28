import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/frontend/setupTests.js'],
    include: ['tests/frontend/**/*.test.{js,jsx,ts,tsx}'],
    globals: true,
    coverage: {
      provider: 'istanbul',
    },
  },
});
