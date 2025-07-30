import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import shadowUITheme from './theme/shadowUI';

// Shadow UI Components
import ShadowHeader from './components/Layout/ShadowHeader';
import ShadowSidebar from './components/Layout/ShadowSidebar';
import ShadowUIAuth from './pages/ShadowUIAuth';
import ShadowDashboard from './pages/ShadowDashboard';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <ShadowSidebar />
      <ShadowHeader />
      {children}
    </>
  );
}

function AppRoutes() {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <ShadowUIAuth />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <ShadowDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ChakraProvider theme={shadowUITheme}>
        <Router>
          <AppRoutes />
        </Router>
      </ChakraProvider>
    </ClerkProvider>
  );
}

export default App;
