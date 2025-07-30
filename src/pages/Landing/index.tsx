import {
  Box,
  VStack,
  HStack,
  Text,
  Container,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  useToast,
  Input,
  FormControl,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  Shield, 
  Code, 
  Database, 
  Play,
  CheckCircle,
  Globe,
} from 'lucide-react';
import LunarEclipseBackground from '../../components/UI/LunarEclipseBackground';
import GlassButtonNew from '../../components/UI/GlassButtonNew';
import PublicLayout from '../../components/Layout/PublicLayout';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleWaitlistJoin = async () => {
    if (!email || !name) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both your name and email address.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Import the waitlist service
      const { waitlistService } = await import('../../services/waitlistService');
      
      const result = await waitlistService.addToWaitlist({
        email: email.toLowerCase(),
        name: name.trim(),
      });

      if (result.success) {
        toast({
          title: 'Welcome to the Beta! 🚀',
          description: 'You\'ve been added to our waitlist. Check your email for next steps.',
          status: 'success',
          duration: 5000,
        });
        
        setEmail('');
        setName('');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong. Please try again.',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout headerVariant="transparent">
      <LunarEclipseBackground variant="landing" intensity="high" />
      
      {/* Hero Section */}
      <Container maxW="1200px" pt={20} pb={20} position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          <Badge 
            bg="rgba(249, 115, 22, 0.05)"
            color="rgba(249, 115, 22, 0.6)"
            border="1px solid rgba(249, 115, 22, 0.15)"
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
          >
            🚀 Now in Private Beta
          </Badge>

          <VStack spacing={4}>
            <Text 
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} 
              fontWeight="black" 
              color="white"
              lineHeight="shorter"
              textAlign="center"
            >
              The Future of{' '}
              <Text 
                as="span"
                bgGradient="linear(to-r, #F97316, #EAB308, #DC2626)"
                bgClip="text"
              >
                AI Development
              </Text>
            </Text>
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }}
              color="rgba(255, 255, 255, 0.7)"
              maxW="600px"
              lineHeight="tall"
            >
              Luna Services revolutionizes development with our Universal Model Context Protocol. 
              Build, deploy, and scale AI-powered applications with unprecedented ease.
            </Text>
          </VStack>

          <HStack spacing={4} flexWrap="wrap" justify="center">
            <GlassButtonNew 
              variant="gradient" 
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Join Beta Waitlist
            </GlassButtonNew>
            <GlassButtonNew 
              variant="outline-glass" 
              size="lg"
              leftIcon={<Play size={20} />}
            >
              Watch Demo
            </GlassButtonNew>
          </HStack>

          <HStack spacing={8} mt={8} opacity={0.6}>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="white">10K+</Text>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">Developers</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="white">99.9%</Text>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">Uptime</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="white">50ms</Text>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">Response</Text>
            </VStack>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Box id="features" py={20} position="relative" zIndex={1}>
        <Container maxW="1200px">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="4xl" fontWeight="black" color="white">
                Powerful Features
              </Text>
              <Text fontSize="lg" color="rgba(255, 255, 255, 0.7)" maxW="600px">
                Everything you need to build next-generation AI applications
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {[
                {
                  icon: Bot,
                  title: 'Universal MCP',
                  description: 'Connect any AI model with our universal protocol',
                  color: '#F97316'
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Sub-50ms response times with global edge deployment',
                  color: '#EAB308'
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  description: 'SOC2 compliant with end-to-end encryption',
                  color: '#22C55E'
                },
                {
                  icon: Code,
                  title: 'Developer First',
                  description: 'Beautiful APIs and comprehensive documentation',
                  color: '#3B82F6'
                },
                {
                  icon: Database,
                  title: 'Smart Caching',
                  description: 'Intelligent response caching reduces costs by 70%',
                  color: '#8B5CF6'
                },
                {
                  icon: Globe,
                  title: 'Global Scale',
                  description: 'Deploy across 15+ regions worldwide',
                  color: '#EC4899'
                }
              ].map((feature, index) => (
                <Card
                  key={index}
                  bg="rgba(255, 255, 255, 0.02)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.05)"
                  borderRadius="2xl"
                  p={6}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-8px)',
                    borderColor: `${feature.color}40`,
                    bg: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <CardBody p={0}>
                    <VStack spacing={4} align="start">
                      <Box
                        p={3}
                        bg={`${feature.color}20`}
                        borderRadius="xl"
                        border={`1px solid ${feature.color}30`}
                      >
                        <feature.icon size={24} color={feature.color} />
                      </Box>
                      <VStack spacing={2} align="start">
                        <Text fontSize="xl" fontWeight="bold" color="white">
                          {feature.title}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.7)">
                          {feature.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Waitlist Section */}
      <Box id="waitlist" py={20} position="relative" zIndex={1}>
        <Container maxW="1200px">
          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(30px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="3xl"
            p={12}
            textAlign="center"
          >
            <VStack spacing={8}>
              <VStack spacing={4}>
                <Badge 
                  bg="transparent"
                  color="rgba(220, 38, 38, 0.6)"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  Limited Beta Access
                </Badge>
                <Text fontSize="3xl" fontWeight="black" color="white">
                  Join the Beta Waitlist
                </Text>
                <Text fontSize="lg" color="rgba(255, 255, 255, 0.7)" maxW="500px">
                  Be among the first to experience the future of AI development. 
                  Get early access and help shape the platform.
                </Text>
              </VStack>

              <VStack spacing={4} w="full" maxW="400px">
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="xl"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{
                      borderColor: '#F97316',
                      boxShadow: '0 0 0 1px #F97316',
                    }}
                    size="lg"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="xl"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _focus={{
                      borderColor: '#F97316',
                      boxShadow: '0 0 0 1px #F97316',
                    }}
                    size="lg"
                  />
                </FormControl>
                <GlassButtonNew
                  variant="gradient"
                  size="lg"
                  w="full"
                  onClick={handleWaitlistJoin}
                  isLoading={isLoading}
                  loadingText="Joining..."
                >
                  Join Waitlist
                </GlassButtonNew>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
                  By joining, you agree to our Terms of Service and Privacy Policy
                </Text>
              </VStack>

              <HStack spacing={6} opacity={0.8}>
                <HStack spacing={2}>
                  <CheckCircle size={16} color="#22C55E" />
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                    Early access
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <CheckCircle size={16} color="#22C55E" />
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                    Priority support
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <CheckCircle size={16} color="#22C55E" />
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                    Beta pricing
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Card>
        </Container>
      </Box>
    </PublicLayout>
  );
}
