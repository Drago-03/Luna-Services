import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Avatar,
  useColorModeValue,
  Progress,
  Button,
  Icon,
} from '@chakra-ui/react';
import { Clock, Play, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface Job {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  duration: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

export const JobStatus: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { user, getUserTier } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const userTier = getUserTier();

  // Generate realistic jobs based on user tier and current user
  const generateJobsForTier = (): Job[] => {
    const userName = user?.name || 'User';
    const userAvatar = user?.avatar || '';

    const baseJobs = [
      {
        id: '1',
        name: 'MCP Model Training',
        status: 'running' as const,
        progress: 75,
        duration: '2m 34s',
        assignee: { name: userName, avatar: userAvatar },
      },
      {
        id: '2',
        name: 'Code Analysis Pipeline',
        status: 'completed' as const,
        progress: 100,
        duration: '1m 12s',
        assignee: { name: userName, avatar: userAvatar },
      },
    ];

    if (userTier === 'free') {
      return baseJobs.slice(0, 1); // Only one job for free tier
    } else if (userTier === 'pro') {
      return [
        ...baseJobs,
        {
          id: '3',
          name: 'Voice Synthesis Training',
          status: 'pending' as const,
          progress: 0,
          duration: '-',
          assignee: { name: userName, avatar: userAvatar },
        },
      ];
    } else {
      // Enterprise tier
      return [
        ...baseJobs,
        {
          id: '3',
          name: 'Voice Synthesis Training',
          status: 'running' as const,
          progress: 45,
          duration: '3m 15s',
          assignee: { name: userName, avatar: userAvatar },
        },
        {
          id: '4',
          name: 'Multi-Model Orchestration',
          status: 'completed' as const,
          progress: 100,
          duration: '4m 30s',
          assignee: { name: userName, avatar: userAvatar },
        },
      ];
    }
  };

  useEffect(() => {
    // Load jobs based on user tier
    setJobs(generateJobsForTier());
  }, [userTier, user]);

  const refreshJobs = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setJobs(generateJobsForTier());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Play;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Active Jobs
        </Text>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Icon as={RefreshCcw} />}
          onClick={refreshJobs}
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </HStack>
      
      <VStack spacing={4} align="stretch">
        {jobs.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500" mb={2}>No active jobs</Text>
            <Text fontSize="sm" color="gray.400">
              {userTier === 'free' 
                ? 'Upgrade to Pro to run multiple jobs simultaneously'
                : 'Start a new MCP task to see jobs here'
              }
            </Text>
          </Box>
        ) : (
          jobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status);
            const statusColor = getStatusColor(job.status);
            
            return (
              <Box
                key={job.id}
                p={4}
                borderRadius="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: `${statusColor}.300` }}
                transition="all 0.2s"
              >
                <HStack justify="space-between" mb={3}>
                  <HStack spacing={3}>
                    <Icon as={StatusIcon} color={`${statusColor}.500`} />
                    <Text fontWeight="medium">{job.name}</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.500">
                      {job.duration}
                    </Text>
                    <Avatar size="xs" name={job.assignee.name} src={job.assignee.avatar} />
                  </HStack>
                </HStack>
                
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme={statusColor} textTransform="capitalize">
                    {job.status}
                  </Badge>
                  <Text fontSize="sm" fontWeight="bold">
                    {job.progress}%
                  </Text>
                </HStack>
                
                {job.status === 'running' && (
                  <Progress value={job.progress} colorScheme={statusColor} size="sm" />
                )}
              </Box>
            );
          })
        )}
      </VStack>
      
      {userTier === 'free' && jobs.length > 0 && (
        <Box mt={4} p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            💡 Upgrade to Pro to run multiple jobs and access advanced features
          </Text>
        </Box>
      )}
    </Box>
  );
};