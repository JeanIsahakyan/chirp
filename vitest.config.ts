import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@aspect/core': resolve(__dirname, 'packages/core/src'),
      '@aspect/web': resolve(__dirname, 'packages/web/src'),
      '@aspect/react-native': resolve(__dirname, 'packages/react-native/src'),
      '@aspect/react-native-web': resolve(__dirname, 'packages/react-native-web/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/src/**/*.test.{ts,tsx}', 'packages/**/tests/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/examples/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/**/src/**/*.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
        '**/*.d.ts',
      ],
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
