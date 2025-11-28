import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps): React.ReactElement {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContinue) {
      const handleInput = () => {
        onComplete();
      };

      // Auto-continue after a brief moment
      const timer = setTimeout(handleInput, 1500);
      return () => clearTimeout(timer);
    }
  }, [showContinue, onComplete]);

  return (
    <Box flexDirection="column" alignItems="center" paddingY={1}>
      <Gradient name="rainbow">
        <BigText text="React Vite" font="chrome" />
      </Gradient>

      <Box marginTop={-1}>
        <Gradient name="pastel">
          <BigText text="Starter Kit" font="chrome" />
        </Gradient>
      </Box>

      <Box marginTop={1} flexDirection="column" alignItems="center">
        <Text color="gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>
        <Box marginTop={1}>
          <Text color="cyan">🚀 </Text>
          <Text>Create modern React + Vite projects with ease</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>TypeScript • TailwindCSS • Redux • React Router • ESLint • Prettier</Text>
        </Box>
      </Box>

      {showContinue && (
        <Box marginTop={2}>
          <Text color="green">Loading...</Text>
        </Box>
      )}
    </Box>
  );
}
