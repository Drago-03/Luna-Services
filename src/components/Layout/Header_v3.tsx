import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useColorModeValue } from '../../utils/colorMode';

export default function Header() {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Universal MCP Dashboard
          </Text>
          <Text fontSize="sm" color="gray.500">
            AI-Powered Development Platform
          </Text>
        </Box>

        <HStack gap={4}>
          {/* Notifications */}
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              size="lg"
            >
              <Bell size={20} />
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
              minW="20px"
              h="20px"
            >
              3
            </Badge>
          </Box>

          {/* User Info */}
          <HStack gap={3}>
            <Box
              w={10}
              h={10}
              bg="blue.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Box>
            <Box textAlign="left">
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                {user?.username || 'User'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Developer
              </Text>
            </Box>
          </HStack>

          {/* User Actions */}
          <HStack gap={2}>
            <Button
              leftIcon={<User size={16} />}
              variant="ghost"
              size="sm"
            >
              Profile
            </Button>
            <Button
              leftIcon={<LogOut size={16} />}
              variant="ghost"
              size="sm"
              colorScheme="red"
              onClick={logout}
            >
              Logout
            </Button>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}
