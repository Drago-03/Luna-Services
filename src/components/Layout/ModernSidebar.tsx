import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Tooltip,
  Badge,
  Divider,
  Image,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Bot,
  Zap,
  Users,
  Settings,
  FileText,
  Shield,
  Building,
  TestTube,
  Database,
  GitBranch,
  Layers,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';
import { GlassCard, GradientText } from '../UI/AnimatedComponents';

interface NavItem {
  to: string;
  icon: any;
  label: string;
  badge?: string;
  tier?: 'free' | 'pro' | 'enterprise';
}

const navigationItems: NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/mcp', icon: Bot, label: 'MCP Server' },
  { to: '/automation', icon: Zap, label: 'Automation', badge: 'New' },
  { to: '/team', icon: Users, label: 'Team', tier: 'pro' },
  { to: '/documentation', icon: FileText, label: 'Documentation' },
  { to: '/testing', icon: TestTube, label: 'Testing' },
  { to: '/database', icon: Database, label: 'Database', tier: 'pro' },
  { to: '/integrations', icon: GitBranch, label: 'Integrations' },
  { to: '/security', icon: Shield, label: 'Security', tier: 'enterprise' },
  { to: '/enterprise', icon: Building, label: 'Enterprise', tier: 'enterprise' },
];

const bottomItems: NavItem[] = [
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function ModernSidebar() {
  const location = useLocation();
  const { getUserTier } = useAuth();
  const userTier = getUserTier();

  const isNavItemAccessible = (tier?: string) => {
    if (!tier) return true;
    if (tier === 'pro') return userTier === 'pro' || userTier === 'enterprise';
    if (tier === 'enterprise') return userTier === 'enterprise';
    return true;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w="64px"
      zIndex={20}
      p={2}
    >
      <GlassCard 
        blur={20} 
        opacity={0.1} 
        border={true} 
        hover={false} 
        h="full" 
        p={4}
        display="flex"
        flexDirection="column"
      >
        {/* Logo Section */}
        <Box mb={8} textAlign="center">
          <Image 
            src="/assets/logo.png" 
            alt="MCP Logo" 
            boxSize="32px"
            mx="auto"
            objectFit="contain"
            filter="drop-shadow(0 2px 4px rgba(244, 63, 94, 0.3))"
          />
        </Box>

        {/* Navigation Items */}
        <VStack spacing={2} flex={1}>
          {navigationItems.map((item) => {
            const accessible = isNavItemAccessible(item.tier);
            const active = isActive(item.to);
            
            const navButton = (
              <Box
                as={accessible ? NavLink : 'div'}
                to={accessible ? item.to : undefined}
                w="full"
                cursor={accessible ? 'pointer' : 'not-allowed'}
                opacity={accessible ? 1 : 0.4}
              >
                <Box
                  w="full"
                  h="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="12px"
                  position="relative"
                  transition="all 0.2s ease"
                  background={
                    active 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 179, 8, 0.2) 100%)'
                      : 'transparent'
                  }
                  border={
                    active 
                      ? '1px solid rgba(245, 158, 11, 0.4)'
                      : '1px solid transparent'
                  }
                  _hover={accessible ? {
                    background: active 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(234, 179, 8, 0.3) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-1px)',
                  } : {}}
                >
                  <Icon 
                    as={item.icon} 
                    boxSize="20px" 
                    color={active ? 'orange.300' : 'whiteAlpha.700'}
                  />
                  
                  {/* Badge */}
                  {item.badge && (
                    <Badge
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      background="linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
                      color="white"
                      fontSize="xs"
                      borderRadius="4px"
                      px={1}
                    >
                      {item.badge}
                    </Badge>
                  )}

                  {/* Tier Lock */}
                  {item.tier && !accessible && (
                    <Box
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      w="12px"
                      h="12px"
                      borderRadius="full"
                      background="linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={Shield} boxSize="8px" color="white" />
                    </Box>
                  )}
                </Box>
              </Box>
            );

            return (
              <Tooltip 
                key={item.to}
                label={
                  <VStack spacing={1} align="start">
                    <Text fontWeight="semibold">{item.label}</Text>
                    {item.tier && !accessible && (
                      <Text fontSize="xs" color="yellow.300">
                        Requires {item.tier} tier
                      </Text>
                    )}
                  </VStack>
                }
                placement="right"
                hasArrow
                bg="rgba(39, 39, 42, 0.95)"
                color="white"
                borderRadius="8px"
                backdropFilter="blur(10px)"
              >
                {navButton}
              </Tooltip>
            );
          })}
        </VStack>

        {/* Divider */}
        <Box py={4}>
          <Divider borderColor="whiteAlpha.200" />
        </Box>

        {/* Bottom Items */}
        <VStack spacing={2}>
          {bottomItems.map((item) => {
            const active = isActive(item.to);
            
            return (
              <Tooltip 
                key={item.to}
                label={item.label}
                placement="right"
                hasArrow
                bg="rgba(39, 39, 42, 0.95)"
                color="white"
                borderRadius="8px"
                backdropFilter="blur(10px)"
              >
                <Box
                  as={NavLink}
                  to={item.to}
                  w="full"
                >
                  <Box
                    w="full"
                    h="48px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="12px"
                    transition="all 0.2s ease"
                    background={
                      active 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 179, 8, 0.2) 100%)'
                        : 'transparent'
                    }
                    border={
                      active 
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : '1px solid transparent'
                    }
                    _hover={{
                      background: active 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(234, 179, 8, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      transform: 'translateY(-1px)',
                    }}
                  >
                    <Icon 
                      as={item.icon} 
                      boxSize="20px" 
                      color={active ? 'orange.300' : 'whiteAlpha.700'}
                    />
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </VStack>
      </GlassCard>
    </Box>
  );
}
