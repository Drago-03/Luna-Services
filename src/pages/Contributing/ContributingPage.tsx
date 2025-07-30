import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Divider,
  Code,
  Link,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Code as CodeIcon, 
  GitBranch, 
  Users, 
  Book, 
  CheckCircle,
  ExternalLink,
  Github,
  Star,
  Upload,
  Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function ContributingPage() {
  const navigate = useNavigate();

  const contributionTypes = [
    {
      title: 'Build Extensions',
      description: 'Create powerful extensions for the Luna Services ecosystem',
      icon: CodeIcon,
      color: 'blue',
      steps: [
        'Fork the extension template repository',
        'Implement your extension logic',
        'Add comprehensive tests',
        'Submit for review and publication'
      ]
    },
    {
      title: 'Core Development',
      description: 'Contribute to the main Luna Services platform',
      icon: GitBranch,
      color: 'green',
      steps: [
        'Check open issues and discussions',
        'Create feature branch from main',
        'Follow coding standards and guidelines',
        'Submit pull request with detailed description'
      ]
    },
    {
      title: 'Documentation',
      description: 'Help improve our guides, tutorials, and API docs',
      icon: Book,
      color: 'purple',
      steps: [
        'Identify areas needing documentation',
        'Write clear, comprehensive guides',
        'Include code examples and demos',
        'Review and update existing docs'
      ]
    },
    {
      title: 'Community Support',
      description: 'Help other developers in forums and discussions',
      icon: Users,
      color: 'orange',
      steps: [
        'Answer questions in GitHub discussions',
        'Help troubleshoot issues',
        'Share best practices and tips',
        'Mentor new contributors'
      ]
    }
  ];

  const requirements = [
    'Node.js 18+ and npm/yarn',
    'TypeScript knowledge',
    'React experience (for UI extensions)',
    'Python 3.9+ (for backend contributions)',
    'Git and GitHub familiarity',
    'Understanding of MCP protocol'
  ];

  const guidelines = [
    'Follow our code style and ESLint rules',
    'Write comprehensive tests for new features',
    'Add JSDoc comments for public APIs',
    'Keep commits atomic and well-described',
    'Ensure backward compatibility',
    'Update documentation for new features'
  ];

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
                Contributing Guide
              </Text>
            </HStack>
            <GlassButtonNew
              variant="gradient"
              size="sm"
              leftIcon={<Github size={16} />}
              onClick={() => window.open('https://github.com/luna-services', '_blank')}
            >
              View on GitHub
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
              🤝 Open Source Community
            </Badge>
            
            <Text fontSize="4xl" fontWeight="black" color="white" lineHeight="shorter">
              Help Build the Future
            </Text>
            
            <Text 
              fontSize="xl" 
              color="rgba(255, 255, 255, 0.7)" 
              maxW="600px"
              lineHeight="tall"
            >
              Luna Services is built by developers, for developers. 
              Join our open-source community and help shape the future of AI-powered development.
            </Text>
          </VStack>

          {/* Quick Start Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              textAlign="center"
              p={6}
            >
              <Text fontSize="3xl" fontWeight="black" color="#F97316">
                2.5K+
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Contributors
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
                15K+
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                GitHub Stars
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
                500+
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Extensions
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
                24/7
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)">
                Community Support
              </Text>
            </Card>
          </SimpleGrid>

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Ways to Contribute */}
          <VStack spacing={8} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
              Ways to Contribute
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {contributionTypes.map((type, index) => (
                <Card
                  key={index}
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
                      <HStack>
                        <Box
                          p={3}
                          bg="rgba(249, 115, 22, 0.1)"
                          borderRadius="lg"
                          border="1px solid rgba(249, 115, 22, 0.2)"
                        >
                          <type.icon size={24} color="#F97316" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="lg" fontWeight="bold" color="white">
                            {type.title}
                          </Text>
                          <Badge colorScheme={type.color} variant="subtle" size="sm">
                            Popular
                          </Badge>
                        </VStack>
                      </HStack>

                      <Text color="rgba(255, 255, 255, 0.7)" lineHeight="tall">
                        {type.description}
                      </Text>

                      <VStack align="start" spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="bold" color="white">
                          Getting Started:
                        </Text>
                        <List spacing={1}>
                          {type.steps.map((step, stepIndex) => (
                            <ListItem key={stepIndex} fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                              <ListIcon as={CheckCircle} color="#22C55E" />
                              {step}
                            </ListItem>
                          ))}
                        </List>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          <Divider borderColor="rgba(255, 255, 255, 0.1)" />

          {/* Development Setup */}
          <VStack spacing={8} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
              Development Setup
            </Text>
            
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={6}
              >
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Terminal size={20} color="#F97316" />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Prerequisites
                    </Text>
                  </HStack>
                  <List spacing={2}>
                    {requirements.map((req, index) => (
                      <ListItem key={index} fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                        <ListIcon as={CheckCircle} color="#22C55E" />
                        {req}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </Card>

              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={6}
              >
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Book size={20} color="#F97316" />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Guidelines
                    </Text>
                  </HStack>
                  <List spacing={2}>
                    {guidelines.map((guideline, index) => (
                      <ListItem key={index} fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                        <ListIcon as={CheckCircle} color="#22C55E" />
                        {guideline}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </Card>
            </SimpleGrid>
          </VStack>

          {/* Quick Start Commands */}
          <Card
            bg="rgba(255, 255, 255, 0.02)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.05)"
            borderRadius="xl"
            p={6}
          >
            <VStack align="start" spacing={4}>
              <Text fontSize="lg" fontWeight="bold" color="white">
                Quick Start Commands
              </Text>
              <VStack align="start" spacing={3} w="full">
                <Box>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" mb={2}>
                    Clone the repository:
                  </Text>
                  <Code 
                    p={3} 
                    bg="rgba(0, 0, 0, 0.3)" 
                    color="#22C55E" 
                    borderRadius="md"
                    w="full"
                    display="block"
                  >
                    git clone https://github.com/luna-services/universal-mcp.git
                  </Code>
                </Box>
                
                <Box>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" mb={2}>
                    Install dependencies:
                  </Text>
                  <Code 
                    p={3} 
                    bg="rgba(0, 0, 0, 0.3)" 
                    color="#22C55E" 
                    borderRadius="md"
                    w="full"
                    display="block"
                  >
                    npm install && npm run setup
                  </Code>
                </Box>
                
                <Box>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" mb={2}>
                    Start development server:
                  </Text>
                  <Code 
                    p={3} 
                    bg="rgba(0, 0, 0, 0.3)" 
                    color="#22C55E" 
                    borderRadius="md"
                    w="full"
                    display="block"
                  >
                    npm run dev
                  </Code>
                </Box>
              </VStack>
            </VStack>
          </Card>

          {/* Resources */}
          <VStack spacing={8} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
              Resources
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{
                  borderColor: 'rgba(249, 115, 22, 0.4)',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s ease"
                onClick={() => navigate('/docs')}
              >
                <VStack spacing={4}>
                  <Book size={32} color="#F97316" />
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    API Documentation
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                    Complete API reference and guides
                  </Text>
                  <HStack color="#F97316">
                    <Text fontSize="sm">Learn more</Text>
                    <ExternalLink size={14} />
                  </HStack>
                </VStack>
              </Card>

              <Card
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{
                  borderColor: 'rgba(249, 115, 22, 0.4)',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s ease"
                onClick={() => window.open('https://github.com/luna-services/discussions', '_blank')}
              >
                <VStack spacing={4}>
                  <Users size={32} color="#F97316" />
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    Community Forum
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                    Join discussions and get help
                  </Text>
                  <HStack color="#F97316">
                    <Text fontSize="sm">Join now</Text>
                    <ExternalLink size={14} />
                  </HStack>
                </VStack>
              </Card>

              <Card
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{
                  borderColor: 'rgba(249, 115, 22, 0.4)',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s ease"
                onClick={() => navigate('/store')}
              >
                <VStack spacing={4}>
                  <Upload size={32} color="#F97316" />
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    Extension Templates
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                    Ready-to-use extension boilerplates
                  </Text>
                  <HStack color="#F97316">
                    <Text fontSize="sm">Browse templates</Text>
                    <ExternalLink size={14} />
                  </HStack>
                </VStack>
              </Card>
            </SimpleGrid>
          </VStack>

          {/* Call to Action */}
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
                Ready to Start Contributing?
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" maxW="500px">
                Join our community of developers building the next generation of AI-powered development tools.
              </Text>
              <HStack spacing={4}>
                <GlassButtonNew
                  variant="gradient"
                  size="lg"
                  leftIcon={<Github size={20} />}
                  onClick={() => window.open('https://github.com/luna-services', '_blank')}
                >
                  Fork on GitHub
                </GlassButtonNew>
                <GlassButtonNew
                  variant="outline-glass"
                  size="lg"
                  leftIcon={<Star size={20} />}
                  onClick={() => window.open('https://github.com/luna-services/universal-mcp', '_blank')}
                >
                  Star the Project
                </GlassButtonNew>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
