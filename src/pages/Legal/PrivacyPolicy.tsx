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

export default function PrivacyPolicyPage() {
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
                Privacy Policy
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
                  Privacy Policy
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)">
                  Last updated: July 30, 2025
                </Text>
              </VStack>

              <Divider borderColor="rgba(255, 255, 255, 0.1)" />

              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    1. Information We Collect
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• Account information (name, email, password)</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Usage data and analytics</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Code and project data (encrypted)</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Communication preferences</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    2. How We Use Your Information
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• Provide and operate Luna Services</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Process AI requests and generate responses</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Send service-related communications</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Improve our AI models and services</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Detect and prevent fraud or abuse</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    3. Data Security & Encryption
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We implement industry-standard security measures to protect your data. All sensitive information is encrypted at rest and in transit using AES-256 encryption. Your code and project data are processed securely and never stored permanently on our servers without your explicit consent.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    4. AI Data Processing
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    When you use our AI-powered features, your code and prompts may be processed by our AI models. We do not use your proprietary code to train our models unless you explicitly opt-in to our improvement program. All AI processing is done in secure, isolated environments.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    5. Third-Party Services
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    Luna Services integrates with various third-party services to provide enhanced functionality:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• Authentication providers (OAuth)</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Cloud storage services</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• AI model providers (OpenAI, Google, etc.)</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Analytics and monitoring tools</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    6. Data Retention
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time. Some information may be retained for legal compliance or security purposes for up to 7 years.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    7. International Data Transfers
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    Luna Services operates globally. Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses and adequacy decisions.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    8. Your Rights
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall" mb={3}>
                    Depending on your location, you may have certain rights regarding your personal information:
                  </Text>
                  <VStack spacing={2} align="start" pl={4}>
                    <Text color="rgba(255, 255, 255, 0.8)">• Access and portability of your data</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Correction of inaccurate information</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Deletion of your personal data</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Restriction of processing</Text>
                    <Text color="rgba(255, 255, 255, 0.8)">• Objection to processing</Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    9. Beta Program Privacy
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    As Luna Services is currently in beta, we may collect additional usage data and feedback to improve our services. All beta data is handled with the same security standards as production data. Beta users may receive updates about new features and improvements.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    10. Changes to This Policy
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the new policy.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                    11. Contact Information
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" lineHeight="tall">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@luna-services.com or through our support portal. For EU residents, you may also contact our Data Protection Officer at dpo@luna-services.com.
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
