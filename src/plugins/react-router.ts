import type { Plugin, PluginFile } from '../types/index.js';
import { featureDevDependencies } from '../config/dependencies.js';

/**
 * React Router Plugin
 *
 * Generates React Router DOM setup
 */
export const reactRouterPlugin: Plugin = {
  id: 'reactRouter',
  name: 'React Router',
  description: 'Client-side routing with React Router',
  order: 25,

  shouldActivate: features => features.reactRouter,

  async getFiles(): Promise<PluginFile[]> {
    // Router integration is handled via main.tsx and App.tsx templates
    // This plugin only provides dependencies
    return [];
  },

  getDependencies: () => ({
    'react-router-dom': '^6.28.0',
  }),

  getDevDependencies: () => featureDevDependencies.reactRouter || {},
};

export default reactRouterPlugin;
