import type { TestProfile, TestProfileConfig } from '../types/index.js';

/**
 * Test profile configurations defining what tests to include
 * and coverage thresholds for each profile level
 */
export const testProfiles: Record<TestProfile, TestProfileConfig> = {
  bare: {
    name: 'Bare',
    description: 'Basic Vitest setup without tests',
    coverage: 0,
    testTypes: [],
    dependencies: ['vitest', 'jsdom', '@testing-library/react', '@testing-library/jest-dom'],
  },

  minimum: {
    name: 'Minimum',
    description: 'Basic unit tests with 50% coverage',
    coverage: 50,
    testTypes: ['unit', 'snapshot'],
    dependencies: [
      'vitest',
      'jsdom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@vitest/coverage-v8',
    ],
  },

  standard: {
    name: 'Standard',
    description: 'Unit and integration tests with 70% coverage',
    coverage: 70,
    testTypes: ['unit', 'integration', 'snapshot', 'redux', 'router', 'i18n'],
    dependencies: [
      'vitest',
      'jsdom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
      '@vitest/coverage-v8',
    ],
  },

  advanced: {
    name: 'Advanced',
    description: 'Complete tests with accessibility and 80% coverage',
    coverage: 80,
    testTypes: [
      'unit',
      'integration',
      'accessibility',
      'snapshot',
      'redux',
      'router',
      'i18n',
      'tailwind',
    ],
    dependencies: [
      'vitest',
      'jsdom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
      '@vitest/coverage-v8',
      '@vitest/ui',
      'jest-axe',
      '@types/jest-axe',
    ],
  },

  complete: {
    name: 'Complete',
    description: 'All test types with 90%+ coverage',
    coverage: 90,
    testTypes: [
      'unit',
      'integration',
      'accessibility',
      'performance',
      'snapshot',
      'redux',
      'router',
      'i18n',
      'tailwind',
    ],
    dependencies: [
      'vitest',
      'jsdom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
      '@vitest/coverage-v8',
      '@vitest/ui',
      'jest-axe',
      '@types/jest-axe',
    ],
  },
};

/**
 * Get test profile configuration by name
 */
export function getTestProfile(profile: TestProfile): TestProfileConfig {
  return testProfiles[profile];
}

/**
 * Get all available test profiles for selection
 */
export function getAvailableProfiles(): Array<{
  value: TestProfile;
  label: string;
  description: string;
}> {
  return Object.entries(testProfiles).map(([key, config]) => ({
    value: key as TestProfile,
    label: config.name,
    description: config.description,
  }));
}

/**
 * Get dependencies for a test profile
 */
export function getTestDependencies(profile: TestProfile): string[] {
  return testProfiles[profile].dependencies;
}

/**
 * Get coverage threshold for a test profile
 */
export function getCoverageThreshold(profile: TestProfile): number {
  return testProfiles[profile].coverage;
}
