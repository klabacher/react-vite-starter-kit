/**
 * Tests for FeatureFlags type system and template configurations
 */
import { describe, it, expect } from 'vitest';
import {
  templates,
  featureDescriptions,
  getTemplateById,
  getDefaultTemplate,
} from '../src/config/templates';
import type { FeatureFlags, Template } from '../src/types/index';

describe('FeatureFlags', () => {
  // All feature keys that should exist
  const expectedFeatureKeys: (keyof FeatureFlags)[] = [
    'typescript',
    'tailwindcss',
    'redux',
    'reactRouter',
    'eslint',
    'prettier',
    'husky',
    'githubActions',
    'vscode',
    'testing',
  ];

  it('should have all expected feature keys in every template', () => {
    templates.forEach(template => {
      expectedFeatureKeys.forEach(key => {
        expect(template.features).toHaveProperty(key);
        expect(typeof template.features[key]).toBe('boolean');
      });
    });
  });

  it('should have typescript always enabled in all templates', () => {
    templates.forEach(template => {
      expect(template.features.typescript).toBe(true);
    });
  });
});

describe('Templates', () => {
  it('should have at least 4 templates defined', () => {
    expect(templates.length).toBeGreaterThanOrEqual(4);
  });

  it('should have required template properties', () => {
    const requiredProps: (keyof Template)[] = [
      'id',
      'name',
      'description',
      'icon',
      'color',
      'features',
    ];

    templates.forEach(template => {
      requiredProps.forEach(prop => {
        expect(template).toHaveProperty(prop);
      });
    });
  });

  it('should have unique template IDs', () => {
    const ids = templates.map(t => t.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  describe('minimal template', () => {
    it('should have minimal features enabled', () => {
      const minimal = getTemplateById('minimal');
      expect(minimal).toBeDefined();
      expect(minimal!.features.typescript).toBe(true);
      expect(minimal!.features.tailwindcss).toBe(false);
      expect(minimal!.features.redux).toBe(false);
      expect(minimal!.features.reactRouter).toBe(false);
    });
  });

  describe('standard template', () => {
    it('should include tailwindcss, eslint, and prettier', () => {
      const standard = getTemplateById('standard');
      expect(standard).toBeDefined();
      expect(standard!.features.tailwindcss).toBe(true);
      expect(standard!.features.eslint).toBe(true);
      expect(standard!.features.prettier).toBe(true);
    });
  });

  describe('full-pack template', () => {
    it('should have all features enabled', () => {
      const fullPack = getTemplateById('full-pack');
      expect(fullPack).toBeDefined();

      // All features should be true in full-pack
      Object.values(fullPack!.features).forEach(value => {
        expect(value).toBe(true);
      });
    });

    it('should include testing feature', () => {
      const fullPack = getTemplateById('full-pack');
      expect(fullPack!.features.testing).toBe(true);
    });
  });

  describe('custom template', () => {
    it('should start with minimal features for customization', () => {
      const custom = getTemplateById('custom');
      expect(custom).toBeDefined();
      expect(custom!.features.typescript).toBe(true);
    });
  });
});

describe('featureDescriptions', () => {
  it('should have descriptions for all feature flags', () => {
    const featureKeys: (keyof FeatureFlags)[] = [
      'typescript',
      'tailwindcss',
      'redux',
      'reactRouter',
      'eslint',
      'prettier',
      'husky',
      'githubActions',
      'vscode',
      'testing',
    ];

    featureKeys.forEach(key => {
      expect(featureDescriptions).toHaveProperty(key);
      expect(featureDescriptions[key]).toHaveProperty('name');
      expect(featureDescriptions[key]).toHaveProperty('description');
      expect(featureDescriptions[key]).toHaveProperty('icon');
    });
  });

  it('should have testing feature description', () => {
    expect(featureDescriptions.testing).toBeDefined();
    expect(featureDescriptions.testing.name).toContain('Vitest');
  });
});

describe('getTemplateById', () => {
  it('should return template when valid ID is provided', () => {
    expect(getTemplateById('minimal')).toBeDefined();
    expect(getTemplateById('standard')).toBeDefined();
    expect(getTemplateById('full-pack')).toBeDefined();
    expect(getTemplateById('custom')).toBeDefined();
  });

  it('should return undefined for invalid ID', () => {
    expect(getTemplateById('nonexistent')).toBeUndefined();
    expect(getTemplateById('')).toBeUndefined();
  });
});

describe('getDefaultTemplate', () => {
  it('should return a valid template', () => {
    const defaultTemplate = getDefaultTemplate();
    expect(defaultTemplate).toBeDefined();
    expect(defaultTemplate.id).toBeDefined();
    expect(defaultTemplate.features).toBeDefined();
  });

  it('should return standard template as default', () => {
    const defaultTemplate = getDefaultTemplate();
    expect(defaultTemplate.id).toBe('standard');
  });
});
