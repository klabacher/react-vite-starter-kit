import React from 'react';
import { Box, Text, useInput } from 'ink';
import type { ProjectConfig } from '../types/index.js';
import { featureDescriptions } from '../config/templates.js';

interface SummaryProps {
  config: ProjectConfig;
  onConfirm: () => void;
  onBack: () => void;
}

export function Summary({ config, onConfirm, onBack }: SummaryProps): React.ReactElement {
  useInput((input, key) => {
    if (key.return) {
      onConfirm();
    } else if (key.escape) {
      onBack();
    }
  });

  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key as keyof typeof featureDescriptions);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📋 Project Summary
        </Text>
      </Box>

      <Box
        flexDirection="column"
        marginLeft={2}
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
      >
        <Box>
          <Text color="gray">Project Name: </Text>
          <Text color="green" bold>
            {config.name}
          </Text>
        </Box>

        <Box>
          <Text color="gray">Template: </Text>
          <Text color="magenta">
            {config.template.icon} {config.template.name}
          </Text>
        </Box>

        <Box>
          <Text color="gray">Package Manager: </Text>
          <Text color="yellow">{config.packageManager}</Text>
        </Box>

        <Box>
          <Text color="gray">Git Init: </Text>
          <Text color={config.initGit ? 'green' : 'red'}>{config.initGit ? '✓ Yes' : '✗ No'}</Text>
        </Box>

        <Box>
          <Text color="gray">Install Deps: </Text>
          <Text color={config.installDeps ? 'green' : 'red'}>
            {config.installDeps ? '✓ Yes' : '✗ No'}
          </Text>
        </Box>

        <Box>
          <Text color="gray">Directory: </Text>
          <Text color="blue">{config.targetDir}</Text>
        </Box>
      </Box>

      <Box marginTop={1} marginBottom={1}>
        <Text color="cyan" bold>
          🎨 Features
        </Text>
      </Box>

      <Box flexDirection="row" flexWrap="wrap" marginLeft={2}>
        {enabledFeatures.map(feature => (
          <Box key={feature} marginRight={2}>
            <Text color="green">
              {featureDescriptions[feature]?.icon || '•'}{' '}
              {featureDescriptions[feature]?.name || feature}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Box>
          <Text color="green" bold>
            Press Enter to create project
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>
            <Text color="cyan">Enter</Text> confirm •<Text color="cyan"> Esc</Text> go back
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
