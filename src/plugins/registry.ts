import type { Plugin, PluginRegistry, FeatureFlags } from '../types/index.js';

/**
 * Default plugin registry implementation
 */
export class PluginRegistryImpl implements PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values()).sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  }

  getActive(features: FeatureFlags): Plugin[] {
    return this.getAll().filter(plugin => plugin.shouldActivate(features));
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }
}

// Singleton registry instance
export const pluginRegistry = new PluginRegistryImpl();

/**
 * Register a plugin with the global registry
 */
export function registerPlugin(plugin: Plugin): void {
  pluginRegistry.register(plugin);
}

/**
 * Get all active plugins for given features
 */
export function getActivePlugins(features: FeatureFlags): Plugin[] {
  return pluginRegistry.getActive(features);
}

/**
 * Create a simple plugin from configuration
 */
export function createPlugin(config: {
  id: keyof FeatureFlags | string;
  name: string;
  description?: string;
  order?: number;
  featureKey?: keyof FeatureFlags;
  files?: Plugin['getFiles'];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}): Plugin {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    order: config.order,

    shouldActivate: features => {
      if (config.featureKey) {
        return Boolean(features[config.featureKey]);
      }
      // If id is a valid feature key, use it
      if (config.id in features) {
        return Boolean(features[config.id as keyof FeatureFlags]);
      }
      return true;
    },

    getFiles: config.files ?? (async () => []),

    getDependencies: () => config.dependencies ?? {},

    getDevDependencies: () => config.devDependencies ?? {},

    getScripts: config.scripts ? () => config.scripts! : undefined,
  };
}

export type { Plugin, PluginRegistry, PluginContext, PluginFile } from '../types/index.js';
