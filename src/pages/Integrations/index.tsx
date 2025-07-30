import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Switch,
  useToast,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Github,
  Database,
  Bot,
  Cloud,
  Shield,
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Development' | 'AI/ML' | 'Database' | 'Cloud' | 'Security' | 'Automation';
  icon: any;
  enabled: boolean;
  configured: boolean;
  requiresAuth: boolean;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'error' | 'inactive';
  lastSync?: string;
}

const availableIntegrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository management, CI/CD, and code review integration',
    category: 'Development',
    icon: Github,
    enabled: true,
    configured: true,
    requiresAuth: true,
    tier: 'free',
    status: 'active',
    lastSync: '2 minutes ago',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Advanced language model for code generation and analysis',
    category: 'AI/ML',
    icon: Bot,
    enabled: true,
    configured: true,
    requiresAuth: true,
    tier: 'pro',
    status: 'active',
    lastSync: '5 minutes ago',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Advanced relational database integration',
    category: 'Database',
    icon: Database,
    enabled: false,
    configured: false,
    requiresAuth: true,
    tier: 'free',
    status: 'inactive',
  },
  {
    id: 'aws',
    name: 'AWS Services',
    description: 'Complete AWS cloud infrastructure integration',
    category: 'Cloud',
    icon: Cloud,
    enabled: false,
    configured: false,
    requiresAuth: true,
    tier: 'enterprise',
    status: 'inactive',
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Enterprise authentication and authorization',
    category: 'Security',
    icon: Shield,
    enabled: false,
    configured: false,
    requiresAuth: true,
    tier: 'pro',
    status: 'inactive',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    category: 'Automation',
    icon: Zap,
    enabled: true,
    configured: false,
    requiresAuth: true,
    tier: 'free',
    status: 'error',
  },
];

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const toast = useToast();
  const { getUserTier } = useAuth();
  const userTier = getUserTier();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const categories = ['all', 'Development', 'AI/ML', 'Database', 'Cloud', 'Security', 'Automation'];
  
  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(int => int.category === selectedCategory);

  const handleToggleIntegration = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              enabled: !integration.enabled,
              status: !integration.enabled ? 'active' : 'inactive'
            }
          : integration
      ));
      
      const integration = integrations.find(int => int.id === id);
      toast({
        title: 'Integration Updated',
        description: `${integration?.name} has been ${integration?.enabled ? 'disabled' : 'enabled'}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update integration',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureIntegration = (id: string) => {
    const integration = integrations.find(int => int.id === id);
    toast({
      title: 'Configuration',
      description: `Opening configuration for ${integration?.name}`,
      status: 'info',
      duration: 2000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'purple';
      case 'pro': return 'blue';
      default: return 'gray';
    }
  };

  const canUseIntegration = (tier: string) => {
    if (tier === 'free') return true;
    if (tier === 'pro') return ['pro', 'enterprise'].includes(userTier);
    if (tier === 'enterprise') return userTier === 'enterprise';
    return false;
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Integrations
        </Text>
        <Text color="gray.500">
          Connect and manage your third-party services and tools
        </Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={CheckCircle} color="green.500" />
                <Text fontSize="2xl" fontWeight="bold">
                  {integrations.filter(int => int.enabled).length}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Active Integrations
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={AlertTriangle} color="orange.500" />
                <Text fontSize="2xl" fontWeight="bold">
                  {integrations.filter(int => int.status === 'error').length}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Needs Attention
              </Text>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={Settings} color="blue.500" />
                <Text fontSize="2xl" fontWeight="bold">
                  {integrations.filter(int => !int.configured && int.enabled).length}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Needs Configuration
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Category Tabs */}
      <Tabs index={categories.indexOf(selectedCategory)} onChange={(index) => setSelectedCategory(categories[index])}>
        <TabList>
          {categories.map((category) => (
            <Tab key={category} textTransform="capitalize">
              {category === 'all' ? 'All' : category}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {categories.map((category) => (
            <TabPanel key={category} px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredIntegrations.map((integration) => {
                  const canUse = canUseIntegration(integration.tier);
                  
                  return (
                    <Card
                      key={integration.id}
                      bg={bgColor}
                      border="1px"
                      borderColor={borderColor}
                      opacity={canUse ? 1 : 0.6}
                      position="relative"
                    >
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <HStack justify="space-between" w="full">
                            <HStack>
                              <Icon as={integration.icon} boxSize={6} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">{integration.name}</Text>
                                <HStack spacing={2}>
                                  <Badge colorScheme={getStatusColor(integration.status)} size="sm">
                                    {integration.status}
                                  </Badge>
                                  <Badge colorScheme={getTierColor(integration.tier)} size="sm">
                                    {integration.tier}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </HStack>
                            
                            <Switch
                              isChecked={integration.enabled}
                              onChange={() => handleToggleIntegration(integration.id)}
                              isDisabled={!canUse || loading}
                              colorScheme="orange"
                            />
                          </HStack>

                          <Text fontSize="sm" color="gray.500" noOfLines={2}>
                            {integration.description}
                          </Text>

                          {integration.enabled && integration.lastSync && (
                            <Text fontSize="xs" color="gray.400">
                              Last sync: {integration.lastSync}
                            </Text>
                          )}

                          <HStack spacing={2} w="full">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfigureIntegration(integration.id)}
                              isDisabled={!canUse || !integration.enabled}
                              leftIcon={<Settings size={14} />}
                            >
                              Configure
                            </Button>
                            
                            {integration.requiresAuth && (
                              <Button size="sm" variant="ghost" rightIcon={<ExternalLink size={14} />}>
                                Docs
                              </Button>
                            )}
                          </HStack>

                          {!canUse && (
                            <Alert status="warning" size="sm" borderRadius="md">
                              <AlertIcon boxSize={3} />
                              <Text fontSize="xs">
                                {integration.tier === 'pro' ? 'Pro' : 'Enterprise'} plan required
                              </Text>
                            </Alert>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {loading && (
        <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)">
          <Spinner size="lg" color="orange.500" />
        </Box>
      )}
    </VStack>
  );
};