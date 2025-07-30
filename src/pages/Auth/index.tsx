import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Flex,
  useColorModeValue,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Badge
} from '@chakra-ui/react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Bot, Code, Mic, Zap, Shield, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, badge }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <VStack align="start" spacing={3}>
        <HStack>
          <Icon as={icon} size={24} color="blue.500" />
          {badge && <Badge colorScheme="blue" size="sm">{badge}</Badge>}
        </HStack>
        <Heading size="sm">{title}</Heading>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const AuthPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [isSignUp, setIsSignUp] = React.useState(false);
  
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, indigo.100, purple.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );

  if (isSignedIn) {
    // This should not render as the app should redirect authenticated users
    return null;
  }

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Development',
      description: 'Advanced code generation and debugging with Google Gemini 2.5 Flash integration',
      badge: 'New'
    },
    {
      icon: Mic,
      title: 'Voice-Enabled Coding',
      description: 'Hands-free development with NVIDIA Riva voice synthesis and recognition',
      badge: 'Pro'
    },
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Comprehensive support for Python, JavaScript, TypeScript, and 15+ languages'
    },
    {
      icon: Zap,
      title: 'LangChain Orchestration',
      description: 'Complex workflow automation with advanced AI chain management'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access control and audit logging'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built for teams with project management and real-time collaboration tools'
    }
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" py={8}>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8} align="center" minH="calc(100vh - 64px)">
          {/* Left side - Branding and Features */}
          <VStack flex={1} align="start" spacing={8} w="full">
            {/* Logo and branding */}
            <VStack align="start" spacing={4}>
              <HStack spacing={4}>
                <Image 
                  src="/assets/logo.png" 
                  alt="Universal MCP Logo" 
                  boxSize="60px"
                  objectFit="contain"
                />
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <Heading size="xl" color="blue.600">
                      Universal MCP
                    </Heading>
                    <Badge 
                      bg="transparent"
                      color="rgba(249, 115, 22, 0.6)"
                      border="1px solid rgba(249, 115, 22, 0.3)"
                      variant="outline"
                      fontSize="8px"
                      px={1.5}
                      py={0.5}
                      borderRadius="sm"
                    >
                      BETA
                    </Badge>
                  </HStack>
                  <Text fontSize="lg" color="gray.600" fontWeight="medium">
                    AI-Powered Development Platform
                  </Text>
                </VStack>
              </HStack>
              
              <Text fontSize="xl" color="gray.700" maxW="lg">
                The most advanced Model Context Protocol system for AI developers. 
                Build, debug, and deploy with the power of AI assistance.
              </Text>
            </VStack>

            {/* Features grid */}
            <Box w="full">
              <Heading size="md" mb={6} color="gray.800">
                Platform Features
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </SimpleGrid>
            </Box>

            {/* Tier information */}
            <Box>
              <HStack spacing={4}>
                <Badge colorScheme="green" p={2} borderRadius="md">
                  Free Tier: 100 AI requests/month
                </Badge>
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  Pro Tier: 5,000 requests + Voice features
                </Badge>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  Enterprise: Unlimited + Custom deployment
                </Badge>
              </HStack>
            </Box>
          </VStack>

          {/* Right side - Authentication */}
          <Box flex={1} w="full" maxW="md" mx="auto">
            <VStack spacing={6}>
              <VStack spacing={2} textAlign="center">
                <Heading size="lg">
                  {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                </Heading>
                <Text color="gray.600">
                  {isSignUp 
                    ? 'Join thousands of developers using AI-powered development' 
                    : 'Sign in to access your Universal MCP dashboard'
                  }
                </Text>
              </VStack>

              {/* Clerk Authentication Component */}
              <Box w="full">
                {isSignUp ? (
                  <SignUp 
                    routing="hash"
                    afterSignUpUrl="/dashboard"
                    redirectUrl="/dashboard"
                  />
                ) : (
                  <SignIn 
                    routing="hash"
                    afterSignInUrl="/dashboard"
                    redirectUrl="/dashboard"
                  />
                )}
              </Box>

              {/* Toggle between sign in and sign up */}
              <Text textAlign="center" color="gray.600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Text
                  as="button"
                  color="blue.600"
                  fontWeight="semibold"
                  onClick={() => setIsSignUp(!isSignUp)}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </Text>
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default AuthPage;
