import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { isGitInstalled } from '../utils/validation.js';

interface GitInitPromptProps {
  onSelect: (init: boolean) => void;
}

interface SelectItem {
  label: string;
  value: boolean;
}

export function GitInitPrompt({ onSelect }: GitInitPromptProps): React.ReactElement {
  const gitInstalled = isGitInstalled();

  const items: SelectItem[] = [
    { label: '✓ Yes, initialize git repository', value: true },
    { label: '✗ No, skip git initialization', value: false },
  ];

  const handleSelect = (item: SelectItem) => {
    onSelect(item.value);
  };

  if (!gitInstalled) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color="cyan" bold>
            🔧 Git initialization
          </Text>
        </Box>

        <Box flexDirection="column" marginLeft={2}>
          <Text color="yellow">⚠ Git is not installed or not found in PATH</Text>
          <Box marginTop={1}>
            <Text dimColor>
              To install git, visit: <Text color="blue">https://git-scm.com/downloads</Text>
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>
              Or run: <Text color="green">sudo apt-get install git</Text> (Linux)
            </Text>
          </Box>
        </Box>

        <Box marginTop={2}>
          <Text dimColor>Skipping git initialization...</Text>
        </Box>

        {/* Auto-continue without git */}
        <Box marginTop={1}>
          <SelectInput
            items={[{ label: 'Continue without git', value: false }]}
            onSelect={() => onSelect(false)}
            itemComponent={({ isSelected, label }) => (
              <Text color={isSelected ? 'cyan' : undefined}>
                {isSelected ? '❯ ' : '  '}
                {label}
              </Text>
            )}
            indicatorComponent={() => null}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🔧 Initialize git repository?
        </Text>
      </Box>

      <SelectInput
        items={items}
        onSelect={handleSelect}
        itemComponent={({ isSelected, label }) => (
          <Text color={isSelected ? 'cyan' : undefined}>
            {isSelected ? '❯ ' : '  '}
            {label}
          </Text>
        )}
        indicatorComponent={() => null}
      />

      <Box marginTop={1}>
        <Text dimColor>Git enables version control and is recommended for all projects.</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Use </Text>
        <Text color="cyan">↑↓</Text>
        <Text dimColor> to navigate, </Text>
        <Text color="cyan">Enter</Text>
        <Text dimColor> to select</Text>
      </Box>
    </Box>
  );
}
