/**
 * Enhanced MCP Dashboard Component
 * 
 * Advanced dashboard for the Universal Model Context Protocol interface
 * with voice integration, multi-modal capabilities, and real-time AI assistance.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue,
  SimpleGrid,
  Progress,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Textarea,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Tooltip,
  IconButton
} from '@chakra-ui/react';

import {
  Code,
  Brain,
  Mic,
  MicOff,
  FileText,
  Zap,
  Settings,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Upload,
  Download,
  Eye,
  MessageSquare,
  Lightbulb,
  Bug,
  TestTube,
  Architecture,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Cpu,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface MCPRequest {
  id?: string;
  task_type: string;
  user_id: string;
  project_id?: string;
  language?: string;
  prompt: string;
  context?: Record<string, any>;
  files?: Array<{name: string; content: string}>;
  voice_input?: string;
  image_input?: string;
  priority?: number;
  metadata?: Record<string, any>;
}

interface MCPResponse {
  request_id: string;
  status: string;
  result?: Record<string, any>;
  error_message?: string;
  generated_code?: string;
  explanation?: string;
  suggestions?: string[];
  confidence_score?: number;
  execution_time?: number;
  tokens_used?: number;
  voice_output?: string;
  completed_at?: string;
}

interface SessionStats {
  total_requests: number;
  task_distribution: Record<string, number>;
  avg_response_time: number;
  success_rate: number;
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Badge,
  IconButton,
  Tooltip,
  Spinner,
  Progress,
  SimpleGrid,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Divider,
  useColorModeValue,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
} from '@chakra-ui/react';
import {
  Brain,
  Code,
  Zap,
  Bug,
  FileText,
  TestTube,
  Mic,
  MicOff,
  Volume2,
  Upload,
  Settings,
  MessageSquare,
  CheckCircle,
  Clock,
  Cpu,
  Lightbulb,
  RefreshCw,
  ImageIcon,
  Architecture,
} from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface MCPRequest {
  task_type: string;
  user_id: string;
  prompt: string;
  language?: string;
  metadata?: Record<string, any>;
  voice_input?: string;
}

interface MCPResponse {
  status: string;
  generated_code?: string;
  explanation?: string;
  suggestions?: string[];
  execution_time?: number;
  tokens_used?: number;
  voice_output?: string;
  confidence_score?: number;
}

interface SessionStats {
  total_requests: number;
  task_distribution: Record<string, number>;
  avg_response_time: number;
  success_rate: number;
}

const EnhancedMCPDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // State management
  const [currentRequest, setCurrentRequest] = useState<MCPRequest>({
    task_type: 'code_generation',
    user_id: user?.id || 'user',
    prompt: '',
    metadata: { include_voice: false }
  });
  
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    voice_available?: boolean;
  }>>([]);
  
  // Update user_id when user changes
  useEffect(() => {
    if (user?.id) {
      setCurrentRequest(prev => ({ ...prev, user_id: user.id }));
    }
  }, [user?.id]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Hooks
  const toast = useToast();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Task types and their configurations
  const taskTypes = [
    { value: 'code_generation', label: 'Code Generation', icon: Code, color: 'blue' },
    { value: 'code_optimization', label: 'Code Optimization', icon: Zap, color: 'yellow' },
    { value: 'debugging', label: 'Debugging', icon: Bug, color: 'red' },
    { value: 'architecture_design', label: 'Architecture Design', icon: Architecture, color: 'purple' },
    { value: 'api_integration', label: 'API Integration', icon: RefreshCw, color: 'green' },
    { value: 'documentation', label: 'Documentation', icon: FileText, color: 'teal' },
    { value: 'testing', label: 'Testing', icon: TestTube, color: 'orange' },
    { value: 'voice_command', label: 'Voice Command', icon: Mic, color: 'pink' },
    { value: 'multi_modal', label: 'Multi-Modal', icon: ImageIcon, color: 'cyan' },
  ];
  
  const programmingLanguages = [
    'python', 'javascript', 'typescript', 'java', 'cpp', 'csharp',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala'
  ];

  // Effects
  useEffect(() => {
    loadSessionStats();
    initializeVoiceSupport();
  }, []);

  // Voice support initialization
  const initializeVoiceSupport = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceEnabled(true);
    }
  };

  // Load session statistics
  const loadSessionStats = async () => {
    try {
      const userId = user?.id || 'user';
      const response = await fetch(`/api/mcp/analytics/session/${userId}`);
      if (response.ok) {
        const stats = await response.json();
        setSessionStats(stats);
      }
    } catch (error) {
      console.error('Failed to load session stats:', error);
    }
  };
  
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    voice_available?: boolean;
  }>>([]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Hooks
  const toast = useToast();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Task types and their configurations
  const taskTypes = [
    { value: 'code_generation', label: 'Code Generation', icon: Code, color: 'blue' },
    { value: 'code_optimization', label: 'Code Optimization', icon: Zap, color: 'yellow' },
    { value: 'debugging', label: 'Debugging', icon: Bug, color: 'red' },
    { value: 'architecture_design', label: 'Architecture Design', icon: Architecture, color: 'purple' },
    { value: 'api_integration', label: 'API Integration', icon: RefreshCw, color: 'green' },
    { value: 'documentation', label: 'Documentation', icon: FileText, color: 'teal' },
    { value: 'testing', label: 'Testing', icon: TestTube, color: 'orange' },
    { value: 'voice_command', label: 'Voice Command', icon: Mic, color: 'pink' },
    { value: 'multi_modal', label: 'Multi-Modal', icon: ImageIcon, color: 'cyan' },
  ];\n  \n  const programmingLanguages = [\n    'python', 'javascript', 'typescript', 'java', 'cpp', 'csharp',\n    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala'\n  ];\n\n  // Effects\n  useEffect(() => {\n    loadSessionStats();\n    initializeVoiceSupport();\n  }, []);\n\n  // Voice support initialization\n  const initializeVoiceSupport = () => {\n    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {\n      setVoiceEnabled(true);\n    }\n  };\n\n  // Load session statistics\n  const loadSessionStats = async () => {\n    try {\n      const response = await fetch(`/api/mcp/analytics/session/${user?.id || 'user'}`);\n      if (response.ok) {\n        const stats = await response.json();\n        setSessionStats(stats);\n      }\n    } catch (error) {\n      console.error('Failed to load session stats:', error);\n    }\n  };\n\n  // Process MCP request\n  const processRequest = async () => {\n    if (!currentRequest.prompt.trim()) {\n      toast({\n        title: 'Error',\n        description: 'Please enter a prompt',\n        status: 'error',\n        duration: 3000\n      });\n      return;\n    }\n\n    setIsProcessing(true);\n    setResponse(null);\n\n    try {\n      // Prepare request data\n      const requestData = {\n        ...currentRequest,\n        files: selectedFiles.length > 0 ? await Promise.all(\n          selectedFiles.map(async (file) => ({\n            name: file.name,\n            content: await file.text()\n          }))\n        ) : undefined\n      };\n\n      const response = await fetch('/api/mcp/process', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(requestData)\n      });\n\n      if (!response.ok) {\n        throw new Error(`HTTP error! status: ${response.status}`);\n      }\n\n      const result = await response.json();\n      setResponse(result);\n\n      // Add to conversation history\n      setConversationHistory(prev => [\n        ...prev,\n        {\n          type: 'user',\n          content: currentRequest.prompt,\n          timestamp: new Date()\n        },\n        {\n          type: 'assistant',\n          content: result.explanation || result.generated_code || 'Task completed',\n          timestamp: new Date(),\n          voice_available: !!result.voice_output\n        }\n      ]);\n\n      // Play voice output if available\n      if (result.voice_output && voiceEnabled) {\n        playVoiceResponse(result.voice_output);\n      }\n\n      // Show success toast\n      toast({\n        title: 'Success',\n        description: `Task completed in ${result.execution_time?.toFixed(2)}s`,\n        status: 'success',\n        duration: 3000\n      });\n\n    } catch (error) {\n      console.error('Processing error:', error);\n      toast({\n        title: 'Error',\n        description: 'Failed to process request',\n        status: 'error',\n        duration: 5000\n      });\n    } finally {\n      setIsProcessing(false);\n      loadSessionStats(); // Refresh stats\n    }\n  };\n\n  // Voice recording functions\n  const startVoiceRecording = async () => {\n    try {\n      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });\n      const mediaRecorder = new MediaRecorder(stream);\n      const audioChunks: Blob[] = [];\n\n      mediaRecorder.ondataavailable = (event) => {\n        audioChunks.push(event.data);\n      };\n\n      mediaRecorder.onstop = () => {\n        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });\n        const reader = new FileReader();\n        reader.onloadend = () => {\n          const base64Audio = (reader.result as string).split(',')[1];\n          setCurrentRequest(prev => ({\n            ...prev,\n            voice_input: base64Audio,\n            task_type: 'voice_command'\n          }));\n        };\n        reader.readAsDataURL(audioBlob);\n        \n        // Stop all tracks\n        stream.getTracks().forEach(track => track.stop());\n      };\n\n      mediaRecorder.start();\n      mediaRecorderRef.current = mediaRecorder;\n      setIsVoiceRecording(true);\n\n      toast({\n        title: 'Recording',\n        description: 'Voice recording started',\n        status: 'info',\n        duration: 2000\n      });\n\n    } catch (error) {\n      console.error('Voice recording error:', error);\n      toast({\n        title: 'Error',\n        description: 'Failed to start voice recording',\n        status: 'error',\n        duration: 3000\n      });\n    }\n  };\n\n  const stopVoiceRecording = () => {\n    if (mediaRecorderRef.current && isVoiceRecording) {\n      mediaRecorderRef.current.stop();\n      setIsVoiceRecording(false);\n      \n      toast({\n        title: 'Recording Complete',\n        description: 'Voice input captured',\n        status: 'success',\n        duration: 2000\n      });\n    }\n  };\n\n  // Play voice response\n  const playVoiceResponse = (base64Audio: string) => {\n    try {\n      const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/wav' });\n      const audioUrl = URL.createObjectURL(audioBlob);\n      \n      if (audioRef.current) {\n        audioRef.current.src = audioUrl;\n        audioRef.current.play();\n      }\n    } catch (error) {\n      console.error('Voice playback error:', error);\n    }\n  };\n\n  // File handling\n  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {\n    if (event.target.files) {\n      setSelectedFiles(Array.from(event.target.files));\n    }\n  };\n\n  // Get task type configuration\n  const getCurrentTaskConfig = () => {\n    return taskTypes.find(t => t.value === currentRequest.task_type) || taskTypes[0];\n  };\n\n  // Render statistics cards\n  const renderStatsCards = () => (\n    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>\n      <Card bg={cardBg}>\n        <CardBody>\n          <Stat>\n            <StatLabel>Total Requests</StatLabel>\n            <StatNumber>{sessionStats?.total_requests || 0}</StatNumber>\n            <StatHelpText>This session</StatHelpText>\n          </Stat>\n        </CardBody>\n      </Card>\n      \n      <Card bg={cardBg}>\n        <CardBody>\n          <Stat>\n            <StatLabel>Success Rate</StatLabel>\n            <StatNumber>{sessionStats?.success_rate?.toFixed(1) || 0}%</StatNumber>\n            <StatHelpText>All time</StatHelpText>\n          </Stat>\n        </CardBody>\n      </Card>\n      \n      <Card bg={cardBg}>\n        <CardBody>\n          <Stat>\n            <StatLabel>Avg Response Time</StatLabel>\n            <StatNumber>{sessionStats?.avg_response_time?.toFixed(2) || 0}s</StatNumber>\n            <StatHelpText>Recent requests</StatHelpText>\n          </Stat>\n        </CardBody>\n      </Card>\n      \n      <Card bg={cardBg}>\n        <CardBody>\n          <Stat>\n            <StatLabel>AI Health</StatLabel>\n            <StatNumber>\n              <HStack>\n                <Icon as={CheckCircle} color='green.500' />\n                <Text>Healthy</Text>\n              </HStack>\n            </StatNumber>\n            <StatHelpText>All systems operational</StatHelpText>\n          </Stat>\n        </CardBody>\n      </Card>\n    </SimpleGrid>\n  );\n\n  return (\n    <Box bg={bgColor} minH='100vh' p={8}>\n      <VStack spacing={8} align='stretch'>\n        {/* Header */}\n        <Flex justify='space-between' align='center'>\n          <VStack align='start' spacing={2}>\n            <Heading size='xl' color='blue.500'>\n              Universal MCP Studio\n            </Heading>\n            <Text color='gray.600'>\n              AI-Powered Development Assistant with Voice & Multi-Modal Capabilities\n            </Text>\n          </VStack>\n          \n          <HStack spacing={4}>\n            <Tooltip label='Conversation History'>\n              <IconButton\n                aria-label='History'\n                icon={<MessageSquare />}\n                onClick={onHistoryOpen}\n                variant='outline'\n              />\n            </Tooltip>\n            \n            <Tooltip label='Settings'>\n              <IconButton\n                aria-label='Settings'\n                icon={<Settings />}\n                onClick={onSettingsOpen}\n                variant='outline'\n              />\n            </Tooltip>\n            \n            <Badge colorScheme={voiceEnabled ? 'green' : 'gray'}>\n              {voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}\n            </Badge>\n          </HStack>\n        </Flex>\n\n        {/* Statistics Cards */}\n        {renderStatsCards()}\n\n        {/* Main Interface */}\n        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>\n          {/* Input Panel */}\n          <Card bg={cardBg}>\n            <CardHeader>\n              <Heading size='md'>AI Assistant Interface</Heading>\n            </CardHeader>\n            <CardBody>\n              <VStack spacing={6} align='stretch'>\n                {/* Task Type Selection */}\n                <FormControl>\n                  <FormLabel>Task Type</FormLabel>\n                  <Select\n                    value={currentRequest.task_type}\n                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, task_type: e.target.value }))}\n                  >\n                    {taskTypes.map(task => (\n                      <option key={task.value} value={task.value}>\n                        {task.label}\n                      </option>\n                    ))}\n                  </Select>\n                </FormControl>\n\n                {/* Programming Language */}\n                <FormControl>\n                  <FormLabel>Programming Language (Optional)</FormLabel>\n                  <Select\n                    value={currentRequest.language || ''}\n                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, language: e.target.value }))}\n                  >\n                    <option value=''>Auto-detect</option>\n                    {programmingLanguages.map(lang => (\n                      <option key={lang} value={lang}>\n                        {lang.charAt(0).toUpperCase() + lang.slice(1)}\n                      </option>\n                    ))}\n                  </Select>\n                </FormControl>\n\n                {/* Prompt Input */}\n                <FormControl>\n                  <FormLabel>Prompt / Request</FormLabel>\n                  <Textarea\n                    value={currentRequest.prompt}\n                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, prompt: e.target.value }))}\n                    placeholder='Describe what you need help with...'\n                    rows={6}\n                    resize='vertical'\n                  />\n                </FormControl>\n\n                {/* File Upload */}\n                <FormControl>\n                  <FormLabel>Files (Optional)</FormLabel>\n                  <HStack>\n                    <Button\n                      leftIcon={<Upload />}\n                      variant='outline'\n                      onClick={() => fileInputRef.current?.click()}\n                    >\n                      Upload Files\n                    </Button>\n                    <Text fontSize='sm' color='gray.600'>\n                      {selectedFiles.length} file(s) selected\n                    </Text>\n                  </HStack>\n                  <input\n                    type='file'\n                    ref={fileInputRef}\n                    onChange={handleFileSelect}\n                    multiple\n                    style={{ display: 'none' }}\n                  />\n                </FormControl>\n\n                {/* Voice & Options */}\n                <HStack justify='space-between'>\n                  <FormControl display='flex' alignItems='center'>\n                    <FormLabel mb='0'>Include Voice Response</FormLabel>\n                    <Switch\n                      isChecked={currentRequest.metadata?.include_voice || false}\n                      onChange={(e) => setCurrentRequest(prev => ({\n                        ...prev,\n                        metadata: { ...prev.metadata, include_voice: e.target.checked }\n                      }))}\n                    />\n                  </FormControl>\n                  \n                  {voiceEnabled && (\n                    <Tooltip label={isVoiceRecording ? 'Stop Recording' : 'Start Voice Input'}>\n                      <IconButton\n                        aria-label='Voice Input'\n                        icon={isVoiceRecording ? <MicOff /> : <Mic />}\n                        colorScheme={isVoiceRecording ? 'red' : 'blue'}\n                        variant={isVoiceRecording ? 'solid' : 'outline'}\n                        onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}\n                      />\n                    </Tooltip>\n                  )}\n                </HStack>\n\n                {/* Action Buttons */}\n                <HStack spacing={4}>\n                  <Button\n                    leftIcon={getCurrentTaskConfig().icon ? <getCurrentTaskConfig().icon /> : <Brain />}\n                    colorScheme='blue'\n                    size='lg'\n                    onClick={processRequest}\n                    isLoading={isProcessing}\n                    loadingText='Processing...'\n                    flex={1}\n                  >\n                    Process Request\n                  </Button>\n                  \n                  <Button\n                    variant='outline'\n                    onClick={() => {\n                      setCurrentRequest({\n                        task_type: 'code_generation',\n                        user_id: user?.id || 'user',\n                        prompt: '',\n                        metadata: { include_voice: false }\n                      });\n                      setSelectedFiles([]);\n                      setResponse(null);\n                    }}\n                  >\n                    Clear\n                  </Button>\n                </HStack>\n              </VStack>\n            </CardBody>\n          </Card>\n\n          {/* Response Panel */}\n          <Card bg={cardBg}>\n            <CardHeader>\n              <HStack justify='space-between'>\n                <Heading size='md'>AI Response</Heading>\n                {response && (\n                  <HStack>\n                    <Badge colorScheme={response.status === 'success' ? 'green' : 'red'}>\n                      {response.status}\n                    </Badge>\n                    {response.confidence_score && (\n                      <Badge colorScheme='blue'>\n                        {(response.confidence_score * 100).toFixed(0)}% confidence\n                      </Badge>\n                    )}\n                  </HStack>\n                )}\n              </HStack>\n            </CardHeader>\n            <CardBody>\n              {isProcessing ? (\n                <VStack spacing={4} py={8}>\n                  <Spinner size='xl' color='blue.500' />\n                  <Text>Processing your request...</Text>\n                  <Progress size='sm' isIndeterminate colorScheme='blue' w='100%' />\n                </VStack>\n              ) : response ? (\n                <VStack spacing={6} align='stretch'>\n                  {/* Response Content */}\n                  {response.generated_code && (\n                    <Box>\n                      <Text fontWeight='bold' mb={2}>Generated Code:</Text>\n                      <Box\n                        bg='gray.900'\n                        color='white'\n                        p={4}\n                        borderRadius='md'\n                        overflowX='auto'\n                      >\n                        <pre><code>{response.generated_code}</code></pre>\n                      </Box>\n                    </Box>\n                  )}\n                  \n                  {response.explanation && (\n                    <Box>\n                      <Text fontWeight='bold' mb={2}>Explanation:</Text>\n                      <Text bg='gray.50' p={4} borderRadius='md'>\n                        {response.explanation}\n                      </Text>\n                    </Box>\n                  )}\n                  \n                  {response.suggestions && response.suggestions.length > 0 && (\n                    <Box>\n                      <Text fontWeight='bold' mb={2}>Suggestions:</Text>\n                      <VStack align='stretch' spacing={2}>\n                        {response.suggestions.map((suggestion, index) => (\n                          <HStack key={index} spacing={2}>\n                            <Icon as={Lightbulb} color='yellow.500' />\n                            <Text fontSize='sm'>{suggestion}</Text>\n                          </HStack>\n                        ))}\n                      </VStack>\n                    </Box>\n                  )}\n                  \n                  {/* Response Metadata */}\n                  <Divider />\n                  <HStack justify='space-between' fontSize='sm' color='gray.600'>\n                    <HStack>\n                      <Icon as={Clock} />\n                      <Text>{response.execution_time?.toFixed(2)}s</Text>\n                    </HStack>\n                    {response.tokens_used && (\n                      <HStack>\n                        <Icon as={Cpu} />\n                        <Text>{response.tokens_used} tokens</Text>\n                      </HStack>\n                    )}\n                    {response.voice_output && (\n                      <HStack>\n                        <Icon as={Volume2} color='green.500' />\n                        <Text>Voice available</Text>\n                      </HStack>\n                    )}\n                  </HStack>\n                </VStack>\n              ) : (\n                <VStack spacing={4} py={8} color='gray.500'>\n                  <Icon as={Brain} boxSize={12} />\n                  <Text>Ready to assist with your development needs</Text>\n                  <Text fontSize='sm' textAlign='center'>\n                    Enter a prompt above and select a task type to get started\n                  </Text>\n                </VStack>\n              )}\n            </CardBody>\n          </Card>\n        </Grid>\n      </VStack>\n\n      {/* Hidden audio element for voice playback */}\n      <audio ref={audioRef} style={{ display: 'none' }} />\n\n      {/* Settings Modal */}\n      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size='lg'>\n        <ModalOverlay />\n        <ModalContent>\n          <ModalHeader>MCP Settings</ModalHeader>\n          <ModalCloseButton />\n          <ModalBody pb={6}>\n            <VStack spacing={6} align='stretch'>\n              <FormControl display='flex' alignItems='center'>\n                <FormLabel mb='0'>Enable Voice Features</FormLabel>\n                <Switch\n                  isChecked={voiceEnabled}\n                  onChange={(e) => setVoiceEnabled(e.target.checked)}\n                />\n              </FormControl>\n              \n              <FormControl>\n                <FormLabel>Default Programming Language</FormLabel>\n                <Select defaultValue='python'>\n                  {programmingLanguages.map(lang => (\n                    <option key={lang} value={lang}>\n                      {lang.charAt(0).toUpperCase() + lang.slice(1)}\n                    </option>\n                  ))}\n                </Select>\n              </FormControl>\n              \n              <FormControl>\n                <FormLabel>Response Detail Level</FormLabel>\n                <Select defaultValue='detailed'>\n                  <option value='brief'>Brief</option>\n                  <option value='detailed'>Detailed</option>\n                  <option value='comprehensive'>Comprehensive</option>\n                </Select>\n              </FormControl>\n            </VStack>\n          </ModalBody>\n        </ModalContent>\n      </Modal>\n\n      {/* Conversation History Modal */}\n      <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size='xl'>\n        <ModalOverlay />\n        <ModalContent>\n          <ModalHeader>Conversation History</ModalHeader>\n          <ModalCloseButton />\n          <ModalBody pb={6}>\n            <VStack spacing={4} align='stretch' maxH='60vh' overflowY='auto'>\n              {conversationHistory.length === 0 ? (\n                <Text color='gray.500' textAlign='center' py={8}>\n                  No conversation history yet\n                </Text>\n              ) : (\n                conversationHistory.map((message, index) => (\n                  <Box\n                    key={index}\n                    p={4}\n                    bg={message.type === 'user' ? 'blue.50' : 'gray.50'}\n                    borderRadius='md'\n                    borderLeft={`4px solid ${message.type === 'user' ? 'blue.500' : 'gray.500'}`}\n                  >\n                    <HStack justify='space-between' mb={2}>\n                      <Badge colorScheme={message.type === 'user' ? 'blue' : 'gray'}>\n                        {message.type === 'user' ? 'You' : 'AI Assistant'}\n                      </Badge>\n                      <Text fontSize='xs' color='gray.500'>\n                        {message.timestamp.toLocaleTimeString()}\n                      </Text>\n                    </HStack>\n                    <Text>{message.content}</Text>\n                    {message.voice_available && (\n                      <HStack mt={2}>\n                        <Icon as={Volume2} color='green.500' size='sm' />\n                        <Text fontSize='xs' color='green.600'>Voice response available</Text>\n                      </HStack>\n                    )}\n                  </Box>\n                ))\n              )}\n            </VStack>\n          </ModalBody>\n        </ModalContent>\n      </Modal>\n    </Box>\n  );\n};\n\nexport default EnhancedMCPDashboard;
