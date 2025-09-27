import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'examples/',
        '.eslintrc.js',
        'src/types/hook-inputs.ts', // Only contains interfaces/types
        'src/types/index.ts', // Only re-exports
      ],
      thresholds: {
        statements: 90,
        branches: 95,
        functions: 95,
        lines: 90,
      },
    },
  },
});
