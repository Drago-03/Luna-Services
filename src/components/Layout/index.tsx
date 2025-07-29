import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { state } = useAuth();
  const bgColor = 'gray.50';

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Flex minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column">
        <Header />
        <Box flex="1" p={6} overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};