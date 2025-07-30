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
  Activity,
  Cpu,
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

export default function ShadowSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getUserTier } = useAuth();
  
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
          borderRadius="xl"
          bg={isActive 
            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 179, 8, 0.1))' 
            : 'transparent'
          }
          border={isActive ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'}
          backdropFilter={isActive ? 'blur(10px)' : 'none'}
          color={isActive ? '#F97316' : 'rgba(255, 255, 255, 0.7)'}
          transition="all 0.3s ease"
          _hover={{
            bg: isLocked 
              ? 'transparent' 
              : isActive 
                ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 179, 8, 0.2))' 
                : 'rgba(255, 255, 255, 0.05)',
            color: isLocked ? 'rgba(255, 255, 255, 0.7)' : 'white',
            borderColor: isLocked ? 'transparent' : 'rgba(249, 115, 22, 0.5)',
            transform: isLocked ? 'none' : 'translateX(5px)',
          }}
        >
          <Icon as={item.icon} boxSize={5} mr={3} />
          <Text fontWeight={isActive ? 'bold' : 'medium'} fontSize="sm" flex="1">
            {item.name}
          </Text>
          
          <HStack spacing={2}>
            {item.badge && (
              <Badge
                bg="linear-gradient(135deg, #22C55E, #16A34A)"
                color="white"
                variant="solid"
                size="sm"
                fontSize="xs"
                borderRadius="full"
                px={2}
                py={1}
                fontWeight="bold"
              >
                {item.badge}
              </Badge>
            )}
            {isLocked && (
              <Badge
                bg="linear-gradient(135deg, #F97316, #EAB308)"
                color="#0F172A"
                variant="solid"
                size="sm"
                fontSize="xs"
                borderRadius="full"
                px={2}
                py={1}
                fontWeight="bold"
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
      w="280px"
      h="full"
      bg="rgba(0, 0, 0, 0.4)"
      backdropFilter="blur(30px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="0"
      spacing={6}
      align="stretch"
      py={6}
      position="relative"
      css={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.05) 0%, transparent 50%, rgba(239, 68, 68, 0.05) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Logo Section */}
      <Box px={6} position="relative" zIndex={1}>
        <HStack spacing={4} align="center">
          <Image
            src="/assets/logo.png"
            alt="Luna Services Logo"
            boxSize="40px"
            objectFit="contain"
            filter="drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))"
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="black" fontSize="xl" color="white" letterSpacing="tight">
              Luna Services
            </Text>
            <HStack spacing={2}>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" fontWeight="medium">
                Universal MCP
              </Text>
              <Badge
                bg="transparent"
                color="rgba(249, 115, 22, 0.4)"
                border="1px solid rgba(249, 115, 22, 0.2)"
                variant="outline"
                size="sm"
                fontSize="8px"
                borderRadius="sm"
                px={1.5}
                py={0.5}
                fontWeight="medium"
                textTransform="uppercase"
              >
                BETA
              </Badge>
            </HStack>
            <Badge
              bg={userTier === 'enterprise' 
                ? 'linear-gradient(135deg, #9333EA, #7C3AED)' 
                : userTier === 'pro' 
                  ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' 
                  : 'linear-gradient(135deg, #6B7280, #4B5563)'
              }
              color="white"
              variant="solid"
              size="sm"
              textTransform="uppercase"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="wider"
            >
              {userTier} Plan
            </Badge>
          </VStack>
        </HStack>
      </Box>

      {/* Main Navigation */}
      <Stack spacing={2} px={6} position="relative" zIndex={1}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="rgba(255, 255, 255, 0.5)"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={3}
          px={4}
        >
          Main Navigation
        </Text>
        {mainNavItems.map(renderNavItem)}
      </Stack>

      {/* AI Status Indicator */}
      <Box mx={6} position="relative" zIndex={1}>
        <Box
          p={4}
          bg="rgba(249, 115, 22, 0.1)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          border="1px solid rgba(249, 115, 22, 0.3)"
        >
          <VStack align="start" spacing={2}>
            <HStack spacing={2}>
              <Icon as={Cpu} boxSize={4} color="#F97316" />
              <Text fontSize="xs" fontWeight="bold" color="#F97316" textTransform="uppercase">
                AI Status
              </Text>
            </HStack>
            <HStack spacing={2}>
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
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.8)" fontWeight="medium">
                All systems operational
              </Text>
            </HStack>
            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
              Gemini 2.5 • Riva TTS • LangChain
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Box mt="auto" px={6} position="relative" zIndex={1}>
        <Stack spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="rgba(255, 255, 255, 0.5)"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
            px={4}
          >
            Account
          </Text>
          {bottomNavItems.map(renderNavItem)}
        </Stack>
      </Box>

      {/* Performance Indicator */}
      <Box mx={6} position="relative" zIndex={1}>
        <Box
          p={3}
          bg="rgba(0, 0, 0, 0.3)"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Icon as={Activity} boxSize={4} color="rgba(255, 255, 255, 0.6)" />
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" fontWeight="medium">
                Performance
              </Text>
            </HStack>
            <Text fontSize="xs" color="#22C55E" fontWeight="bold">
              99.9%
            </Text>
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
}
