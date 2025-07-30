import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Badge,
  Card,
  CardBody,
} from '@chakra-ui/react';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  badge 
}) => {
  return (
    <Card
      bg="rgba(0, 0, 0, 0.3)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.1)"
      borderRadius="2xl"
      p={6}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        borderColor: 'rgba(249, 115, 22, 0.5)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      }}
    >
      <CardBody p={0}>
        <VStack align="start" spacing={4}>
          <HStack>
            <Box
              p={3}
              bg="rgba(249, 115, 22, 0.2)"
              borderRadius="xl"
              backdropFilter="blur(10px)"
            >
              <Icon as={icon} boxSize={6} color="#F97316" />
            </Box>
            {badge && (
              <Badge
                bg="rgba(234, 179, 8, 0.2)"
                color="#EAB308"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="bold"
              >
                {badge}
              </Badge>
            )}
          </HStack>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
              {title}
            </Text>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize="sm">
              {description}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default FeatureCard;
