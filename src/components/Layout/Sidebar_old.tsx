import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  Separator,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Settings,
  Users,
  FileText,
  TestTube,
  GitBranch,
  Zap,
  Shield,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
  color?: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', icon: BarChart3, path: '/' },
  { name: 'Automation', icon: Zap, path: '/automation', badge: '3', color: 'primary' },
  { name: 'Documentation', icon: FileText, path: '/documentation' },
  { name: 'Testing', icon: TestTube, path: '/testing', badge: '12', color: 'success' },
  { name: 'Team', icon: Users, path: '/team' },
  { name: 'Integrations', icon: GitBranch, path: '/integrations' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="280px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={6}
      boxShadow="sm"
    >
      <Flex align="center" mb={8}>
        <Icon as={Shield} boxSize={8} color="primary.500" mr={3} />
        <Text fontSize="xl" fontWeight="bold" color="primary.500">
          Luna-service
        </Text>
      </Flex>

      <VStack spacing={2} align="stretch">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hoverBg = useColorModeValue('gray.100', 'gray.700');
          const activeBg = useColorModeValue('primary.50', 'primary.900');
          const activeColor = useColorModeValue('primary.600', 'primary.200');

          return (
            <Flex
              key={item.name}
              align="center"
              p={3}
              borderRadius="lg"
              cursor="pointer"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : undefined}
              _hover={{ bg: isActive ? activeBg : hoverBg }}
              transition="all 0.2s"
              onClick={() => navigate(item.path)}
            >
              <Icon as={item.icon} boxSize={5} mr={3} />
              <Text flex="1" fontWeight={isActive ? 'semibold' : 'medium'}>
                {item.name}
              </Text>
              {item.badge && (
                <Badge
                  colorScheme={item.color || 'gray'}
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontSize="xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Flex>
          );
        })}
      </VStack>

      <Divider my={6} />

      <Text fontSize="sm" color="gray.500" mb={4}>
        Quick Actions
      </Text>
      
      <VStack spacing={2} align="stretch">
        <Box
          p={3}
          borderRadius="lg"
          bg={useColorModeValue('blue.50', 'blue.900')}
          border="1px dashed"
          borderColor={useColorModeValue('blue.200', 'blue.700')}
          cursor="pointer"
          _hover={{ borderColor: useColorModeValue('blue.300', 'blue.600') }}
          transition="all 0.2s"
        >
          <Text fontSize="sm" fontWeight="medium" color="blue.600">
            + New Automation
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};