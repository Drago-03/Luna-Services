import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Textarea,
  Badge,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { Save, X, Edit, Download } from 'lucide-react';

interface DocumentationEditorProps {
  docId: string;
  onClose: () => void;
}

export const DocumentationEditor: React.FC<DocumentationEditorProps> = ({
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`# API Authentication Guide

## Overview

This guide covers the authentication methods available in the Luna-service API.

## Authentication Methods

### 1. API Keys

API keys are the primary method for authenticating requests to the Luna-service API.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.luna-service.com/v1/projects
\`\`\`

### 2. OAuth 2.0

For applications that need to act on behalf of users, OAuth 2.0 is supported.

\`\`\`javascript
const response = await fetch('/api/auth/oauth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_id: 'your_client_id',
    redirect_uri: 'your_redirect_uri'
  })
});
\`\`\`

## Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use environment variables for sensitive data**
3. **Implement proper token rotation**
4. **Monitor API usage for anomalies**

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Free tier**: 1,000 requests per hour
- **Pro tier**: 10,000 requests per hour  
- **Enterprise**: Custom limits available

## Error Responses

The API returns standard HTTP status codes:

\`\`\`json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided token is invalid or expired",
    "details": {
      "token_expires_at": "2023-12-01T00:00:00Z"
    }
  }
}
\`\`\`
`);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBg = useColorModeValue('gray.100', 'gray.700');

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('# ')) {
        elements.push(
          <Text key={i} fontSize="2xl" fontWeight="bold" mb={4}>
            {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Text key={i} fontSize="xl" fontWeight="bold" mb={3} mt={6}>
            {line.substring(3)}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <Text key={i} fontSize="lg" fontWeight="semibold" mb={2} mt={4}>
            {line.substring(4)}
          </Text>
        );
      } else if (line.startsWith('```')) {
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <Box key={i} mb={4}>
            <Box
              as="pre"
              bg={codeBg}
              p={4}
              borderRadius="md"
              overflow="auto"
              fontSize="14px"
              fontFamily="monospace"
            >
              <Text as="code">{codeLines.join('\n')}</Text>
            </Box>
          </Box>
        );
      } else if (line.trim()) {
        elements.push(
          <Text key={i} mb={3} lineHeight={1.6}>
            {line}
          </Text>
        );
      }
      i++;
    }

    return elements;
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <HStack justify="space-between" p={4} borderBottom="1px" borderColor={borderColor}>
        <HStack spacing={3}>
          <Text fontSize="lg" fontWeight="bold">
            API Authentication Guide
          </Text>
          <Badge colorScheme="blue">API</Badge>
          <Badge colorScheme="green">Published</Badge>
        </HStack>
        <HStack spacing={2}>
          <IconButton
            icon={<Download size={16} />}
            variant="ghost"
            size="sm"
            aria-label="Download"
          />
          <Button
            leftIcon={<Edit size={16} />}
            size="sm"
            variant={isEditing ? 'solid' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <IconButton
            icon={<X size={16} />}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
          />
        </HStack>
      </HStack>

      <Box p={6} maxH="600px" overflowY="auto">
        {isEditing ? (
          <VStack spacing={4} align="stretch">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minH="500px"
              fontFamily="mono"
              fontSize="sm"
              placeholder="Write your documentation in Markdown..."
            />
            <HStack justify="flex-end">
              <Button leftIcon={<Save size={16} />} colorScheme="primary">
                Save Changes
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            {renderMarkdown(content)}
          </VStack>
        )}
      </Box>
    </Box>
  );
};