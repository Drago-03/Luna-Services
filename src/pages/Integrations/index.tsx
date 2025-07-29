import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export const Integrations: React.FC = () => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Integrations
      </Text>
      <Text color="gray.500" mt={2}>
        Third-party integrations (GitHub, Slack, Jira) coming soon...
      </Text>
    </Box>
  );
};