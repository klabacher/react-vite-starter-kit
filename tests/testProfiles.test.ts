/**
 * Tests for TestGenerator and test profile functionality
 */
import { describe, it, expect } from 'vitest';
import {
  testProfiles,
  getTestProfile,
  getAvailableProfiles,
  getCoverageThreshold,
  getTestDependencies,
} from '../src/config/testProfiles';
import type { TestProfile, FeatureFlags } from '../src/types/index';

// Helper to create feature flags
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
    testing: true,
    testProfile: 'standard',
    ...overrides,
  };
}

describe('testProfiles configuration', () => {
  describe('profile definitions', () => {
    it('should have all 5 test profiles defined', () => {
      const profiles: TestProfile[] = ['bare', 'minimum', 'standard', 'advanced', 'complete'];

      for (const profile of profiles) {
        expect(testProfiles[profile]).toBeDefined();
        expect(testProfiles[profile].name).toBeDefined();
        expect(testProfiles[profile].description).toBeDefined();
        expect(testProfiles[profile].coverageThreshold).toBeDefined();
        expect(testProfiles[profile].includeTests).toBeDefined();
        expect(testProfiles[profile].dependencies).toBeDefined();
      }
    });

    it('should have increasing coverage thresholds', () => {
      expect(testProfiles.bare.coverageThreshold).toBe(0);
      expect(testProfiles.minimum.coverageThreshold).toBe(50);
      expect(testProfiles.standard.coverageThreshold).toBe(70);
      expect(testProfiles.advanced.coverageThreshold).toBe(80);
      expect(testProfiles.complete.coverageThreshold).toBe(90);
    });

    it('bare profile should have no tests included', () => {
      const { includeTests } = testProfiles.bare;
      expect(includeTests.unit).toBe(false);
      expect(includeTests.integration).toBe(false);
      expect(includeTests.a11y).toBe(false);
      expect(includeTests.performance).toBe(false);
    });

    it('complete profile should have all tests included', () => {
      const { includeTests } = testProfiles.complete;
      expect(includeTests.unit).toBe(true);
      expect(includeTests.integration).toBe(true);
      expect(includeTests.a11y).toBe(true);
      expect(includeTests.performance).toBe(true);
      expect(includeTests.snapshot).toBe(true);
    });

    it('standard profile should have unit and integration but not a11y', () => {
      const { includeTests } = testProfiles.standard;
      expect(includeTests.unit).toBe(true);
      expect(includeTests.integration).toBe(true);
      expect(includeTests.a11y).toBe(false);
      expect(includeTests.performance).toBe(false);
    });
  });

  describe('getTestProfile', () => {
    it('should return correct profile for each profile name', () => {
      expect(getTestProfile('bare').name).toBe('Bare (Mínimo)');
      expect(getTestProfile('minimum').name).toBe('Minimum (Básico)');
      expect(getTestProfile('standard').name).toBe('Standard (Padrão)');
      expect(getTestProfile('advanced').name).toBe('Advanced (Avançado)');
      expect(getTestProfile('complete').name).toBe('Complete (Completo)');
    });
  });

  describe('getAvailableProfiles', () => {
    it('should return all 5 profiles with value, label and description', () => {
      const profiles = getAvailableProfiles();

      expect(profiles).toHaveLength(5);

      for (const profile of profiles) {
        expect(profile.value).toBeDefined();
        expect(profile.label).toBeDefined();
        expect(profile.description).toBeDefined();
      }
    });

    it('should return profiles in correct order', () => {
      const profiles = getAvailableProfiles();
      const values = profiles.map(p => p.value);

      expect(values).toEqual(['bare', 'minimum', 'standard', 'advanced', 'complete']);
    });
  });

  describe('getCoverageThreshold', () => {
    it('should return correct thresholds for each profile', () => {
      expect(getCoverageThreshold('bare')).toBe(0);
      expect(getCoverageThreshold('minimum')).toBe(50);
      expect(getCoverageThreshold('standard')).toBe(70);
      expect(getCoverageThreshold('advanced')).toBe(80);
      expect(getCoverageThreshold('complete')).toBe(90);
    });
  });

  describe('getTestDependencies', () => {
    it('should return minimal dependencies for bare profile', () => {
      const deps = getTestDependencies('bare');

      expect(deps).toContain('vitest');
      expect(deps).toContain('jsdom');
      expect(deps).not.toContain('@vitest/coverage-v8');
    });

    it('should include coverage for minimum profile', () => {
      const deps = getTestDependencies('minimum');

      expect(deps).toContain('vitest');
      expect(deps).toContain('@vitest/coverage-v8');
    });

    it('should include user-event for standard profile', () => {
      const deps = getTestDependencies('standard');

      expect(deps).toContain('@testing-library/user-event');
    });

    it('should include jest-axe for advanced profile', () => {
      const deps = getTestDependencies('advanced');

      expect(deps).toContain('jest-axe');
      expect(deps).toContain('@types/jest-axe');
      expect(deps).toContain('@vitest/ui');
    });

    it('should include all dependencies for complete profile', () => {
      const deps = getTestDependencies('complete');

      expect(deps).toContain('vitest');
      expect(deps).toContain('@vitest/coverage-v8');
      expect(deps).toContain('@vitest/ui');
      expect(deps).toContain('@testing-library/react');
      expect(deps).toContain('@testing-library/jest-dom');
      expect(deps).toContain('@testing-library/user-event');
      expect(deps).toContain('jest-axe');
    });
  });
});

describe('FeatureFlags with testProfile', () => {
  it('should allow testProfile to be undefined', () => {
    const features = createFeatures({ testProfile: undefined });
    expect(features.testProfile).toBeUndefined();
  });

  it('should accept all valid test profiles', () => {
    const profiles: TestProfile[] = ['bare', 'minimum', 'standard', 'advanced', 'complete'];

    for (const profile of profiles) {
      const features = createFeatures({ testProfile: profile });
      expect(features.testProfile).toBe(profile);
    }
  });

  it('should default to standard when testProfile is not specified', () => {
    const features = createFeatures();
    expect(features.testProfile).toBe('standard');
  });
});
