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
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName, options) => {
    // Check Node.js version
    const nodeCheck = checkNodeVersion();
    if (!nodeCheck.valid) {
      console.error(`\n❌ ${nodeCheck.message}\n`);
      process.exit(1);
    }

    // Render the Ink app
    const { waitUntilExit } = render(
      React.createElement(App, {
        initialProjectName: projectName,
        templateName: options.template,
        skipPrompts: options.yes,
        initGit: options.git !== false,
        installDeps: options.install !== false,
      })
    );

    await waitUntilExit();
  });

program.parse();
