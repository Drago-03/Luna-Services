import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export const Settings: React.FC = () => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Settings
      </Text>
      <Text color="gray.500" mt={2}>
        System configuration and preferences coming soon...
      </Text>
    </Box>
  );
};