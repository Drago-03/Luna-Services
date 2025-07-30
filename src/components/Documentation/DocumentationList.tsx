import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  HStack,
  Badge,
  Avatar,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FileText, Calendar, User, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/ClerkAuthContext';

interface Documentation {
  id: string;
  title: string;
  description: string;
  type: 'api' | 'user' | 'technical' | 'changelog';
  status: 'draft' | 'review' | 'published';
  author: {
    name: string;
    avatar: string;
  };
  lastModified: Date;
  views: number;
}

interface DocumentationListProps {
  searchTerm: string;
  filter?: string;
  onSelectDoc: (docId: string) => void;
  selectedDoc: string | null;
}

export const DocumentationList: React.FC<DocumentationListProps> = ({
  searchTerm,
  filter,
  onSelectDoc,
  selectedDoc,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('primary.50', 'primary.900');
  const { user, getUserTier } = useAuth();
  const [docs, setDocs] = useState<Documentation[]>([]);
  
  const userTier = getUserTier();
  const userName = user?.name || 'User';
  const userAvatar = user?.avatar || '';

  // Generate documentation based on user tier
  const generateDocsForTier = (): Documentation[] => {
    const baseDocs = [
      {
        id: '1',
        title: 'MCP Quick Start Guide',
        description: 'Get started with Model Context Protocol in minutes',
        type: 'user' as const,
        status: 'published' as const,
        author: { name: userName, avatar: userAvatar },
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
        views: 1250,
      },
      {
        id: '2',
        title: 'Authentication Overview',
        description: 'Understanding Luna-service authentication and security',
        type: 'api' as const,
        status: 'published' as const,
        author: { name: userName, avatar: userAvatar },
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
        views: 840,
      },
    ];

    if (userTier === 'free') {
      return baseDocs;
    } else if (userTier === 'pro') {
      return [
        ...baseDocs,
        {
          id: '3',
          title: 'Advanced API Integration',
          description: 'Pro-level API features and automation workflows',
          type: 'technical' as const,
          status: 'published' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000),
          views: 456,
        },
        {
          id: '4',
          title: 'Voice Command Reference',
          description: 'Complete voice interaction documentation',
          type: 'api' as const,
          status: 'review' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 30 * 60 * 1000),
          views: 123,
        },
      ];
    } else {
      // Enterprise tier
      return [
        ...baseDocs,
        {
          id: '3',
          title: 'Enterprise Architecture Guide',
          description: 'Complete system architecture and deployment strategies',
          type: 'technical' as const,
          status: 'published' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000),
          views: 1456,
        },
        {
          id: '4',
          title: 'Custom Model Training',
          description: 'Enterprise-level model customization and training',
          type: 'technical' as const,
          status: 'published' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000),
          views: 890,
        },
        {
          id: '5',
          title: 'Team Management & Analytics',
          description: 'Enterprise team collaboration and usage analytics',
          type: 'user' as const,
          status: 'published' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 30 * 60 * 1000),
          views: 623,
        },
        {
          id: '6',
          title: 'Security & Compliance',
          description: 'Enterprise security features and compliance guidelines',
          type: 'api' as const,
          status: 'review' as const,
          author: { name: userName, avatar: userAvatar },
          lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
          views: 234,
        },
      ];
    }
  };

  useEffect(() => {
    setDocs(generateDocsForTier());
  }, [userTier, user]);

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filter || doc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'review': return 'yellow';
      case 'draft': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'blue';
      case 'user': return 'green';
      case 'technical': return 'purple';
      case 'changelog': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {filteredDocs.map((doc) => (
        <Box
          key={doc.id}
          bg={selectedDoc === doc.id ? selectedBg : bgColor}
          p={4}
          borderRadius="xl"
          boxShadow="md"
          cursor="pointer"
          _hover={{ bg: selectedDoc === doc.id ? selectedBg : hoverBg }}
          transition="all 0.2s"
          onClick={() => onSelectDoc(doc.id)}
          border="2px"
          borderColor={selectedDoc === doc.id ? 'primary.200' : 'transparent'}
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Badge colorScheme={getTypeColor(doc.type)} textTransform="capitalize">
                  {doc.type}
                </Badge>
                <Badge colorScheme={getStatusColor(doc.status)} textTransform="capitalize">
                  {doc.status}
                </Badge>
              </HStack>
              <HStack spacing={2} color="gray.500">
                <Icon as={Eye} boxSize={3} />
                <Text fontSize="xs">{doc.views}</Text>
              </HStack>
            </HStack>

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={1}>
                {doc.title}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                {doc.description}
              </Text>
            </Box>

            <HStack justify="space-between" fontSize="sm" color="gray.500">
              <HStack spacing={2}>
                <Avatar size="xs" name={doc.author.name} src={doc.author.avatar} />
                <Text>{doc.author.name}</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={Calendar} boxSize={3} />
                <Text>
                  {formatDistanceToNow(doc.lastModified, { addSuffix: true })}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};