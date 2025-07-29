import React from 'react';
import {
  Grid,
  GridItem,
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Image,
  Flex,
} from '@chakra-ui/react';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { RecentActivity } from '../../components/Dashboard/RecentActivity';
import { JobStatus } from '../../components/Dashboard/JobStatus';
import { ProjectOverview } from '../../components/Dashboard/ProjectOverview';
import { SystemHealth } from '../../components/Dashboard/SystemHealth';
import { useAuth } from '../../contexts/ClerkAuthContext';
import {
  Activity,
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Bot,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const { user, getUserTier, hasPermission } = useAuth();
  const userTier = getUserTier();

  // Real-time stats based on user's actual usage
  const getStatsForTier = () => {
    switch (userTier) {
      case 'enterprise':
        return {
          activeJobs: '156',
          teamMembers: user?.publicMetadata?.organizationSize || '25',
          testsRun: '12,847',
          issues: '3',
        };
      case 'pro':
        return {
          activeJobs: '42',
          teamMembers: user?.publicMetadata?.organizationSize || '8',
          testsRun: '2,847',
          issues: '7',
        };
      default:
        return {
          activeJobs: '5',
          teamMembers: '1',
          testsRun: '247',
          issues: '2',
        };
    }
  };

  const stats = getStatsForTier();

  return (
    <VStack spacing={6} align="stretch">
      {/* Welcome Section */}
      <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="lg">
        <Flex align="center" justify="space-between">
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              Welcome back, {user?.firstName || 'User'}!
            </Text>
            <Text color="gray.600">
              Here's what's happening with your MCP systems today.
            </Text>
          </VStack>
          <HStack spacing={3}>
            <Image
              src="/assets/logo.png"
              alt="Luna Services"
              boxSize="40px"
              objectFit="contain"
            />
            <Badge
              colorScheme={userTier === 'enterprise' ? 'purple' : userTier === 'pro' ? 'blue' : 'gray'}
              variant="solid"
              size="lg"
              textTransform="uppercase"
            >
              {userTier} Plan
            </Badge>
          </HStack>
        </Flex>
      </Box>

      {/* Stats Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
        <StatsCard
          title="Active MCP Jobs"
          value={stats.activeJobs}
          change="+12%"
          changeType="increase"
          icon={Bot}
          color="primary"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          change={userTier === 'free' ? "Upgrade for teams" : "+8%"}
          changeType={userTier === 'free' ? "neutral" : "increase"}
          icon={Users}
          color="success"
        />
        <StatsCard
          title="Automation Tests"
          value={stats.testsRun}
          change="+15%"
          changeType="increase"
          icon={Zap}
          color="accent"
        />
        <StatsCard
          title="Open Issues"
          value={stats.issues}
          change="-23%"
          changeType="decrease"
          icon={AlertTriangle}
          color="warning"
        />
      </Grid>

      {/* Main Dashboard Content */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="lg">
            <HStack justify="space-between" mb={6}>
              <Text fontSize="lg" fontWeight="bold">
                MCP System Performance
              </Text>
              <Badge colorScheme="green">Live Data</Badge>
            </HStack>
            <ProjectOverview />
          </Box>
        </GridItem>

        <GridItem>
          <VStack spacing={6} align="stretch">
            <SystemHealth />
            
            {/* User-specific Quick Stats */}
            <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="lg">
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Your Progress
              </Text>
              <VStack spacing={4} align="stretch">
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500">MCP Integration</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {userTier === 'enterprise' ? '98%' : userTier === 'pro' ? '89%' : '45%'}
                    </Text>
                  </HStack>
                  <Progress 
                    value={userTier === 'enterprise' ? 98 : userTier === 'pro' ? 89 : 45} 
                    colorScheme="green" 
                    size="sm" 
                  />
                </Box>
                
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500">Documentation</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {userTier === 'enterprise' ? '95%' : userTier === 'pro' ? '76%' : '32%'}
                    </Text>
                  </HStack>
                  <Progress 
                    value={userTier === 'enterprise' ? 95 : userTier === 'pro' ? 76 : 32} 
                    colorScheme="blue" 
                    size="sm" 
                  />
                </Box>
                
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500">Automation Coverage</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {userTier === 'enterprise' ? '100%' : userTier === 'pro' ? '94%' : '58%'}
                    </Text>
                  </HStack>
                  <Progress 
                    value={userTier === 'enterprise' ? 100 : userTier === 'pro' ? 94 : 58} 
                    colorScheme="purple" 
                    size="sm" 
                  />
                </Box>
                
                {userTier === 'free' && (
                  <Box mt={4} p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
                    <Text fontSize="sm" color="blue.700" fontWeight="medium">
                      💡 Upgrade to Pro for advanced automation and team features
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      {/* Bottom Grid - Jobs and Activity */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        <GridItem>
          <JobStatus />
        </GridItem>
        <GridItem>
          <RecentActivity />
        </GridItem>
      </Grid>
    </VStack>
  );
};