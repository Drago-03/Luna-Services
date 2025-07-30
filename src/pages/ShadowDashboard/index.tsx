import {
  Box,
  Flex,
  Grid,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { 
  Activity, 
  Shield, 
  Clock, 
  Database,
  Bot,
  PlayCircle,
  Settings,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';
import AnimatedBackgroundNew from '../../components/UI/AnimatedBackgroundNew';
import GlassButtonNew from '../../components/UI/GlassButtonNew';

export default function ShadowDashboard() {
  const stats = [
    {
      label: 'Active MCPs',
      value: '24',
      change: '+12%',
      positive: true,
      icon: Bot,
      color: '#F97316',
    },
    {
      label: 'API Calls',
      value: '125.8K',
      change: '+24%',
      positive: true,
      icon: Activity,
      color: '#EAB308',
    },
    {
      label: 'Success Rate',
      value: '99.2%',
      change: '+0.8%',
      positive: true,
      icon: Shield,
      color: '#22C55E',
    },
    {
      label: 'Response Time',
      value: '45ms',
      change: '-15%',
      positive: true,
      icon: Clock,
      color: '#3B82F6',
    },
  ];

  const mcpServices = [
    {
      name: 'GitHub Integration',
      status: 'Active',
      uptime: '99.8%',
      requests: '23.4K',
      color: '#22C55E',
    },
    {
      name: 'Slack Connector',
      status: 'Active', 
      uptime: '98.9%',
      requests: '18.2K',
      color: '#22C55E',
    },
    {
      name: 'AWS Lambda',
      status: 'Maintenance',
      uptime: '95.1%',
      requests: '12.7K',
      color: '#EAB308',
    },
    {
      name: 'Database Sync',
      status: 'Error',
      uptime: '87.3%',
      requests: '8.9K',
      color: '#EF4444',
    },
  ];

  const recentActivity = [
    {
      action: 'New MCP Server deployed',
      time: '2 minutes ago',
      type: 'deployment',
      icon: PlayCircle,
    },
    {
      action: 'API rate limit adjusted',
      time: '15 minutes ago', 
      type: 'config',
      icon: Settings,
    },
    {
      action: 'Performance alert resolved',
      time: '1 hour ago',
      type: 'alert',
      icon: Shield,
    },
    {
      action: 'New team member added',
      time: '3 hours ago',
      type: 'team',
      icon: Users,
    },
  ];

  return (
    <Box
      minH="100vh"
      bg="#0F172A"
      position="relative"
      ml={280}
      pt={24}
    >
      <AnimatedBackgroundNew variant="dashboard" />
      
      <Box position="relative" zIndex={1} p={8}>
        {/* Header */}
        <VStack align="start" spacing={2} mb={8}>
          <HStack spacing={3}>
            <Text fontSize="3xl" fontWeight="black" color="white">
              Dashboard Overview
            </Text>
            <Badge
              bg="linear-gradient(135deg, #F97316, #EAB308)"
              color="#0F172A"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              LIVE
            </Badge>
          </HStack>
          <Text fontSize="lg" color="rgba(255, 255, 255, 0.6)">
            Monitor your MCP services and AI integrations
          </Text>
        </VStack>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6} mb={8}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                bg="rgba(0, 0, 0, 0.4)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.3s ease"
                _hover={{
                  borderColor: `${stat.color}50`,
                  transform: 'translateY(-4px)',
                  bg: 'rgba(0, 0, 0, 0.6)',
                }}
              >
                <CardBody p={6}>
                  <Stat>
                    <HStack justify="space-between" mb={3}>
                      <Box
                        p={3}
                        bg={`${stat.color}20`}
                        borderRadius="xl"
                        border={`1px solid ${stat.color}30`}
                      >
                        <IconComponent size={24} color={stat.color} />
                      </Box>
                      <Badge
                        bg={stat.positive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                        color={stat.positive ? '#22C55E' : '#EF4444'}
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                      >
                        {stat.change}
                      </Badge>
                    </HStack>
                    <StatLabel fontSize="sm" color="rgba(255, 255, 255, 0.6)" mb={1}>
                      {stat.label}
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="black" color="white">
                      {stat.value}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            );
          })}
        </Grid>

        <Grid templateColumns={{ base: '1fr', xl: '2fr 1fr' }} gap={8}>
          {/* MCP Services */}
          <Card
            bg="rgba(0, 0, 0, 0.4)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
          >
            <CardBody p={6}>
              <HStack justify="space-between" mb={6}>
                <HStack spacing={3}>
                  <Box
                    p={3}
                    bg="rgba(249, 115, 22, 0.2)"
                    borderRadius="xl"
                    border="1px solid rgba(249, 115, 22, 0.3)"
                  >
                    <Database size={24} color="#F97316" />
                  </Box>
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="white">
                      MCP Services
                    </Text>
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                      Real-time service monitoring
                    </Text>
                  </Box>
                </HStack>
                <GlassButtonNew variant="glass" size="sm">
                  <HStack spacing={2}>
                    <BarChart3 size={16} />
                    <Text>View All</Text>
                  </HStack>
                </GlassButtonNew>
              </HStack>

              <VStack spacing={4}>
                {mcpServices.map((service, index) => (
                  <Box
                    key={index}
                    w="full"
                    p={4}
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="lg"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <Flex justify="space-between" align="center" mb={3}>
                      <HStack spacing={3}>
                        <Box
                          w={3}
                          h={3}
                          bg={service.color}
                          borderRadius="full"
                          css={{
                            animation: service.status === 'Active' ? 'pulse 2s ease-in-out infinite' : 'none',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                            },
                          }}
                        />
                        <Text fontWeight="bold" color="white">
                          {service.name}
                        </Text>
                      </HStack>
                      <Badge
                        bg={
                          service.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' :
                          service.status === 'Maintenance' ? 'rgba(234, 179, 8, 0.2)' :
                          'rgba(239, 68, 68, 0.2)'
                        }
                        color={
                          service.status === 'Active' ? '#22C55E' :
                          service.status === 'Maintenance' ? '#EAB308' :
                          '#EF4444'
                        }
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        {service.status}
                      </Badge>
                    </Flex>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={1}>
                          Uptime
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="white">
                          {service.uptime}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={1}>
                          Requests
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="white">
                          {service.requests}
                        </Text>
                      </Box>
                    </Grid>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card
            bg="rgba(0, 0, 0, 0.4)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
          >
            <CardBody p={6}>
              <HStack spacing={3} mb={6}>
                <Box
                  p={3}
                  bg="rgba(234, 179, 8, 0.2)"
                  borderRadius="xl"
                  border="1px solid rgba(234, 179, 8, 0.3)"
                >
                  <Activity size={24} color="#EAB308" />
                </Box>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    Recent Activity
                  </Text>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                    Latest system events
                  </Text>
                </Box>
              </HStack>

              <VStack spacing={4}>
                {recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <Box
                      key={index}
                      w="full"
                      p={4}
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="lg"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                    >
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          bg="rgba(255, 255, 255, 0.1)"
                          borderRadius="lg"
                        >
                          <IconComponent size={16} color="rgba(255, 255, 255, 0.8)" />
                        </Box>
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium" color="white" mb={1}>
                            {activity.action}
                          </Text>
                          <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                            {activity.time}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>

              <Box mt={6}>
                <GlassButtonNew variant="outline-glass" size="sm" w="full">
                  View All Activity
                </GlassButtonNew>
              </Box>
            </CardBody>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Box mt={8}>
          <Text fontSize="xl" fontWeight="bold" color="white" mb={4}>
            Quick Actions
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <GlassButtonNew variant="gradient" size="lg">
              <HStack spacing={3}>
                <PlayCircle size={20} />
                <Text>Deploy New MCP</Text>
              </HStack>
            </GlassButtonNew>
            <GlassButtonNew variant="glass" size="lg">
              <HStack spacing={3}>
                <Settings size={20} />
                <Text>System Settings</Text>
              </HStack>
            </GlassButtonNew>
            <GlassButtonNew variant="shadow" size="lg">
              <HStack spacing={3}>
                <Globe size={20} />
                <Text>API Documentation</Text>
              </HStack>
            </GlassButtonNew>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
