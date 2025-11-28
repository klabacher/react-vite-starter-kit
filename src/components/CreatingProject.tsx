import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type { ProjectConfig } from '../types/index.js';
import { createProject } from '../logics/ProjectCreator.js';

interface CreatingProjectProps {
  config: ProjectConfig;
  onComplete: () => void;
  onError: (error: string) => void;
}

type CreationStep =
  | 'creating-directory'
  | 'copying-files'
  | 'generating-config'
  | 'initializing-git'
  | 'installing-deps'
  | 'complete';

interface StepStatus {
  step: CreationStep;
  message: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
}

export function CreatingProject({
  config,
  onComplete,
  onError,
}: CreatingProjectProps): React.ReactElement {
  const [steps, setSteps] = useState<StepStatus[]>([
    { step: 'creating-directory', message: 'Creating project directory', status: 'pending' },
    { step: 'copying-files', message: 'Copying template files', status: 'pending' },
    { step: 'generating-config', message: 'Generating configuration', status: 'pending' },
    ...(config.initGit
      ? [
          {
            step: 'initializing-git' as CreationStep,
            message: 'Initializing git repository',
            status: 'pending' as const,
          },
        ]
      : []),
    ...(config.installDeps
      ? [
          {
            step: 'installing-deps' as CreationStep,
            message: `Installing dependencies with ${config.packageManager}`,
            status: 'pending' as const,
          },
        ]
      : []),
  ]);
  const [, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const runCreation = async () => {
      try {
        await createProject(config, (stepIndex, status) => {
          setSteps(prev => {
            const updated = [...prev];
            if (updated[stepIndex]) {
              updated[stepIndex] = { ...updated[stepIndex], status };
            }
            return updated;
          });

          if (status === 'complete' && stepIndex < steps.length - 1) {
            setCurrentStep(stepIndex + 1);
          }
        });

        setIsComplete(true);

        // Small delay before transitioning
        setTimeout(() => {
          onComplete();
        }, 500);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        onError(errorMessage);
      }
    };

    runCreation();
  }, []);

  const getStatusIcon = (status: StepStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Text color="gray">○</Text>;
      case 'in-progress':
        return <Spinner type="dots" />;
      case 'complete':
        return <Text color="green">✓</Text>;
      case 'error':
        return <Text color="red">✗</Text>;
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🚀 Creating project: {config.name}
        </Text>
      </Box>

      <Box flexDirection="column" marginLeft={2}>
        {steps.map(step => (
          <Box key={step.step}>
            {getStatusIcon(step.status)}
            <Text
              color={
                step.status === 'complete'
                  ? 'green'
                  : step.status === 'in-progress'
                    ? 'yellow'
                    : 'gray'
              }
            >
              {' '}
              {step.message}
            </Text>
          </Box>
        ))}
      </Box>

      {isComplete && (
        <Box marginTop={2}>
          <Text color="green" bold>
            ✨ Project created successfully!
          </Text>
        </Box>
      )}
    </Box>
  );
}
