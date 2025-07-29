/**
 * MCP (Model Context Protocol) Main Page
 * 
 * Universal AI development assistance platform
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Grid,
  Card,
  CardBody,
  Badge,
  Flex,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';

const MCPPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    tokensUsed: 0
  });

  const [systemStatus, setSystemStatus] = useState({
    status: 'operational',
    activeSessions: 0,
    activeRequests: 0,
    voiceEnabled: true,
    multimodalEnabled: true
  });

  useEffect(() => {
    loadMCPData();
  }, []);

  const loadMCPData = async () => {
    try {
      // Load system status
      const statusResponse = await fetch('/api/mcp/status');
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        setSystemStatus({
          status: status.status,
          activeSessions: status.active_sessions || 0,
          activeRequests: status.active_requests || 0,
          voiceEnabled: status.features?.voice_enabled || true,
          multimodalEnabled: status.features?.multimodal_enabled || true
        });
      }

      // Load user analytics
      const analyticsResponse = await fetch('/api/mcp/analytics/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        setStats({
          totalRequests: analytics.total_requests || 0,
          successRate: analytics.success_rate || 0,
          avgResponseTime: analytics.avg_execution_time || 0,
          tokensUsed: analytics.total_tokens_used || 0
        });
      }
    } catch (error) {
      console.error('Failed to load MCP data:', error);
    }
  };

  const quickActions = [
    {
      title: 'Generate Code',
      description: 'AI-powered code generation',
      color: 'blue',
      action: () => console.log('Generate code')
    },
    {
      title: 'Debug Assistant',
      description: 'Intelligent debugging help',
      color: 'purple',
      action: () => console.log('Debug code')
    },
    {
      title: 'Voice Commands',
      description: 'Hands-free development',
      color: 'green',
      action: () => console.log('Voice commands')
    },
    {
      title: 'Architecture Design',
      description: 'System design assistance',
      color: 'orange',
      action: () => console.log('Architecture design')
    },
    {
      title: 'Documentation',
      description: 'Auto-generate docs',
      color: 'teal',
      action: () => console.log('Generate docs')
    },
    {
      title: 'API Integration',
      description: 'Automated API setup',
      color: 'red',
      action: () => console.log('API integration')
    }
  ];

  return (
    <Box p={6}>
      <VStack align="stretch">
        {/* Header */}
        <Box mb={8}>
          <Heading size="xl" mb={3}>
            Universal Model Context Protocol
          </Heading>
          <Text fontSize="lg" color="gray.600">
            AI-powered development ecosystem for modern developers
          </Text>
        </Box>

        {/* System Status */}
        <Card mb={6}>
          <CardBody>
            <VStack align="stretch">
              <HStack justify="space-between" mb={4}>
                <Heading size="md">System Status</Heading>
                <Badge 
                  colorScheme={systemStatus.status === 'operational' ? 'green' : 'red'}
                  variant="solid"
                  px={3}
                  py={1}
                >
                  {systemStatus.status.toUpperCase()}
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                <Stat>
                  <StatLabel>Active Sessions</StatLabel>
                  <StatNumber>{systemStatus.activeSessions}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Processing Queue</StatLabel>
                  <StatNumber>{systemStatus.activeRequests}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Voice Features</StatLabel>
                  <StatNumber fontSize="sm">
                    {systemStatus.voiceEnabled ? 'Enabled' : 'Disabled'}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Multi-modal</StatLabel>
                  <StatNumber fontSize="sm">
                    {systemStatus.multimodalEnabled ? 'Enabled' : 'Disabled'}
                  </StatNumber>
                </Stat>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Usage Statistics */}
        <Card mb={6}>
          <CardBody>
            <VStack align="stretch">
              <Heading size="md" mb={4}>Usage Analytics (Last 30 Days)</Heading>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
                <Stat>
                  <StatLabel>Total Requests</StatLabel>
                  <StatNumber>{stats.totalRequests.toLocaleString()}</StatNumber>
                  <StatHelpText>AI assistance calls</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Success Rate</StatLabel>
                  <StatNumber>{(stats.successRate * 100).toFixed(1)}%</StatNumber>
                  <Progress 
                    value={stats.successRate * 100} 
                    colorScheme="green" 
                    size="sm" 
                    mt={2}
                  />
                </Stat>
                <Stat>
                  <StatLabel>Avg Response Time</StatLabel>
                  <StatNumber>{stats.avgResponseTime.toFixed(2)}s</StatNumber>
                  <StatHelpText>Processing speed</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Tokens Used</StatLabel>
                  <StatNumber>{stats.tokensUsed.toLocaleString()}</StatNumber>
                  <StatHelpText>AI model usage</StatHelpText>
                </Stat>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <VStack align="stretch">
              <Heading size="md" mb={4}>Quick Actions</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                    onClick={action.action}
                    variant="outline"
                  >
                    <CardBody textAlign="center">
                      <VStack>
                        <Box
                          w={12}
                          h={12}
                          bg={`${action.color}.100`}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mb={2}
                        >
                          <Box w={6} h={6} bg={`${action.color}.500`} borderRadius="sm" />
                        </Box>
                        <Text fontWeight="semibold" mb={1}>
                          {action.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {action.description}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <Flex justify="center" gap={4} mt={8}>
          <Button colorScheme="blue" size="lg">
            Start New Session
          </Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
          <Button variant="outline" size="lg" onClick={loadMCPData}>
            Refresh Data
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default MCPPage;
