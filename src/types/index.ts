// Package manager types
export type PackageManager = 'npm' | 'yarn' | 'pnpm';

// Feature flags for modular template composition
export interface FeatureFlags {
  typescript: boolean;
  tailwindcss: boolean;
  redux: boolean;
  reactRouter: boolean;
  eslint: boolean;
  prettier: boolean;
  husky: boolean;
  githubActions: boolean;
  vscode: boolean;
  testing: boolean;
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
