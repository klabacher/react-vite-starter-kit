import { TestProfile, TestProfileConfig } from '../types/index.js';

/**
 * Test profile configurations defining what tests to include
 * and coverage thresholds for each profile level
 */
export const testProfiles: Record<TestProfile, TestProfileConfig> = {
  bare: {
    name: 'Bare (Mínimo)',
    description: 'Apenas configuração básica do Vitest sem testes',
    coverageThreshold: 0,
    includeTests: {
      unit: false,
      integration: false,
      a11y: false,
      performance: false,
      snapshot: false,
    },
    dependencies: ['vitest', 'jsdom', '@testing-library/react', '@testing-library/jest-dom'],
  },

  minimum: {
    name: 'Minimum (Básico)',
    description: 'Testes unitários básicos com 50% de cobertura',
    coverageThreshold: 50,
    includeTests: {
      unit: true,
      integration: false,
      a11y: false,
      performance: false,
      snapshot: true,
    },
    dependencies: [
      'vitest',
      'jsdom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@vitest/coverage-v8',
    ],
  },

  standard: {
    name: 'Standard (Padrão)',
    description: 'Testes unitários e de integração com 70% de cobertura',
    coverageThreshold: 70,
    includeTests: {
      unit: true,
      integration: true,
      a11y: false,
      performance: false,
      snapshot: true,
    },
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
    name: 'Advanced (Avançado)',
    description: 'Testes completos com acessibilidade e 80% de cobertura',
    coverageThreshold: 80,
    includeTests: {
      unit: true,
      integration: true,
      a11y: true,
      performance: false,
      snapshot: true,
    },
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
    name: 'Complete (Completo)',
    description: 'Todos os tipos de testes com 90%+ de cobertura',
    coverageThreshold: 90,
    includeTests: {
      unit: true,
      integration: true,
      a11y: true,
      performance: true,
      snapshot: true,
    },
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
  return testProfiles[profile].coverageThreshold;
}
