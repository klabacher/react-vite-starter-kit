import type { FeatureFlags, DependencyVersions } from '../types/index.js';
import { getTestDependencies } from './testProfiles.js';

// Base dependencies (always included)
export const baseDependencies: Record<string, string> = {
  react: '^18.3.1',
  'react-dom': '^18.3.1',
};

export const baseDevDependencies: Record<string, string> = {
  '@vitejs/plugin-react': '^4.5.2',
  typescript: '~5.8.3',
  '@types/react': '^18.3.20',
  '@types/react-dom': '^18.3.7',
  '@types/node': '^22.15.0',
  vite: 'npm:rolldown-vite@7.2.5',
};

// Testing dependency versions mapping
export const testingDependencyVersions: Record<string, string> = {
  vitest: '^3.1.4',
  jsdom: '^26.1.0',
  '@testing-library/react': '^16.2.0',
  '@testing-library/jest-dom': '^6.6.3',
  '@testing-library/user-event': '^14.6.1',
  '@vitest/coverage-v8': '^3.1.4',
  '@vitest/ui': '^3.1.4',
  'jest-axe': '^9.0.0',
  '@types/jest-axe': '^3.5.9',
};

// Feature-specific dependencies - exported for plugin access
export const featureDependencies: Record<string, Record<string, string>> = {
  tailwindcss: {
    tailwindcss: '^4.1.17',
    '@tailwindcss/vite': '^4.1.17',
  },
  redux: {
    '@reduxjs/toolkit': '^2.11.0',
    'react-redux': '^9.2.0',
  },
  reactRouter: {
    'react-router-dom': '^7.9.6',
  },
  i18n: {
    'react-i18next': '^15.4.1',
    i18next: '^24.2.3',
    'i18next-browser-languagedetector': '^8.0.4',
    'i18next-http-backend': '^3.0.2',
  },
};

// Feature-specific dev dependencies - exported for plugin access
export const featureDevDependencies: Record<string, Record<string, string>> = {
  tailwindcss: {
    autoprefixer: '^10.4.22',
    postcss: '^8.5.6',
  },
  eslint: {
    eslint: '^9.39.1',
    '@eslint/js': '^9.39.1',
    '@typescript-eslint/eslint-plugin': '^8.48.0',
    '@typescript-eslint/parser': '^8.48.0',
    'typescript-eslint': '^8.46.4',
    'eslint-plugin-react-hooks': '^5.2.0',
    'eslint-plugin-react-refresh': '^0.4.20',
    globals: '^16.5.0',
  },
  prettier: {
    prettier: '^3.6.2',
    'eslint-config-prettier': '^10.1.8',
    'eslint-plugin-prettier': '^5.5.4',
  },
  husky: {
    husky: '^9.1.7',
    'lint-staged': '^16.1.0',
  },
  testing: {
    vitest: '^3.1.4',
    jsdom: '^26.1.0',
    '@testing-library/react': '^16.2.0',
    '@testing-library/jest-dom': '^6.6.3',
    '@testing-library/user-event': '^14.6.1',
    '@vitest/coverage-v8': '^3.1.4',
    '@vitest/ui': '^3.1.4',
  },
  reactRouter: {},
};

// Legacy structure for backward compatibility
const featureDependenciesLegacy: Record<
  string,
  { deps?: Record<string, string>; devDeps?: Record<string, string> }
> = {
  tailwindcss: {
    deps: featureDependencies.tailwindcss,
    devDeps: featureDevDependencies.tailwindcss,
  },
  redux: {
    deps: featureDependencies.redux,
  },
  reactRouter: {
    deps: featureDependencies.reactRouter,
  },
  i18n: {
    deps: featureDependencies.i18n,
  },
  eslint: {
    devDeps: featureDevDependencies.eslint,
  },
  prettier: {
    devDeps: featureDevDependencies.prettier,
  },
  husky: {
    devDeps: featureDevDependencies.husky,
  },
};

export function generateDependencies(features: FeatureFlags): DependencyVersions {
  const dependencies: Record<string, string> = { ...baseDependencies };
  const devDependencies: Record<string, string> = { ...baseDevDependencies };

  // Add feature dependencies
  if (features.tailwindcss) {
    Object.assign(dependencies, featureDependenciesLegacy.tailwindcss.deps);
    Object.assign(devDependencies, featureDependenciesLegacy.tailwindcss.devDeps);
  }

  if (features.redux) {
    Object.assign(dependencies, featureDependenciesLegacy.redux.deps);
  }

  if (features.reactRouter) {
    Object.assign(dependencies, featureDependenciesLegacy.reactRouter.deps);
  }

  if (features.i18n) {
    Object.assign(dependencies, featureDependencies.i18n);
  }

  if (features.eslint) {
    Object.assign(devDependencies, featureDependenciesLegacy.eslint.devDeps);
  }

  if (features.prettier) {
    Object.assign(devDependencies, featureDependenciesLegacy.prettier.devDeps);
  }

  if (features.husky) {
    Object.assign(devDependencies, featureDependenciesLegacy.husky.devDeps);
  }

  // Add testing dependencies based on profile
  if (features.testing) {
    const testProfile = features.testProfile || 'standard';
    const testDeps = getTestDependencies(testProfile);

    // Add each testing dependency with its version
    for (const dep of testDeps) {
      if (testingDependencyVersions[dep]) {
        devDependencies[dep] = testingDependencyVersions[dep];
      }
    }
  }

  return { dependencies, devDependencies };
}

export function generateScripts(features: FeatureFlags): Record<string, string> {
  const scripts: Record<string, string> = {
    dev: 'vite',
    build: 'tsc -b && vite build',
    preview: 'vite preview',
  };

  if (features.eslint) {
    scripts.lint = 'eslint . --ext .ts,.tsx --max-warnings=0';
    scripts['lint:fix'] = 'eslint . --ext .ts,.tsx --fix';
  }

  if (features.prettier) {
    scripts.format = "prettier --write 'src/**/*.{ts,tsx,css,md}'";
    scripts['format:check'] = "prettier --check 'src/**/*.{ts,tsx,css,md}'";
  }

  if (features.husky) {
    scripts.prepare = 'husky';
  }

  if (features.testing) {
    scripts.test = 'vitest run';
    scripts['test:watch'] = 'vitest';
    scripts['test:ui'] = 'vitest --ui';
    scripts['test:coverage'] = 'vitest run --coverage';
  }

  return scripts;
}
