import { Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';

// Public Pages
import LandingPage from './pages/Landing';
import DocumentationPage from './pages/Documentation/DocumentationPage';
import IntegrationsPage from './pages/Integrations/IntegrationsPage';
import StorePage from './pages/Store/StorePage';
import ContributingPage from './pages/Contributing/ContributingPage';
import ContactPage from './pages/Contact/ContactPage';
import PrivacyPolicyPage from './pages/Legal/PrivacyPolicy';
import TermsOfServicePage from './pages/Legal/TermsOfService';
import CookiePolicyPage from './pages/Legal/CookiePolicy';
import AboutPage from './pages/About';
import StatusPage from './pages/Status';

// Auth Pages
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

// Protected Dashboard Components
import ShadowHeader from './components/Layout/ShadowHeader';
import ShadowSidebar from './components/Layout/ShadowSidebar';
import { Dashboard } from './pages/Dashboard';
import { Automation } from './pages/Automation';
import { Documentation } from './pages/Documentation';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { TeamManagement } from './pages/TeamManagement';
import { Testing } from './pages/Testing';
import MCPPage from './pages/MCP';

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
      <div className="dashboard-layout">
        {children}
      </div>
    </>
  );
}

function AppRoutes() {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs" element={<DocumentationPage />} />
      <Route path="/integrations-info" element={<IntegrationsPage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/contributing" element={<ContributingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/status" element={<StatusPage />} />
      
      {/* Auth Routes */}
      <Route 
        path="/signin" 
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <SignInPage />} 
      />
      <Route 
        path="/signup" 
        element={isSignedIn ? <Navigate to="/dashboard" replace /> : <SignUpPage />} 
      />
      
      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mcp" 
        element={
          <ProtectedRoute>
            <MCPPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/automation" 
        element={
          <ProtectedRoute>
            <Automation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/documentation" 
        element={
          <ProtectedRoute>
            <Documentation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/integrations" 
        element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/testing" 
        element={
          <ProtectedRoute>
            <Testing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppRoutes />
    </ClerkProvider>
  );
}

export default App;