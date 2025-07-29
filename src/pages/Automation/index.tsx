import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Grid,
  Badge,
  useColorModeValue,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { Search, Plus, Filter, Play, Pause, Settings } from 'lucide-react';
import { AutomationCard } from '../../components/Automation/AutomationCard';
import { CreateAutomationModal } from '../../components/Automation/CreateAutomationModal';

const mockAutomations = [
  {
    id: '1',
    name: 'Daily Backup',
    description: 'Automated database backup every day at 2 AM',
    status: 'active' as const,
    schedule: '0 2 * * *',
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000),
    type: 'maintenance' as const,
    success: 98.5,
    duration: 120,
  },
  {
    id: '2',
    name: 'Test Suite Runner',
    description: 'Run full test suite on code changes',
    status: 'running' as const,
    schedule: 'On push',
    lastRun: new Date(Date.now() - 5 * 60 * 1000),
    nextRun: null,
    type: 'testing' as const,
    success: 94.2,
    duration: 450,
  },
  {
    id: '3',
    name: 'Documentation Sync',
    description: 'Generate and sync API documentation',
    status: 'paused' as const,
    schedule: '0 */6 * * *',
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 30 * 60 * 1000),
    type: 'documentation' as const,
    success: 100,
    duration: 180,
  },
];

export const Automation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');

  const filteredAutomations = mockAutomations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
        <HStack justify="space-between" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Automation Center
            </Text>
            <Text color="gray.500">
              Manage and monitor your automated workflows
            </Text>
          </Box>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Automation
          </Button>
        </HStack>

        <HStack spacing={4} mb={6}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <Icon as={Search} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search automations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
            <option value="error">Error</option>
          </Select>

          <Button leftIcon={<Filter size={16} />} variant="outline">
            More Filters
          </Button>
        </HStack>

        <HStack spacing={4} mb={6}>
          <Badge colorScheme="green" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="bold">12</Text>
              <Text fontSize="sm">Active</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="blue" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="bold">3</Text>
              <Text fontSize="sm">Running</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="yellow" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="bold">2</Text>
              <Text fontSize="sm">Paused</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="red" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="bold">1</Text>
              <Text fontSize="sm">Error</Text>
            </HStack>
          </Badge>
        </HStack>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={6}>
        {filteredAutomations.map((automation) => (
          <AutomationCard key={automation.id} automation={automation} />
        ))}
      </Grid>

      <CreateAutomationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </VStack>
  );
};