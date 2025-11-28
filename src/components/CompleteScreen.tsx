import React from 'react';
import { Box, Text } from 'ink';
import type { ProjectConfig } from '../types/index.js';

interface CompleteScreenProps {
  config: ProjectConfig;
}

export function CompleteScreen({ config }: CompleteScreenProps): React.ReactElement {
  const getRunCommand = () => {
    switch (config.packageManager) {
      case 'yarn':
        return 'yarn dev';
      case 'pnpm':
        return 'pnpm dev';
      default:
        return 'npm run dev';
    }
  };

  const getInstallCommand = () => {
    switch (config.packageManager) {
      case 'yarn':
        return 'yarn';
      case 'pnpm':
        return 'pnpm install';
      default:
        return 'npm install';
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="green" bold>
          🎉 Success! Created {config.name} at {config.targetDir}
        </Text>
      </Box>

      <Box
        flexDirection="column"
        marginLeft={2}
        borderStyle="round"
        borderColor="green"
        paddingX={2}
        paddingY={1}
      >
        <Text color="white" bold>
          Get started:
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Box>
            <Text color="cyan"> cd </Text>
            <Text color="yellow">{config.name}</Text>
          </Box>

          {!config.installDeps && (
            <Box>
              <Text color="cyan"> {getInstallCommand()}</Text>
            </Box>
          )}

          <Box>
            <Text color="cyan"> {getRunCommand()}</Text>
          </Box>
        </Box>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Text dimColor>Useful commands:</Text>
        <Box marginLeft={2} flexDirection="column" marginTop={1}>
          {config.features.eslint && (
            <Box>
              <Text color="gray">• </Text>
              <Text color="cyan">
                {config.packageManager === 'npm' ? 'npm run ' : config.packageManager + ' '}lint
              </Text>
              <Text dimColor> - Check for linting errors</Text>
            </Box>
          )}
          {config.features.prettier && (
            <Box>
              <Text color="gray">• </Text>
              <Text color="cyan">
                {config.packageManager === 'npm' ? 'npm run ' : config.packageManager + ' '}format
              </Text>
              <Text dimColor> - Format code with Prettier</Text>
            </Box>
          )}
          <Box>
            <Text color="gray">• </Text>
            <Text color="cyan">
              {config.packageManager === 'npm' ? 'npm run ' : config.packageManager + ' '}build
            </Text>
            <Text dimColor> - Build for production</Text>
          </Box>
          <Box>
            <Text color="gray">• </Text>
            <Text color="cyan">
              {config.packageManager === 'npm' ? 'npm run ' : config.packageManager + ' '}preview
            </Text>
            <Text dimColor> - Preview production build</Text>
          </Box>
        </Box>
      </Box>

      <Box marginTop={2}>
        <Text dimColor>Happy coding! 🚀</Text>
      </Box>
    </Box>
  );
}
