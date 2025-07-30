import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Container,
  Flex,
  Badge,
  Image,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  Code, 
  Zap, 
  Shield, 
  Users,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AnimatedBackground, GlassCard, GradientText, ParticleSystem } from '../../components/UI/AnimatedComponents';
import { GlassButton } from '../../components/UI/GlassButton';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, badge }) => {
  return (
    <GlassCard blur={15} opacity={0.08} hover={true} p={6}>
      <VStack align="start" spacing={4}>
        <HStack>
          <Box
            p={3}
            borderRadius="12px"
            background="linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)"
            backdropFilter="blur(10px)"
          >
            <Icon as={icon} boxSize={6} color="white" />
          </Box>
          {badge && (
            <Badge
              background="linear-gradient(135deg, #f43f5e 0%, #eab308 100%)"
              color="white"
              px={2}
              py={1}
              borderRadius="6px"
              fontSize="xs"
              fontWeight="bold"
            >
              {badge}
            </Badge>
          )}
        </HStack>
        
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
            {title}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800" lineHeight="tall">
            {description}
          </Text>
        </Box>
      </VStack>
    </GlassCard>
  );
};

const ModernAuthPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
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

  const stats = [
    { label: 'Active Developers', value: '50,000+' },
    { label: 'Code Generated', value: '2M+ Lines' },
    { label: 'AI Requests', value: '10M+' },
    { label: 'Enterprise Clients', value: '500+' },
  ];

  return (
    <AnimatedBackground variant="gradient">
      <ParticleSystem count={100} color="rgba(255, 255, 255, 0.3)" />
      
      <Container maxW="full" p={0}>
        <Flex direction={{ base: 'column', lg: 'row' }} minH="100vh">
          
          {/* Left Side - Branding and Features */}
          <Box flex={1} p={{ base: 8, lg: 12 }} display="flex" alignItems="center">
            <VStack align="start" spacing={10} w="full" maxW="600px" mx="auto">
              
              {/* Logo and Main Branding */}
              <VStack align="start" spacing={6}>
                <HStack spacing={4}>
                  <Image 
                    src="/assets/logo.png" 
                    alt="Universal MCP Logo" 
                    boxSize="80px"
                    objectFit="contain"
                    filter="drop-shadow(0 4px 8px rgba(244, 63, 94, 0.3))"
                  />
                  <VStack align="start" spacing={2}>
                    <HStack spacing={3}>
                      <GradientText fontSize="4xl" fontWeight="black">
                        Universal MCP
                      </GradientText>
                      <Badge 
                        background="linear-gradient(135deg, #f59e0b 0%, #eab308 100%)"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="8px"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        BETA
                      </Badge>
                    </HStack>
                    <Text fontSize="xl" color="whiteAlpha.900" fontWeight="medium">
                      AI-Powered Development Platform
                    </Text>
                  </VStack>
                </HStack>
                
                <Text fontSize="2xl" color="whiteAlpha.800" maxW="lg" lineHeight="tall">
                  The most advanced Model Context Protocol system for AI developers. 
                  Build, debug, and deploy with the power of AI assistance.
                </Text>
              </VStack>

              {/* Stats Section */}
              <GlassCard blur={15} opacity={0.1} w="full" p={6}>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  {stats.map((stat, index) => (
                    <VStack key={index} align="center" spacing={2}>
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        {stat.value}
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.700" textAlign="center">
                        {stat.label}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </GlassCard>

              {/* Features Grid */}
              <Box w="full">
                <VStack align="start" spacing={6}>
                  <HStack spacing={2}>
                    <Icon as={Sparkles} color="yellow.400" boxSize={6} />
                    <Heading size="lg" color="white">
                      Platform Features
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    {features.map((feature, index) => (
                      <FeatureCard key={index} {...feature} />
                    ))}
                  </SimpleGrid>
                </VStack>
              </Box>

              {/* Tier Information */}
              <VStack align="start" spacing={4} w="full">
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  Choose Your Plan
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  <GlassCard blur={10} opacity={0.1} p={4}>
                    <VStack spacing={2}>
                      <Badge colorScheme="green" variant="solid">Free Tier</Badge>
                      <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
                        100 AI requests/month
                      </Text>
                    </VStack>
                  </GlassCard>
                  <GlassCard blur={10} opacity={0.1} p={4}>
                    <VStack spacing={2}>
                      <Badge background="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" color="white">Pro Tier</Badge>
                      <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
                        5,000 requests + Voice features
                      </Text>
                    </VStack>
                  </GlassCard>
                  <GlassCard blur={10} opacity={0.1} p={4}>
                    <VStack spacing={2}>
                      <Badge background="linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)" color="white">Enterprise</Badge>
                      <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
                        Unlimited + Custom deployment
                      </Text>
                    </VStack>
                  </GlassCard>
                </HStack>
              </VStack>

            </VStack>
          </Box>

          {/* Right Side - Authentication */}
          <Box 
            flex={{ base: 'none', lg: '0 0 500px' }} 
            p={{ base: 8, lg: 12 }} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Box w="full" maxW="400px">
              <VStack spacing={8}>
                
                {/* Auth Header */}
                <VStack spacing={4} textAlign="center" w="full">
                  <GlassCard blur={20} opacity={0.15} p={6} w="full">
                    <VStack spacing={4}>
                      <HStack spacing={2}>
                        <Icon as={Star} color="yellow.400" boxSize={5} />
                        <Heading size="lg" color="white">
                          {isSignUp ? 'Join the Revolution' : 'Welcome Back'}
                        </Heading>
                        <Icon as={Star} color="yellow.400" boxSize={5} />
                      </HStack>
                      <Text color="whiteAlpha.800" fontSize="md">
                        {isSignUp 
                          ? 'Join thousands of developers using AI-powered development' 
                          : 'Sign in to access your Universal MCP dashboard'
                        }
                      </Text>
                    </VStack>
                  </GlassCard>
                </VStack>

                {/* Clerk Authentication Component */}
                <GlassCard blur={25} opacity={0.12} p={8} w="full">
                  <Box w="full">
                    {isSignUp ? (
                      <SignUp 
                        routing="hash"
                        afterSignUpUrl="/dashboard"
                        appearance={{
                          elements: {
                            rootBox: {
                              backgroundColor: 'transparent',
                            },
                            card: {
                              backgroundColor: 'transparent',
                              boxShadow: 'none',
                              border: 'none',
                            },
                            headerTitle: {
                              color: 'white',
                            },
                            headerSubtitle: {
                              color: 'rgba(255, 255, 255, 0.8)',
                            },
                            formFieldInput: {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                            },
                            formButtonPrimary: {
                              backgroundColor: '#f43f5e',
                              '&:hover': {
                                backgroundColor: '#e11d48',
                              },
                            },
                            footerActionLink: {
                              color: '#f59e0b',
                            },
                          },
                        }}
                      />
                    ) : (
                      <SignIn 
                        routing="hash"
                        afterSignInUrl="/dashboard"
                        appearance={{
                          elements: {
                            rootBox: {
                              backgroundColor: 'transparent',
                            },
                            card: {
                              backgroundColor: 'transparent',
                              boxShadow: 'none',
                              border: 'none',
                            },
                            headerTitle: {
                              color: 'white',
                            },
                            headerSubtitle: {
                              color: 'rgba(255, 255, 255, 0.8)',
                            },
                            formFieldInput: {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                            },
                            formButtonPrimary: {
                              backgroundColor: '#f43f5e',
                              '&:hover': {
                                backgroundColor: '#e11d48',
                              },
                            },
                            footerActionLink: {
                              color: '#f59e0b',
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                </GlassCard>

                {/* Switch Auth Mode */}
                <VStack spacing={4}>
                  <GlassButton
                    variant="outline-glass"
                    size="lg"
                    onClick={() => setIsSignUp(!isSignUp)}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'New to Universal MCP? Sign Up'}
                  </GlassButton>
                  
                  <Text fontSize="xs" color="whiteAlpha.600" textAlign="center" maxW="300px">
                    By continuing, you agree to our Terms of Service and Privacy Policy. 
                    Experience the future of AI-powered development.
                  </Text>
                </VStack>

              </VStack>
            </Box>
          </Box>

        </Flex>
      </Container>
    </AnimatedBackground>
  );
};

export default ModernAuthPage;
