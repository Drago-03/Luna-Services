import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function CookiePolicyPage() {
  const navigate = useNavigate();

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      purpose: 'Required for basic site functionality',
      duration: 'Session',
      examples: 'Authentication, security, load balancing'
    },
    {
      name: 'Analytics Cookies',
      purpose: 'Help us understand how users interact with our service',
      duration: '2 years',
      examples: 'Google Analytics, usage statistics'
    },
    {
      name: 'Functional Cookies',
      purpose: 'Remember your preferences and settings',
      duration: '1 year',
      examples: 'Theme preference, language settings'
    },
    {
      name: 'Performance Cookies',
      purpose: 'Monitor and improve site performance',
      duration: '6 months',
      examples: 'Error tracking, performance monitoring'
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
                Cookie Policy
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="800px" py={12} position="relative" zIndex={1}>
        <Card
          bg="rgba(255, 255, 255, 0.02)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.05)"
          borderRadius="xl"
          p={8}
        >
          <CardBody p={0}>
            <VStack spacing={8} align="stretch">
              <VStack spacing={4} align="start">
                <Text fontSize="3xl" fontWeight="black" color="white">
                  Cookie Policy
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)">
                  Last updated: July 30, 2025
                </Text>
              </VStack>

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    What Are Cookies?
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you signed in, and understanding how you use our service.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    How We Use Cookies
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    Luna Services uses cookies for several purposes:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Authentication**: Keep you logged in securely</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Preferences**: Remember your settings and customizations</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Analytics**: Understand usage patterns to improve our service</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Performance**: Monitor and optimize our platform performance</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Security**: Detect and prevent fraudulent activity</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={4}>
                    Types of Cookies We Use
                  </Text>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color="rgba(255, 255, 255, 0.7)" borderColor="rgba(255, 255, 255, 0.1)">
                            Cookie Type
                          </Th>
                          <Th color="rgba(255, 255, 255, 0.7)" borderColor="rgba(255, 255, 255, 0.1)">
                            Purpose
                          </Th>
                          <Th color="rgba(255, 255, 255, 0.7)" borderColor="rgba(255, 255, 255, 0.1)">
                            Duration
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cookieTypes.map((cookie, index) => (
                          <Tr key={index}>
                            <Td color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">
                              <Text fontWeight="bold">{cookie.name}</Text>
                              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                                {cookie.examples}
                              </Text>
                            </Td>
                            <Td color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">
                              {cookie.purpose}
                            </Td>
                            <Td color="rgba(255, 255, 255, 0.8)" borderColor="rgba(255, 255, 255, 0.1)">
                              {cookie.duration}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Third-Party Cookies
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    We may use third-party services that place cookies on your device. These include:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Google Analytics**: For website analytics and performance monitoring</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Clerk**: For user authentication and account management</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **Supabase**: For database services and real-time features</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• **CDN Providers**: For content delivery and performance optimization</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Managing Your Cookie Preferences
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    You have several options for managing cookies:
                  </Text>
                  <VStack spacing={3} align="start" pl={4}>
                    <Box>
                      <Text color="rgba(255, 255, 255, 0.8)" fontWeight="bold">Browser Settings</Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                        Most browsers allow you to control cookies through their settings. You can choose to block all cookies, allow only first-party cookies, or manage them on a site-by-site basis.
                      </Text>
                    </Box>
                    <Box>
                      <Text color="rgba(255, 255, 255, 0.8)" fontWeight="bold">Account Settings</Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                        When logged in, you can manage certain preferences in your account settings, including analytics and functional cookies.
                      </Text>
                    </Box>
                    <Box>
                      <Text color="rgba(255, 255, 255, 0.8)" fontWeight="bold">Opt-Out Tools</Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
                        You can opt out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on.
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Impact of Disabling Cookies
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    Disabling cookies may affect your experience with Luna Services:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• You may need to sign in repeatedly</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Your preferences and settings may not be saved</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Some features may not work properly</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• We won't be able to remember your consent choices</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Cookie Consent
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    By continuing to use Luna Services, you consent to our use of cookies as described in this policy. For users in the EU and other regions with specific cookie laws, we provide granular consent options when you first visit our site. You can withdraw your consent at any time through your browser settings or by contacting us.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Updates to This Policy
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post any updates on this page and update the "Last updated" date. We recommend checking this policy periodically for any changes.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    Contact Us
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@luna-services.com or through our support portal.
                  </Text>
                </Box>
              </VStack>

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              <Box textAlign="center">
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
                  © 2025 Luna Services. All rights reserved.
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
