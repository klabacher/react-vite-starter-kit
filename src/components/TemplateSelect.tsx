import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { Template } from '../types/index.js';

interface TemplateSelectProps {
  templates: Template[];
  selectedId?: string;
  onSelect: (template: Template) => void;
}

interface SelectItem {
  label: string;
  value: string;
}

export function TemplateSelect({
  templates,
  selectedId,
  onSelect,
}: TemplateSelectProps): React.ReactElement {
  const items: SelectItem[] = templates.map(template => ({
    label: `${template.icon} ${template.name}`,
    value: template.id,
  }));

  const handleSelect = (item: SelectItem) => {
    const template = templates.find(t => t.id === item.value);
    if (template) {
      onSelect(template);
    }
  };

  const initialIndex = selectedId ? templates.findIndex(t => t.id === selectedId) : 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📦 Choose a template
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
        {templates.map(template => (
          <Box key={template.id} marginLeft={2}>
            <Text dimColor>
              {template.icon} <Text bold>{template.name}</Text>: {template.description}
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
