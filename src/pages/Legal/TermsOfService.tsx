import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function TermsOfServicePage() {
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
                Terms of Service
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
                  Terms of Service
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)">
                  Last updated: July 30, 2025
                </Text>
              </VStack>

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    1. Acceptance of Terms
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    By accessing and using Luna Services ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    2. Beta Service Disclaimer
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    Luna Services is currently in beta testing phase. The service is provided "as is" without warranty of any kind. Features may change, and service interruptions may occur. By participating in the beta program, you acknowledge that the service is experimental and may contain bugs or errors.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    3. Use License
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    Permission is granted to temporarily use Luna Services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• modify or copy the materials</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• use the materials for any commercial purpose or for any public display</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• attempt to reverse engineer any software contained on the website</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• remove any copyright or other proprietary notations from the materials</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    4. User Data and Privacy
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We take your privacy seriously. All data processed through our MCP platform is encrypted and handled according to our Privacy Policy. We do not store or retain your sensitive data beyond what is necessary for service operation. Beta users' feedback and usage data may be collected to improve the service.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    5. API Usage and Rate Limits
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    During the beta period, API usage is subject to rate limits and fair use policies. Commercial usage is not permitted without explicit written consent. We reserve the right to modify rate limits and usage restrictions at any time.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    6. Intellectual Property
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    The service and its original content, features, and functionality are and will remain the exclusive property of Luna Services and its licensors. The service is protected by copyright, trademark, and other laws.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    7. Termination
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    8. Changes to Terms
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    9. Contact Information
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    If you have any questions about these Terms of Service, please contact us at legal@luna-services.com or through our support portal.
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
