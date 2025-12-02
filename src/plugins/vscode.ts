import type { Plugin, PluginFile } from '../types/index.js';

/**
 * VSCode Plugin
 *
 * VS Code editor configuration
 */
export const vscodePlugin: Plugin = {
  id: 'vscode',
  name: 'VS Code',
  description: 'VS Code editor settings and extensions',
  order: 80,

  shouldActivate: features => features.vscode,

  async getFiles(context): Promise<PluginFile[]> {
    const files: PluginFile[] = [];

    // Recommended extensions
    const extensions: string[] = ['dbaeumer.vscode-eslint', 'esbenp.prettier-vscode'];

    if (context.features.tailwindcss) {
      extensions.push('bradlc.vscode-tailwindcss');
    }

    if (context.features.i18n) {
      extensions.push('lokalise.i18n-ally');
    }

    files.push({
      path: '.vscode/extensions.json',
      content: JSON.stringify({ recommendations: extensions }, null, 2),
    });

    // Editor settings
    interface VscodeSettings {
      [key: string]: unknown;
    }

    const settings: VscodeSettings = {
      'editor.formatOnSave': true,
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit',
      },
      'typescript.tsdk': 'node_modules/typescript/lib',
      'typescript.enablePromptUseWorkspaceTsdk': true,
    };

    if (context.features.tailwindcss) {
      settings['tailwindCSS.experimental.classRegex'] = [
        ['cva\\(([^)]*)\\)', '["\'`]([^"\'`]*).*?["\'`]'],
        ['cx\\(([^)]*)\\)', "(?:'|\"|`)([^']*)(?:'|\"|`)"],
      ];
      settings['editor.quickSuggestions'] = {
        strings: 'on',
      };
    }

    files.push({
      path: '.vscode/settings.json',
      content: JSON.stringify(settings, null, 2),
    });

    return files;
  },

  getDependencies: () => ({}),

  getDevDependencies: () => ({}),
};

export default vscodePlugin;
