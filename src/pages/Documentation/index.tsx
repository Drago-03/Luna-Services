import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Grid,
  GridItem,
  Input,
  Select,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { Search, Plus, BookOpen, FileText, Code, Zap } from 'lucide-react';
import { DocumentationList } from '../../components/Documentation/DocumentationList';
import { DocumentationEditor } from '../../components/Documentation/DocumentationEditor';

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={6} align="stretch">
      <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
        <HStack justify="space-between" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Documentation Center
            </Text>
            <Text color="gray.500">
              Create, manage, and maintain your project documentation
            </Text>
          </Box>
          <Button leftIcon={<Plus size={16} />} colorScheme="primary">
            New Document
          </Button>
        </HStack>

        <HStack spacing={4} mb={6}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <Icon as={Search} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select maxW="200px" defaultValue="all">
            <option value="all">All Types</option>
            <option value="api">API Reference</option>
            <option value="user">User Guide</option>
            <option value="technical">Technical</option>
            <option value="changelog">Changelog</option>
          </Select>
        </HStack>

        <HStack spacing={4}>
          <Badge colorScheme="blue" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Icon as={FileText} boxSize={3} />
              <Text fontSize="sm" fontWeight="bold">45</Text>
              <Text fontSize="sm">Documents</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="green" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Icon as={Code} boxSize={3} />
              <Text fontSize="sm" fontWeight="bold">12</Text>
              <Text fontSize="sm">API Docs</Text>
            </HStack>
          </Badge>
          <Badge colorScheme="purple" p={2} borderRadius="lg">
            <HStack spacing={1}>
              <Icon as={Zap} boxSize={3} />
              <Text fontSize="sm" fontWeight="bold">8</Text>
              <Text fontSize="sm">Auto-generated</Text>
            </HStack>
          </Badge>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: selectedDoc ? '1fr 2fr' : '1fr' }} gap={6}>
        <GridItem>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={BookOpen} boxSize={4} />
                  <Text>All Docs</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={Code} boxSize={4} />
                  <Text>API Reference</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FileText} boxSize={4} />
                  <Text>User Guides</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={4}>
                <DocumentationList
                  searchTerm={searchTerm}
                  onSelectDoc={setSelectedDoc}
                  selectedDoc={selectedDoc}
                />
              </TabPanel>
              <TabPanel p={0} pt={4}>
                <DocumentationList
                  searchTerm={searchTerm}
                  filter="api"
                  onSelectDoc={setSelectedDoc}
                  selectedDoc={selectedDoc}
                />
              </TabPanel>
              <TabPanel p={0} pt={4}>
                <DocumentationList
                  searchTerm={searchTerm}
                  filter="user"
                  onSelectDoc={setSelectedDoc}
                  selectedDoc={selectedDoc}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>

        {selectedDoc && (
          <GridItem>
            <DocumentationEditor
              docId={selectedDoc}
              onClose={() => setSelectedDoc(null)}
            />
          </GridItem>
        )}
      </Grid>
    </VStack>
  );
};