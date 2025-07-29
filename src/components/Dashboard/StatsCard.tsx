import React from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: any;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const changeColor = changeType === 'increase' ? 'green.500' : 
                     changeType === 'decrease' ? 'red.500' : 'blue.500';
  const TrendIcon = changeType === 'increase' ? TrendingUp : 
                   changeType === 'decrease' ? TrendingDown : null;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" mb={4}>
        <Icon as={icon} boxSize={6} color={`${color}.500`} />
        {TrendIcon && (
          <Box
            p={2}
            borderRadius="lg"
            bg={`${color}.50`}
            color={`${color}.500`}
          >
            <Icon as={TrendIcon} boxSize={4} />
          </Box>
        )}
      </HStack>
      
      <VStack align="start" spacing={1}>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {title}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" fontWeight="semibold" color={changeColor}>
            {change}
          </Text>
          {changeType !== 'neutral' && (
            <Text fontSize="sm" color="gray.500">
              from last month
            </Text>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};