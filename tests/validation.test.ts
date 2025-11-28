/**
 * Tests for validation utilities
 */
import { describe, it, expect } from 'vitest';
import { validateProjectName, suggestValidName } from '../src/utils/validation';

describe('validateProjectName', () => {
  it('should accept valid npm package names', () => {
    const validNames = [
      'my-project',
      'my_project',
      'myproject',
      'my-awesome-app',
      '@scope/package',
      'project123',
    ];

    validNames.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  it('should reject names starting with a dot', () => {
    const result = validateProjectName('.hidden');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject names starting with underscore', () => {
    const result = validateProjectName('_private');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject names with spaces', () => {
    const result = validateProjectName('my project');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject names with uppercase letters', () => {
    const result = validateProjectName('MyProject');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject empty names', () => {
    const result = validateProjectName('');
    expect(result.valid).toBe(false);
  });

  it('should reject very long names (>214 chars)', () => {
    const longName = 'a'.repeat(215);
    const result = validateProjectName(longName);
    expect(result.valid).toBe(false);
  });

  it('should reject names with special characters', () => {
    const invalidNames = ['my!project', 'my@project', 'my#project', 'my$project'];

    invalidNames.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(false);
    });
  });

  it('should reject core Node.js module names', () => {
    const coreModules = ['http', 'fs', 'path', 'os', 'util'];

    coreModules.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(false);
    });
  });
});

describe('suggestValidName', () => {
  it('should convert uppercase to lowercase', () => {
    const suggestion = suggestValidName('MyProject');
    expect(suggestion).toBe('myproject');
  });

  it('should replace spaces with hyphens', () => {
    const suggestion = suggestValidName('my project');
    expect(suggestion).toBe('my-project');
  });

  it('should remove leading dots', () => {
    const suggestion = suggestValidName('.hidden');
    expect(suggestion).toBe('hidden');
  });

  it('should remove leading underscores', () => {
    const suggestion = suggestValidName('_private');
    expect(suggestion).toBe('private');
  });

  it('should handle complex invalid names', () => {
    const suggestion = suggestValidName('My_Awesome Project!');
    // Should lowercase and handle spaces
    expect(suggestion).not.toContain(' ');
    expect(suggestion).not.toMatch(/[A-Z]/);
    expect(suggestion).not.toContain('!');
  });

  it('should return a valid name suggestion', () => {
    const inputs = ['MyProject', 'my project', '.hidden', '_private', 'My-Awesome-App'];

    inputs.forEach(input => {
      const suggestion = suggestValidName(input);
      const validation = validateProjectName(suggestion);
      expect(validation.valid).toBe(true);
    });
  });
});
