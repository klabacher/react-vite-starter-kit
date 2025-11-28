import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { validateProjectName, suggestValidName } from '../utils/validation.js';
import { existsSync } from 'fs';
import { join } from 'path';

interface ProjectNameInputProps {
  initialValue?: string;
  onSubmit: (name: string, targetDir: string) => void;
}

export function ProjectNameInput({
  initialValue = '',
  onSubmit,
}: ProjectNameInputProps): React.ReactElement {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setName(value);
    setError(null);

    // Provide suggestions for invalid names
    const validation = validateProjectName(value);
    if (!validation.valid && value.length > 0) {
      const suggested = suggestValidName(value);
      setSuggestion(suggested !== value ? suggested : null);
    } else {
      setSuggestion(null);
    }
  };

  const handleSubmit = (value: string) => {
    const validation = validateProjectName(value);

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    const targetDir = join(process.cwd(), value);

    if (existsSync(targetDir)) {
      setError(`Directory "${value}" already exists`);
      return;
    }

    onSubmit(value, targetDir);
  };

  useInput((input, key) => {
    // Use suggestion with Tab
    if (key.tab && suggestion) {
      setName(suggestion);
      setSuggestion(null);
      setError(null);
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📁 Project name
        </Text>
      </Box>

      <Box>
        <Text color="gray">{'> '}</Text>
        <TextInput
          value={name}
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder="my-awesome-app"
        />
      </Box>

      {error && (
        <Box marginTop={1}>
          <Text color="red">✖ {error}</Text>
        </Box>
      )}

      {suggestion && !error && (
        <Box marginTop={1}>
          <Text color="yellow">
            💡 Suggestion: <Text color="green">{suggestion}</Text>
            <Text dimColor> (press Tab to use)</Text>
          </Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>
          Enter a valid npm package name. Will create directory: ./{name || 'project-name'}
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Press </Text>
        <Text color="cyan">Enter</Text>
        <Text dimColor> to continue</Text>
      </Box>
    </Box>
  );
}
