import type { Plugin, PluginFile } from '../types/index.js';

/**
 * GitHub Actions Plugin
 *
 * CI/CD workflow configuration
 */
export const githubActionsPlugin: Plugin = {
  id: 'githubActions',
  name: 'GitHub Actions',
  description: 'CI/CD with GitHub Actions',
  order: 70,

  shouldActivate: features => features.githubActions,

  async getFiles(context): Promise<PluginFile[]> {
    const ciWorkflow = `name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: '${context.packageManager}'

      - name: Install dependencies
        run: ${context.packageManager} install

${
  context.features.eslint
    ? `      - name: Lint
        run: ${context.packageManager} run lint

`
    : ''
}${
      context.features.testing
        ? `      - name: Test
        run: ${context.packageManager} run test

`
        : ''
    }      - name: Build
        run: ${context.packageManager} run build
`;

    return [
      {
        path: '.github/workflows/ci.yml',
        content: ciWorkflow,
      },
    ];
  },

  getDependencies: () => ({}),

  getDevDependencies: () => ({}),
};

export default githubActionsPlugin;
