import type { Plugin, PluginContext, PluginFile } from '../types/index.js';
import { featureDependencies, featureDevDependencies } from '../config/dependencies.js';

/**
 * Redux Toolkit Plugin
 *
 * Generates Redux store, slices, and type definitions
 */
export const reduxPlugin: Plugin = {
  id: 'redux',
  name: 'Redux Toolkit',
  description: 'State management with Redux Toolkit',
  order: 20,

  shouldActivate: features => features.redux,

  async getFiles(_context: PluginContext): Promise<PluginFile[]> {
    return [
      {
        path: 'src/store/store.ts',
        content: `import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`,
      },
      {
        path: 'src/store/slices/appSlice.ts',
        content: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
`,
      },
      {
        path: 'src/store/hooks.ts',
        content: `import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed hooks for use throughout the app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`,
      },
    ];
  },

  getDependencies: () => featureDependencies.redux || {},

  getDevDependencies: () => featureDevDependencies.redux || {},
};

export default reduxPlugin;
