import type { FeatureFlags, DependencyVersions } from '../types/index.js';

// Base dependencies (always included)
const baseDependencies: Record<string, string> = {
  react: '^18.3.1',
  'react-dom': '^18.3.1',
};

const baseDevDependencies: Record<string, string> = {
  '@vitejs/plugin-react': '^4.5.2',
  typescript: '~5.8.3',
  '@types/react': '^18.3.20',
  '@types/react-dom': '^18.3.7',
  '@types/node': '^22.15.0',
  vite: 'npm:rolldown-vite@7.2.5',
};

// Feature-specific dependencies
const featureDependencies: Record<
  string,
  { deps?: Record<string, string>; devDeps?: Record<string, string> }
> = {
  tailwindcss: {
    deps: {
      tailwindcss: '^4.1.17',
      '@tailwindcss/vite': '^4.1.17',
    },
    devDeps: {
      autoprefixer: '^10.4.22',
      postcss: '^8.5.6',
    },
  },
  redux: {
    deps: {
      '@reduxjs/toolkit': '^2.11.0',
      'react-redux': '^9.2.0',
    },
  },
  reactRouter: {
    deps: {
      'react-router-dom': '^7.9.6',
    },
  },
  eslint: {
    devDeps: {
      eslint: '^9.39.1',
      '@eslint/js': '^9.39.1',
      '@typescript-eslint/eslint-plugin': '^8.48.0',
      '@typescript-eslint/parser': '^8.48.0',
      'typescript-eslint': '^8.46.4',
      'eslint-plugin-react-hooks': '^5.2.0',
      'eslint-plugin-react-refresh': '^0.4.20',
      globals: '^16.5.0',
    },
  },
  prettier: {
    devDeps: {
      prettier: '^3.6.2',
      'eslint-config-prettier': '^10.1.8',
      'eslint-plugin-prettier': '^5.5.4',
    },
  },
  husky: {
    devDeps: {
      husky: '^9.1.7',
      'lint-staged': '^16.1.0',
    },
  },
  testing: {
    devDeps: {
      vitest: '^3.1.4',
      '@vitest/coverage-v8': '^3.1.4',
      '@vitest/ui': '^3.1.4',
      '@testing-library/react': '^16.2.0',
      '@testing-library/jest-dom': '^6.6.3',
      '@testing-library/user-event': '^14.6.1',
      jsdom: '^26.1.0',
    },
  },
};

export function generateDependencies(features: FeatureFlags): DependencyVersions {
  const dependencies: Record<string, string> = { ...baseDependencies };
  const devDependencies: Record<string, string> = { ...baseDevDependencies };

  // Add feature dependencies
  if (features.tailwindcss) {
    Object.assign(dependencies, featureDependencies.tailwindcss.deps);
    Object.assign(devDependencies, featureDependencies.tailwindcss.devDeps);
  }

  if (features.redux) {
    Object.assign(dependencies, featureDependencies.redux.deps);
  }

  if (features.reactRouter) {
    Object.assign(dependencies, featureDependencies.reactRouter.deps);
  }

  if (features.eslint) {
    Object.assign(devDependencies, featureDependencies.eslint.devDeps);
  }

  if (features.prettier) {
    Object.assign(devDependencies, featureDependencies.prettier.devDeps);
  }

  if (features.husky) {
    Object.assign(devDependencies, featureDependencies.husky.devDeps);
  }

  if (features.testing) {
    Object.assign(devDependencies, featureDependencies.testing.devDeps);
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
