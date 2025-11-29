import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { App } from './app.js';
import { getVersion, checkNodeVersion } from './utils/version.js';

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

    // Render the Ink app
    const { waitUntilExit } = render(
      React.createElement(App, {
        initialProjectName: projectName,
        templateName: options.template,
        skipPrompts: options.yes,
        initGit: options.git !== false,
        installDeps: options.install !== false,
        // Pass feature flags for headless mode
        customFeatures: hasFeatureFlags
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
          : undefined,
      })
    );

    await waitUntilExit();
  });

program.parse();
