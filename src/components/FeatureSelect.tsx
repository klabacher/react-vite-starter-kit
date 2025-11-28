import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { FeatureFlags } from '../types/index.js';
import { featureDescriptions } from '../config/templates.js';

interface FeatureSelectProps {
  features: FeatureFlags;
  onSubmit: (features: FeatureFlags) => void;
  onBack: () => void;
}

type FeatureKey = keyof FeatureFlags;

const featureOrder: FeatureKey[] = [
  'tailwindcss',
  'redux',
  'reactRouter',
  'eslint',
  'prettier',
  'husky',
  'githubActions',
  'vscode',
  'testing',
];

export function FeatureSelect({
  features,
  onSubmit,
  onBack,
}: FeatureSelectProps): React.ReactElement {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureFlags>({ ...features });
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor(prev => (prev > 0 ? prev - 1 : featureOrder.length - 1));
    } else if (key.downArrow) {
      setCursor(prev => (prev < featureOrder.length - 1 ? prev + 1 : 0));
    } else if (input === ' ') {
      const feature = featureOrder[cursor];
      if (feature !== 'typescript') {
        // TypeScript is always enabled
        setSelectedFeatures(prev => ({
          ...prev,
          [feature]: !prev[feature],
        }));
      }
    } else if (key.return) {
      onSubmit(selectedFeatures);
    } else if (key.escape) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🎨 Select features (Space to toggle)
        </Text>
      </Box>

      {/* TypeScript is always included */}
      <Box marginBottom={1}>
        <Text color="gray">
          ✓ <Text color="blue">{featureDescriptions.typescript.icon}</Text>{' '}
          <Text>{featureDescriptions.typescript.name}</Text>
          <Text dimColor> (always included)</Text>
        </Text>
      </Box>

      {featureOrder.map((feature, index) => {
        const isSelected = cursor === index;
        const isEnabled = selectedFeatures[feature];
        const desc = featureDescriptions[feature];

        return (
          <Box key={feature}>
            <Text color={isSelected ? 'cyan' : undefined}>
              {isSelected ? '❯ ' : '  '}
              <Text color={isEnabled ? 'green' : 'gray'}>{isEnabled ? '◉' : '○'}</Text>{' '}
              <Text>{desc.icon}</Text> <Text bold={!!isEnabled}>{desc.name}</Text>
              <Text dimColor> - {desc.description}</Text>
            </Text>
          </Box>
        );
      })}

      <Box marginTop={2} flexDirection="column">
        <Box>
          <Text dimColor>
            <Text color="cyan">Space</Text> toggle •<Text color="cyan"> ↑↓</Text> navigate •
            <Text color="cyan"> Enter</Text> confirm •<Text color="cyan"> Esc</Text> back
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text color="green">
            Selected: {featureOrder.filter(f => selectedFeatures[f]).length + 1} features
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
