import React from 'react';
import { Box, Text, useInput, useApp } from 'ink';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps): React.ReactElement {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === 'r' || input === 'R') {
      onRetry();
    } else if (input === 'q' || input === 'Q' || key.escape) {
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="red" bold>
          ❌ Error occurred
        </Text>
      </Box>

      <Box
        flexDirection="column"
        marginLeft={2}
        borderStyle="round"
        borderColor="red"
        paddingX={2}
        paddingY={1}
      >
        <Text color="red">{error}</Text>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Text dimColor>What would you like to do?</Text>
        <Box marginTop={1} marginLeft={2} flexDirection="column">
          <Box>
            <Text color="cyan">r</Text>
            <Text dimColor> - Retry</Text>
          </Box>
          <Box>
            <Text color="cyan">q</Text>
            <Text dimColor> - Quit</Text>
          </Box>
        </Box>
      </Box>

      <Box marginTop={2}>
        <Text dimColor>
          If this error persists, please report it at:{' '}
          <Text color="blue">
            https://github.com/klabacher/tsvite-react-tailwind-boilerplate/issues
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
