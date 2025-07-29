import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  Play, 
  Pause, 
  Settings, 
  MoreVertical, 
  Clock, 
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AutomationProps {
  automation: {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'running' | 'paused' | 'error';
    schedule: string;
    lastRun: Date | null;
    nextRun: Date | null;
    type: 'maintenance' | 'testing' | 'documentation' | 'deployment';
    success: number;
    duration: number;
  };
}

export const AutomationCard: React.FC<AutomationProps> = ({ automation }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'running': return 'blue';
      case 'paused': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'purple';
      case 'testing': return 'green';
      case 'documentation': return 'blue';
      case 'deployment': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Badge colorScheme={getStatusColor(automation.status)} textTransform="capitalize">
              {automation.status}
            </Badge>
            <Badge colorScheme={getTypeColor(automation.type)} textTransform="capitalize">
              {automation.type}
            </Badge>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreVertical size={16} />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
              <MenuItem icon={<Copy size={16} />}>Duplicate</MenuItem>
              <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
              <MenuItem icon={<Trash2 size={16} />} color="red.500">
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            {automation.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {automation.description}
          </Text>
        </Box>

        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Clock size={14} />
              <Text fontSize="sm" color="gray.500">Schedule:</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="medium">
              {automation.schedule}
            </Text>
          </HStack>

          {automation.lastRun && (
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Calendar size={14} />
                <Text fontSize="sm" color="gray.500">Last run:</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium">
                {formatDistanceToNow(automation.lastRun, { addSuffix: true })}
              </Text>
            </HStack>
          )}

          <HStack justify="space-between">
            <HStack spacing={2}>
              <TrendingUp size={14} />
              <Text fontSize="sm" color="gray.500">Success rate:</Text>
            </HStack>
            <Text fontSize="sm" fontWeight="medium">
              {automation.success}%
            </Text>
          </HStack>

          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.500">Performance</Text>
              <Text fontSize="sm" fontWeight="bold">
                {automation.success}%
              </Text>
            </HStack>
            <Progress
              value={automation.success}
              colorScheme={automation.success > 95 ? 'green' : automation.success > 85 ? 'yellow' : 'red'}
              size="sm"
              borderRadius="full"
            />
          </Box>
        </VStack>

        <HStack spacing={2}>
          <IconButton
            icon={automation.status === 'running' ? <Pause size={16} /> : <Play size={16} />}
            colorScheme={automation.status === 'running' ? 'yellow' : 'green'}
            variant="outline"
            size="sm"
            aria-label={automation.status === 'running' ? 'Pause' : 'Run'}
          />
          <IconButton
            icon={<Settings size={16} />}
            variant="outline"
            size="sm"
            aria-label="Settings"
          />
        </HStack>
      </VStack>
    </Box>
  );
};