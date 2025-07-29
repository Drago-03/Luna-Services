/**
 * MCP Code Generator Component
 * 
 * AI-powered code generation interface for the Universal MCP system.
 * Supports multiple programming languages and advanced code generation features.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Textarea,
  Select,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Badge,
  Divider,
  Code,
  Alert,
  AlertIcon,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  Play,
  Copy,
  Download,
  RefreshCw,
  Mic,
  Volume2,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react';

interface CodeGenerationRequest {
  prompt: string;
  language: string;
  includeTests: boolean;
  includeDocumentation: boolean;
  stylePreferences: Record<string, string>;
  functionName?: string;
  requirements: string[];
}

interface CodeGenerationResponse {
  generatedCode: string;
  explanation: string;
  suggestions: string[];
  confidenceScore: number;
  executionTime: number;
  voiceOutput?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' }
];

const MCPCodeGenerator: React.FC = () => {
  const [request, setRequest] = useState<CodeGenerationRequest>({
    prompt: '',
    language: 'python',
    includeTests: true,
    includeDocumentation: true,
    stylePreferences: {},
    requirements: []
  });
  
  const [response, setResponse] = useState<CodeGenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const toast = useToast();

  const handleGenerate = async () => {
    if (!request.prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a description of the code you want to generate',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        task_type: 'code_generation',
        prompt: request.prompt,
        language: request.language,
        context: {
          include_tests: request.includeTests,
          include_documentation: request.includeDocumentation,
          style_preferences: request.stylePreferences,
          function_name: request.functionName,
          requirements: request.requirements
        }
      };

      const response = await fetch('/api/mcp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Code generation failed');
      }

      const result = await response.json();
      setResponse({
        generatedCode: result.generated_code || '',
        explanation: result.explanation || '',
        suggestions: result.suggestions || [],
        confidenceScore: result.confidence_score || 0,
        executionTime: result.execution_time || 0,
        voiceOutput: result.voice_output
      });

      toast({
        title: 'Success',
        description: 'Code generated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Code generation failed';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (response?.generatedCode) {
      navigator.clipboard.writeText(response.generatedCode);
      toast({
        title: 'Copied',
        description: 'Code copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    }
  };

  const handlePlayVoice = () => {
    if (response?.voiceOutput) {
      // Convert base64 to audio and play
      const audio = new Audio('data:audio/wav;base64,' + response.voiceOutput);
      audio.play();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    toast({
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      description: isRecording ? 'Processing voice input...' : 'Speak your code requirements',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2} display="flex" alignItems="center">
            <Sparkles style={{ marginRight: '0.5rem' }} />
            AI Code Generator
          </Heading>
          <Text color="gray.600">
            Generate high-quality code using advanced AI models
          </Text>
        </Box>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <Heading size="md">Code Requirements</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Prompt Input */}
              <FormControl>
                <FormLabel>Describe the code you want to generate</FormLabel>
                <HStack>
                  <Textarea
                    value={request.prompt}
                    onChange={(e) => setRequest({ ...request, prompt: e.target.value })}
                    placeholder="Example: Create a function that sorts a list of users by their registration date..."
                    minH="120px"
                    resize="vertical"
                  />
                  <VStack>
                    <Tooltip label="Voice Input">
                      <IconButton
                        aria-label="Voice input"
                        icon={<Mic />}
                        colorScheme={isRecording ? "red" : "blue"}
                        variant={isRecording ? "solid" : "outline"}
                        onClick={toggleRecording}
                      />
                    </Tooltip>
                  </VStack>
                </HStack>
              </FormControl>

              {/* Language Selection */}
              <FormControl>
                <FormLabel>Programming Language</FormLabel>
                <Select
                  value={request.language}
                  onChange={(e) => setRequest({ ...request, language: e.target.value })}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Optional Settings */}
              <FormControl>
                <FormLabel>Function Name (Optional)</FormLabel>
                <Input
                  value={request.functionName || ''}
                  onChange={(e) => setRequest({ ...request, functionName: e.target.value })}
                  placeholder="my_function"
                />
              </FormControl>

              {/* Toggles */}
              <HStack spacing={6}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="include-tests" mb="0">
                    Include Tests
                  </FormLabel>
                  <Switch
                    id="include-tests"
                    isChecked={request.includeTests}
                    onChange={(e) => setRequest({ ...request, includeTests: e.target.checked })}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="include-docs" mb="0">
                    Include Documentation
                  </FormLabel>
                  <Switch
                    id="include-docs"
                    isChecked={request.includeDocumentation}
                    onChange={(e) => setRequest({ ...request, includeDocumentation: e.target.checked })}
                  />
                </FormControl>
              </HStack>

              {/* Generate Button */}
              <Button
                leftIcon={<Play />}
                colorScheme="blue"
                size="lg"
                onClick={handleGenerate}
                isLoading={loading}
                loadingText="Generating..."
              >
                Generate Code
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Results Section */}
        {response && (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Generated Code</Heading>
                <HStack>
                  <Badge colorScheme="green">
                    Confidence: {(response.confidenceScore * 100).toFixed(0)}%
                  </Badge>
                  <Badge colorScheme="blue">
                    {response.executionTime.toFixed(2)}s
                  </Badge>
                  {response.voiceOutput && (
                    <Tooltip label="Play Voice Explanation">
                      <IconButton
                        aria-label="Play voice"
                        icon={<Volume2 />}
                        size="sm"
                        onClick={handlePlayVoice}
                      />
                    </Tooltip>
                  )}
                  <Tooltip label="Copy Code">
                    <IconButton
                      aria-label="Copy code"
                      icon={<Copy />}
                      size="sm"
                      onClick={handleCopyCode}
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody>
              <Tabs>
                <TabList>
                  <Tab>Generated Code</Tab>
                  <Tab>Explanation</Tab>
                  <Tab>Suggestions</Tab>
                </TabList>

                <TabPanels>
                  {/* Code Tab */}
                  <TabPanel px={0}>
                    <Box
                      bg="gray.900"
                      color="white"
                      p={4}
                      borderRadius="md"
                      overflow="auto"
                      maxH="400px"
                    >
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        bg="transparent"
                        color="inherit"
                        p={0}
                      >
                        {response.generatedCode}
                      </Code>
                    </Box>
                  </TabPanel>

                  {/* Explanation Tab */}
                  <TabPanel px={0}>
                    <Box
                      bg="gray.50"
                      p={4}
                      borderRadius="md"
                      whiteSpace="pre-wrap"
                    >
                      {response.explanation}
                    </Box>
                  </TabPanel>

                  {/* Suggestions Tab */}
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={2}>
                      {response.suggestions.length > 0 ? (
                        response.suggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor="blue.500"
                          >
                            <Text>{suggestion}</Text>
                          </Box>
                        ))
                      ) : (
                        <Text color="gray.500">No suggestions available</Text>
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        {response && (
          <HStack spacing={4} justify="center">
            <Button
              leftIcon={<RefreshCw />}
              variant="outline"
              onClick={() => setResponse(null)}
            >
              Generate New
            </Button>
            <Button
              leftIcon={<Download />}
              variant="outline"
            >
              Download Code
            </Button>
            <Button
              leftIcon={<FileText />}
              variant="outline"
            >
              Save to Project
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default MCPCodeGenerator;
