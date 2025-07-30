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
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Star, 
  Code, 
  Bot, 
  Zap, 
  Database, 
  Shield, 
  Cloud,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

interface Extension {
  id: string;
  name: string;
  description: string;
  category: 'AI/ML' | 'Development' | 'Automation' | 'Database' | 'Security' | 'Cloud' | 'Templates';
  author: string;
  version: string;
  downloads: number;
  rating: number;
  price: 'Free' | 'Pro' | 'Enterprise';
  featured?: boolean;
  verified?: boolean;
  trending?: boolean;
  icon: any;
}

const extensions: Extension[] = [
  {
    id: '1',
    name: 'AI Code Assistant Pro',
    description: 'Advanced AI-powered code completion and generation with GPT-4 integration',
    category: 'AI/ML',
    author: 'Luna Labs',
    version: '2.1.0',
    downloads: 125430,
    rating: 4.9,
    price: 'Pro',
    featured: true,
    verified: true,
    trending: true,
    icon: Bot,
  },
  {
    id: '2',
    name: 'Smart Debugger',
    description: 'Intelligent debugging assistant that identifies and suggests fixes for common issues',
    category: 'Development',
    author: 'DevTools Inc',
    version: '1.8.3',
    downloads: 89234,
    rating: 4.7,
    price: 'Free',
    verified: true,
    icon: Code,
  },
  {
    id: '3',
    name: 'Auto-Deploy Pipeline',
    description: 'Automated CI/CD pipeline generator with cloud deployment capabilities',
    category: 'Cloud',
    author: 'CloudOps Team',
    version: '3.2.1',
    downloads: 67891,
    rating: 4.8,
    price: 'Enterprise',
    featured: true,
    verified: true,
    icon: Cloud,
  },
  {
    id: '4',
    name: 'Database Schema Generator',
    description: 'Generate optimized database schemas from natural language descriptions',
    category: 'Database',
    author: 'DB Experts',
    version: '1.5.2',
    downloads: 45123,
    rating: 4.6,
    price: 'Pro',
    verified: true,
    trending: true,
    icon: Database,
  },
  {
    id: '5',
    name: 'Security Audit Tool',
    description: 'Comprehensive security analysis and vulnerability detection for your codebase',
    category: 'Security',
    author: 'SecureCode Ltd',
    version: '2.0.4',
    downloads: 34567,
    rating: 4.8,
    price: 'Enterprise',
    verified: true,
    icon: Shield,
  },
  {
    id: '6',
    name: 'Team Collaboration Hub',
    description: 'Enhanced team features with real-time collaboration and project management',
    category: 'Development',
    author: 'Teamwork Solutions',
    version: '1.9.1',
    downloads: 78234,
    rating: 4.5,
    price: 'Pro',
    trending: true,
    icon: Users,
  },
];

const categoryColors = {
  'AI/ML': 'purple',
  'Development': 'blue',
  'Automation': 'orange',
  'Database': 'green',
  'Security': 'red',
  'Cloud': 'cyan',
  'Templates': 'pink',
};

const priceColors = {
  'Free': 'green',
  'Pro': 'blue',
  'Enterprise': 'purple',
};

export default function StorePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const ExtensionCard = ({ extension }: { extension: Extension }) => (
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
      h="full"
    >
      <CardBody p={6}>
        <VStack align="start" spacing={4} h="full">
          <HStack justify="space-between" w="full">
            <HStack>
              <Box
                p={3}
                bg="rgba(249, 115, 22, 0.1)"
                borderRadius="lg"
                border="1px solid rgba(249, 115, 22, 0.2)"
              >
                <extension.icon size={24} color="#F97316" />
              </Box>
              <VStack align="start" spacing={0}>
                <HStack>
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    {extension.name}
                  </Text>
                  {extension.verified && (
                    <Badge colorScheme="blue" variant="solid" size="sm">
                      ✓
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                  by {extension.author}
                </Text>
              </VStack>
            </HStack>
            <VStack spacing={1} align="end">
              {extension.featured && (
                <Badge colorScheme="yellow" variant="solid" size="sm">
                  Featured
                </Badge>
              )}
              {extension.trending && (
                <Badge colorScheme="red" variant="outline" size="sm">
                  <HStack spacing={1}>
                    <TrendingUp size={12} />
                    <Text>Trending</Text>
                  </HStack>
                </Badge>
              )}
            </VStack>
          </HStack>

          <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm" lineHeight="tall" flex="1">
            {extension.description}
          </Text>

          <VStack spacing={3} w="full">
            <HStack justify="space-between" w="full">
              <Badge
                colorScheme={categoryColors[extension.category]}
                variant="subtle"
                size="sm"
              >
                {extension.category}
              </Badge>
              <Badge
                colorScheme={priceColors[extension.price]}
                variant="solid"
                size="sm"
              >
                {extension.price}
              </Badge>
            </HStack>

            <HStack justify="space-between" w="full" fontSize="sm">
              <HStack spacing={4}>
                <HStack spacing={1}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <Text color="rgba(255, 255, 255, 0.7)">{extension.rating}</Text>
                </HStack>
                <HStack spacing={1}>
                  <Download size={14} color="rgba(255, 255, 255, 0.5)" />
                  <Text color="rgba(255, 255, 255, 0.7)">
                    {extension.downloads.toLocaleString()}
                  </Text>
                </HStack>
              </HStack>
              <Text color="rgba(255, 255, 255, 0.6)">
                v{extension.version}
              </Text>
            </HStack>

            <Button
              w="full"
              size="sm"
              bg="rgba(249, 115, 22, 0.1)"
              border="1px solid rgba(249, 115, 22, 0.3)"
              color="#F97316"
              _hover={{
                bg: 'rgba(249, 115, 22, 0.2)',
                borderColor: 'rgba(249, 115, 22, 0.5)',
              }}
              onClick={() => navigate('/signin')}
            >
              {extension.price === 'Free' ? 'Install Free' : 'View Details'}
            </Button>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
    const matchesPrice = selectedPrice === 'all' || ext.price === selectedPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
                Extension Store
              </Text>
            </HStack>
            <GlassButtonNew
              variant="gradient"
              size="sm"
              onClick={() => navigate('/contributing')}
            >
              Publish Extension
            </GlassButtonNew>
          </HStack>
        </Container>
      </Box>

      <Container maxW="1200px" py={12} position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">
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
              🛍️ 500+ Extensions Available
            </Badge>
            
            <Text fontSize="4xl" fontWeight="black" color="white" lineHeight="shorter">
              Extend Your Capabilities
            </Text>
            
            <Text 
              fontSize="xl" 
              color="rgba(255, 255, 255, 0.7)" 
              maxW="600px"
              lineHeight="tall"
            >
              Discover powerful extensions built by the community. 
              Enhance your development workflow with AI-powered tools and automation.
            </Text>
          </VStack>

          {/* Filters */}
          <Card
            bg="rgba(255, 255, 255, 0.02)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.05)"
            borderRadius="xl"
            p={6}
          >
            <VStack spacing={4}>
              <HStack spacing={4} w="full">
                <InputGroup flex="1">
                  <InputLeftElement>
                    <Icon as={Search} color="rgba(255, 255, 255, 0.4)" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search extensions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                  />
                </InputGroup>
                
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  color="white"
                  w="200px"
                >
                  <option value="all">All Categories</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Development">Development</option>
                  <option value="Automation">Automation</option>
                  <option value="Database">Database</option>
                  <option value="Security">Security</option>
                  <option value="Cloud">Cloud</option>
                </Select>
                
                <Select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  color="white"
                  w="150px"
                >
                  <option value="all">All Prices</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </Select>
              </HStack>
              
              <HStack spacing={4} w="full" fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                <Text>Showing {filteredExtensions.length} extensions</Text>
                <Divider orientation="vertical" h="20px" borderColor="rgba(255, 255, 255, 0.2)" />
                <HStack spacing={2}>
                  <Filter size={14} />
                  <Text>Filter by:</Text>
                </HStack>
              </HStack>
            </VStack>
          </Card>

          {/* Extensions Grid */}
          <Tabs>
            <TabList>
              <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316' }}>
                All Extensions
              </Tab>
              <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316' }}>
                Featured
              </Tab>
              <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316' }}>
                Trending
              </Tab>
              <Tab color="rgba(255, 255, 255, 0.7)" _selected={{ color: '#F97316' }}>
                Free
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={6}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredExtensions.map((extension) => (
                    <ExtensionCard key={extension.id} extension={extension} />
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel p={0} pt={6}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredExtensions.filter(ext => ext.featured).map((extension) => (
                    <ExtensionCard key={extension.id} extension={extension} />
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel p={0} pt={6}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredExtensions.filter(ext => ext.trending).map((extension) => (
                    <ExtensionCard key={extension.id} extension={extension} />
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel p={0} pt={6}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredExtensions.filter(ext => ext.price === 'Free').map((extension) => (
                    <ExtensionCard key={extension.id} extension={extension} />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Developer CTA */}
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
                Build Your Own Extension
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" maxW="500px">
                Join thousands of developers building the future of AI-powered development tools.
              </Text>
              <HStack spacing={4}>
                <GlassButtonNew
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/contributing')}
                >
                  Start Building
                </GlassButtonNew>
                <GlassButtonNew
                  variant="outline-glass"
                  size="lg"
                  onClick={() => navigate('/docs')}
                >
                  View Documentation
                </GlassButtonNew>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
