import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Text,
  Box,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'maintenance',
    schedule: '0 2 * * *',
    enabled: true,
  });

  const bgColor = useColorModeValue('white', 'gray.800');

  const handleSubmit = () => {
    console.log('Creating automation:', formData);
    onClose();
  };

  const schedulePresets = [
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at 2 AM', value: '0 2 * * *' },
    { label: 'Weekly (Sundays)', value: '0 2 * * 0' },
    { label: 'Monthly', value: '0 2 1 * *' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Create New Automation</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter automation name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this automation does"
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="maintenance">Maintenance</option>
                <option value="testing">Testing</option>
                <option value="documentation">Documentation</option>
                <option value="deployment">Deployment</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Schedule</FormLabel>
              <VStack align="stretch" spacing={3}>
                <Select
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                >
                  <option value="">Custom schedule</option>
                  {schedulePresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </Select>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="0 2 * * * (Cron expression)"
                  fontSize="sm"
                  fontFamily="mono"
                />
                <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                  <Text fontSize="sm" color="gray.500">
                    Cron format: minute hour day month weekday
                    <br />
                    Example: "0 2 * * *" runs daily at 2:00 AM
                  </Text>
                </Box>
              </VStack>
            </FormControl>

            <FormControl>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <FormLabel mb={0}>Enable automation</FormLabel>
                  <Text fontSize="sm" color="gray.500">
                    Start running this automation immediately
                  </Text>
                </VStack>
                <Switch
                  isChecked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  colorScheme="primary"
                />
              </HStack>
            </FormControl>

            <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
              <HStack spacing={3} mb={2}>
                <Text fontWeight="semibold">Preview:</Text>
                <Badge colorScheme="blue">{formData.type}</Badge>
              </HStack>
              <Text fontSize="sm">
                <strong>{formData.name || 'Untitled Automation'}</strong>
                <br />
                {formData.description || 'No description provided'}
                <br />
                Schedule: {formData.schedule || 'Not set'}
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="primary"
            onClick={handleSubmit}
            isDisabled={!formData.name || !formData.schedule}
          >
            Create Automation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};