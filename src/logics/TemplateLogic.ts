import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import type { FeatureFlags } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to templates directory (relative to dist or src)
function getTemplatesDir(): string {
  // Check for templates in different locations
  const possiblePaths = [
    join(__dirname, '../../templates'), // From dist/logics/
    join(__dirname, '../../../templates'), // Alternative path
    join(process.cwd(), 'templates'), // Current working directory
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  return possiblePaths[0]; // Default to first path
}

export interface TemplateFile {
  source: string;
  dest: string;
  template?: boolean; // If true, file content should be processed
}

// Base template files (always included)
export async function getTemplateFiles(
  templateType: 'base' | 'full-pack'
): Promise<TemplateFile[]> {
  const templatesDir = getTemplatesDir();
  const files: TemplateFile[] = [];

  if (templateType === 'base') {
    // Return minimal base structure
    return [
      // We'll generate these dynamically instead
    ];
  }

  if (templateType === 'full-pack') {
    const fullPackDir = join(templatesDir, 'full-pack');
    return await getFilesRecursive(fullPackDir, '');
  }

  return files;
}

// Feature-specific files
export async function getFeatureFiles(_features: FeatureFlags): Promise<TemplateFile[]> {
  // For now, we generate feature files dynamically in ProjectCreator
  // This function can be extended to copy pre-made template files

  return [];
}

// Helper to get all files recursively from a directory
async function getFilesRecursive(dir: string, relativePath: string): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const destPath = relativePath ? join(relativePath, entry.name) : entry.name;

    if (entry.isDirectory()) {
      // Skip node_modules and other common directories
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      const subFiles = await getFilesRecursive(fullPath, destPath);
      files.push(...subFiles);
    } else {
      files.push({
        source: fullPath,
        dest: destPath,
      });
    }
  }

  return files;
}

// Get source file content for a specific template
export async function getSourceFileContent(
  templateId: string,
  features: FeatureFlags
): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();

  // Generate main.tsx content
  contentMap.set('src/main.tsx', generateMainTsx(features));

  // Generate App.tsx content
  contentMap.set('src/App.tsx', generateAppTsx(features));

  // Generate App.css content
  contentMap.set('src/App.css', generateAppCss(features));

  // Redux files
  if (features.redux) {
    contentMap.set('src/store/store.ts', generateReduxStore());
    contentMap.set('src/store/slices/appSlice.ts', generateReduxSlice());
  }

  return contentMap;
}

function generateMainTsx(features: FeatureFlags): string {
  const imports = [
    "import { StrictMode } from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import App from './App';",
  ];

  if (features.tailwindcss) {
    imports.push("import './App.css';");
  }

  if (features.redux) {
    imports.push("import { Provider } from 'react-redux';");
    imports.push("import { store } from './store/store';");
  }

  if (features.reactRouter) {
    imports.push("import { BrowserRouter } from 'react-router-dom';");
  }

  let appContent = '<App />';

  if (features.reactRouter) {
    appContent = `<BrowserRouter>\n        ${appContent}\n      </BrowserRouter>`;
  }

  if (features.redux) {
    appContent = `<Provider store={store}>\n        ${appContent}\n      </Provider>`;
  }

  return `${imports.join('\n')}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    ${appContent}
  </StrictMode>
);
`;
}

function generateAppTsx(features: FeatureFlags): string {
  const baseStyles = features.tailwindcss
    ? 'className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center"'
    : '';

  const titleStyles = features.tailwindcss ? 'className="text-4xl font-bold text-white mb-4"' : '';

  const descStyles = features.tailwindcss ? 'className="text-gray-400"' : '';

  return `function App() {
  return (
    <div ${baseStyles}>
      <div ${features.tailwindcss ? 'className="text-center"' : ''}>
        <h1 ${titleStyles}>
          React + Vite
        </h1>
        <p ${descStyles}>
          Edit <code>src/App.tsx</code> and save to see changes
        </p>
      </div>
    </div>
  );
}

export default App;
`;
}

function generateAppCss(features: FeatureFlags): string {
  if (features.tailwindcss) {
    return `@import 'tailwindcss';
`;
  }

  return `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
`;
}

function generateReduxStore(): string {
  return `import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}

function generateReduxSlice(): string {
  return `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AppState {
  theme: 'light' | 'dark';
}

const initialState: AppState = {
  theme: 'dark',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setTheme, toggleTheme } = appSlice.actions;
export const selectTheme = (state: RootState) => state.app.theme;
export default appSlice.reducer;
`;
}
