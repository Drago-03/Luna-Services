import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Image,
  Badge,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { LogOut, User, Settings as SettingsIcon, Bell } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

export default function Header() {
  const { user, signOut, getUserTier } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const userTier = getUserTier();
  const tierColors = {
    free: 'green',
    pro: 'blue', 
    enterprise: 'purple'
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      position="fixed"
      top={0}
      left={64}
      right={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Image 
            src="/assets/logo.png" 
            alt="Universal MCP Logo" 
            boxSize="32px"
            objectFit="contain"
          />
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.900">
              Universal MCP Dashboard
            </Text>
            <Text fontSize="sm" color="gray.500">
              AI-Powered Development Platform
            </Text>
          </Box>
        </HStack>

        <HStack spacing={4}>
          {/* User Tier Badge */}
          <Badge 
            colorScheme={tierColors[userTier as keyof typeof tierColors]} 
            variant="subtle"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            textTransform="uppercase"
          >
            {userTier}
          </Badge>

          {/* Notifications */}
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              size="sm"
            >
              <Bell size={18} />
            </IconButton>
            <Badge
              position="absolute"
              top="0"
              right="0"
              transform="translate(50%, -50%)"
              bg="red.500"
              color="white"
              borderRadius="full"
              fontSize="xs"
              minW="18px"
              h="18px"
            >
              3
            </Badge>
          </Box>

          {/* User Menu using Clerk's UserButton */}
          <UserButton 
            afterSignOutUrl="/auth"
            appearance={{
              elements: {
                avatarBox: {
                  width: '32px',
                  height: '32px'
                }
              }
            }}
          />
        </HStack>
      </Flex>
    </Box>
  );
}
