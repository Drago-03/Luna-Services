import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Select,
  useToast,
  Badge,
  Grid,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Mail,
  User,
  Building,
  MessageSquare
} from 'lucide-react';
import { waitlistService, WaitlistUser } from '../../services/waitlistService';
import GlassButtonNew from '../UI/GlassButtonNew';

interface WaitlistStats {
  total: number;
  pending: number;
  approved: number;
  thisWeek: number;
}

export default function WaitlistSection() {
  const [formData, setFormData] = useState<Omit<WaitlistUser, 'id' | 'created_at' | 'status'>>({
    name: '',
    email: '',
    company: '',
    use_case: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<WaitlistStats>({
    total: 2847,
    pending: 2234,
    approved: 613,
    thisWeek: 342
  });
  const toast = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const waitlistStats = await waitlistService.getWaitlistStats();
      setStats(waitlistStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const validation = waitlistService.validateWaitlistData(formData);
    if (!validation.valid) {
      const fieldErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) fieldErrors.name = error;
        if (error.includes('email')) fieldErrors.email = error;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await waitlistService.addToWaitlist(formData);
      
      if (result.success) {
        toast({
          title: 'Welcome to the Beta!',
          description: 'You\'ve been added to our waitlist. Check your email for next steps.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          use_case: '',
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1,
          thisWeek: prev.thisWeek + 1
        }));
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'Something went wrong. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useCaseOptions = [
    { value: '', label: 'Select your primary use case...' },
    { value: 'ai-development', label: 'AI Application Development' },
    { value: 'code-generation', label: 'Code Generation & Review' },
    { value: 'automation', label: 'Workflow Automation' },
    { value: 'data-analysis', label: 'Data Analysis & Processing' },
    { value: 'content-creation', label: 'Content Creation' },
    { value: 'customer-support', label: 'Customer Support' },
    { value: 'research', label: 'Research & Development' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Box id="waitlist" py={20} position="relative" zIndex={1}>
      <VStack spacing={12} maxW="1200px" mx="auto" px={6}>
        {/* Header */}
        <VStack spacing={4} textAlign="center">
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
            🚀 Join the Beta Program
          </Badge>
          
          <Text fontSize="4xl" fontWeight="black" color="white" lineHeight="shorter">
            Get Early Access
          </Text>
          
          <Text 
            fontSize="xl" 
            color="rgba(255, 255, 255, 0.7)" 
            maxW="600px"
            lineHeight="tall"
          >
            Join thousands of developers already using Luna Services. 
            Be among the first to experience the future of AI-powered development.
          </Text>
        </VStack>

        {/* Stats */}
        <Grid 
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} 
          gap={6} 
          w="full"
          maxW="800px"
        >
          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            p={4}
          >
            <CardBody p={0}>
              <VStack spacing={2}>
                <Icon as={Users} size={24} color="#F97316" />
                <Text fontSize="2xl" fontWeight="black" color="white">
                  {stats.total.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Total Users
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            p={4}
          >
            <CardBody p={0}>
              <VStack spacing={2}>
                <Icon as={Clock} size={24} color="#EAB308" />
                <Text fontSize="2xl" fontWeight="black" color="white">
                  {stats.pending.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  On Waitlist
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            p={4}
          >
            <CardBody p={0}>
              <VStack spacing={2}>
                <Icon as={CheckCircle} size={24} color="#22C55E" />
                <Text fontSize="2xl" fontWeight="black" color="white">
                  {stats.approved.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Active Users
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            p={4}
          >
            <CardBody p={0}>
              <VStack spacing={2}>
                <Icon as={TrendingUp} size={24} color="#3B82F6" />
                <Text fontSize="2xl" fontWeight="black" color="white">
                  +{stats.thisWeek}
                </Text>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  This Week
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Waitlist Form */}
        <Card
          bg="rgba(255, 255, 255, 0.03)"
          backdropFilter="blur(30px)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="3xl"
          p={8}
          maxW="600px"
          w="full"
        >
          <CardBody p={0}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
                  Join the Beta Waitlist
                </Text>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="full">
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                      <HStack spacing={2}>
                        <Icon as={User} size={16} />
                        <Text>Full Name</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      color="white"
                      _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      _hover={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                      _focus={{ borderColor: '#F97316', boxShadow: '0 0 0 1px #F97316' }}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                      <HStack spacing={2}>
                        <Icon as={Mail} size={16} />
                        <Text>Email Address</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      color="white"
                      _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      _hover={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                      _focus={{ borderColor: '#F97316', boxShadow: '0 0 0 1px #F97316' }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                    <HStack spacing={2}>
                      <Icon as={Building} size={16} />
                      <Text>Company (Optional)</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your company or organization"
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    color="white"
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    _hover={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                    _focus={{ borderColor: '#F97316', boxShadow: '0 0 0 1px #F97316' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                    <HStack spacing={2}>
                      <Icon as={MessageSquare} size={16} />
                      <Text>Primary Use Case</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    value={formData.use_case}
                    onChange={(e) => handleInputChange('use_case', e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    color="white"
                    _hover={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                    _focus={{ borderColor: '#F97316', boxShadow: '0 0 0 1px #F97316' }}
                  >
                    {useCaseOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <GlassButtonNew
                  type="submit"
                  variant="gradient"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Joining Waitlist..."
                >
                  {isLoading ? <Spinner size="sm" /> : 'Join Beta Waitlist'}
                </GlassButtonNew>

                <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)" textAlign="center">
                  By joining, you agree to our{' '}
                  <Text as="span" color="#F97316" cursor="pointer">
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text as="span" color="#F97316" cursor="pointer">
                    Privacy Policy
                  </Text>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Benefits */}
        <VStack spacing={4} textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color="white">
            What you'll get as a beta user:
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} maxW="800px">
            <HStack spacing={3} justify="center">
              <CheckCircle size={20} color="#22C55E" />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                Early access to all features
              </Text>
            </HStack>
            <HStack spacing={3} justify="center">
              <CheckCircle size={20} color="#22C55E" />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                Direct feedback channel
              </Text>
            </HStack>
            <HStack spacing={3} justify="center">
              <CheckCircle size={20} color="#22C55E" />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                Lifetime discount on Pro plan
              </Text>
            </HStack>
          </Grid>
        </VStack>
      </VStack>
    </Box>
  );
}
