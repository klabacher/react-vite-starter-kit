import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FeatureFlags } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TemplateContext - All variables available for template interpolation
 */
export interface TemplateContext {
  // Feature flags
  features: FeatureFlags;

  // Project metadata
  projectName?: string;
  author?: string;
  description?: string;
  license?: string;

  // Computed helpers
  hasProviders: boolean;
  providerOrder: string[]; // e.g., ['i18n', 'redux', 'router']

  // Custom variables
  [key: string]: unknown;
}

/**
 * TemplateEngine - A powerful, Handlebars-like template processor
 *
 * Supported syntax:
 * - {{variable}} - Variable interpolation
 * - {{#if condition}}...{{/if}} - Conditional blocks
 * - {{#if condition}}...{{else}}...{{/if}} - If-else blocks
 * - {{#unless condition}}...{{/unless}} - Negated conditionals
 * - {{#each array}}...{{/each}} - Array iteration with {{this}}, {{@index}}, {{@first}}, {{@last}}
 * - {{#with object}}...{{/with}} - Context switching
 * - {{> partialName}} - Partial inclusion (from partials directory)
 * - {{!-- comment --}} - Comments (removed from output)
 * - {{{raw}}} - Unescaped HTML output
 */
export class TemplateEngine {
  private templatesDir: string;
  private partialsCache: Map<string, string> = new Map();
  private context: TemplateContext;

  constructor(context: TemplateContext) {
    this.context = context;
    this.templatesDir = this.findTemplatesDir();
  }

  /**
   * Find the templates directory
   */
  private findTemplatesDir(): string {
    const possiblePaths = [
      path.join(__dirname, '../../templates/dynamic'),
      path.join(__dirname, '../../../templates/dynamic'),
      path.join(process.cwd(), 'templates/dynamic'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    // Create the directory if it doesn't exist
    const defaultPath = possiblePaths[0];
    fs.mkdirSync(defaultPath, { recursive: true });
    return defaultPath;
  }

  /**
   * Process a template string with the current context
   */
  public process(template: string, additionalContext?: Record<string, unknown>): string {
    const ctx = { ...this.context, ...additionalContext };
    let result = template;

    // Remove comments {{!-- ... --}}
    result = this.removeComments(result);

    // Process partials {{> partialName}}
    result = this.processPartials(result, ctx);

    // Process {{#with object}}...{{/with}} blocks
    result = this.processWithBlocks(result, ctx);

    // Process {{#each array}}...{{/each}} blocks
    result = this.processEachBlocks(result, ctx);

    // Process {{#unless condition}}...{{/unless}} blocks
    result = this.processUnlessBlocks(result, ctx);

    // Process {{#if condition}}...{{else}}...{{/if}} blocks
    result = this.processIfElseBlocks(result, ctx);

    // Process {{#if condition}}...{{/if}} blocks (without else)
    result = this.processIfBlocks(result, ctx);

    // Process triple-brace unescaped output {{{variable}}}
    result = this.processUnescapedVariables(result, ctx);

    // Process regular variables {{variable}}
    result = this.processVariables(result, ctx);

    // Clean up excessive blank lines
    result = this.cleanupWhitespace(result);

    return result;
  }

  /**
   * Process a template file from the templates directory
   */
  public processFile(templatePath: string, additionalContext?: Record<string, unknown>): string {
    const fullPath = path.isAbsolute(templatePath)
      ? templatePath
      : path.join(this.templatesDir, templatePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Template file not found: ${fullPath}`);
    }

    const template = fs.readFileSync(fullPath, 'utf-8');
    return this.process(template, additionalContext);
  }

  /**
   * Check if a template file exists
   */
  public templateExists(templatePath: string): boolean {
    const fullPath = path.isAbsolute(templatePath)
      ? templatePath
      : path.join(this.templatesDir, templatePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get the templates directory path
   */
  public getTemplatesDir(): string {
    return this.templatesDir;
  }

  /**
   * Update the context
   */
  public setContext(context: Partial<TemplateContext>): void {
    this.context = { ...this.context, ...context };
  }

  // ============================================================================
  // PRIVATE PROCESSING METHODS
  // ============================================================================

  /**
   * Remove template comments
   */
  private removeComments(template: string): string {
    return template.replace(/\{\{!--[\s\S]*?--\}\}/g, '');
  }

  /**
   * Process partial inclusions
   */
  private processPartials(template: string, ctx: Record<string, unknown>): string {
    const partialRegex = /\{\{>\s*(\w+)\s*\}\}/g;

    return template.replace(partialRegex, (_match, partialName) => {
      const partialContent = this.loadPartial(partialName);
      if (partialContent) {
        return this.process(partialContent, ctx);
      }
      return `<!-- Partial "${partialName}" not found -->`;
    });
  }

  /**
   * Load a partial from cache or file system
   */
  private loadPartial(name: string): string | null {
    if (this.partialsCache.has(name)) {
      return this.partialsCache.get(name)!;
    }

    const partialsDir = path.join(this.templatesDir, 'partials');
    const partialPath = path.join(partialsDir, `${name}.template`);

    if (fs.existsSync(partialPath)) {
      const content = fs.readFileSync(partialPath, 'utf-8');
      this.partialsCache.set(name, content);
      return content;
    }

    return null;
  }

  /**
   * Process {{#with object}}...{{/with}} blocks
   */
  private processWithBlocks(template: string, ctx: Record<string, unknown>): string {
    const withRegex = /\{\{#with\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/with\}\}/g;

    return template.replace(withRegex, (_match, path, content) => {
      const value = this.resolvePath(path, ctx);
      if (value && typeof value === 'object') {
        return this.process(content, { ...ctx, ...value });
      }
      return '';
    });
  }

  /**
   * Process {{#each array}}...{{/each}} blocks
   */
  private processEachBlocks(template: string, ctx: Record<string, unknown>): string {
    const eachRegex = /\{\{#each\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return template.replace(eachRegex, (_match, path, content) => {
      const array = this.resolvePath(path, ctx);

      if (!Array.isArray(array)) {
        return '';
      }

      return array
        .map((item, index) => {
          const itemCtx = {
            ...ctx,
            this: item,
            '@index': index,
            '@first': index === 0,
            '@last': index === array.length - 1,
          };

          // If item is an object, spread its properties
          if (typeof item === 'object' && item !== null) {
            Object.assign(itemCtx, item);
          }

          return this.process(content, itemCtx);
        })
        .join('');
    });
  }

  /**
   * Process {{#unless condition}}...{{/unless}} blocks
   */
  private processUnlessBlocks(template: string, ctx: Record<string, unknown>): string {
    const unlessRegex = /\{\{#unless\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/unless\}\}/g;

    return template.replace(unlessRegex, (_match, condition, content) => {
      const value = this.resolvePath(condition, ctx);
      return !this.isTruthy(value) ? this.process(content, ctx) : '';
    });
  }

  /**
   * Process {{#if condition}}...{{else}}...{{/if}} blocks
   */
  private processIfElseBlocks(template: string, ctx: Record<string, unknown>): string {
    const ifElseRegex =
      /\{\{#if\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return template.replace(ifElseRegex, (_match, condition, ifContent, elseContent) => {
      const value = this.resolvePath(condition, ctx);
      return this.isTruthy(value) ? this.process(ifContent, ctx) : this.process(elseContent, ctx);
    });
  }

  /**
   * Process {{#if condition}}...{{/if}} blocks (without else)
   */
  private processIfBlocks(template: string, ctx: Record<string, unknown>): string {
    const ifRegex = /\{\{#if\s+(\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return template.replace(ifRegex, (_match, condition, content) => {
      const value = this.resolvePath(condition, ctx);
      return this.isTruthy(value) ? this.process(content, ctx) : '';
    });
  }

  /**
   * Process triple-brace unescaped output
   */
  private processUnescapedVariables(template: string, ctx: Record<string, unknown>): string {
    const unescapedRegex = /\{\{\{(\w+(?:\.\w+)*)\}\}\}/g;

    return template.replace(unescapedRegex, (_match, path) => {
      const value = this.resolvePath(path, ctx);
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  /**
   * Process regular variable interpolation
   */
  private processVariables(template: string, ctx: Record<string, unknown>): string {
    const variableRegex = /\{\{(\w+(?:\.\w+)*)\}\}/g;

    return template.replace(variableRegex, (_match, path) => {
      const value = this.resolvePath(path, ctx);
      if (value !== undefined && value !== null) {
        return this.escapeHtml(String(value));
      }
      return '';
    });
  }

  /**
   * Resolve a dot-notation path in the context
   */
  private resolvePath(pathStr: string, ctx: Record<string, unknown>): unknown {
    // Handle special variables
    if (pathStr === 'this') return ctx['this'];
    if (pathStr.startsWith('@')) return ctx[pathStr];

    // Handle features.* paths
    if (pathStr.startsWith('features.')) {
      const featureKey = pathStr.substring(9) as keyof FeatureFlags;
      return (ctx.features as FeatureFlags | undefined)?.[featureKey];
    }

    const parts = pathStr.split('.');
    let current: unknown = ctx;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }

  /**
   * Check if a value is truthy in template context
   */
  private isTruthy(value: unknown): boolean {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return Boolean(value);
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
  }

  /**
   * Clean up excessive whitespace
   */
  private cleanupWhitespace(template: string): string {
    // Remove lines that are only whitespace followed by a conditional that was removed
    let result = template;

    // Remove more than 2 consecutive blank lines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Remove trailing whitespace from lines
    result = result.replace(/[ \t]+$/gm, '');

    return result;
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a TemplateEngine with feature flags
 */
export function createTemplateEngine(
  features: FeatureFlags,
  projectConfig?: {
    projectName?: string;
    author?: string;
    description?: string;
    license?: string;
  }
): TemplateEngine {
  // Compute provider order based on features (i18n → redux → router)
  const providerOrder: string[] = [];
  if (features.i18n) providerOrder.push('i18n');
  if (features.redux) providerOrder.push('redux');
  if (features.reactRouter) providerOrder.push('router');

  const context: TemplateContext = {
    features,
    projectName: projectConfig?.projectName || 'my-app',
    author: projectConfig?.author || '',
    description: projectConfig?.description || '',
    license: projectConfig?.license || 'MIT',
    hasProviders: providerOrder.length > 0,
    providerOrder,
  };

  return new TemplateEngine(context);
}

/**
 * Create context from FeatureFlags for standalone processing
 */
export function createTemplateContext(
  features: FeatureFlags,
  additionalContext?: Record<string, unknown>
): TemplateContext {
  const providerOrder: string[] = [];
  if (features.i18n) providerOrder.push('i18n');
  if (features.redux) providerOrder.push('redux');
  if (features.reactRouter) providerOrder.push('router');

  return {
    features,
    hasProviders: providerOrder.length > 0,
    providerOrder,
    ...additionalContext,
  };
}

/**
 * Quick process a template string with features
 */
export function processTemplate(
  template: string,
  features: FeatureFlags,
  additionalContext?: Record<string, unknown>
): string {
  const engine = createTemplateEngine(features);
  return engine.process(template, additionalContext);
}
