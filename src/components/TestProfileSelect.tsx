import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { TestProfile } from '../types/index.js';
import { testProfiles } from '../config/testProfiles.js';

interface TestProfileSelectProps {
  onSelect: (profile: TestProfile) => void;
  onSkip: () => void;
}

const profileOrder: TestProfile[] = ['bare', 'minimum', 'standard', 'advanced', 'complete'];

const profileIcons: Record<TestProfile, string> = {
  bare: '📦',
  minimum: '🔧',
  standard: '✅',
  advanced: '🚀',
  complete: '💯',
};

export function TestProfileSelect({
  onSelect,
  onSkip,
}: TestProfileSelectProps): React.ReactElement {
  const [cursor, setCursor] = useState(2); // Default to 'standard'

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor(prev => (prev > 0 ? prev - 1 : profileOrder.length - 1));
    } else if (key.downArrow) {
      setCursor(prev => (prev < profileOrder.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(profileOrder[cursor]);
    } else if (key.escape || input === 's') {
      onSkip();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🧪 Selecione o perfil de testes
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>Escolha o nível de testes que deseja incluir no projeto.</Text>
      </Box>

      {profileOrder.map((profile, index) => {
        const isSelected = cursor === index;
        const config = testProfiles[profile];
        const icon = profileIcons[profile];

        return (
          <Box
            key={profile}
            flexDirection="column"
            marginBottom={index < profileOrder.length - 1 ? 1 : 0}
          >
            <Box>
              <Text color={isSelected ? 'cyan' : undefined}>
                {isSelected ? '❯ ' : '  '}
                <Text color={isSelected ? 'yellow' : 'white'}>{icon}</Text>{' '}
                <Text bold={isSelected}>{config.name}</Text>
              </Text>
            </Box>
            <Box marginLeft={4}>
              <Text dimColor>{config.description}</Text>
            </Box>
            <Box marginLeft={4}>
              <Text color="gray">
                Coverage:{' '}
                <Text color={getCoverageColor(config.coverageThreshold)}>
                  {config.coverageThreshold}%
                </Text>
                {' • '}
                Testes: {getTestTypesLabel(config.includeTests)}
              </Text>
            </Box>
          </Box>
        );
      })}

      <Box marginTop={2} flexDirection="column">
        <Box>
          <Text dimColor>
            <Text color="cyan">↑↓</Text> navegar • <Text color="cyan">Enter</Text> selecionar •{' '}
            <Text color="cyan">S/Esc</Text> pular (sem testes)
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function getCoverageColor(threshold: number): string {
  if (threshold >= 90) return 'green';
  if (threshold >= 70) return 'yellow';
  if (threshold >= 50) return 'cyan';
  return 'gray';
}

function getTestTypesLabel(includeTests: {
  unit: boolean;
  integration: boolean;
  a11y: boolean;
  performance: boolean;
  snapshot: boolean;
}): string {
  const types: string[] = [];
  if (includeTests.unit) types.push('Unit');
  if (includeTests.integration) types.push('Integration');
  if (includeTests.a11y) types.push('A11y');
  if (includeTests.performance) types.push('Performance');
  if (includeTests.snapshot) types.push('Snapshot');
  return types.length > 0 ? types.join(', ') : 'Apenas setup';
}
