import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import type { ProjectConfig, FeatureFlags } from '../types/index.js';
import { generatePackageJson } from './PackageJsonLogic.js';
import { getSourceFileContent } from './TemplateLogic.js';

// Vite SVG logo
const VITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFBD4F"></stop><stop offset="100%" stop-color="#FF980E"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`;

type StepStatus = 'pending' | 'in-progress' | 'complete' | 'error';
type ProgressCallback = (stepIndex: number, status: StepStatus) => void;

export async function createProject(
  config: ProjectConfig,
  onProgress: ProgressCallback
): Promise<void> {
  let currentStep = 0;

  try {
    // Step 1: Create project directory
    onProgress(currentStep, 'in-progress');
    await createProjectDirectory(config.targetDir);
    onProgress(currentStep, 'complete');
    currentStep++;

    // Step 2: Copy template files
    onProgress(currentStep, 'in-progress');
    await copyTemplateFiles(config);
    onProgress(currentStep, 'complete');
    currentStep++;

    // Step 3: Generate configuration
    onProgress(currentStep, 'in-progress');
    await generateConfiguration(config);
    onProgress(currentStep, 'complete');
    currentStep++;

    // Step 4: Initialize git (if enabled)
    if (config.initGit) {
      onProgress(currentStep, 'in-progress');
      await initializeGit(config.targetDir);
      onProgress(currentStep, 'complete');
      currentStep++;
    }

    // Step 5: Install dependencies (if enabled)
    if (config.installDeps) {
      onProgress(currentStep, 'in-progress');
      await installDependencies(config.targetDir, config.packageManager);
      onProgress(currentStep, 'complete');
    }
  } catch (error) {
    onProgress(currentStep, 'error');
    throw error;
  }
}

async function createProjectDirectory(targetDir: string): Promise<void> {
  if (existsSync(targetDir)) {
    throw new Error(`Directory already exists: ${targetDir}`);
  }
  await mkdir(targetDir, { recursive: true });
}

async function copyTemplateFiles(config: ProjectConfig): Promise<void> {
  const { targetDir, features } = config;

  // Create src directory
  await mkdir(join(targetDir, 'src'), { recursive: true });
  await mkdir(join(targetDir, 'public'), { recursive: true });

  // Generate source files based on features
  const sourceFiles = await getSourceFileContent(config.template.id, features);

  for (const [filePath, content] of sourceFiles) {
    const destPath = join(targetDir, filePath);
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    await writeFile(destPath, content);
  }

  // Create vite.svg in public folder
  await writeFile(join(targetDir, 'public', 'vite.svg'), VITE_SVG);
}

async function generateConfiguration(config: ProjectConfig): Promise<void> {
  const { targetDir, name, features } = config;

  // Generate package.json
  const packageJson = generatePackageJson(config);
  await writeFile(join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Generate index.html
  await generateIndexHtml(targetDir, name);

  // Generate vite.config.ts
  await generateViteConfig(targetDir, features);

  // Generate TypeScript configs
  await generateTsConfigs(targetDir);

  // Generate feature-specific configs
  if (features.eslint) {
    await generateEslintConfig(targetDir, features);
  }

  if (features.prettier) {
    await generatePrettierConfig(targetDir);
  }

  if (features.tailwindcss) {
    await generateTailwindConfig(targetDir);
  }

  if (features.husky) {
    await generateHuskyConfig(targetDir);
  }

  if (features.githubActions) {
    await generateGithubActions(targetDir);
  }

  if (features.vscode) {
    await generateVscodeConfig(targetDir);
  }

  // Generate .gitignore
  await generateGitignore(targetDir);

  // Generate README
  await generateReadme(targetDir, config);
}

async function generateIndexHtml(targetDir: string, projectName: string): Promise<void> {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  await writeFile(join(targetDir, 'index.html'), html);
}

async function generateViteConfig(targetDir: string, features: FeatureFlags): Promise<void> {
  const imports = [
    "import { defineConfig } from 'vite';",
    "import react from '@vitejs/plugin-react';",
  ];
  const plugins = ['react()'];

  if (features.tailwindcss) {
    imports.push("import tailwindcss from '@tailwindcss/vite';");
    plugins.unshift('tailwindcss()');
  }

  const content = `${imports.join('\n')}

// https://vite.dev/config/
export default defineConfig({
  plugins: [${plugins.join(', ')}],
});
`;
  await writeFile(join(targetDir, 'vite.config.ts'), content);
}

async function generateTsConfigs(targetDir: string): Promise<void> {
  // Main tsconfig.json
  const mainConfig = {
    files: [],
    references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
  };
  await writeFile(join(targetDir, 'tsconfig.json'), JSON.stringify(mainConfig, null, 2));

  // tsconfig.app.json
  const appConfig = {
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedSideEffectImports: true,
    },
    include: ['src'],
  };
  await writeFile(join(targetDir, 'tsconfig.app.json'), JSON.stringify(appConfig, null, 2));

  // tsconfig.node.json
  const nodeConfig = {
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
      target: 'ES2022',
      lib: ['ES2023'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedSideEffectImports: true,
    },
    include: ['vite.config.ts'],
  };
  await writeFile(join(targetDir, 'tsconfig.node.json'), JSON.stringify(nodeConfig, null, 2));
}

async function generateEslintConfig(targetDir: string, features: FeatureFlags): Promise<void> {
  const imports = [
    "import js from '@eslint/js';",
    "import globals from 'globals';",
    "import reactHooks from 'eslint-plugin-react-hooks';",
    "import reactRefresh from 'eslint-plugin-react-refresh';",
    "import tseslint from 'typescript-eslint';",
  ];

  const plugins: string[] = [
    "'@typescript-eslint': tseslint.plugin",
    "'react-hooks': reactHooks",
    "'react-refresh': reactRefresh",
  ];

  const rules: string[] = [
    '...js.configs.recommended.rules',
    '...tseslint.configs.recommended.rules',
    '...reactHooks.configs.recommended.rules',
    "'react-refresh/only-export-components': 'warn'",
    "'@typescript-eslint/no-explicit-any': 'warn'",
    "'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]",
  ];

  let configExtend = '';

  if (features.prettier) {
    imports.push("import prettier from 'eslint-plugin-prettier';");
    imports.push("import eslintConfigPrettier from 'eslint-config-prettier';");
    plugins.push('prettier: prettier');
    rules.push("'prettier/prettier': 'error'");
    configExtend = ',\n  eslintConfigPrettier';
  }

  const content = `${imports.join('\n')}

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      ${plugins.join(',\n      ')},
    },
    rules: {
      ${rules.join(',\n      ')},
    },
  }${configExtend},
];
`;
  await writeFile(join(targetDir, 'eslint.config.js'), content);
}

async function generatePrettierConfig(targetDir: string): Promise<void> {
  const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 100,
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'lf',
  };
  await writeFile(join(targetDir, '.prettierrc'), JSON.stringify(config, null, 2));
}

async function generateTailwindConfig(targetDir: string): Promise<void> {
  const content = `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
`;
  await writeFile(join(targetDir, 'tailwind.config.ts'), content);
}

async function generateHuskyConfig(targetDir: string): Promise<void> {
  // Create .husky directory
  const huskyDir = join(targetDir, '.husky');
  await mkdir(huskyDir, { recursive: true });

  // Create pre-commit hook
  const preCommit = `npx lint-staged
`;
  await writeFile(join(huskyDir, 'pre-commit'), preCommit);
}

async function generateGithubActions(targetDir: string): Promise<void> {
  // Create .github/workflows directory
  const workflowsDir = join(targetDir, '.github', 'workflows');
  await mkdir(workflowsDir, { recursive: true });

  const ciWorkflow = `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run build

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
`;
  await writeFile(join(workflowsDir, 'ci.yml'), ciWorkflow);
}

async function generateVscodeConfig(targetDir: string): Promise<void> {
  const vscodeDir = join(targetDir, '.vscode');
  await mkdir(vscodeDir, { recursive: true });

  // settings.json
  const settings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': 'explicit',
    },
    'typescript.tsdk': 'node_modules/typescript/lib',
  };
  await writeFile(join(vscodeDir, 'settings.json'), JSON.stringify(settings, null, 2));

  // extensions.json
  const extensions = {
    recommendations: [
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
      'bradlc.vscode-tailwindcss',
    ],
  };
  await writeFile(join(vscodeDir, 'extensions.json'), JSON.stringify(extensions, null, 2));
}

async function generateGitignore(targetDir: string): Promise<void> {
  const content = `# Dependencies
node_modules/

# Build outputs
dist/
dist-ssr/
*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db

# Environment files
.env
.env.local
.env.*.local

# TypeScript cache
*.tsbuildinfo

# Testing
coverage/
`;
  await writeFile(join(targetDir, '.gitignore'), content);
}

async function generateReadme(targetDir: string, config: ProjectConfig): Promise<void> {
  const features: string[] = ['React 18', 'Vite', 'TypeScript'];

  if (config.features.tailwindcss) features.push('TailwindCSS');
  if (config.features.redux) features.push('Redux Toolkit');
  if (config.features.reactRouter) features.push('React Router');
  if (config.features.eslint) features.push('ESLint');
  if (config.features.prettier) features.push('Prettier');

  const content = `# ${config.name}

${config.description || 'A modern React + Vite project.'}

## Features

${features.map(f => `- ${f}`).join('\n')}

## Getting Started

\`\`\`bash
# Install dependencies
${config.packageManager === 'npm' ? 'npm install' : config.packageManager === 'yarn' ? 'yarn' : 'pnpm install'}

# Start development server
${config.packageManager === 'npm' ? 'npm run dev' : config.packageManager + ' dev'}

# Build for production
${config.packageManager === 'npm' ? 'npm run build' : config.packageManager + ' build'}
\`\`\`

## Scripts

- \`dev\` - Start development server
- \`build\` - Build for production
- \`preview\` - Preview production build
${config.features.eslint ? '- `lint` - Run ESLint\n- `lint:fix` - Fix ESLint errors' : ''}
${config.features.prettier ? '- `format` - Format code with Prettier' : ''}

## Created with

[react-vite-starter-kit](https://github.com/klabacher/tsvite-react-tailwind-boilerplate)
`;
  await writeFile(join(targetDir, 'README.md'), content);
}

async function initializeGit(targetDir: string): Promise<void> {
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit from react-vite-starter-kit"', {
      cwd: targetDir,
      stdio: 'ignore',
    });
  } catch {
    // Git init failed, but we can continue
    console.warn('Warning: Git initialization failed');
  }
}

async function installDependencies(targetDir: string, packageManager: string): Promise<void> {
  const commands: Record<string, string> = {
    npm: 'npm install',
    yarn: 'yarn',
    pnpm: 'pnpm install',
  };

  const command = commands[packageManager] || 'npm install';
  execSync(command, { cwd: targetDir, stdio: 'ignore' });
}
