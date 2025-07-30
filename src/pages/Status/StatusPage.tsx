import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Flex,
  Circle,
  Tooltip,
  Select,
  Divider,
} from '@chakra-ui/react';
import {
  Activity,
  Server,
  Database,
  Shield,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
import PublicLayout from '../../components/Layout/PublicLayout';
import LunarEclipseBackground from '../../components/UI/LunarEclipseBackground';

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance';
  uptime: number;
  responseTime: number;
  icon: any;
  category: 'core' | 'api' | 'infrastructure' | 'security';
}

interface HistoryData {
  date: string;
  uptime: number;
  responseTime: number;
  incidents: number;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  updatedAt: string;
  affectedServices: string[];
  updates: {
    id: string;
    message: string;
    timestamp: string;
    status: string;
  }[];
}

const mockServices: ServiceStatus[] = [
  {
    id: 'mcp-api',
    name: 'MCP API Gateway',
    description: 'Core API routing and management',
    status: 'operational',
    uptime: 99.98,
    responseTime: 45,
    icon: Server,
    category: 'core',
  },
  {
    id: 'ai-models',
    name: 'AI Model Services',
    description: 'GPT-4, Claude, and other AI model integrations',
    status: 'operational',
    uptime: 99.95,
    responseTime: 120,
    icon: Activity,
    category: 'core',
  },
  {
    id: 'database',
    name: 'Database Cluster',
    description: 'Primary database and replicas',
    status: 'operational',
    uptime: 99.99,
    responseTime: 8,
    icon: Database,
    category: 'infrastructure',
  },
  {
    id: 'authentication',
    name: 'Authentication Service',
    description: 'User authentication and authorization',
    status: 'operational',
    uptime: 99.97,
    responseTime: 25,
    icon: Shield,
    category: 'security',
  },
  {
    id: 'cdn',
    name: 'Global CDN',
    description: 'Content delivery network',
    status: 'operational',
    uptime: 99.96,
    responseTime: 18,
    icon: Globe,
    category: 'infrastructure',
  },
  {
    id: 'webhook',
    name: 'Webhook Service',
    description: 'Event notifications and webhooks',
    status: 'degraded',
    uptime: 99.85,
    responseTime: 180,
    icon: Zap,
    category: 'api',
  },
];

const mockHistoryData: HistoryData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  return {
    date: date.toISOString().split('T')[0],
    uptime: 98 + Math.random() * 2,
    responseTime: 40 + Math.random() * 60,
    incidents: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
  };
});

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Increased API Response Times',
    description: 'We are investigating reports of increased response times for some API endpoints.',
    status: 'monitoring',
    severity: 'minor',
    createdAt: '2025-01-29T14:30:00Z',
    updatedAt: '2025-01-29T15:45:00Z',
    affectedServices: ['webhook'],
    updates: [
      {
        id: '1',
        message: 'We have identified the cause and are implementing a fix.',
        timestamp: '2025-01-29T15:45:00Z',
        status: 'monitoring',
      },
      {
        id: '2',
        message: 'We are investigating reports of increased response times.',
        timestamp: '2025-01-29T14:30:00Z',
        status: 'investigating',
      },
    ],
  },
];

export default function StatusPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [services] = useState<ServiceStatus[]>(mockServices);
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [historyData] = useState<HistoryData[]>(mockHistoryData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'green';
      case 'degraded': return 'yellow';
      case 'partial': return 'orange';
      case 'major': return 'red';
      case 'maintenance': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'partial': return Minus;
      case 'major': return AlertTriangle;
      case 'maintenance': return Clock;
      default: return Minus;
    }
  };

  const getOverallStatus = () => {
    const hasIncidents = incidents.some(i => i.status !== 'resolved');
    const hasDegraded = services.some(s => s.status === 'degraded' || s.status === 'partial');
    const hasMajor = services.some(s => s.status === 'major');

    if (hasMajor) return { status: 'major', text: 'Major Service Outage', color: 'red' };
    if (hasIncidents && hasDegraded) return { status: 'degraded', text: 'Degraded Performance', color: 'orange' };
    if (hasDegraded) return { status: 'degraded', text: 'Degraded Performance', color: 'yellow' };
    return { status: 'operational', text: 'All Systems Operational', color: 'green' };
  };

  const overallStatus = getOverallStatus();
  const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;
  const avgResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0) / services.length;

  const filteredHistoryData = historyData.slice(-parseInt(selectedTimeRange.replace('d', '')));

  return (
    <PublicLayout headerVariant="solid">
      <Box position="relative" minHeight="100vh">
        <LunarEclipseBackground variant="dashboard" intensity="low" />
        
        <Container maxW="1200px" py={8} position="relative" zIndex={1}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <VStack spacing={4} textAlign="center">
              <Text fontSize="4xl" fontWeight="black" color="white">
                Luna Services Status
              </Text>
              <HStack spacing={3}>
                <Circle size="12px" bg={`${overallStatus.color}.500`} />
                <Text fontSize="xl" color="white" fontWeight="semibold">
                  {overallStatus.text}
                </Text>
              </HStack>
              <Text color="rgba(255, 255, 255, 0.7)">
                Real-time status and performance metrics for Luna Services MCP platform
              </Text>
            </VStack>

            {/* Overall Metrics */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
                <CardBody>
                  <Stat>
                    <StatLabel color="rgba(255, 255, 255, 0.7)">Overall Uptime</StatLabel>
                    <StatNumber color="white" fontSize="2xl">
                      {avgUptime.toFixed(2)}%
                    </StatNumber>
                    <StatHelpText color="rgba(255, 255, 255, 0.6)">
                      <HStack>
                        <TrendingUp size={16} color="#22C55E" />
                        <Text>Last 90 days</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
                <CardBody>
                  <Stat>
                    <StatLabel color="rgba(255, 255, 255, 0.7)">Avg Response Time</StatLabel>
                    <StatNumber color="white" fontSize="2xl">
                      {Math.round(avgResponseTime)}ms
                    </StatNumber>
                    <StatHelpText color="rgba(255, 255, 255, 0.6)">
                      <HStack>
                        <TrendingDown size={16} color="#22C55E" />
                        <Text>15% faster this week</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
                <CardBody>
                  <Stat>
                    <StatLabel color="rgba(255, 255, 255, 0.7)">Active Incidents</StatLabel>
                    <StatNumber color="white" fontSize="2xl">
                      {incidents.filter(i => i.status !== 'resolved').length}
                    </StatNumber>
                    <StatHelpText color="rgba(255, 255, 255, 0.6)">
                      <HStack>
                        <AlertTriangle size={16} color="#F59E0B" />
                        <Text>Being monitored</Text>
                      </HStack>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Services Status */}
            <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardHeader>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Service Status
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {services.map((service) => {
                    const StatusIcon = getStatusIcon(service.status);
                    return (
                      <Box key={service.id}>
                        <Flex justify="space-between" align="center" py={3}>
                          <HStack spacing={4} flex={1}>
                            <Box p={2} bg="rgba(255, 255, 255, 0.1)" borderRadius="lg">
                              <service.icon size={20} color="white" />
                            </Box>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold" color="white">
                                {service.name}
                              </Text>
                              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                                {service.description}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <HStack spacing={4}>
                            <VStack spacing={1} align="center">
                              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">Uptime</Text>
                              <Text fontSize="sm" fontWeight="bold" color="white">
                                {service.uptime.toFixed(2)}%
                              </Text>
                            </VStack>
                            
                            <VStack spacing={1} align="center">
                              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">Response</Text>
                              <Text fontSize="sm" fontWeight="bold" color="white">
                                {service.responseTime}ms
                              </Text>
                            </VStack>

                            <Tooltip label={service.status} placement="top">
                              <HStack spacing={2}>
                                <StatusIcon 
                                  size={16} 
                                  color={
                                    service.status === 'operational' ? '#22C55E' :
                                    service.status === 'degraded' ? '#F59E0B' :
                                    service.status === 'partial' ? '#F97316' :
                                    service.status === 'major' ? '#EF4444' : '#6B7280'
                                  }
                                />
                                <Badge 
                                  colorScheme={getStatusColor(service.status)}
                                  textTransform="capitalize"
                                >
                                  {service.status}
                                </Badge>
                              </HStack>
                            </Tooltip>
                          </HStack>
                        </Flex>
                        <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                      </Box>
                    );
                  })}
                </VStack>
              </CardBody>
            </Card>

            {/* Historical Data */}
            <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    Performance History
                  </Text>
                  <Select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    width="150px"
                    bg="rgba(255, 255, 255, 0.1)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    color="white"
                    title="Select time range"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </Select>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box height="300px" width="100%">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredHistoryData}>
                      <defs>
                        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                        domain={[95, 100]}
                      />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="uptime"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#uptimeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            {/* Incidents */}
            {incidents.length > 0 && (
              <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold" color="white">
                      Recent Incidents
                    </Text>
                    <Button size="sm" variant="ghost" color="white">
                      View All
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {incidents.map((incident) => (
                      <Box key={incident.id}>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge
                                  colorScheme={
                                    incident.severity === 'critical' ? 'red' :
                                    incident.severity === 'major' ? 'orange' : 'yellow'
                                  }
                                >
                                  {incident.severity}
                                </Badge>
                                <Badge
                                  colorScheme={
                                    incident.status === 'resolved' ? 'green' :
                                    incident.status === 'monitoring' ? 'blue' : 'yellow'
                                  }
                                >
                                  {incident.status}
                                </Badge>
                              </HStack>
                              <Text fontWeight="semibold" color="white">
                                {incident.title}
                              </Text>
                              <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                                {incident.description}
                              </Text>
                            </VStack>
                            <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                              {new Date(incident.createdAt).toLocaleDateString()}
                            </Text>
                          </HStack>
                          
                          <VStack spacing={3} align="stretch" pl={4} borderLeft="2px solid rgba(255, 255, 255, 0.1)">
                            {incident.updates.map((update) => (
                              <HStack key={update.id} spacing={3}>
                                <Circle size="8px" bg="rgba(249, 115, 22, 0.8)" />
                                <VStack align="start" spacing={1} flex={1}>
                                  <HStack justify="space-between" w="full">
                                    <Text fontSize="sm" color="white">
                                      {update.message}
                                    </Text>
                                    <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">
                                      {new Date(update.timestamp).toLocaleTimeString()}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                        <Divider borderColor="rgba(255, 255, 255, 0.1)" mt={6} />
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Subscribe to Updates */}
            <Card bg="rgba(255, 255, 255, 0.02)" backdropFilter="blur(20px)" border="1px solid rgba(255, 255, 255, 0.1)">
              <CardBody textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    Stay Updated
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.7)">
                    Subscribe to get notified about service status updates and maintenance windows
                  </Text>
                  <HStack spacing={4}>
                    <Button colorScheme="orange" variant="solid">
                      Subscribe to Updates
                    </Button>
                    <Button variant="outline" color="white" borderColor="rgba(255, 255, 255, 0.3)">
                      RSS Feed
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </PublicLayout>
  );
}
