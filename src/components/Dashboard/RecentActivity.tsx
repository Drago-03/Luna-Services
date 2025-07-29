import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  useColorModeValue,
  Button,
  Icon,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCcw } from 'lucide-react';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  type: 'mcp' | 'ai' | 'voice' | 'automation';
  timestamp: Date;
}

export const RecentActivity: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { user, getUserTier } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const userTier = getUserTier();

  // Generate realistic activities based on user tier and current user
  const generateActivitiesForTier = (): Activity[] => {
    const userName = user?.name || 'User';
    const userAvatar = user?.avatar || '';

    const baseActivities = [
      {
        id: '1',
        user: { name: userName, avatar: userAvatar },
        action: 'started MCP training',
        target: 'Gemini 2.5 Flash Model',
        type: 'mcp' as const,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: '2',
        user: { name: userName, avatar: userAvatar },
        action: 'generated code',
        target: 'Python Authentication Service',
        type: 'ai' as const,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
    ];

    if (userTier === 'free') {
      return baseActivities.slice(0, 2);
    } else if (userTier === 'pro') {
      return [
        ...baseActivities,
        {
          id: '3',
          user: { name: userName, avatar: userAvatar },
          action: 'processed voice command',
          target: 'Code Review Request',
          type: 'voice' as const,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: '4',
          user: { name: userName, avatar: userAvatar },
          action: 'created automation',
          target: 'Daily Code Analysis',
          type: 'automation' as const,
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
        },
      ];
    } else {
      // Enterprise tier
      return [
        ...baseActivities,
        {
          id: '3',
          user: { name: userName, avatar: userAvatar },
          action: 'deployed custom model',
          target: 'Enterprise MCP Instance',
          type: 'mcp' as const,
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
        },
        {
          id: '4',
          user: { name: userName, avatar: userAvatar },
          action: 'configured voice synthesis',
          target: 'Multi-language TTS',
          type: 'voice' as const,
          timestamp: new Date(Date.now() - 35 * 60 * 1000),
        },
        {
          id: '5',
          user: { name: userName, avatar: userAvatar },
          action: 'optimized LangChain',
          target: 'Enterprise Workflow',
          type: 'automation' as const,
          timestamp: new Date(Date.now() - 50 * 60 * 1000),
        },
      ];
    }
  };

  useEffect(() => {
    setActivities(generateActivitiesForTier());
  }, [userTier, user]);

  const refreshActivities = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setActivities(generateActivitiesForTier());
    setIsLoading(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcp': return 'blue';
      case 'ai': return 'green';
      case 'voice': return 'purple';
      case 'automation': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mcp': return 'MCP';
      case 'ai': return 'AI';
      case 'voice': return 'Voice';
      case 'automation': return 'Auto';
      default: return 'System';
    }
  };

  return (
    <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
      <HStack justify="space-between" mb={6}>
        <Text fontSize="lg" fontWeight="bold">
          Recent Activity
        </Text>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Icon as={RefreshCcw} />}
          onClick={refreshActivities}
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </HStack>
      
      <VStack spacing={4} align="stretch">
        {activities.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500" mb={2}>No recent activity</Text>
            <Text fontSize="sm" color="gray.400">
              Start using MCP features to see activity here
            </Text>
          </Box>
        ) : (
          activities.map((activity) => (
            <HStack key={activity.id} spacing={4} align="start">
              <Avatar
                size="sm"
                name={activity.user.name}
                src={activity.user.avatar}
              />
              <Box flex="1">
                <HStack spacing={2} mb={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    {activity.user.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {activity.action}
                  </Text>
                  <Badge
                    colorScheme={getTypeColor(activity.type)}
                    size="sm"
                    variant="subtle"
                  >
                    {getTypeLabel(activity.type)}
                  </Badge>
                </HStack>
                <Text fontSize="sm" fontWeight="medium" color="blue.600" mb={1}>
                  {activity.target}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </Text>
              </Box>
            </HStack>
          ))
        )}
      </VStack>
      
      {userTier === 'free' && activities.length > 0 && (
        <Box mt={4} p={3} bg="green.50" borderRadius="md" borderLeft="4px" borderColor="green.400">
          <Text fontSize="sm" color="green.700" fontWeight="medium">
            ⭐ Upgrade to Pro for detailed activity analytics and team insights
          </Text>
        </Box>
      )}
    </Box>
  );
};