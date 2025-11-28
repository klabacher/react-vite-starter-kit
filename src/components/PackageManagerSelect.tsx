import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { PackageManager } from '../types/index.js';

interface PackageManagerSelectProps {
  selected?: PackageManager;
  onSelect: (pm: PackageManager) => void;
}

interface SelectItem {
  label: string;
  value: PackageManager;
}

const packageManagers: {
  value: PackageManager;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: 'npm',
    label: 'npm',
    icon: '📦',
    description: 'Node Package Manager (default)',
  },
  {
    value: 'yarn',
    label: 'yarn',
    icon: '🧶',
    description: 'Fast, reliable, and secure dependency management',
  },
  {
    value: 'pnpm',
    label: 'pnpm',
    icon: '⚡',
    description: 'Fast, disk space efficient package manager',
  },
];

export function PackageManagerSelect({
  selected = 'npm',
  onSelect,
}: PackageManagerSelectProps): React.ReactElement {
  const items: SelectItem[] = packageManagers.map(pm => ({
    label: `${pm.icon} ${pm.label}`,
    value: pm.value,
  }));

  const handleSelect = (item: SelectItem) => {
    onSelect(item.value);
  };

  const initialIndex = packageManagers.findIndex(pm => pm.value === selected);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📥 Choose package manager
        </Text>
      </Box>

      <SelectInput
        items={items}
        initialIndex={initialIndex >= 0 ? initialIndex : 0}
        onSelect={handleSelect}
        itemComponent={({ isSelected, label }) => (
          <Text color={isSelected ? 'cyan' : undefined}>
            {isSelected ? '❯ ' : '  '}
            {label}
          </Text>
        )}
        indicatorComponent={() => null}
      />

      <Box marginTop={1} flexDirection="column">
        {packageManagers.map(pm => (
          <Box key={pm.value} marginLeft={2}>
            <Text dimColor>
              {pm.icon} <Text bold>{pm.label}</Text>: {pm.description}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text dimColor>Use </Text>
        <Text color="cyan">↑↓</Text>
        <Text dimColor> to navigate, </Text>
        <Text color="cyan">Enter</Text>
        <Text dimColor> to select</Text>
      </Box>
    </Box>
  );
}
