import {
  Box,
  Flex,
  Text,
  HStack,
  Image,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from '@chakra-ui/react';
import { Bell, Settings, User, LogOut, Zap } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function ShadowHeader() {
  const { signOut } = useAuth();
  const { user } = useUser();
  
  const userTier = 'pro'; // Default tier for now

  const handleSignOut = () => {
    signOut();
  };

  const displayName = user?.firstName || user?.username || 'User';
  const userImage = user?.imageUrl;

  return (
    <Box
      as="header"
      bg="rgba(0, 0, 0, 0.4)"
      backdropFilter="blur(30px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      px={8}
      py={4}
      position="fixed"
      top={0}
      left={280}
      right={0}
      zIndex={100}
      css={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.05) 0%, transparent 50%, rgba(239, 68, 68, 0.05) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Flex justify="space-between" align="center" position="relative" zIndex={1}>
        <HStack spacing={6}>
          <Image 
            src="/assets/logo.png" 
            alt="Universal MCP Logo" 
            boxSize="32px"
            objectFit="contain"
            filter="drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))"
          />
          <Box>
            <HStack spacing={3}>
              <Text fontSize="xl" fontWeight="black" color="white" letterSpacing="tight">
                Universal MCP Dashboard
              </Text>
              <Badge 
                bg="transparent"
                color="rgba(249, 115, 22, 0.4)"
                border="1px solid rgba(249, 115, 22, 0.2)"
                variant="outline"
                fontSize="8px"
                px={1.5}
                py={0.5}
                borderRadius="sm"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                BETA
              </Badge>
            </HStack>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" fontWeight="medium">
              AI-Powered Development Platform
            </Text>
          </Box>
        </HStack>

        <HStack spacing={6}>
          {/* Performance Badge */}
          <Badge
            bg="rgba(34, 197, 94, 0.2)"
            color="#22C55E"
            borderRadius="full"
            px={3}
            py={2}
            fontSize="xs"
            fontWeight="bold"
            border="1px solid rgba(34, 197, 94, 0.3)"
            backdropFilter="blur(10px)"
          >
            <HStack spacing={1}>
              <Box
                w={2}
                h={2}
                bg="#22C55E"
                borderRadius="full"
                css={{
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Text>System Online</Text>
            </HStack>
          </Badge>

          {/* User Tier Badge */}
          <Badge 
            bg="linear-gradient(135deg, #3B82F6, #1D4ED8)"
            color="white"
            variant="solid"
            fontSize="xs"
            px={3}
            py={2}
            borderRadius="full"
            textTransform="uppercase"
            fontWeight="bold"
            letterSpacing="wider"
          >
            {userTier}
          </Badge>

          {/* Notifications */}
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              size="lg"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="xl"
              color="rgba(255, 255, 255, 0.8)"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(249, 115, 22, 0.5)',
                color: 'white',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.3s ease"
            >
              <Bell size={20} />
            </IconButton>
            <Badge
              position="absolute"
              top="0"
              right="0"
              transform="translate(50%, -50%)"
              bg="linear-gradient(135deg, #EF4444, #DC2626)"
              color="white"
              borderRadius="full"
              fontSize="xs"
              minW="20px"
              h="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              border="2px solid rgba(0, 0, 0, 0.4)"
            >
              3
            </Badge>
          </Box>

          {/* AI Activity Indicator */}
          <Box
            bg="rgba(249, 115, 22, 0.2)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(249, 115, 22, 0.3)"
            borderRadius="xl"
            px={3}
            py={2}
          >
            <HStack spacing={2}>
              <Zap size={16} color="#F97316" />
              <Text fontSize="xs" color="#F97316" fontWeight="bold">
                AI Active
              </Text>
            </HStack>
          </Box>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack
                spacing={3}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="xl"
                px={4}
                py={2}
                transition="all 0.3s ease"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(249, 115, 22, 0.5)',
                  transform: 'translateY(-2px)',
                }}
                cursor="pointer"
              >
                <Avatar
                  size="sm"
                  name={displayName}
                  src={userImage}
                  bg="linear-gradient(135deg, #F97316, #EAB308)"
                  color="white"
                />
                <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {displayName}
                  </Text>
                  <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                    Developer
                  </Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg="rgba(0, 0, 0, 0.8)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="xl"
              boxShadow="0 25px 50px rgba(0, 0, 0, 0.5)"
            >
              <MenuItem
                bg="transparent"
                color="white"
                _hover={{ bg: 'rgba(249, 115, 22, 0.2)' }}
                icon={<User size={16} />}
              >
                Profile
              </MenuItem>
              <MenuItem
                bg="transparent"
                color="white"
                _hover={{ bg: 'rgba(249, 115, 22, 0.2)' }}
                icon={<Settings size={16} />}
              >
                Settings
              </MenuItem>
              <MenuDivider borderColor="rgba(255, 255, 255, 0.2)" />
              <MenuItem
                bg="transparent"
                color="#EF4444"
                _hover={{ bg: 'rgba(239, 68, 68, 0.2)' }}
                icon={<LogOut size={16} />}
                onClick={handleSignOut}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
