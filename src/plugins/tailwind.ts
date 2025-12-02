import type { Plugin, PluginContext, PluginFile } from '../types/index.js';
import { featureDependencies, featureDevDependencies } from '../config/dependencies.js';

/**
 * Tailwind CSS Plugin
 *
 * Generates Tailwind configuration and CSS setup
 */
export const tailwindPlugin: Plugin = {
  id: 'tailwindcss',
  name: 'Tailwind CSS',
  description: 'Utility-first CSS framework',
  order: 10,

  shouldActivate: features => features.tailwindcss,

  async getFiles(_context: PluginContext): Promise<PluginFile[]> {
    return [
      {
        path: 'tailwind.config.ts',
        content: `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
`,
      },
    ];
  },

  getDependencies: () => featureDependencies.tailwindcss || {},

  getDevDependencies: () => featureDevDependencies.tailwindcss || {},
};

export default tailwindPlugin;
