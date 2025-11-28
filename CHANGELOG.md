# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2024-11-28

### Added

#### CLI Implementation

- **Complete CLI wizard** using Ink (React for terminal) with interactive multi-step flow
- **Commander.js integration** for argument parsing (`--template`, `--yes`, `--no-git`, `--no-install`)
- **Project name validation** with npm package name validation and smart suggestions
- **Template selection** with 4 preset templates:
  - ⚡ Minimal - React + Vite + TypeScript only
  - 📦 Standard - Adds TailwindCSS + ESLint + Prettier
  - 🚀 Full Pack - Everything included with Redux, React Router, Husky, GitHub Actions
  - 🎨 Custom - Pick your own features
- **Feature selection** for custom template with toggleable options
- **Package manager selection** (npm, yarn, pnpm)
- **Git initialization prompt** with auto-detection of git availability

#### Project Generation

- **Dynamic package.json generation** based on selected features
- **TypeScript configuration** with proper tsconfig.json, tsconfig.app.json, tsconfig.node.json
- **Vite configuration** with rolldown-vite support
- **ESLint 9 flat config** with TypeScript, React hooks, and Prettier integration
- **Prettier configuration** with sensible defaults
- **TailwindCSS v4** configuration with Vite plugin
- **Redux Toolkit** store and slice generation
- **React Router** integration ready
- **Husky + lint-staged** for pre-commit hooks
- **GitHub Actions CI/CD** workflow for Node.js matrix testing (18.x, 20.x, 22.x)
- **VS Code configuration** with recommended extensions and settings

#### Build & Development

- **ESM module system** - Fully ESM compatible
- **tsup bundler** for building CLI distribution
- **tsx** for development with TypeScript
- **Proper npm publish configuration** with `files`, `bin`, and `publishConfig`

#### UI Components (Ink)

- `WelcomeScreen` - Animated welcome with gradient text
- `ProjectNameInput` - Input with validation and suggestions
- `TemplateSelect` - Template picker with descriptions
- `FeatureSelect` - Multi-toggle feature selection
- `PackageManagerSelect` - Package manager picker
- `GitInitPrompt` - Git initialization with availability check
- `Summary` - Project configuration summary
- `CreatingProject` - Progress indicator with step tracking
- `CompleteScreen` - Success message with next steps
- `ErrorScreen` - Error display with retry option

### Changed

- Updated from CommonJS to ESM module system
- Changed main entry from `main.ts` to compiled `dist/main.js`
- Updated React to v18.3.1 for Ink compatibility
- Restructured project with modular architecture

### Project Structure

```
src/
├── main.ts              # CLI entry point with Commander
├── app.tsx              # Main Ink app with wizard state
├── components/          # UI components
│   ├── WelcomeScreen.tsx
│   ├── ProjectNameInput.tsx
│   ├── TemplateSelect.tsx
│   ├── FeatureSelect.tsx
│   ├── PackageManagerSelect.tsx
│   ├── GitInitPrompt.tsx
│   ├── Summary.tsx
│   ├── CreatingProject.tsx
│   ├── CompleteScreen.tsx
│   └── ErrorScreen.tsx
├── config/
│   ├── templates.ts     # Template definitions
│   └── dependencies.ts  # Dependency versions
├── logics/
│   ├── ProjectCreator.ts    # Project generation logic
│   ├── PackageJsonLogic.ts  # package.json builder
│   └── TemplateLogic.ts     # Template file generation
├── types/
│   └── index.ts         # TypeScript type definitions
└── utils/
    ├── version.ts       # Version checking utilities
    └── validation.ts    # Name validation utilities
```

### Dependencies

#### Runtime

- `commander` - CLI argument parsing
- `ink` - React for CLI
- `ink-big-text` - ASCII art titles
- `ink-gradient` - Gradient text effects
- `ink-select-input` - Selection input
- `ink-spinner` - Loading spinners
- `ink-text-input` - Text input
- `chalk` - Terminal colors
- `fs-extra` - File system utilities
- `ora` - Elegant terminal spinners
- `validate-npm-package-name` - Package name validation

#### Development

- `typescript` - Type checking
- `tsup` - Build tool
- `tsx` - TypeScript execution
- `eslint` - Linting
- `prettier` - Code formatting
- `husky` - Git hooks
- `lint-staged` - Staged file linting

## [0.0.2] - Previous

### Added

- Initial project setup
- Basic template structure in `templates/full-pack/`
- Ink dependency installation

---

## Roadmap

### [0.1.0] - Planned

- [ ] Supabase integration template
- [ ] Custom TypeScript configurations
- [ ] Custom linting presets
- [ ] Template caching for faster project creation
- [ ] Update checker for CLI

### [0.2.0] - Future

- [ ] Monorepo support
- [ ] Docker configuration templates
- [ ] CI/CD templates for GitLab, Bitbucket
- [ ] Custom component library scaffolding
