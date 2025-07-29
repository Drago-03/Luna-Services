import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Server, Database, Cpu, HardDrive } from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
}

const metrics: SystemMetric[] = [
  { name: 'CPU Usage', value: 45, status: 'healthy', icon: Cpu },
  { name: 'Memory', value: 67, status: 'warning', icon: HardDrive },
  { name: 'Database', value: 23, status: 'healthy', icon: Database },
  { name: 'Server Load', value: 89, status: 'critical', icon: Server },
];

export const SystemHealth: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          System Health
        </Text>
        <Badge colorScheme="green">Online</Badge>
      </HStack>
      
      <VStack spacing={4} align="stretch">
        {metrics.map((metric) => (
          <Box key={metric.name}>
            <HStack justify="space-between" mb={2}>
              <HStack spacing={2}>
                <metric.icon size={16} />
                <Text fontSize="sm" fontWeight="medium">
                  {metric.name}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize="sm" fontWeight="bold">
                  {metric.value}%
                </Text>
                <Badge
                  size="sm"
                  colorScheme={getStatusColor(metric.status)}
                  textTransform="capitalize"
                >
                  {metric.status}
                </Badge>
              </HStack>
            </HStack>
            <Progress
              value={metric.value}
              colorScheme={getStatusColor(metric.status)}
              size="sm"
              borderRadius="full"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};