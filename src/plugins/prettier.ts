import type { Plugin, PluginFile } from '../types/index.js';
import { featureDevDependencies } from '../config/dependencies.js';

/**
 * Prettier Plugin
 *
 * Generates Prettier configuration
 */
export const prettierPlugin: Plugin = {
  id: 'prettier',
  name: 'Prettier',
  description: 'Code formatting with Prettier',
  order: 51,

  shouldActivate: features => features.prettier,

  async getFiles(): Promise<PluginFile[]> {
    const config = {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
      bracketSpacing: true,
      arrowParens: 'avoid',
      endOfLine: 'lf',
    };

    return [{ path: '.prettierrc', content: JSON.stringify(config, null, 2) }];
  },

  getDependencies: () => ({}),

  getDevDependencies: () => featureDevDependencies.prettier || {},

  getScripts: () => ({
    format: "prettier --write 'src/**/*.{ts,tsx}'",
    'format:check': "prettier --check 'src/**/*.{ts,tsx}'",
  }),
};

export default prettierPlugin;
