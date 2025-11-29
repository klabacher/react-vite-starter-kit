import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FeatureFlags, TestProfileConfig } from '../types/index.js';
import { testProfiles, getCoverageThreshold } from '../config/testProfiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the test templates directory with fallback paths
 */
function getTestTemplatesDir(): string {
  const possiblePaths = [
    path.resolve(__dirname, '../templates/test-templates'), // From bundled dist/main.js
    path.resolve(__dirname, '../../templates/test-templates'), // From dist/logics/ (dev)
    path.resolve(__dirname, '../../../templates/test-templates'), // Alternative path
    path.join(process.cwd(), 'templates/test-templates'), // Current working directory
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return possiblePaths[0]; // Default to first path
}

/**
 * TestGenerator - Generates test files from templates based on features and profile
 */
export class TestGenerator {
  private templatesDir: string;
  private features: FeatureFlags;
  private profile: TestProfileConfig;

  constructor(features: FeatureFlags) {
    this.features = features;
    this.profile = testProfiles[features.testProfile || 'standard'];
    this.templatesDir = getTestTemplatesDir();
  }

  /**
   * Read a template file from the templates directory
   */
  private readTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesDir, templateName);
    try {
      return fs.readFileSync(templatePath, 'utf-8');
    } catch {
      console.warn(`Template ${templateName} not found, using inline fallback`);
      return '';
    }
  }

  /**
   * Find the matching closing tag for a block, handling nested blocks
   */
  private findMatchingClose(
    template: string,
    startIndex: number,
    openTag: string,
    closeTag: string
  ): number {
    let depth = 1;
    let pos = startIndex;

    while (pos < template.length && depth > 0) {
      const nextOpen = template.indexOf(openTag, pos);
      const nextClose = template.indexOf(closeTag, pos);

      if (nextClose === -1) {
        // No closing tag found
        return -1;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        // Found another opening tag first
        depth++;
        pos = nextOpen + openTag.length;
      } else {
        // Found closing tag
        depth--;
        if (depth === 0) {
          return nextClose;
        }
        pos = nextClose + closeTag.length;
      }
    }

    return -1;
  }

  /**
   * Find {{else}} at the same nesting level (not inside nested #if blocks)
   */
  private findElseAtSameLevel(content: string): number {
    let depth = 0;
    let pos = 0;

    while (pos < content.length) {
      const nextIf = content.indexOf('{{#if', pos);
      const nextElse = content.indexOf('{{else}}', pos);
      const nextEndIf = content.indexOf('{{/if}}', pos);

      // Find the earliest occurrence
      const positions = [
        { type: 'if', pos: nextIf },
        { type: 'else', pos: nextElse },
        { type: 'endif', pos: nextEndIf },
      ]
        .filter(p => p.pos !== -1)
        .sort((a, b) => a.pos - b.pos);

      if (positions.length === 0) break;

      const next = positions[0];

      if (next.type === 'if') {
        depth++;
        pos = next.pos + 5; // length of '{{#if'
      } else if (next.type === 'endif') {
        depth--;
        pos = next.pos + 7; // length of '{{/if}}'
      } else if (next.type === 'else') {
        if (depth === 0) {
          return next.pos;
        }
        pos = next.pos + 8; // length of '{{else}}'
      }
    }

    return -1;
  }

  /**
   * Process template conditionals with proper nested block handling
   */
  private processConditionals(template: string): string {
    const openRegex = /\{\{#if\s+(\w+)\}\}/g;
    let result = template;
    let match;

    // Reset lastIndex to ensure we start from the beginning
    openRegex.lastIndex = 0;

    while ((match = openRegex.exec(result)) !== null) {
      const fullOpenTag = match[0];
      const feature = match[1];
      const startIndex = match.index;
      const contentStart = startIndex + fullOpenTag.length;
      const closeIndex = this.findMatchingClose(result, contentStart, '{{#if', '{{/if}}');

      if (closeIndex === -1) continue;

      const fullContent = result.substring(contentStart, closeIndex);

      // Find {{else}} at the same nesting level
      const elseIndex = this.findElseAtSameLevel(fullContent);

      let ifContent: string;
      let elseContent: string;

      if (elseIndex !== -1) {
        ifContent = fullContent.substring(0, elseIndex);
        elseContent = fullContent.substring(elseIndex + '{{else}}'.length);
      } else {
        ifContent = fullContent;
        elseContent = '';
      }

      const featureValue = this.getFeatureValue(feature);
      // Recursively process the chosen content to handle nested conditionals
      const replacement = featureValue
        ? this.processConditionals(ifContent)
        : this.processConditionals(elseContent);

      result =
        result.substring(0, startIndex) +
        replacement +
        result.substring(closeIndex + '{{/if}}'.length);

      // Reset regex to search from the start since we modified the string
      openRegex.lastIndex = 0;
    }

    return result;
  }

  /**
   * Process template variables ({{variable}})
   */
  private processVariables(template: string): string {
    let result = template;

    // Replace {{coverageThreshold}} with actual value
    result = result.replace(
      /\{\{coverageThreshold\}\}/g,
      String(getCoverageThreshold(this.features.testProfile || 'standard'))
    );

    // Replace {{custom}} based on feature set
    result = result.replace(/\{\{custom\}\}/g, String(this.isCustomSetup()));

    return result;
  }

  /**
   * Get feature value from features object
   */
  private getFeatureValue(feature: string): boolean {
    const featureMap: Record<string, boolean> = {
      redux: this.features.redux,
      reactRouter: this.features.reactRouter,
      tailwindcss: this.features.tailwindcss,
      typescript: this.features.typescript,
      eslint: this.features.eslint,
      prettier: this.features.prettier,
      i18n: this.features.i18n || false,
      custom: this.isCustomSetup(),
    };
    return featureMap[feature] ?? false;
  }

  /**
   * Check if this is a custom setup (has Redux or Router)
   */
  private isCustomSetup(): boolean {
    return this.features.redux || this.features.reactRouter;
  }

  /**
   * Process a template with all transformations
   */
  private processTemplate(templateContent: string): string {
    let result = templateContent;
    result = this.processConditionals(result);
    result = this.processVariables(result);
    // Clean up extra blank lines
    result = result.replace(/\n{3,}/g, '\n\n');
    return result.trim() + '\n';
  }

  /**
   * Generate setup.ts content
   */
  generateSetup(): string {
    const template = this.readTemplate('setup.ts.template');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackSetup();
  }

  /**
   * Generate test-utils.tsx content
   */
  generateTestUtils(): string {
    const template = this.readTemplate('test-utils.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackTestUtils();
  }

  /**
   * Generate App.test.tsx content
   */
  generateAppTest(): string {
    if (!this.profile.includeTests.unit) return '';

    const template = this.readTemplate('App.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackAppTest();
  }

  /**
   * Generate store.test.ts content (Redux only)
   */
  generateStoreTest(): string {
    if (!this.features.redux || !this.profile.includeTests.unit) return '';

    const template = this.readTemplate('store.test.ts.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate router.test.tsx content (React Router only)
   */
  generateRouterTest(): string {
    if (!this.features.reactRouter || !this.profile.includeTests.unit) return '';

    const template = this.readTemplate('router.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate integration tests content
   */
  generateIntegrationTest(): string {
    if (!this.profile.includeTests.integration) return '';
    if (!this.features.redux && !this.features.reactRouter) return '';

    const template = this.readTemplate('redux-integration.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate a11y tests content
   */
  generateA11yTest(): string {
    if (!this.profile.includeTests.a11y) return '';

    const template = this.readTemplate('a11y.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate performance tests content
   */
  generatePerformanceTest(): string {
    if (!this.profile.includeTests.performance) return '';

    const template = this.readTemplate('performance.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate tailwind tests content
   */
  generateTailwindTest(): string {
    if (!this.features.tailwindcss || !this.profile.includeTests.unit) return '';

    const template = this.readTemplate('tailwind.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate i18n tests content
   */
  generateI18nTest(): string {
    if (!this.features.i18n || !this.profile.includeTests.unit) return '';

    const template = this.readTemplate('i18n.test.tsx.template');
    if (template) {
      return this.processTemplate(template);
    }
    return '';
  }

  /**
   * Generate vitest.config.ts content
   */
  generateVitestConfig(): string {
    const template = this.readTemplate('vitest.config.ts.template');
    if (template) {
      return this.processTemplate(template);
    }
    return this.getFallbackVitestConfig();
  }

  /**
   * Get all test files to generate based on profile and features
   */
  getTestFilesToGenerate(): Array<{ filename: string; content: string }> {
    const files: Array<{ filename: string; content: string }> = [];

    // Always include setup and utils
    files.push({ filename: 'setup.ts', content: this.generateSetup() });
    files.push({ filename: 'test-utils.tsx', content: this.generateTestUtils() });

    // App test
    const appTest = this.generateAppTest();
    if (appTest) {
      files.push({ filename: 'App.test.tsx', content: appTest });
    }

    // Redux store test
    const storeTest = this.generateStoreTest();
    if (storeTest) {
      files.push({ filename: 'store.test.ts', content: storeTest });
    }

    // Router test
    const routerTest = this.generateRouterTest();
    if (routerTest) {
      files.push({ filename: 'router.test.tsx', content: routerTest });
    }

    // Integration test
    const integrationTest = this.generateIntegrationTest();
    if (integrationTest) {
      files.push({ filename: 'integration.test.tsx', content: integrationTest });
    }

    // A11y test
    const a11yTest = this.generateA11yTest();
    if (a11yTest) {
      files.push({ filename: 'a11y.test.tsx', content: a11yTest });
    }

    // Performance test
    const performanceTest = this.generatePerformanceTest();
    if (performanceTest) {
      files.push({ filename: 'performance.test.tsx', content: performanceTest });
    }

    // Tailwind test
    const tailwindTest = this.generateTailwindTest();
    if (tailwindTest) {
      files.push({ filename: 'tailwind.test.tsx', content: tailwindTest });
    }

    // i18n test
    const i18nTest = this.generateI18nTest();
    if (i18nTest) {
      files.push({ filename: 'i18n.test.tsx', content: i18nTest });
    }

    return files.filter(f => f.content.trim().length > 0);
  }

  // Fallback methods for when templates are not available

  private getFallbackSetup(): string {
    return `import '@testing-library/jest-dom';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
`;
  }

  private getFallbackTestUtils(): string {
    return `import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

export function renderApp(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

export * from '@testing-library/react';
`;
  }

  private getFallbackAppTest(): string {
    return `import { describe, it, expect } from 'vitest';
import { renderApp } from '../test/test-utils';
import App from '../App';

describe('App', () => {
  it('should render without crashing', () => {
    renderApp(<App />);
    expect(document.body).toBeDefined();
  });
});
`;
  }

  private getFallbackVitestConfig(): string {
    const threshold = getCoverageThreshold(this.features.testProfile || 'standard');
    return `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: ${threshold},
        branches: ${threshold},
        functions: ${threshold},
        lines: ${threshold},
      },
    },
  },
});
`;
  }
}

/**
 * Factory function to create a TestGenerator
 */
export function createTestGenerator(features: FeatureFlags): TestGenerator {
  return new TestGenerator(features);
}
