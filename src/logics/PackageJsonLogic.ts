import type { ProjectConfig } from '../types/index.js';
import { generateDependencies, generateScripts } from '../config/dependencies.js';

export interface GeneratedPackageJson {
  name: string;
  version: string;
  private: boolean;
  type: string;
  description?: string;
  author?: string;
  license: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  'lint-staged'?: Record<string, string[]>;
}

export function generatePackageJson(config: ProjectConfig): GeneratedPackageJson {
  const { dependencies, devDependencies } = generateDependencies(config.features);
  const scripts = generateScripts(config.features);

  const packageJson: GeneratedPackageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    license: config.license || 'MIT',
    scripts,
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
  };

  if (config.description) {
    packageJson.description = config.description;
  }

  if (config.author) {
    packageJson.author = config.author;
  }

  // Add lint-staged config if husky is enabled
  if (config.features.husky) {
    const lintStaged: Record<string, string[]> = {};

    if (config.features.eslint && config.features.prettier) {
      lintStaged['*.{ts,tsx}'] = ['eslint --fix', 'prettier --write'];
    } else if (config.features.eslint) {
      lintStaged['*.{ts,tsx}'] = ['eslint --fix'];
    } else if (config.features.prettier) {
      lintStaged['*.{ts,tsx}'] = ['prettier --write'];
    }

    if (config.features.prettier) {
      lintStaged['*.{json,md,css}'] = ['prettier --write'];
    }

    if (Object.keys(lintStaged).length > 0) {
      packageJson['lint-staged'] = lintStaged;
    }
  }

  return packageJson;
}

export function validatePackageName(name: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!name) {
    errors.push('Package name is required');
    return { valid: false, errors };
  }

  if (name.length > 214) {
    errors.push('Package name must be less than 214 characters');
  }

  if (name.startsWith('.') || name.startsWith('_')) {
    errors.push('Package name cannot start with . or _');
  }

  if (name !== name.toLowerCase()) {
    errors.push('Package name must be lowercase');
  }

  if (/[~'!()*]/.test(name)) {
    errors.push("Package name cannot contain special characters: ~'!()*");
  }

  if (name.startsWith('@') && !name.includes('/')) {
    errors.push('Scoped package names must include a scope and name');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<string, string>
    );
}
