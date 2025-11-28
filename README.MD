# react-vite-starter-kit - Development Plan for V1

This projects aims a Out-Of-The-Box experience when creating React + Vite Apps. Focusing on scaffolding comonly used features on Vite Projects without the headdaque of always redoing the same code. Just type `npx react-vite-starter-kit` and select templates or build your custom project.

Be Faster!

## For Later publish

npm publish --access public

## Should install and configure

- Node - I think node v22 or greatter shoulb be good

- Package managers: npm, maybe yarn??

Check for compatibilite versions with this boilerplate version and yells if not comatipable. Asks for update

## Initial Config

- Asks for compatible folder

- Asks for node compatible project name, author, license and etc. Like npm init

- asks if its going to init git project. If yes, check for git command line and initialize with same name and details from project.json. If not fails and asks for installing git with a link tutorial and install "sudo apt-get install git" message

## Bare Deps

- Vite + using rolldown-vite + configuration depending what is installed

- React + React-dom - configuration

TODO: Add legacy vite option

## Optional Deps/outofbox features

- React-Router-Dom + Setup Provider and a base "/" + "/404" setup

- Redux/Redux Toolkit + Configured default Slice & Store

- TailwindCSS + Direcly as index.css import for easier manipulation later

## Ready to go - Adaptive Configuration

All of them, in case of the selcted packages will be modify for compatibly with the project and their packages

### Necessary Deps Config

- Typescript setup - Necessary - Modify based on optional Deps

- Vite - Necessary - May be modify based on optional deps

- Package.json config based on Selected Packages

### Optional Deps Config

- TailwindCSS configurations on app(Base) Ex: tailwind.config.ts. If other options selected then configure -> Prettier, Editor and Eslint with robust configurations

- Eslint + configuration

- Prettier + configuration

### Optional Project Configurations

- ".github" CI/CD - Github Actions - Out of the box

- VSCode Editor simple features ".vscode" + .editorconfig

## Cli Configuration

CLI for selecting templates or custom packages based on commander and INK - Cli React Components

## For Later Versions

- TODO: Supabase. Later implementaion only
- TODO: Custom configurations for typescript
- TODO: Custom configurations for linting and TypeCheck

- some more stuff idk
