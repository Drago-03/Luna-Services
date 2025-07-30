import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Link,
  Divider,
  Card,
  CardBody,
  SimpleGrid,
  Code,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  Book, 
  Code as CodeIcon, 
  Zap, 
  Shield, 
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function DocumentationPage() {
  const navigate = useNavigate();

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
                Documentation
              </Text>
              <Badge 
                bg="rgba(34, 197, 94, 0.2)"
                color="#22C55E"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                v1.0.0-beta
              </Badge>
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
        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={8}>
          {/* Sidebar */}
          <Box>
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              borderRadius="xl"
              p={6}
              position="sticky"
              top="100px"
            >
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold" color="white">
                  Quick Start
                </Text>
                
                <VStack spacing={2} align="stretch">
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Getting Started
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Authentication
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Your First Request
                  </Link>
                </VStack>

                <Divider borderColor="rgba(255, 255, 255, 0.1)" />

                <Text fontSize="lg" fontWeight="bold" color="white">
                  API Reference
                </Text>
                
                <VStack spacing={2} align="stretch">
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    MCP Protocol
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    REST API
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    WebSocket API
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    SDKs
                  </Link>
                </VStack>

                <Divider borderColor="rgba(255, 255, 255, 0.1)" />

                <Text fontSize="lg" fontWeight="bold" color="white">
                  Guides
                </Text>
                
                <VStack spacing={2} align="stretch">
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Building Extensions
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Deployment
                  </Link>
                  <Link 
                    color="rgba(255, 255, 255, 0.7)" 
                    _hover={{ color: '#F97316' }}
                    fontSize="sm"
                  >
                    Best Practices
                  </Link>
                </VStack>
              </VStack>
            </Card>
          </Box>

          {/* Main Content */}
          <Box gridColumn={{ base: '1', lg: '2 / 5' }}>
            <VStack spacing={8} align="stretch">
              {/* Hero */}
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={8}
              >
                <VStack spacing={6} align="start">
                  <HStack spacing={3}>
                    <Box
                      p={3}
                      bg="rgba(249, 115, 22, 0.2)"
                      borderRadius="xl"
                      border="1px solid rgba(249, 115, 22, 0.3)"
                    >
                      <Book size={24} color="#F97316" />
                    </Box>
                    <VStack spacing={1} align="start">
                      <Text fontSize="2xl" fontWeight="black" color="white">
                        Luna Services Documentation
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.7)">
                        Everything you need to build with our Universal MCP
                      </Text>
                    </VStack>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                    <Card
                      bg="rgba(249, 115, 22, 0.1)"
                      border="1px solid rgba(249, 115, 22, 0.2)"
                      borderRadius="lg"
                      p={4}
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-2px)',
                        borderColor: 'rgba(249, 115, 22, 0.4)',
                      }}
                      cursor="pointer"
                    >
                      <VStack spacing={3}>
                        <CodeIcon size={32} color="#F97316" />
                        <VStack spacing={1}>
                          <Text fontWeight="bold" color="white">
                            Quick Start
                          </Text>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" textAlign="center">
                            Get up and running in minutes
                          </Text>
                        </VStack>
                      </VStack>
                    </Card>

                    <Card
                      bg="rgba(234, 179, 8, 0.1)"
                      border="1px solid rgba(234, 179, 8, 0.2)"
                      borderRadius="lg"
                      p={4}
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-2px)',
                        borderColor: 'rgba(234, 179, 8, 0.4)',
                      }}
                      cursor="pointer"
                    >
                      <VStack spacing={3}>
                        <Zap size={32} color="#EAB308" />
                        <VStack spacing={1}>
                          <Text fontWeight="bold" color="white">
                            API Reference
                          </Text>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" textAlign="center">
                            Complete API documentation
                          </Text>
                        </VStack>
                      </VStack>
                    </Card>

                    <Card
                      bg="rgba(34, 197, 94, 0.1)"
                      border="1px solid rgba(34, 197, 94, 0.2)"
                      borderRadius="lg"
                      p={4}
                      transition="all 0.3s ease"
                      _hover={{
                        transform: 'translateY(-2px)',
                        borderColor: 'rgba(34, 197, 94, 0.4)',
                      }}
                      cursor="pointer"
                    >
                      <VStack spacing={3}>
                        <Shield size={32} color="#22C55E" />
                        <VStack spacing={1}>
                          <Text fontWeight="bold" color="white">
                            Security
                          </Text>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" textAlign="center">
                            Enterprise-grade security
                          </Text>
                        </VStack>
                      </VStack>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </Card>

              {/* Getting Started */}
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={8}
              >
                <VStack spacing={6} align="start">
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    Getting Started
                  </Text>

                  <Tabs variant="enclosed" colorScheme="orange" w="full">
                    <TabList>
                      <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316', borderColor: '#F97316' }}>
                        JavaScript
                      </Tab>
                      <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316', borderColor: '#F97316' }}>
                        Python
                      </Tab>
                      <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316', borderColor: '#F97316' }}>
                        cURL
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel p={0} pt={6}>
                        <VStack spacing={4} align="stretch">
                          <Text color="rgba(255, 255, 255, 0.8)">
                            Install the Luna Services SDK:
                          </Text>
                          <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p={4}
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.1)"
                          >
                            <Code color="#22C55E" fontSize="sm">
                              npm install @luna-services/sdk
                            </Code>
                          </Box>
                          
                          <Text color="rgba(255, 255, 255, 0.8)">
                            Make your first request:
                          </Text>
                          <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p={4}
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.1)"
                            overflow="auto"
                          >
                            <Code color="#22C55E" fontSize="sm" whiteSpace="pre-wrap">
{`import { LunaClient } from '@luna-services/sdk';

const client = new LunaClient({
  apiKey: 'your-api-key'
});

const response = await client.mcp.request({
  task_type: 'code_generation',
  prompt: 'Create a React component'
});

console.log(response.generated_code);`}
                            </Code>
                          </Box>
                        </VStack>
                      </TabPanel>

                      <TabPanel p={0} pt={6}>
                        <VStack spacing={4} align="stretch">
                          <Text color="rgba(255, 255, 255, 0.8)">
                            Install the Luna Services Python SDK:
                          </Text>
                          <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p={4}
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.1)"
                          >
                            <Code color="#22C55E" fontSize="sm">
                              pip install luna-services
                            </Code>
                          </Box>
                          
                          <Text color="rgba(255, 255, 255, 0.8)">
                            Make your first request:
                          </Text>
                          <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p={4}
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.1)"
                            overflow="auto"
                          >
                            <Code color="#22C55E" fontSize="sm" whiteSpace="pre-wrap">
{`from luna_services import LunaClient

client = LunaClient(api_key="your-api-key")

response = client.mcp.request(
    task_type="code_generation",
    prompt="Create a React component"
)

print(response.generated_code)`}
                            </Code>
                          </Box>
                        </VStack>
                      </TabPanel>

                      <TabPanel p={0} pt={6}>
                        <VStack spacing={4} align="stretch">
                          <Text color="rgba(255, 255, 255, 0.8)">
                            Make a request using cURL:
                          </Text>
                          <Box
                            bg="rgba(0, 0, 0, 0.5)"
                            p={4}
                            borderRadius="lg"
                            border="1px solid rgba(255, 255, 255, 0.1)"
                            overflow="auto"
                          >
                            <Code color="#22C55E" fontSize="sm" whiteSpace="pre-wrap">
{`curl -X POST https://api.luna-services.com/v1/mcp/request \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "task_type": "code_generation",
    "prompt": "Create a React component"
  }'`}
                            </Code>
                          </Box>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </Card>

              {/* Community */}
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={8}
              >
                <VStack spacing={6} align="start">
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    Community & Support
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <HStack
                      spacing={4}
                      p={4}
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="lg"
                      cursor="pointer"
                      _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <Box
                        p={2}
                        bg="rgba(59, 130, 246, 0.2)"
                        borderRadius="lg"
                      >
                        <ExternalLink size={20} color="#3B82F6" />
                      </Box>
                      <VStack spacing={1} align="start">
                        <Text fontWeight="bold" color="white">
                          Discord Community
                        </Text>
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                          Join 10k+ developers
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack
                      spacing={4}
                      p={4}
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="lg"
                      cursor="pointer"
                      _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <Box
                        p={2}
                        bg="rgba(139, 92, 246, 0.2)"
                        borderRadius="lg"
                      >
                        <ExternalLink size={20} color="#8B5CF6" />
                      </Box>
                      <VStack spacing={1} align="start">
                        <Text fontWeight="bold" color="white">
                          GitHub
                        </Text>
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                          Open source examples
                        </Text>
                      </VStack>
                    </HStack>
                  </SimpleGrid>
                </VStack>
              </Card>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
