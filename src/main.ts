import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { join } from 'path';
import { App } from './app.js';
import { getVersion, checkNodeVersion } from './utils/version.js';
import { getTemplateById, getDefaultTemplate } from './config/templates.js';
import { createProject } from './logics/ProjectCreator.js';
import type { ProjectConfig, FeatureFlags } from './types/index.js';

/**
 * Check if running in a non-interactive environment (CI, no TTY, etc.)
 */
function isNonInteractive(): boolean {
  return (
    !process.stdin.isTTY ||
    process.env.CI === 'true' ||
    process.env.CONTINUOUS_INTEGRATION === 'true' ||
    process.env.GITHUB_ACTIONS === 'true'
  );
}

/**
 * Run project creation in headless mode (no UI)
 */
async function runHeadless(config: ProjectConfig): Promise<void> {
  console.log(`\n🚀 Creating project: ${config.name}\n`);

  const steps = [
    'Creating project directory',
    'Copying template files',
    'Generating configuration',
    ...(config.initGit ? ['Initializing git repository'] : []),
    ...(config.installDeps ? [`Installing dependencies with ${config.packageManager}`] : []),
  ];

  await createProject(config, (stepIndex, status) => {
    const step = steps[stepIndex];
    if (status === 'in-progress') {
      process.stdout.write(`  ⏳ ${step}...`);
    } else if (status === 'complete') {
      process.stdout.write('\r');
      console.log(`  ✅ ${step}`);
    } else if (status === 'error') {
      process.stdout.write('\r');
      console.log(`  ❌ ${step}`);
    }
  });

  console.log(`\n✨ Project created successfully!\n`);
  console.log(`Next steps:`);
  console.log(`  cd ${config.name}`);
  if (!config.installDeps) {
    console.log(`  npm install`);
  }
  console.log(`  npm run dev\n`);
}

const program = new Command();

program
  .name('react-vite-starter-kit')
  .description('🚀 Create modern React + Vite projects with ease')
  .version(getVersion(), '-v, --version', 'Display version number')
  .option('-t, --template <name>', 'Use a specific template (minimal, standard, full-pack)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--no-git', 'Skip git initialization')
  .option('--no-install', 'Skip dependency installation')
  // Granular feature flags for headless mode
  .option('--tailwind', 'Include TailwindCSS')
  .option('--redux', 'Include Redux Toolkit')
  .option('--router', 'Include React Router')
  .option('--i18n', 'Include react-i18next internationalization')
  .option('--eslint', 'Include ESLint')
  .option('--prettier', 'Include Prettier')
  .option('--husky', 'Include Husky + lint-staged')
  .option('--github-actions', 'Include GitHub Actions CI/CD')
  .option('--vscode', 'Include VS Code configuration')
  .option('--testing', 'Include Vitest + Testing Library')
  .option(
    '--test-profile <profile>',
    'Testing profile (bare, minimum, standard, advanced, complete)'
  )
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName, options) => {
    // Check Node.js version
    const nodeCheck = checkNodeVersion();
    if (!nodeCheck.valid) {
      console.error(`\n❌ ${nodeCheck.message}\n`);
      process.exit(1);
    }

    // Build custom features from CLI flags if any feature flag is provided
    const hasFeatureFlags =
      options.tailwind ||
      options.redux ||
      options.router ||
      options.i18n ||
      options.eslint ||
      options.prettier ||
      options.husky ||
      options.githubActions ||
      options.vscode ||
      options.testing;

    const customFeatures: FeatureFlags | undefined = hasFeatureFlags
      ? {
          typescript: true,
          tailwindcss: options.tailwind || false,
          redux: options.redux || false,
          reactRouter: options.router || false,
          i18n: options.i18n || false,
          eslint: options.eslint || false,
          prettier: options.prettier || false,
          husky: options.husky || false,
          githubActions: options.githubActions || false,
          vscode: options.vscode || false,
          testing: options.testing || false,
          testProfile: options.testProfile,
        }
      : undefined;

    // Determine if we should run headless (non-interactive)
    const shouldRunHeadless =
      isNonInteractive() && projectName && (options.template || hasFeatureFlags);

    if (shouldRunHeadless) {
      // Run in headless mode for CI/non-TTY environments
      const template = options.template ? getTemplateById(options.template) : getDefaultTemplate();
      if (!template) {
        console.error(`\n❌ Unknown template: ${options.template}\n`);
        process.exit(1);
      }

      const features = customFeatures || template.features;
      const config: ProjectConfig = {
        name: projectName,
        targetDir: join(process.cwd(), projectName),
        template,
        features,
        packageManager: 'npm',
        initGit: options.git !== false,
        installDeps: options.install !== false,
        author: '',
        license: 'MIT',
        description: '',
      };

      try {
        await runHeadless(config);
        process.exit(0);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`\n❌ Error: ${message}\n`);
        process.exit(1);
      }
    } else {
      // Render the interactive Ink app
      const { waitUntilExit } = render(
        React.createElement(App, {
          initialProjectName: projectName,
          templateName: options.template,
          skipPrompts: options.yes,
          initGit: options.git !== false,
          installDeps: options.install !== false,
          customFeatures,
        })
      );

      await waitUntilExit();
    }
  });

program.parse();
