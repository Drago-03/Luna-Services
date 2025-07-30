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
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageSquare,
  Users,
  Building,
  Send,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function ContactPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Message Sent!',
        description: 'We\'ll get back to you within 24 hours.',
        status: 'success',
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: 'general',
        message: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@luna-services.com',
      responseTime: '< 24 hours',
      available: '24/7'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available in dashboard',
      responseTime: '< 5 minutes',
      available: 'Business hours'
    },
    {
      icon: Building,
      title: 'Enterprise Sales',
      description: 'Custom solutions for your team',
      contact: 'enterprise@luna-services.com',
      responseTime: '< 12 hours',
      available: 'Business hours'
    }
  ];

  const officeLocations = [
    {
      city: 'San Francisco',
      address: '123 Tech Street, Suite 456',
      timezone: 'PST (UTC-8)',
      type: 'Headquarters'
    },
    {
      city: 'London',
      address: '789 Innovation Ave, Floor 12',
      timezone: 'GMT (UTC+0)',
      type: 'European Office'
    },
    {
      city: 'Tokyo',
      address: '456 AI District, Building 7',
      timezone: 'JST (UTC+9)',
      type: 'Asia Pacific'
    }
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
                Contact Us
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
              💬 24/7 Support Available
            </Badge>
            
            <Text fontSize="4xl" fontWeight="black" color="white" lineHeight="shorter">
              Get in Touch
            </Text>
            
            <Text 
              fontSize="xl" 
              color="rgba(255, 255, 255, 0.7)" 
              maxW="600px"
              lineHeight="tall"
            >
              Have questions about Luna Services? Need help with integration? 
              Our team is here to support your development journey.
            </Text>
          </VStack>

          {/* Contact Methods */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {contactMethods.map((method, index) => (
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
                    <Box
                      p={3}
                      bg="rgba(249, 115, 22, 0.1)"
                      borderRadius="lg"
                      border="1px solid rgba(249, 115, 22, 0.2)"
                    >
                      <method.icon size={24} color="#F97316" />
                    </Box>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="lg" fontWeight="bold" color="white">
                        {method.title}
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                        {method.description}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={1} w="full">
                      <Text fontSize="sm" fontWeight="bold" color="#F97316">
                        {method.contact}
                      </Text>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                          Response: {method.responseTime}
                        </Text>
                        <Badge colorScheme="green" variant="subtle" size="sm">
                          {method.available}
                        </Badge>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Contact Form */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <Card
              bg="rgba(255, 255, 255, 0.02)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
              borderRadius="xl"
              p={8}
            >
              <VStack spacing={6} align="stretch">
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    Send us a Message
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)">
                    Fill out the form below and we'll get back to you soon.
                  </Text>
                </VStack>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel color="rgba(255, 255, 255, 0.8)">Name</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        bg="rgba(255, 255, 255, 0.05)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        color="white"
                        _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                        placeholder="Your full name"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="rgba(255, 255, 255, 0.8)">Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        bg="rgba(255, 255, 255, 0.05)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        color="white"
                        _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                        placeholder="your.email@company.com"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="rgba(255, 255, 255, 0.8)">Company</FormLabel>
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        bg="rgba(255, 255, 255, 0.05)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        color="white"
                        _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                        placeholder="Your company name (optional)"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="rgba(255, 255, 255, 0.8)">Subject</FormLabel>
                      <Select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        bg="rgba(255, 255, 255, 0.05)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        color="white"
                        _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales & Pricing</option>
                        <option value="enterprise">Enterprise Solutions</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="rgba(255, 255, 255, 0.8)">Message</FormLabel>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        bg="rgba(255, 255, 255, 0.05)"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        color="white"
                        _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        _focus={{ borderColor: 'rgba(249, 115, 22, 0.5)' }}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Sending..."
                      leftIcon={<Send size={16} />}
                      bg="linear-gradient(135deg, #F97316, #EAB308)"
                      color="white"
                      _hover={{
                        bg: "linear-gradient(135deg, #EA580C, #D97706)",
                        transform: 'translateY(-2px)',
                      }}
                      size="lg"
                      w="full"
                    >
                      Send Message
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Card>

            {/* Office Locations */}
            <VStack spacing={6} align="stretch">
              <Card
                bg="rgba(255, 255, 255, 0.02)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.05)"
                borderRadius="xl"
                p={6}
              >
                <VStack align="start" spacing={4}>
                  <HStack>
                    <MapPin size={20} color="#F97316" />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Our Offices
                    </Text>
                  </HStack>
                  
                  <VStack spacing={4} align="stretch" w="full">
                    {officeLocations.map((office, index) => (
                      <Box
                        key={index}
                        p={4}
                        bg="rgba(255, 255, 255, 0.03)"
                        borderRadius="lg"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                      >
                        <VStack align="start" spacing={2}>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="bold" color="white">
                              {office.city}
                            </Text>
                            <Badge colorScheme="blue" variant="subtle" size="sm">
                              {office.type}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                            {office.address}
                          </Text>
                          <HStack spacing={4}>
                            <HStack spacing={1}>
                              <Clock size={12} color="rgba(255, 255, 255, 0.5)" />
                              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                                {office.timezone}
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </Card>

              {/* Security Note */}
              <Card
                bg="rgba(249, 115, 22, 0.05)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(249, 115, 22, 0.2)"
                borderRadius="xl"
                p={6}
              >
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Shield size={20} color="#F97316" />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Privacy & Security
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)" lineHeight="tall">
                    Your information is secure with us. We use enterprise-grade encryption 
                    and never share your data with third parties. All communications are 
                    protected under our privacy policy.
                  </Text>
                  <Button
                    variant="link"
                    color="#F97316"
                    fontSize="sm"
                    p={0}
                    h="auto"
                    onClick={() => navigate('/privacy')}
                  >
                    View Privacy Policy →
                  </Button>
                </VStack>
              </Card>
            </VStack>
          </SimpleGrid>

          {/* FAQ Section */}
          <Card
            bg="rgba(255, 255, 255, 0.02)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.05)"
            borderRadius="xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={6}>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Looking for Quick Answers?
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" maxW="500px">
                Check out our comprehensive documentation and FAQ section for instant help.
              </Text>
              <HStack spacing={4}>
                <GlassButtonNew
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/docs')}
                >
                  View Documentation
                </GlassButtonNew>
                <GlassButtonNew
                  variant="outline-glass"
                  size="lg"
                  onClick={() => navigate('/signin')}
                >
                  Join Community
                </GlassButtonNew>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
