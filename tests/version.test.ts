/**
 * Tests for version utilities
 */
import { describe, it, expect } from 'vitest';
import { getVersion, checkNodeVersion, getNpmVersion } from '../src/utils/version';

describe('getVersion', () => {
  it('should return a valid semver version string', () => {
    const version = getVersion();
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
    // Semver pattern: x.y.z
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });
});

describe('checkNodeVersion', () => {
  it('should return an object with valid and message properties', () => {
    const result = checkNodeVersion();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('message');
    expect(typeof result.valid).toBe('boolean');
    expect(typeof result.message).toBe('string');
  });

  it('should validate current Node version', () => {
    const result = checkNodeVersion();
    // Current test environment should have valid Node version
    expect(result.valid).toBe(true);
    expect(result.message).toContain('Node.js');
  });
});

describe('getNpmVersion', () => {
  it('should return npm version string or null', () => {
    const version = getNpmVersion();
    // Should either be a valid version string or null
    if (version !== null) {
      expect(typeof version).toBe('string');
      // Should be a valid semver-like string
      expect(version).toMatch(/^\d+\.\d+\.\d+/);
    }
  });
});
