import validateNpmPackageName from 'validate-npm-package-name';
import { execSync } from 'child_process';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateProjectName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return {
      valid: false,
      errors: ['Project name cannot be empty'],
      warnings: [],
    };
  }

  const result = validateNpmPackageName(name);

  return {
    valid: result.validForNewPackages,
    errors: [...(result.errors || []), ...(result.warnings || [])],
    warnings: result.warnings || [],
  };
}

export function suggestValidName(name: string): string {
  // Convert to lowercase
  let suggested = name.toLowerCase();

  // Replace spaces and underscores with hyphens
  suggested = suggested.replace(/[\s_]+/g, '-');

  // Remove invalid characters
  suggested = suggested.replace(/[^a-z0-9-]/g, '');

  // Remove leading/trailing hyphens
  suggested = suggested.replace(/^-+|-+$/g, '');

  // Ensure it doesn't start with a number
  if (/^\d/.test(suggested)) {
    suggested = 'app-' + suggested;
  }

  // Ensure minimum length
  if (suggested.length === 0) {
    suggested = 'my-app';
  }

  return suggested;
}

export function isGitInstalled(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
