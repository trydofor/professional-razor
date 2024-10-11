import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // https://github.com/marketplace/actions/vitest-coverage-report
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      include: [
        '**/components/**',
        '**/composables/**',
        '**/utils/**',
      ],
    },
  },
});
