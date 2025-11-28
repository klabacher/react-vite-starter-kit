import type { Template, FeatureFlags } from '../types/index.js';

// Default feature flags (all disabled)
const defaultFeatures: FeatureFlags = {
  typescript: true, // Always enabled
  tailwindcss: false,
  redux: false,
  reactRouter: false,
  eslint: false,
  prettier: false,
  husky: false,
  githubActions: false,
  vscode: false,
};

// Predefined templates
export const templates: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'React + Vite + TypeScript only. Clean slate for custom setup.',
    icon: '⚡',
    color: 'yellow',
    features: {
      ...defaultFeatures,
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'React + Vite + TypeScript + TailwindCSS + ESLint + Prettier',
    icon: '📦',
    color: 'cyan',
    features: {
      ...defaultFeatures,
      tailwindcss: true,
      eslint: true,
      prettier: true,
    },
  },
  {
    id: 'full-pack',
    name: 'Full Pack',
    description: 'Everything included: Redux, React Router, TailwindCSS, Linting, Husky, CI/CD',
    icon: '🚀',
    color: 'magenta',
    features: {
      typescript: true,
      tailwindcss: true,
      redux: true,
      reactRouter: true,
      eslint: true,
      prettier: true,
      husky: true,
      githubActions: true,
      vscode: true,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Choose exactly what you need. Pick your own features.',
    icon: '🎨',
    color: 'green',
    features: {
      ...defaultFeatures,
    },
  },
];

// Feature descriptions for selection UI
export const featureDescriptions: Record<
  keyof FeatureFlags,
  { name: string; description: string; icon: string }
> = {
  typescript: {
    name: 'TypeScript',
    description: 'Strongly typed JavaScript (always included)',
    icon: '📘',
  },
  tailwindcss: {
    name: 'TailwindCSS',
    description: 'Utility-first CSS framework with Vite plugin',
    icon: '🎨',
  },
  redux: {
    name: 'Redux Toolkit',
    description: 'State management with Redux Toolkit and React-Redux',
    icon: '🔄',
  },
  reactRouter: {
    name: 'React Router',
    description: 'Declarative routing for React applications',
    icon: '🛣️',
  },
  eslint: {
    name: 'ESLint',
    description: 'Find and fix problems in your JavaScript/TypeScript code',
    icon: '🔍',
  },
  prettier: {
    name: 'Prettier',
    description: 'Opinionated code formatter',
    icon: '✨',
  },
  husky: {
    name: 'Husky + lint-staged',
    description: 'Git hooks for linting and formatting on commit',
    icon: '🐶',
  },
  githubActions: {
    name: 'GitHub Actions',
    description: 'CI/CD workflow for testing and building',
    icon: '⚙️',
  },
  vscode: {
    name: 'VS Code Config',
    description: 'Editor settings, extensions, and launch configs',
    icon: '💻',
  },
};

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function getDefaultTemplate(): Template {
  return templates.find(t => t.id === 'standard') || templates[0];
}
