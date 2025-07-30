import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  IconButton,
  Icon,
  Checkbox,
  Link,
  Card,
  CardBody,
  Divider,
  Image,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Github,
  Chrome,
  Apple,
  Bot,
  Zap,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { AnimatedBackground } from '../../components/UI/AnimatedBackground';
import { GlassButton } from '../../components/UI/GlassButton';
import { FeatureCard } from '../../components/UI/FeatureCard';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Development',
      description: 'Advanced code generation and debugging with Google Gemini 2.5 Flash integration',
      badge: 'NEW',
    },
    {
      icon: Zap,
      title: 'Voice-Enabled Coding',
      description: 'Hands-free development with NVIDIA Riva voice synthesis and recognition',
      badge: 'PRO',
    },
    {
      icon: Sparkles,
      title: 'Multi-Language Support',
      description: 'Comprehensive support for Python, JavaScript, TypeScript, and 15+ languages',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with role-based access control and audit logging',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in form submission
    console.log('Sign-in submitted:', { email, password, rememberMe });
  };

  return (
    <AnimatedBackground variant="auth">
      <Container maxW="7xl" py={8} minH="100vh">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={12} align="center" minH="calc(100vh - 64px)">
          {/* Left side - Branding and Features */}
          <VStack flex={1} align="start" spacing={8} w="full">
            {/* Logo and branding */}
            <VStack align="start" spacing={6}>
              <HStack spacing={4}>
                <Image 
                  src="/assets/logo.png" 
                  alt="Universal MCP Logo" 
                  boxSize="80px"
                  objectFit="contain"
                  filter="drop-shadow(0 0 20px rgba(249, 115, 22, 0.5))"
                />
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Heading size="2xl" color="white" fontWeight="black">
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
                  <Text fontSize="xl" color="rgba(255, 255, 255, 0.8)" fontWeight="medium">
                    AI-Powered Development Platform
                  </Text>
                </VStack>
              </HStack>
              
              <Text fontSize="xl" color="rgba(255, 255, 255, 0.9)" maxW="lg" lineHeight="tall">
                Welcome back! Sign in to access your Universal MCP dashboard and continue your AI-powered development journey.
              </Text>
            </VStack>

            {/* Features grid */}
            <Box w="full">
              <Heading size="lg" mb={6} color="white" fontWeight="bold">
                Platform Features
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </SimpleGrid>
            </Box>

            {/* Tier information */}
            <Box>
              <HStack spacing={4} flexWrap="wrap">
                <Badge
                  bg="rgba(34, 197, 94, 0.2)"
                  color="#22C55E"
                  p={3}
                  borderRadius="xl"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Free Tier: 100 AI requests/month
                </Badge>
                <Badge
                  bg="rgba(59, 130, 246, 0.2)"
                  color="#3B82F6"
                  p={3}
                  borderRadius="xl"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Pro Tier: 5,000 requests + Voice features
                </Badge>
                <Badge
                  bg="rgba(147, 51, 234, 0.2)"
                  color="#9333EA"
                  p={3}
                  borderRadius="xl"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Enterprise: Unlimited + Custom deployment
                </Badge>
              </HStack>
            </Box>
          </VStack>

          {/* Right side - Sign-in Form */}
          <Box flex={1} w="full" maxW="md" mx="auto">
            <Card
              bg="rgba(0, 0, 0, 0.4)"
              backdropFilter="blur(30px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="3xl"
              p={8}
              boxShadow="0 25px 50px rgba(0, 0, 0, 0.5)"
            >
              <CardBody p={0}>
                <VStack spacing={8}>
                  <VStack spacing={3} textAlign="center">
                    <Heading size="xl" color="white" fontWeight="bold">
                      Welcome Back
                    </Heading>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize="lg">
                      Sign in to access your Universal MCP dashboard
                    </Text>
                  </VStack>

                  {/* Social login buttons */}
                  <VStack spacing={3} w="full">
                    <GlassButton variant="glass" size="lg" w="full" leftIcon={<Github />}>
                      Continue with GitHub
                    </GlassButton>
                    <HStack spacing={3} w="full">
                      <GlassButton variant="outline-glass" flex={1} leftIcon={<Chrome />}>
                        Google
                      </GlassButton>
                      <GlassButton variant="outline-glass" flex={1} leftIcon={<Apple />}>
                        Apple
                      </GlassButton>
                    </HStack>
                  </VStack>

                  <Divider borderColor="rgba(255, 255, 255, 0.2)" />

                  {/* Sign-in Form */}
                  <Box as="form" onSubmit={handleSubmit} w="full">
                    <VStack spacing={6} w="full">
                      <FormControl>
                        <FormLabel color="white" fontWeight="semibold">Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={Mail} color="rgba(255, 255, 255, 0.5)" />
                          </InputLeftElement>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            bg="rgba(255, 255, 255, 0.1)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            borderRadius="xl"
                            color="white"
                            _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                            _focus={{
                              borderColor: '#F97316',
                              boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
                              bg: 'rgba(255, 255, 255, 0.15)',
                            }}
                            size="lg"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel color="white" fontWeight="semibold">Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={Lock} color="rgba(255, 255, 255, 0.5)" />
                          </InputLeftElement>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            bg="rgba(255, 255, 255, 0.1)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            borderRadius="xl"
                            color="white"
                            _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                            _focus={{
                              borderColor: '#F97316',
                              boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
                              bg: 'rgba(255, 255, 255, 0.15)',
                            }}
                            size="lg"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              icon={<Icon as={showPassword ? EyeOff : Eye} />}
                              variant="ghost"
                              color="rgba(255, 255, 255, 0.5)"
                              _hover={{ color: 'white' }}
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <HStack justify="space-between" w="full">
                        <Checkbox
                          isChecked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          colorScheme="orange"
                        >
                          <Text color="rgba(255, 255, 255, 0.8)">Remember me</Text>
                        </Checkbox>
                        <Link color="#F97316" fontSize="sm" fontWeight="semibold">
                          Forgot password?
                        </Link>
                      </HStack>

                      <GlassButton
                        type="submit"
                        variant="gradient"
                        size="lg"
                        w="full"
                        rightIcon={<ArrowRight />}
                        fontSize="lg"
                        fontWeight="bold"
                      >
                        Sign In
                      </GlassButton>
                    </VStack>
                  </Box>

                  <VStack spacing={4}>
                    <Text color="rgba(255, 255, 255, 0.6)">
                      Don't have an account?{' '}
                      <Link
                        color="#F97316"
                        fontWeight="bold"
                        onClick={() => navigate('/signup')}
                        cursor="pointer"
                        _hover={{ color: '#EAB308' }}
                      >
                        Sign Up
                      </Link>
                    </Text>

                    {/* Demo credentials */}
                    <Box
                      p={4}
                      bg="rgba(249, 115, 22, 0.1)"
                      borderRadius="xl"
                      border="1px solid rgba(249, 115, 22, 0.3)"
                      w="full"
                    >
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)" textAlign="center">
                        <Text as="span" fontWeight="bold" color="#F97316">Demo Credentials:</Text><br />
                        Email: admin@universalmcp.com<br />
                        Password: admin123
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </AnimatedBackground>
  );
};

export default SignInPage;
