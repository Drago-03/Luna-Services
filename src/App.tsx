import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuth } from '@clerk/clerk-react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Automation } from './pages/Automation';
import { Documentation } from './pages/Documentation';
import { Testing } from './pages/Testing';
import { TeamManagement } from './pages/TeamManagement';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import AuthPage from './pages/Auth';
import MCPPage from './pages/MCP';
import { MCPAuthProvider } from './contexts/ClerkAuthContext';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.50"
      >
        <Box textAlign="center">
          <Box 
            w={12} 
            h={12} 
            border="4px solid #E2E8F0" 
            borderTopColor="#3182CE" 
            borderRadius="full" 
            mx="auto"
            mb={4}
            css={{
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Box fontSize="lg" color="gray.600">Loading Universal MCP BETA...</Box>
        </Box>
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <MCPAuthProvider>
      <Box minH="100vh">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="automation" element={<Automation />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="testing" element={<Testing />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="mcp" element={<MCPPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </MCPAuthProvider>
  );
}

export default App;