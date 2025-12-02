import type { Plugin, PluginFile } from '../types/index.js';
import { featureDevDependencies } from '../config/dependencies.js';

/**
 * Husky Plugin
 *
 * Git hooks with Husky and lint-staged
 */
export const huskyPlugin: Plugin = {
  id: 'husky',
  name: 'Husky',
  description: 'Git hooks with Husky and lint-staged',
  order: 60,

  shouldActivate: features => features.husky,

  async getFiles(context): Promise<PluginFile[]> {
    const files: PluginFile[] = [];

    // Pre-commit hook
    const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
`;

    files.push({
      path: '.husky/pre-commit',
      content: preCommitContent,
    });

    // Lint-staged config
    interface LintStagedConfig {
      [key: string]: string | string[];
    }

    const lintStagedConfig: LintStagedConfig = {};

    if (context.features.eslint) {
      lintStagedConfig['*.{js,jsx,ts,tsx}'] = ['eslint --fix', 'prettier --write'];
    } else if (context.features.prettier) {
      lintStagedConfig['*.{js,jsx,ts,tsx}'] = 'prettier --write';
    }

    if (context.features.prettier) {
      lintStagedConfig['*.{json,md,yml,yaml}'] = 'prettier --write';
      lintStagedConfig['*.css'] = 'prettier --write';
    }

    if (Object.keys(lintStagedConfig).length > 0) {
      files.push({
        path: '.lintstagedrc.json',
        content: JSON.stringify(lintStagedConfig, null, 2),
      });
    }

    return files;
  },

  getDependencies: () => ({}),

  getDevDependencies: () => featureDevDependencies.husky || {},

  getScripts: () => ({
    prepare: 'husky install',
  }),

  getSetupCommands: () => ['npx husky install', 'chmod +x .husky/pre-commit'],
};

export default huskyPlugin;
