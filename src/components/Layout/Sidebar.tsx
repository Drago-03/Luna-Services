import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  Badge,
  Stack,
  Image,
  HStack,
  useColorModeValue,
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
  Bot,
} from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface NavItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
  requiresPro?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { name: 'MCP System', icon: Bot, path: '/mcp', badge: 'AI' },
  { name: 'Automation', icon: Zap, path: '/automation' },
  { name: 'Testing', icon: TestTube, path: '/testing' },
  { name: 'Documentation', icon: FileText, path: '/documentation' },
  { name: 'Integrations', icon: GitBranch, path: '/integrations', requiresPro: true },
];

const bottomNavItems: NavItem[] = [
  { name: 'Team Management', icon: Users, path: '/team', requiresPro: true },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getUserTier } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userTier = getUserTier();

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const isLocked = item.requiresPro && userTier === 'free';
    
    return (
      <Box
        key={item.name}
        as="button"
        onClick={() => !isLocked && navigate(item.path)}
        w="full"
        textAlign="left"
        opacity={isLocked ? 0.6 : 1}
        cursor={isLocked ? 'not-allowed' : 'pointer'}
      >
        <Flex
          align="center"
          px={4}
          py={3}
          borderRadius="md"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.600' : 'gray.600'}
          _hover={{
            bg: isLocked ? 'transparent' : (isActive ? 'blue.50' : 'gray.100'),
            color: isLocked ? 'gray.600' : (isActive ? 'blue.600' : 'gray.900'),
          }}
          transition="all 0.2s"
        >
          <Icon as={item.icon} boxSize={5} mr={3} />
          <Text fontWeight={isActive ? 'semibold' : 'medium'} fontSize="sm" flex="1">
            {item.name}
          </Text>
          
          <HStack spacing={2}>
            {item.badge && (
              <Badge
                colorScheme="green"
                variant="solid"
                size="sm"
                fontSize="xs"
              >
                {item.badge}
              </Badge>
            )}
            {isLocked && (
              <Badge
                colorScheme="orange"
                variant="outline"
                size="sm"
                fontSize="xs"
              >
                PRO
              </Badge>
            )}
          </HStack>
        </Flex>
      </Box>
    );
  };

  return (
    <VStack
      w="240px"
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      spacing={6}
      align="stretch"
      py={6}
    >
      {/* Logo Section */}
      <Box px={4}>
        <HStack spacing={3} align="center">
          <Image
            src="/assets/logo.png"
            alt="Luna Services Logo"
            boxSize="32px"
            objectFit="contain"
          />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg" color="gray.900">
              Luna Services
            </Text>
            <Badge
              colorScheme={userTier === 'enterprise' ? 'purple' : userTier === 'pro' ? 'blue' : 'gray'}
              variant="subtle"
              size="sm"
              textTransform="uppercase"
            >
              {userTier}
            </Badge>
          </VStack>
        </HStack>
      </Box>

      {/* Main Navigation */}
      <Stack spacing={1} px={4}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
          mb={2}
        >
          Main
        </Text>
        {mainNavItems.map(renderNavItem)}
      </Stack>

      {/* Bottom Navigation */}
      <Box mt="auto">
        <Stack spacing={1} px={4}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="wide"
            mb={2}
          >
            Account
          </Text>
          {bottomNavItems.map(renderNavItem)}
        </Stack>
      </Box>
    </VStack>
  );
}
