// Always use npm by now
type PackageManager = 'npm' | 'yarn' | 'pnpm';
// Always use react + react-dom + vite
type BasePackages = 'react' | 'react-dom' | 'vite';

// Aditional packages for templates
type AdditionalPackages = 'tailwindcss' | 'redux' | 'redux-toolkit' | 'react-router-dom';

// Linting and formatting packages
type LintingPackages = 'eslint' | 'prettier';

// Extend type to include @types and eslint/prettier plugins

// '@types/react' | '@types/react-dom' | '@vitejs/plugin-react'
type Packages = BasePackages | AdditionalPackages | LintingPackages;
type DevPackages = 'typescript' | 'eslint' | 'prettier' | '@types/react' | '@types/react-dom' | '@vitejs/plugin-react';

type Template = {
    title: string;
    description: string;
    packages: Packages[];
    devPackages: DevPackages[];
}

type Templates = Record<string, Template>;

export { PackageManager, Packages, DevPackages, Template, Templates };