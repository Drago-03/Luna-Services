/**
 * MCP Dashboard Component
 * 
 * Main dashboard for the Universal Model Context Protocol interface.
 * Provides access to all AI-powered development tools and features.
 */

import React, { useState, useEffect } from 'react';
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
  AlertIcon
} from '@chakra-ui/react';
import {
  Code,
  Brain,
  Mic,
  FileText,
  Zap,
  Settings,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  MessageSquare,
  GitBranch,
  Database,
  Cpu,
  Volume2
} from 'lucide-react';

interface MCPDashboardProps {
  userId: string;
}

interface MCPStats {
  totalRequests: number;
  successfulRequests: number;
  successRate: number;
  avgExecutionTime: number;
  totalTokensUsed: number;
  taskTypeBreakdown: Record<string, number>;
}

interface MCPStatus {
  status: string;
  activeSessions: number;
  activeRequests: number;
  features: {
    voiceEnabled: boolean;
    multimodalEnabled: boolean;
    analyticsEnabled: boolean;
  };
  models: {
    primaryLlm: string;
    voiceSynthesis: string;
    framework: string;
  };
}

const MCPDashboard: React.FC<MCPDashboardProps> = ({ userId }) => {
  const [mcpStats, setMcpStats] = useState<MCPStats | null>(null);
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const statsBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load MCP analytics
      const statsResponse = await fetch('/api/mcp/analytics/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to load analytics');
      }

      const stats = await statsResponse.json();
      setMcpStats(stats);

      // Load MCP status
      const statusResponse = await fetch('/api/mcp/status');
      if (!statusResponse.ok) {
        throw new Error('Failed to load MCP status');
      }

      const status = await statusResponse.json();
      setMcpStatus(status);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      toast({
        title: 'Error',
        description: 'Failed to load MCP dashboard data',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Generate Code',
      description: 'AI-powered code generation',
      icon: Code,
      color: 'blue',
      action: () => console.log('Navigate to code generation')
    },
    {
      title: 'Debug Assistant',
      description: 'Intelligent debugging help',
      icon: Brain,
      color: 'purple',
      action: () => console.log('Navigate to debugging')
    },
    {
      title: 'Voice Commands',
      description: 'Hands-free development',
      icon: Mic,
      color: 'green',
      action: () => console.log('Open voice interface')
    },
    {
      title: 'Architecture Design',
      description: 'System design assistance',
      icon: GitBranch,
      color: 'orange',
      action: () => console.log('Navigate to architecture')
    },
    {
      title: 'Auto Documentation',
      description: 'Generate comprehensive docs',
      icon: FileText,
      color: 'teal',
      action: () => console.log('Navigate to documentation')
    },
    {
      title: 'API Integration',
      description: 'Automated API setup',
      icon: Database,
      color: 'red',
      action: () => console.log('Navigate to API integration')
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading MCP Dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <VStack spacing={6} align=\"stretch\">
        <Box>
          <Heading size=\"lg\" mb={2}>
            Universal Model Context Protocol
          </Heading>
          <Text color=\"gray.600\" fontSize=\"lg\">
            AI-powered development ecosystem at your fingertips
          </Text>
        </Box>

        {/* System Status */}
        {mcpStatus && (
          <Card bg={cardBg} shadow=\"sm\">
            <CardHeader pb={2}>
              <HStack justify=\"space-between\">
                <Heading size=\"md\">System Status</Heading>
                <Badge 
                  colorScheme={mcpStatus.status === 'operational' ? 'green' : 'red'}
                  variant=\"solid\"
                >
                  {mcpStatus.status.toUpperCase()}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Stat>
                  <StatLabel>Active Sessions</StatLabel>
                  <StatNumber>{mcpStatus.activeSessions}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Processing Queue</StatLabel>
                  <StatNumber>{mcpStatus.activeRequests}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Primary Model</StatLabel>
                  <StatNumber fontSize=\"sm\">{mcpStatus.models.primaryLlm}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Framework</StatLabel>
                  <StatNumber fontSize=\"sm\">{mcpStatus.models.framework}</StatNumber>
                </Stat>
              </SimpleGrid>
              
              <HStack mt={4} spacing={4}>
                <Badge 
                  colorScheme={mcpStatus.features.voiceEnabled ? 'green' : 'gray'}
                  variant=\"outline\"
                >
                  <Icon as={Volume2} mr={1} />
                  Voice {mcpStatus.features.voiceEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge 
                  colorScheme={mcpStatus.features.multimodalEnabled ? 'green' : 'gray'}
                  variant=\"outline\"
                >
                  <Icon as={Zap} mr={1} />
                  Multi-modal {mcpStatus.features.multimodalEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge 
                  colorScheme={mcpStatus.features.analyticsEnabled ? 'green' : 'gray'}
                  variant=\"outline\"
                >
                  <Icon as={BarChart3} mr={1} />
                  Analytics {mcpStatus.features.analyticsEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </HStack>
            </CardBody>
          </Card>
        )}

        {/* Usage Statistics */}
        {mcpStats && (
          <Card bg={cardBg} shadow=\"sm\">
            <CardHeader>
              <Heading size=\"md\">Usage Analytics (Last 30 Days)</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 5 }} spacing={6}>
                <Stat>
                  <StatLabel>Total Requests</StatLabel>
                  <StatNumber>{mcpStats.totalRequests}</StatNumber>
                  <StatHelpText>AI assistance calls</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Success Rate</StatLabel>
                  <StatNumber>{(mcpStats.successRate * 100).toFixed(1)}%</StatNumber>
                  <Progress 
                    value={mcpStats.successRate * 100} 
                    colorScheme=\"green\" 
                    size=\"sm\" 
                    mt={2}
                  />
                </Stat>
                <Stat>
                  <StatLabel>Avg Response Time</StatLabel>
                  <StatNumber>{mcpStats.avgExecutionTime.toFixed(2)}s</StatNumber>
                  <StatHelpText>Processing speed</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Tokens Used</StatLabel>
                  <StatNumber>{mcpStats.totalTokensUsed.toLocaleString()}</StatNumber>
                  <StatHelpText>AI model usage</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Most Used</StatLabel>
                  <StatNumber fontSize=\"sm\">
                    {Object.entries(mcpStats.taskTypeBreakdown)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </StatNumber>
                  <StatHelpText>Task type</StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Quick Actions */}
        <Card bg={cardBg} shadow=\"sm\">
          <CardHeader>
            <Heading size=\"md\">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  bg={statsBg}
                  cursor=\"pointer\"
                  transition=\"all 0.2s\"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  onClick={action.action}
                >
                  <CardBody>
                    <VStack spacing={3} align=\"center\" textAlign=\"center\">
                      <Icon 
                        as={action.icon} 
                        size={8} 
                        color={`${action.color}.500`}
                      />
                      <Box>
                        <Text fontWeight=\"semibold\" mb={1}>
                          {action.title}
                        </Text>
                        <Text fontSize=\"sm\" color=\"gray.600\">
                          {action.description}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Recent Activity & Task Breakdown */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Task Type Breakdown */}
          <Card bg={cardBg} shadow=\"sm\">
            <CardHeader>
              <Heading size=\"md\">Task Distribution</Heading>
            </CardHeader>
            <CardBody>
              {mcpStats && Object.entries(mcpStats.taskTypeBreakdown).length > 0 ? (
                <VStack spacing={3} align=\"stretch\">
                  {Object.entries(mcpStats.taskTypeBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .map(([taskType, count]) => (
                      <Box key={taskType}>
                        <Flex justify=\"space-between\" mb={1}>
                          <Text fontSize=\"sm\" textTransform=\"capitalize\">
                            {taskType.replace('_', ' ')}
                          </Text>
                          <Text fontSize=\"sm\" fontWeight=\"semibold\">
                            {count}
                          </Text>
                        </Flex>
                        <Progress 
                          value={(count / mcpStats.totalRequests) * 100}
                          colorScheme=\"blue\"
                          size=\"sm\"
                        />
                      </Box>
                    ))}
                </VStack>
              ) : (
                <Text color=\"gray.500\" textAlign=\"center\" py={8}>
                  No task data available
                </Text>
              )}
            </CardBody>
          </Card>

          {/* System Resources */}
          <Card bg={cardBg} shadow=\"sm\">
            <CardHeader>
              <Heading size=\"md\">System Resources</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align=\"stretch\">
                <Box>
                  <Flex justify=\"space-between\" mb={2}>
                    <Text fontSize=\"sm\">API Usage</Text>
                    <Text fontSize=\"sm\">72%</Text>
                  </Flex>
                  <Progress value={72} colorScheme=\"green\" size=\"sm\" />
                </Box>
                <Box>
                  <Flex justify=\"space-between\" mb={2}>
                    <Text fontSize=\"sm\">Voice Processing</Text>
                    <Text fontSize=\"sm\">45%</Text>
                  </Flex>
                  <Progress value={45} colorScheme=\"blue\" size=\"sm\" />
                </Box>
                <Box>
                  <Flex justify=\"space-between\" mb={2}>
                    <Text fontSize=\"sm\">Model Cache</Text>
                    <Text fontSize=\"sm\">89%</Text>
                  </Flex>
                  <Progress value={89} colorScheme=\"orange\" size=\"sm\" />
                </Box>
                <Box>
                  <Flex justify=\"space-between\" mb={2}>
                    <Text fontSize=\"sm\">Vector Storage</Text>
                    <Text fontSize=\"sm\">34%</Text>
                  </Flex>
                  <Progress value={34} colorScheme=\"purple\" size=\"sm\" />
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <HStack spacing={4} justify=\"center\">
          <Button
            leftIcon={<RefreshCw />}
            colorScheme=\"blue\"
            variant=\"outline\"
            onClick={loadDashboardData}
          >
            Refresh Data
          </Button>
          <Button
            leftIcon={<Settings />}
            variant=\"outline\"
          >
            MCP Settings
          </Button>
          <Button
            leftIcon={<MessageSquare />}
            colorScheme=\"green\"
          >
            Start New Session
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MCPDashboard;
