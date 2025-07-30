import {
  Box,
  Flex,
  Text,
  HStack,
  Image,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Bell } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../../contexts/ClerkAuthContext';
import { GlassCard, GradientText } from '../UI/AnimatedComponents';

export default function ModernHeader() {
  const { getUserTier } = useAuth();
  const userTier = getUserTier();

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={64}
      right={0}
      zIndex={10}
      p={4}
    >
      <GlassCard blur={20} opacity={0.1} border={true} hover={false} p={4}>
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            <Image 
              src="/assets/logo.png" 
              alt="Universal MCP Logo" 
              boxSize="32px"
              objectFit="contain"
              filter="drop-shadow(0 2px 4px rgba(244, 63, 94, 0.3))"
            />
            <Box>
              <HStack spacing={2}>
                <GradientText fontSize="lg" fontWeight="semibold">
                  Universal MCP Dashboard
                </GradientText>
                <Badge 
                  background="linear-gradient(135deg, #f59e0b 0%, #eab308 100%)"
                  color="white"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="6px"
                  fontWeight="bold"
                >
                  BETA
                </Badge>
              </HStack>
              <Text fontSize="sm" color="whiteAlpha.700">
                AI-Powered Development Platform
              </Text>
            </Box>
          </HStack>

          <HStack spacing={4}>
            {/* User Tier Badge */}
            <Badge 
              background={
                userTier === 'enterprise' 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)'
                  : userTier === 'pro'
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }
              color="white"
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="8px"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {userTier}
            </Badge>

            {/* Notifications */}
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                variant="ghost"
                size="sm"
                borderRadius="10px"
                color="whiteAlpha.800"
                _hover={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                }}
              >
                <Bell size={18} />
              </IconButton>
              <Badge
                position="absolute"
                top="0"
                right="0"
                transform="translate(50%, -50%)"
                background="linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
                color="white"
                borderRadius="full"
                fontSize="xs"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                3
              </Badge>
            </Box>

            {/* User Menu using Clerk's UserButton */}
            <Box
              borderRadius="12px"
              overflow="hidden"
              border="1px solid rgba(255, 255, 255, 0.2)"
              background="rgba(255, 255, 255, 0.05)"
              backdropFilter="blur(10px)"
            >
              <UserButton 
                afterSignOutUrl="/signin"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                    },
                    userButtonPopoverCard: {
                      background: 'rgba(39, 39, 42, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(82, 82, 91, 0.3)',
                      borderRadius: '12px',
                    },
                    userButtonPopoverActionButton: {
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }
                }}
              />
            </Box>
          </HStack>
        </Flex>
      </GlassCard>
    </Box>
  );
}
