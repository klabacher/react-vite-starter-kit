/**
 * Plugin System Index
 *
 * Exports all plugins and provides a pre-configured registry
 */

import { PluginRegistryImpl } from './registry.js';
import type { PluginRegistry } from '../types/index.js';

// Import all plugins
import { tailwindPlugin } from './tailwind.js';
import { reduxPlugin } from './redux.js';
import { reactRouterPlugin } from './react-router.js';
import { i18nPlugin } from './i18n.js';
import { eslintPlugin } from './eslint.js';
import { prettierPlugin } from './prettier.js';
import { huskyPlugin } from './husky.js';
import { githubActionsPlugin } from './github-actions.js';
import { vscodePlugin } from './vscode.js';
import { testingPlugin } from './testing.js';

// Re-export individual plugins
export { tailwindPlugin } from './tailwind.js';
export { reduxPlugin } from './redux.js';
export { reactRouterPlugin } from './react-router.js';
export { i18nPlugin } from './i18n.js';
export { eslintPlugin } from './eslint.js';
export { prettierPlugin } from './prettier.js';
export { huskyPlugin } from './husky.js';
export { githubActionsPlugin } from './github-actions.js';
export { vscodePlugin } from './vscode.js';
export { testingPlugin } from './testing.js';

// Re-export registry
export { PluginRegistryImpl, pluginRegistry } from './registry.js';

/**
 * All available plugins
 */
export const allPlugins = [
  tailwindPlugin,
  reduxPlugin,
  reactRouterPlugin,
  i18nPlugin,
  eslintPlugin,
  prettierPlugin,
  huskyPlugin,
  githubActionsPlugin,
  vscodePlugin,
  testingPlugin,
];

/**
 * Creates a new plugin registry with all core plugins registered
 */
export function createPluginRegistry(): PluginRegistry {
  const registry = new PluginRegistryImpl();

  for (const plugin of allPlugins) {
    registry.register(plugin);
  }

  return registry;
}

/**
 * Default registry instance with all plugins
 */
export const defaultRegistry = createPluginRegistry();
