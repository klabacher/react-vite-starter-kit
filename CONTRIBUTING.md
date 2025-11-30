# Contributing to react-vite-starter-kit

Thank you for your interest in contributing to react-vite-starter-kit. This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-vite-starter-kit.git
   cd react-vite-starter-kit
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Commands

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Run CLI in development mode  |
| `npm run build`      | Build the CLI                |
| `npm run test`       | Run tests                    |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run lint`       | Check for linting errors     |
| `npm run lint:fix`   | Fix linting errors           |
| `npm run typecheck`  | Run TypeScript type checking |
| `npm run format`     | Format code with Prettier    |

## Code Style

This project uses ESLint and Prettier for code quality and formatting.

### ESLint

- Configuration is in `eslint.config.js`
- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to auto-fix issues

### Prettier

- Configuration is in the project root
- Run `npm run format` to format all files
- Run `npm run format:check` to verify formatting

### TypeScript

- Strict mode is enabled
- All code must pass type checking (`npm run typecheck`)
- Use explicit types for public APIs

## Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new feature                                             |
| `fix`      | A bug fix                                                 |
| `docs`     | Documentation only changes                                |
| `style`    | Changes that do not affect the meaning of the code        |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `test`     | Adding missing tests or correcting existing tests         |
| `chore`    | Changes to the build process or auxiliary tools           |

### Examples

```
feat(cli): add support for pnpm package manager
fix(template): correct TypeScript config for strict mode
docs(readme): update installation instructions
test(validation): add tests for project name validation
```

## Branch Naming

Use descriptive branch names with the following prefixes:

| Prefix      | Purpose                 |
| ----------- | ----------------------- |
| `feature/`  | New features            |
| `fix/`      | Bug fixes               |
| `docs/`     | Documentation changes   |
| `refactor/` | Code refactoring        |
| `test/`     | Test additions or fixes |
| `chore/`    | Maintenance tasks       |

### Examples

```
feature/add-docker-template
fix/template-engine-nested-conditionals
docs/update-contributing-guide
```

## Pull Request Process

1. Ensure your code passes all checks:

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

2. Update documentation if needed

3. Add tests for new functionality

4. Update CHANGELOG.md if applicable

5. Create a pull request with:
   - Clear title following commit message format
   - Description of changes
   - Link to related issues

6. Wait for code review and address feedback

## Code Review

All pull requests require review before merging. Reviewers will check for:

- Code quality and style consistency
- Test coverage
- Documentation updates
- Breaking changes
- Performance implications

## Reporting Issues

Before creating an issue:

1. Search existing issues to avoid duplicates
2. Use the appropriate issue template
3. Provide clear reproduction steps for bugs
4. Include environment details (Node.js version, OS, etc.)

## Questions

If you have questions, please:

1. Check the documentation
2. Search existing issues and discussions
3. Open a discussion for general questions
4. Open an issue for bugs or feature requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
