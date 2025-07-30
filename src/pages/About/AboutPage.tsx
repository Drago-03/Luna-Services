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
  Image,
  Divider,
  Stack,
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Zap, 
  Globe,
  Shield,
  Code,
  Bot,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI researcher at Google. Passionate about democratizing AI development.',
      avatar: '/assets/team/alex.jpg'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Meta engineering lead. Expert in distributed systems and AI infrastructure.',
      avatar: '/assets/team/sarah.jpg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Product',
      bio: 'Previously at OpenAI. Focused on developer experience and AI tooling.',
      avatar: '/assets/team/marcus.jpg'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research',
      bio: 'PhD in Machine Learning from Stanford. Leading our AI protocol research.',
      avatar: '/assets/team/emily.jpg'
    }
  ];

  const values = [
    {
      icon: Zap,
      title: 'Developer First',
      description: 'We build tools that developers love to use, with beautiful APIs and comprehensive documentation.',
      color: '#F97316'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security with zero-trust architecture and end-to-end encryption.',
      color: '#22C55E'
    },
    {
      icon: Globe,
      title: 'Open & Interoperable',
      description: 'Our platform is built on open standards, ensuring you\'re never locked in.',
      color: '#3B82F6'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We listen to our community and build features that solve real problems.',
      color: '#8B5CF6'
    }
  ];

  const stats = [
    { label: 'Developers', value: '10,000+' },
    { label: 'API Calls/Day', value: '1M+' },
    { label: 'Integrations', value: '50+' },
    { label: 'Countries', value: '75+' }
  ];

  return (
    <PublicLayout headerVariant="solid">
      <Box position="relative" overflow="hidden">
        <AnimatedBackgroundNew variant="dashboard" />
        
        {/* Hero Section */}
        <Container maxW="1200px" py={20} position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
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
              🚀 About Luna Services
            </Badge>
            
            <VStack spacing={4}>
              <Text 
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} 
                fontWeight="black" 
                color="white"
                lineHeight="shorter"
              >
                Building the Future of{' '}
                <Text 
                  as="span"
                  bgGradient="linear(to-r, #F97316, #EAB308)"
                  bgClip="text"
                >
                  AI Development
                </Text>
              </Text>
              
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }}
                color="rgba(255, 255, 255, 0.7)"
                maxW="800px"
                lineHeight="tall"
              >
                Luna Services is revolutionizing how developers build with AI. Our Universal Model Context Protocol (MCP) 
                makes it simple to integrate any AI model into your applications with a single, unified API.
              </Text>
            </VStack>

            {/* Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full" maxW="600px">
              {stats.map((stat, index) => (
                <VStack key={index} spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Mission Section */}
        <Container maxW="1200px" py={20} position="relative" zIndex={1}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">
            <VStack spacing={6} align="start">
              <VStack spacing={4} align="start">
                <Text fontSize="3xl" fontWeight="black" color="white">
                  Our Mission
                </Text>
                <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                  We believe AI should be accessible to every developer, not just those with PhD-level expertise. 
                  Our mission is to democratize AI development by providing simple, powerful tools that make 
                  building with AI as easy as making an HTTP request.
                </Text>
                <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                  Founded in 2024, Luna Services emerged from our frustration with the complexity of AI integration. 
                  We've built the platform we wish existed when we were struggling with multiple AI APIs, 
                  inconsistent formats, and vendor lock-in.
                </Text>
              </VStack>
              
              <GlassButtonNew 
                variant="gradient" 
                size="lg"
                rightIcon={<Rocket size={20} />}
                onClick={() => navigate('/#waitlist')}
              >
                Join Our Mission
              </GlassButtonNew>
            </VStack>

            <Box position="relative">
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="2xl"
                p={8}
              >
                <CardBody p={0}>
                  <VStack spacing={6}>
                    <HStack spacing={4}>
                      <Box
                        p={3}
                        bg="rgba(249, 115, 22, 0.2)"
                        borderRadius="xl"
                        border="1px solid rgba(249, 115, 22, 0.3)"
                      >
                        <Target size={24} color="#F97316" />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xl" fontWeight="bold" color="white">
                          Vision 2030
                        </Text>
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                          Powering 1M+ AI applications
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Text color="rgba(255, 255, 255, 0.7)" textAlign="center">
                      "Every developer should be able to build AI-powered applications 
                      without needing a PhD in machine learning."
                    </Text>
                    
                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                    
                    <VStack spacing={3} w="full">
                      <HStack w="full" justify="space-between">
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">AI Models Supported</Text>
                        <Text fontSize="sm" fontWeight="bold" color="white">15+</Text>
                      </HStack>
                      <HStack w="full" justify="space-between">
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">Response Time</Text>
                        <Text fontSize="sm" fontWeight="bold" color="white">&lt;50ms</Text>
                      </HStack>
                      <HStack w="full" justify="space-between">
                        <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">Uptime SLA</Text>
                        <Text fontSize="sm" fontWeight="bold" color="white">99.9%</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </SimpleGrid>
        </Container>

        {/* Values Section */}
        <Container maxW="1200px" py={20} position="relative" zIndex={1}>
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="black" color="white">
                Our Values
              </Text>
              <Text fontSize="lg" color="rgba(255, 255, 255, 0.7)" maxW="600px">
                The principles that guide everything we build
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {values.map((value, index) => (
                <Card
                  key={index}
                  bg="rgba(255, 255, 255, 0.02)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.05)"
                  borderRadius="2xl"
                  p={6}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    borderColor: `${value.color}40`,
                  }}
                >
                  <CardBody p={0}>
                    <VStack spacing={4} align="start">
                      <Box
                        p={3}
                        bg={`${value.color}20`}
                        borderRadius="xl"
                        border={`1px solid ${value.color}30`}
                      >
                        <value.icon size={24} color={value.color} />
                      </Box>
                      <VStack spacing={2} align="start">
                        <Text fontSize="xl" fontWeight="bold" color="white">
                          {value.title}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.7)">
                          {value.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Team Section */}
        <Container maxW="1200px" py={20} position="relative" zIndex={1}>
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Text fontSize="3xl" fontWeight="black" color="white">
                Meet Our Team
              </Text>
              <Text fontSize="lg" color="rgba(255, 255, 255, 0.7)" maxW="600px">
                Experienced builders from top tech companies, united by a vision to democratize AI
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  bg="rgba(255, 255, 255, 0.02)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.05)"
                  borderRadius="2xl"
                  textAlign="center"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <CardBody p={6}>
                    <VStack spacing={4}>
                      <Box
                        w="80px"
                        h="80px"
                        borderRadius="full"
                        bg="linear-gradient(135deg, #F97316, #EAB308)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontSize="2xl"
                        fontWeight="bold"
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Box>
                      <VStack spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                          {member.name}
                        </Text>
                        <Text fontSize="sm" color="#F97316" fontWeight="semibold">
                          {member.role}
                        </Text>
                      </VStack>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" lineHeight="tall">
                        {member.bio}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* CTA Section */}
        <Container maxW="1200px" py={20} position="relative" zIndex={1}>
          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(30px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="3xl"
            p={12}
            textAlign="center"
          >
            <CardBody p={0}>
              <VStack spacing={8}>
                <VStack spacing={4}>
                  <Text fontSize="3xl" fontWeight="black" color="white">
                    Ready to Build the Future?
                  </Text>
                  <Text fontSize="lg" color="rgba(255, 255, 255, 0.7)" maxW="600px">
                    Join thousands of developers who are already building the next generation 
                    of AI-powered applications with Luna Services.
                  </Text>
                </VStack>

                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <GlassButtonNew 
                    variant="gradient" 
                    size="lg"
                    onClick={() => navigate('/#waitlist')}
                  >
                    Join Beta Waitlist
                  </GlassButtonNew>
                  <GlassButtonNew 
                    variant="outline-glass" 
                    size="lg"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us
                  </GlassButtonNew>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </PublicLayout>
  );
}
