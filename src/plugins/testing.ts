import type { Plugin, PluginFile, PluginContext } from '../types/index.js';
import { featureDevDependencies } from '../config/dependencies.js';
import { testProfiles } from '../config/testProfiles.js';
import { createTemplateEngine, createTemplateContext } from '../logics/TemplateEngine.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Testing Plugin
 *
 * Generates Vitest testing setup with configurable profiles
 */
export const testingPlugin: Plugin = {
  id: 'testing',
  name: 'Testing',
  description: 'Testing with Vitest and Testing Library',
  order: 40,

  shouldActivate: features => features.testing,

  async getFiles(context: PluginContext): Promise<PluginFile[]> {
    const files: PluginFile[] = [];
    const profile = context.features.testProfile || 'standard';
    const profileConfig = testProfiles[profile];

    const templatesDir = path.resolve(__dirname, '../../templates/test-templates');
    const engine = createTemplateEngine(path.resolve(__dirname, '../../templates/dynamic'));

    // Create template context with both nested and flat access patterns
    const templateContext = {
      ...createTemplateContext({
        projectName: context.projectName,
        features: context.features,
      }),
      // Flat access for test templates
      typescript: context.features.typescript,
      tailwindcss: context.features.tailwindcss,
      redux: context.features.redux,
      reactRouter: context.features.reactRouter,
      i18n: context.features.i18n,
      eslint: context.features.eslint,
      prettier: context.features.prettier,
      testing: context.features.testing,
      testProfile: profile,
      coverageThreshold: profileConfig.coverage,
    };

    // Always generate base test files
    const baseFiles = ['setup.ts', 'test-utils.tsx', 'vitest.config.ts', 'App.test.tsx'];

    for (const file of baseFiles) {
      const templatePath = path.join(templatesDir, `${file}.hbs`);
      try {
        const template = await fs.readFile(templatePath, 'utf-8');
        const content = engine.process(template, templateContext);
        files.push({
          path: file === 'vitest.config.ts' ? file : `src/__tests__/${file}`,
          content,
        });
      } catch {
        // Template not found, skip
      }
    }

    // Profile-based test files
    const testTypeFiles: Record<string, string> = {
      redux: 'store.test.ts',
      router: 'router.test.tsx',
      i18n: 'i18n.test.tsx',
      accessibility: 'a11y.test.tsx',
      performance: 'performance.test.tsx',
      integration: 'redux-integration.test.tsx',
      tailwind: 'tailwind.test.tsx',
    };

    const includedTypes = profileConfig.testTypes;

    for (const [type, filename] of Object.entries(testTypeFiles)) {
      // Check if test type is included in profile
      if (!includedTypes.includes(type as (typeof includedTypes)[number])) continue;

      // Check feature requirements
      if (type === 'redux' && !context.features.redux) continue;
      if (type === 'integration' && !context.features.redux) continue;
      if (type === 'router' && !context.features.reactRouter) continue;
      if (type === 'i18n' && !context.features.i18n) continue;
      if (type === 'tailwind' && !context.features.tailwindcss) continue;

      const templatePath = path.join(templatesDir, `${filename}.hbs`);
      try {
        const template = await fs.readFile(templatePath, 'utf-8');
        const content = engine.process(template, templateContext);
        files.push({
          path: `src/__tests__/${filename}`,
          content,
        });
      } catch {
        // Template not found, skip
      }
    }

    return files;
  },

  getDependencies: () => ({}),

  getDevDependencies: (context?: PluginContext) => {
    const deps = { ...(featureDevDependencies.testing || {}) };

    if (!context) return deps;

    const profile = context.features.testProfile || 'standard';
    const profileConfig = testProfiles[profile];

    // Add profile-specific dependencies
    if (profileConfig.testTypes.includes('accessibility')) {
      deps['vitest-axe'] = '^0.1.0';
      deps['axe-core'] = '^4.10.0';
    }

    return deps;
  },

  getScripts: (context?: PluginContext) => {
    const scripts: Record<string, string> = {
      test: 'vitest run',
      'test:watch': 'vitest',
      'test:ui': 'vitest --ui',
    };

    if (!context) return scripts;

    const profile = context.features.testProfile || 'standard';
    const profileConfig = testProfiles[profile];

    if (profileConfig.coverage > 0) {
      scripts['test:coverage'] = 'vitest run --coverage';
    }

    return scripts;
  },
};

export default testingPlugin;
