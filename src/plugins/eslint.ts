import type { Plugin, PluginContext, PluginFile } from '../types/index.js';
import { featureDevDependencies } from '../config/dependencies.js';

/**
 * ESLint Plugin
 *
 * Generates ESLint configuration for TypeScript and React
 */
export const eslintPlugin: Plugin = {
  id: 'eslint',
  name: 'ESLint',
  description: 'Code linting with ESLint',
  order: 50,

  shouldActivate: features => features.eslint,

  async getFiles(context: PluginContext): Promise<PluginFile[]> {
    const { features } = context;

    const imports = [
      "import js from '@eslint/js';",
      "import globals from 'globals';",
      "import reactHooks from 'eslint-plugin-react-hooks';",
      "import reactRefresh from 'eslint-plugin-react-refresh';",
      "import tseslint from 'typescript-eslint';",
    ];

    const plugins: string[] = [
      "'@typescript-eslint': tseslint.plugin",
      "'react-hooks': reactHooks",
      "'react-refresh': reactRefresh",
    ];

    const rules: string[] = [
      '...js.configs.recommended.rules',
      '...tseslint.configs.recommended.rules',
      '...reactHooks.configs.recommended.rules',
      "'react-refresh/only-export-components': 'warn'",
      "'@typescript-eslint/no-explicit-any': 'warn'",
      "'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]",
    ];

    let configExtend = '';

    if (features.prettier) {
      imports.push("import prettier from 'eslint-plugin-prettier';");
      imports.push("import eslintConfigPrettier from 'eslint-config-prettier';");
      plugins.push('prettier: prettier');
      rules.push("'prettier/prettier': 'error'");
      configExtend = ',\n  eslintConfigPrettier';
    }

    const content = `${imports.join('\n')}

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      ${plugins.join(',\n      ')},
    },
    rules: {
      ${rules.join(',\n      ')},
    },
  }${configExtend},
];
`;

    return [{ path: 'eslint.config.js', content }];
  },

  getDependencies: () => ({}),

  getDevDependencies: () => featureDevDependencies.eslint || {},

  getScripts: () => ({
    lint: 'eslint . --max-warnings=0',
    'lint:fix': 'eslint . --fix',
  }),
};

export default eslintPlugin;
