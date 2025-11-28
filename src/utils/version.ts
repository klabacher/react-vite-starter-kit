import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getVersion(): string {
  try {
    // Try multiple possible paths (dev vs built)
    const possiblePaths = [
      join(__dirname, '../../package.json'), // From dist/utils/
      join(__dirname, '../../../package.json'), // Alternative
      join(process.cwd(), 'package.json'), // Current directory
    ];

    for (const packagePath of possiblePaths) {
      if (existsSync(packagePath)) {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
        if (pkg.name === 'react-vite-starter-kit') {
          return pkg.version || '0.0.0';
        }
      }
    }
    return '0.0.3';
  } catch {
    return '0.0.3';
  }
}

export function checkNodeVersion(): { valid: boolean; message: string } {
  const currentVersion = process.version;
  const major = parseInt(currentVersion.slice(1).split('.')[0], 10);

  if (major < 18) {
    return {
      valid: false,
      message: `Node.js version ${currentVersion} is not supported. Please upgrade to Node.js 18.0.0 or higher.`,
    };
  }

  return {
    valid: true,
    message: `Node.js ${currentVersion} detected`,
  };
}

export function getNpmVersion(): string | null {
  try {
    return execSync('npm --version', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}
