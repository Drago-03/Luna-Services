import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useColorModeValue,
  Icon,
  Divider,
  Checkbox,
  Link,
  Badge,
} from '@chakra-ui/react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { state, login } = useAuth();
  const [email, setEmail] = useState('admin@luna-service.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  );

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg={bgColor}
        p={8}
        borderRadius="2xl"
        boxShadow="2xl"
        w="full"
        maxW="md"
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <VStack spacing={6}>
          <VStack spacing={4}>
            <HStack spacing={3}>
              <Icon as={Shield} boxSize={10} color="primary.500" />
              <HStack spacing={2}>
                <Text fontSize="3xl" fontWeight="bold" color="primary.500">
                  Luna-service
                </Text>
                <Badge 
                  colorScheme="orange" 
                  variant="solid"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  BETA
                </Badge>
              </HStack>
            </HStack>
            <Text color="gray.500" textAlign="center">
              Master Control Program for Engineering Teams
            </Text>
          </VStack>

          <Box w="full">
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Welcome back
            </Text>
            <Text color="gray.500" mb={6}>
              Sign in to your account to continue
            </Text>

            {state.error && (
              <Alert status="error" mb={4} borderRadius="lg">
                <AlertIcon />
                {state.error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </FormControl>

                <HStack justify="space-between" w="full">
                  <Checkbox
                    isChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary.500" fontSize="sm">
                    Forgot password?
                  </Link>
                </HStack>

                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  w="full"
                  isLoading={state.loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Divider my={6} />

            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                Demo Credentials:
              </Text>
              <Box
                p={3}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderRadius="lg"
                w="full"
              >
                <Text fontSize="sm">
                  <strong>Email:</strong> admin@luna-service.com<br />
                  <strong>Password:</strong> admin123
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};