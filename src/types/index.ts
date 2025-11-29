// Package manager types
export type PackageManager = 'npm' | 'yarn' | 'pnpm';

// Test profile options for configurable testing setup
export type TestProfile = 'bare' | 'minimum' | 'standard' | 'advanced' | 'complete';

// Test profile configuration
export interface TestProfileConfig {
  name: string;
  description: string;
  coverageThreshold: number;
  includeTests: {
    unit: boolean; // Basic unit tests
    integration: boolean; // Redux/Router integration tests
    a11y: boolean; // Accessibility tests
    performance: boolean; // Performance tests
    snapshot: boolean; // Snapshot tests
  };
  dependencies: string[];
}

// Feature flags for modular template composition
export interface FeatureFlags {
  typescript: boolean;
  tailwindcss: boolean;
  redux: boolean;
  reactRouter: boolean;
  i18n: boolean; // react-i18next internationalization
  eslint: boolean;
  prettier: boolean;
  husky: boolean;
  githubActions: boolean;
  vscode: boolean;
  testing: boolean;
  testProfile?: TestProfile;
}

// ============================================================================
// DYNAMIC TEMPLATE SYSTEM TYPES
// ============================================================================

// Technology icons for showcase display
export interface TechIcon {
  name: string;
  logo: string; // SVG filename or inline SVG
  url: string;
  color: string;
}

// Feature card configuration for showcase App
export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  feature: keyof FeatureFlags; // Which feature flag enables this card
}

// Component registry for dynamic composition
export interface ComponentRegistry {
  providers: ProviderConfig[];
  cards: FeatureCard[];
  icons: TechIcon[];
}

// Provider wrapper configuration (for main.tsx)
export interface ProviderConfig {
  name: string;
  feature: keyof FeatureFlags;
  importStatement: string;
  wrapperStart: string;
  wrapperEnd: string;
  order: number; // Lower = outer wrapper (i18n=1, redux=2, router=3)
}

// Translation keys structure for i18n
export interface TranslationKeys {
  hero: {
    title: string;
    subtitle: string;
  };
  features: {
    counter: { title: string; description: string };
    redux: { title: string; description: string };
    router: { title: string; description: string };
    i18n: { title: string; description: string };
  };
  footer: {
    madeWith: string;
    by: string;
  };
  common: {
    increment: string;
    lightMode: string;
    darkMode: string;
    language: string;
  };
}

// Base packages always included
export type BasePackage = 'react' | 'react-dom' | 'vite';

// Optional feature packages
export type FeaturePackage =
  | 'tailwindcss'
  | '@tailwindcss/vite'
  | '@reduxjs/toolkit'
  | 'react-redux'
  | 'react-router-dom';

// Dev packages
export type DevPackage =
  | 'typescript'
  | '@types/react'
  | '@types/react-dom'
  | '@types/node'
  | '@vitejs/plugin-react'
  | 'eslint'
  | '@eslint/js'
  | '@typescript-eslint/eslint-plugin'
  | '@typescript-eslint/parser'
  | 'typescript-eslint'
  | 'eslint-plugin-react-hooks'
  | 'eslint-plugin-react-refresh'
  | 'eslint-config-prettier'
  | 'eslint-plugin-prettier'
  | 'prettier'
  | 'globals'
  | 'husky'
  | 'lint-staged'
  | 'vitest'
  | '@vitest/coverage-v8'
  | '@vitest/ui'
  | '@testing-library/react'
  | '@testing-library/jest-dom'
  | '@testing-library/user-event'
  | 'jsdom';

// Template definition
export interface Template {
  id: string;
  name: string;
  description: string;
  features: FeatureFlags;
  icon: string;
  color: string;
}

// Project configuration from user input
export interface ProjectConfig {
  name: string;
  author: string;
  license: string;
  description: string;
  template: Template;
  features: FeatureFlags;
  packageManager: PackageManager;
  initGit: boolean;
  installDeps: boolean;
  targetDir: string;
}

// CLI state for multi-step wizard
export type WizardStep =
  | 'welcome'
  | 'project-name'
  | 'template-select'
  | 'feature-select'
  | 'test-profile-select'
  | 'package-manager'
  | 'git-init'
  | 'summary'
  | 'creating'
  | 'complete'
  | 'error';

export interface WizardState {
  step: WizardStep;
  config: Partial<ProjectConfig>;
  error?: string;
}

// Dependency versions for package.json generation
export interface DependencyVersions {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}
