import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Badge,
  HStack,
  Button,
} from '@chakra-ui/react';
import { Bell, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useColorModeValue } from '../../utils/colorMode';

export const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Good morning, {state.user?.name?.split(' ')[0] || 'User'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Here's what's happening with your projects today
          </Text>
        </Box>

        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
            size="lg"
          />

          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              icon={<Bell size={20} />}
              variant="ghost"
              size="lg"
            />
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
              boxSize="18px"
              fontSize="10px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              3
            </Badge>
          </Box>

          <Menu>
            <MenuButton as={Button} variant="ghost" p={2}>
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={state.user?.name}
                  src={state.user?.avatar}
                />
                <Box textAlign="left">
                  <Text fontSize="sm" fontWeight="medium">
                    {state.user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                    {state.user?.role}
                  </Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>
                Profile
              </MenuItem>
              <MenuItem icon={<Settings size={16} />}>
                Account Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<LogOut size={16} />} onClick={logout} color="red.500">
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};