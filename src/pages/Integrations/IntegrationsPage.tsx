import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { ArrowLeft, ExternalLink, Code, Database, Bot, Cloud, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

interface Integration {
  name: string;
  description: string;
  category: 'AI/ML' | 'Development' | 'Database' | 'Cloud' | 'Security' | 'Automation';
  icon: any;
  available: boolean;
  popular?: boolean;
  enterprise?: boolean;
}

const integrations: Integration[] = [
  {
    name: 'GitHub',
    description: 'Full repository management, CI/CD, and code review integration',
    category: 'Development',
    icon: Code,
    available: true,
    popular: true,
  },
  {
    name: 'OpenAI GPT-4',
    description: 'Advanced language model integration for code generation and analysis',
    category: 'AI/ML',
    icon: Bot,
    available: true,
    popular: true,
  },
  {
    name: 'Google Gemini',
    description: 'Multi-modal AI capabilities for code, text, and image processing',
    category: 'AI/ML',
    icon: Bot,
    available: true,
  },
  {
    name: 'PostgreSQL',
    description: 'Advanced relational database integration with real-time features',
    category: 'Database',
    icon: Database,
    available: true,
  },
  {
    name: 'AWS Services',
    description: 'Complete AWS cloud infrastructure integration and deployment',
    category: 'Cloud',
    icon: Cloud,
    available: true,
    enterprise: true,
  },
  {
    name: 'Docker',
    description: 'Containerization and deployment automation',
    category: 'Development',
    icon: Code,
    available: true,
  },
  {
    name: 'Kubernetes',
    description: 'Orchestration and scaling for containerized applications',
    category: 'Cloud',
    icon: Cloud,
    available: true,
    enterprise: true,
  },
  {
    name: 'Slack',
    description: 'Team communication and notification integration',
    category: 'Automation',
    icon: Zap,
    available: true,
    popular: true,
  },
  {
    name: 'Jira',
    description: 'Project management and issue tracking integration',
    category: 'Development',
    icon: Code,
    available: false,
  },
  {
    name: 'Auth0',
    description: 'Enterprise authentication and authorization services',
    category: 'Security',
    icon: Shield,
    available: true,
    enterprise: true,
  },
];

const categoryColors = {
  'AI/ML': 'purple',
  'Development': 'blue',
  'Database': 'green',
  'Cloud': 'cyan',
  'Security': 'red',
  'Automation': 'orange',
};

export default function IntegrationsPage() {
  const navigate = useNavigate();

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
    <Card
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="xl"
      _hover={{
        borderColor: 'rgba(249, 115, 22, 0.4)',
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
      transition="all 0.3s ease"
    >
      <CardBody p={6}>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <HStack>
              <Box
                p={2}
                bg="rgba(249, 115, 22, 0.1)"
                borderRadius="lg"
                border="1px solid rgba(249, 115, 22, 0.2)"
              >
                <integration.icon size={20} color="#F97316" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {integration.name}
                </Text>
                <Badge
                  colorScheme={categoryColors[integration.category]}
                  variant="subtle"
                  size="sm"
                >
                  {integration.category}
                </Badge>
              </VStack>
            </HStack>
            <VStack spacing={1} align="end">
              {integration.popular && (
                <Badge colorScheme="yellow" variant="solid" size="sm">
                  Popular
                </Badge>
              )}
              {integration.enterprise && (
                <Badge colorScheme="purple" variant="outline" size="sm">
                  Enterprise
                </Badge>
              )}
            </VStack>
          </HStack>

          <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm" lineHeight="tall">
            {integration.description}
          </Text>

          <HStack justify="space-between" w="full" pt={2}>
            <Badge
              colorScheme={integration.available ? 'green' : 'gray'}
              variant={integration.available ? 'solid' : 'outline'}
            >
              {integration.available ? 'Available' : 'Coming Soon'}
            </Badge>
            {integration.available && (
              <Button
                size="sm"
                variant="ghost"
                color="rgba(255, 255, 255, 0.8)"
                _hover={{ color: '#F97316' }}
                rightIcon={<ExternalLink size={14} />}
                onClick={() => navigate('/signin')}
              >
                Use Integration
              </Button>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box minH="100vh" bg="#0A0A0A" position="relative">
      <AnimatedBackgroundNew variant="dashboard" />
      
      {/* Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={100}
        bg="rgba(10, 10, 10, 0.9)"
        backdropFilter="blur(20px)"
        borderBottom="1px solid rgba(255, 255, 255, 0.05)"
      >
        <Container maxW="1200px" py={4}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <GlassButtonNew
                variant="outline-glass"
                size="sm"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => navigate('/')}
              >
                Back to Home
              </GlassButtonNew>
              <Text fontSize="xl" fontWeight="bold" color="white">
                Integrations
              </Text>
            </HStack>
            <GlassButtonNew
              variant="gradient"
              size="sm"
              onClick={() => navigate('/signin')}
            >
              Get Started
            </GlassButtonNew>
          </HStack>
        </Container>
      </Box>

      <Container maxW="1200px" py={12} position="relative" zIndex={1}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center">
            <Badge 
              bg="rgba(249, 115, 22, 0.1)"
              color="#F97316"
              border="1px solid rgba(249, 115, 22, 0.2)"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              🔌 200+ Integrations Available
            </Badge>
            
            <Text fontSize="4xl" fontWeight="black" color="white" lineHeight="shorter">
              Connect Everything
            </Text>
            
            <Text 
              fontSize="xl" 
              color="rgba(255, 255, 255, 0.7)" 
              maxW="600px"
              lineHeight="tall"
            >
              Luna Services integrates with all your favorite tools and services. 
              Build powerful workflows that connect your entire development ecosystem.
            </Text>
          </VStack>

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              textAlign="center"
              p={6}
            >
              <Text fontSize="3xl" fontWeight="black" color="#F97316">
                200+
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Total Integrations
              </Text>
            </Card>
            
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              textAlign="center"
              p={6}
            >
              <Text fontSize="3xl" fontWeight="black" color="#EAB308">
                50+
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                AI/ML Models
              </Text>
            </Card>
            
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              textAlign="center"
              p={6}
            >
              <Text fontSize="3xl" fontWeight="black" color="#22C55E">
                99.9%
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Uptime SLA
              </Text>
            </Card>
            
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              textAlign="center"
              p={6}
            >
              <Text fontSize="3xl" fontWeight="black" color="#3B82F6">
                &lt;50ms
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Response Time
              </Text>
            </Card>
          </SimpleGrid>

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Integrations Grid */}
          <VStack spacing={8} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Featured Integrations
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {integrations.map((integration, index) => (
                <IntegrationCard key={index} integration={integration} />
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <Card
            bg="rgba(249, 115, 22, 0.05)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(249, 115, 22, 0.2)"
            borderRadius="xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={6}>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Need a Custom Integration?
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" maxW="500px">
                Our enterprise team can build custom integrations for your specific tools and workflows.
              </Text>
              <HStack spacing={4}>
                <GlassButtonNew
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Contact Enterprise
                </GlassButtonNew>
                <GlassButtonNew
                  variant="outline-glass"
                  size="lg"
                  onClick={() => navigate('/docs')}
                >
                  API Documentation
                </GlassButtonNew>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
