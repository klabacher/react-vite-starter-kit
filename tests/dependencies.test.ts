/**
 * Tests for dependency generation logic
 */
import { describe, it, expect } from 'vitest';
import { generateDependencies, generateScripts } from '../src/config/dependencies';
import type { FeatureFlags } from '../src/types/index';

// Helper to create feature flags with specific features enabled
function createFeatures(overrides: Partial<FeatureFlags> = {}): FeatureFlags {
  return {
    typescript: true,
    tailwindcss: false,
    redux: false,
    reactRouter: false,
    eslint: false,
    prettier: false,
    husky: false,
    githubActions: false,
    vscode: false,
    testing: false,
    ...overrides,
  };
}

describe('generateDependencies', () => {
  it('should always include base dependencies', () => {
    const { dependencies } = generateDependencies(createFeatures());

    expect(dependencies).toHaveProperty('react');
    expect(dependencies).toHaveProperty('react-dom');
  });

  it('should always include base dev dependencies', () => {
    const { devDependencies } = generateDependencies(createFeatures());

    expect(devDependencies).toHaveProperty('@vitejs/plugin-react');
    expect(devDependencies).toHaveProperty('typescript');
    expect(devDependencies).toHaveProperty('@types/react');
    expect(devDependencies).toHaveProperty('@types/react-dom');
    expect(devDependencies).toHaveProperty('vite');
  });

  describe('with tailwindcss', () => {
    it('should include tailwindcss dependencies', () => {
      const { dependencies, devDependencies } = generateDependencies(
        createFeatures({ tailwindcss: true })
      );

      expect(dependencies).toHaveProperty('tailwindcss');
      expect(dependencies).toHaveProperty('@tailwindcss/vite');
      expect(devDependencies).toHaveProperty('autoprefixer');
      expect(devDependencies).toHaveProperty('postcss');
    });
  });

  describe('with redux', () => {
    it('should include redux dependencies', () => {
      const { dependencies } = generateDependencies(createFeatures({ redux: true }));

      expect(dependencies).toHaveProperty('@reduxjs/toolkit');
      expect(dependencies).toHaveProperty('react-redux');
    });
  });

  describe('with reactRouter', () => {
    it('should include react-router-dom dependency', () => {
      const { dependencies } = generateDependencies(createFeatures({ reactRouter: true }));

      expect(dependencies).toHaveProperty('react-router-dom');
    });
  });

  describe('with eslint', () => {
    it('should include eslint dev dependencies', () => {
      const { devDependencies } = generateDependencies(createFeatures({ eslint: true }));

      expect(devDependencies).toHaveProperty('eslint');
      expect(devDependencies).toHaveProperty('@eslint/js');
      expect(devDependencies).toHaveProperty('typescript-eslint');
      expect(devDependencies).toHaveProperty('eslint-plugin-react-hooks');
      expect(devDependencies).toHaveProperty('eslint-plugin-react-refresh');
    });
  });

  describe('with prettier', () => {
    it('should include prettier dev dependencies', () => {
      const { devDependencies } = generateDependencies(createFeatures({ prettier: true }));

      expect(devDependencies).toHaveProperty('prettier');
      expect(devDependencies).toHaveProperty('eslint-config-prettier');
      expect(devDependencies).toHaveProperty('eslint-plugin-prettier');
    });
  });

  describe('with husky', () => {
    it('should include husky dev dependencies', () => {
      const { devDependencies } = generateDependencies(createFeatures({ husky: true }));

      expect(devDependencies).toHaveProperty('husky');
      expect(devDependencies).toHaveProperty('lint-staged');
    });
  });

  describe('with testing', () => {
    it('should include vitest and testing library dependencies', () => {
      // With standard profile (default), @vitest/ui is not included
      const { devDependencies } = generateDependencies(createFeatures({ testing: true }));

      expect(devDependencies).toHaveProperty('vitest');
      expect(devDependencies).toHaveProperty('@vitest/coverage-v8');
      expect(devDependencies).toHaveProperty('@testing-library/react');
      expect(devDependencies).toHaveProperty('@testing-library/jest-dom');
      expect(devDependencies).toHaveProperty('@testing-library/user-event');
      expect(devDependencies).toHaveProperty('jsdom');
    });

    it('should include @vitest/ui with advanced profile', () => {
      const { devDependencies } = generateDependencies(
        createFeatures({ testing: true, testProfile: 'advanced' })
      );

      expect(devDependencies).toHaveProperty('@vitest/ui');
      expect(devDependencies).toHaveProperty('jest-axe');
    });

    it('should include minimal dependencies with bare profile', () => {
      const { devDependencies } = generateDependencies(
        createFeatures({ testing: true, testProfile: 'bare' })
      );

      expect(devDependencies).toHaveProperty('vitest');
      expect(devDependencies).toHaveProperty('jsdom');
      expect(devDependencies).toHaveProperty('@testing-library/react');
      expect(devDependencies).toHaveProperty('@testing-library/jest-dom');
      // Should not have coverage or ui in bare profile
      expect(devDependencies).not.toHaveProperty('@vitest/coverage-v8');
      expect(devDependencies).not.toHaveProperty('@vitest/ui');
    });
  });

  describe('with all features', () => {
    it('should include all dependencies when all features enabled', () => {
      const allFeatures: FeatureFlags = {
        typescript: true,
        tailwindcss: true,
        redux: true,
        reactRouter: true,
        eslint: true,
        prettier: true,
        husky: true,
        githubActions: true,
        vscode: true,
        testing: true,
      };

      const { dependencies, devDependencies } = generateDependencies(allFeatures);

      // Check all major deps are present
      expect(dependencies).toHaveProperty('react');
      expect(dependencies).toHaveProperty('tailwindcss');
      expect(dependencies).toHaveProperty('@reduxjs/toolkit');
      expect(dependencies).toHaveProperty('react-router-dom');
      expect(devDependencies).toHaveProperty('vitest');
      expect(devDependencies).toHaveProperty('husky');
      expect(devDependencies).toHaveProperty('eslint');
      expect(devDependencies).toHaveProperty('prettier');
    });
  });
});

describe('generateScripts', () => {
  it('should always include base scripts', () => {
    const scripts = generateScripts(createFeatures());

    expect(scripts).toHaveProperty('dev');
    expect(scripts).toHaveProperty('build');
    expect(scripts).toHaveProperty('preview');
    expect(scripts.dev).toBe('vite');
    expect(scripts.build).toContain('vite build');
  });

  describe('with eslint', () => {
    it('should include lint scripts', () => {
      const scripts = generateScripts(createFeatures({ eslint: true }));

      expect(scripts).toHaveProperty('lint');
      expect(scripts).toHaveProperty('lint:fix');
      expect(scripts.lint).toContain('eslint');
    });
  });

  describe('with prettier', () => {
    it('should include format scripts', () => {
      const scripts = generateScripts(createFeatures({ prettier: true }));

      expect(scripts).toHaveProperty('format');
      expect(scripts).toHaveProperty('format:check');
      expect(scripts.format).toContain('prettier');
    });
  });

  describe('with husky', () => {
    it('should include prepare script', () => {
      const scripts = generateScripts(createFeatures({ husky: true }));

      expect(scripts).toHaveProperty('prepare');
      expect(scripts.prepare).toBe('husky');
    });
  });

  describe('with testing', () => {
    it('should include test scripts', () => {
      const scripts = generateScripts(createFeatures({ testing: true }));

      expect(scripts).toHaveProperty('test');
      expect(scripts).toHaveProperty('test:watch');
      expect(scripts).toHaveProperty('test:ui');
      expect(scripts).toHaveProperty('test:coverage');
      expect(scripts.test).toBe('vitest run');
      expect(scripts['test:watch']).toBe('vitest');
      expect(scripts['test:coverage']).toContain('coverage');
    });
  });
});
