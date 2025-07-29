import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

// Clerk configuration
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file');
}

// Enhanced user interface for MCP system
interface MCPUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'developer' | 'viewer';
  permissions: string[];
  department: string;
  tier: 'free' | 'pro' | 'enterprise';
  lastLogin: Date;
  createdAt: Date;
}

interface MCPAuthContextType {
  user: MCPUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  getUserTier: () => string;
}

const MCPAuthContext = createContext<MCPAuthContextType | undefined>(undefined);

// User role and permission mapping
const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'admin', 'manage_users', 'manage_billing'],
  manager: ['read', 'write', 'manage_projects', 'view_analytics'],
  developer: ['read', 'write', 'use_ai_features'],
  viewer: ['read']
};

const DEFAULT_USER_ROLE = 'developer';

// Hook to use MCP authentication
export const useAuth = (): MCPAuthContextType => {
  const context = useContext(MCPAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an MCPAuthProvider');
  }
  return context;
};

// Internal auth provider component
const MCPAuthProviderInternal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [mcpUser, setMcpUser] = useState<MCPUser | null>(null);

  // Transform Clerk user to MCP user
  const transformClerkUser = (clerkUser: any): MCPUser => {
    const userRole = (clerkUser?.publicMetadata?.role as MCPUser['role']) || DEFAULT_USER_ROLE;
    const userTier = (clerkUser?.publicMetadata?.tier as MCPUser['tier']) || 'free';
    
    return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || 'User',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      avatar: clerkUser.imageUrl,
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole],
      department: clerkUser.publicMetadata?.department || 'Engineering',
      tier: userTier,
      lastLogin: new Date(),
      createdAt: new Date(clerkUser.createdAt)
    };
  };

  // Update MCP user when Clerk user changes
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const transformedUser = transformClerkUser(clerkUser);
      setMcpUser(transformedUser);
      
      // Update last login time in user metadata
      clerkUser.update({
        publicMetadata: {
          ...clerkUser.publicMetadata,
          lastLogin: new Date().toISOString()
        }
      }).catch(console.error);
    } else {
      setMcpUser(null);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const hasPermission = (permission: string): boolean => {
    return mcpUser?.permissions.includes(permission) || false;
  };

  const getUserTier = (): string => {
    return mcpUser?.tier || 'free';
  };

  const signOut = async (): Promise<void> => {
    await clerkSignOut();
    setMcpUser(null);
  };

  const contextValue: MCPAuthContextType = {
    user: mcpUser,
    isAuthenticated: isLoaded && isSignedIn && !!mcpUser,
    isLoading: !isLoaded,
    signOut,
    hasPermission,
    getUserTier
  };

  return (
    <MCPAuthContext.Provider value={contextValue}>
      {children}
    </MCPAuthContext.Provider>
  );
};

// Main auth provider with Clerk wrapper
export const MCPAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fee', 
        color: '#c00',
        fontFamily: 'monospace'
      }}>
        <h2>⚠️ Configuration Error</h2>
        <p>Missing Clerk configuration. Please add your Clerk Publishable Key to the environment variables.</p>
        <p>Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file</p>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3182CE', // Blue theme matching MCP
          colorBackground: '#FFFFFF',
          colorInputBackground: '#F7FAFC',
          borderRadius: '0.5rem'
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: '#3182CE',
            '&:hover': {
              backgroundColor: '#2C5282'
            }
          },
          card: {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }
        }
      }}
    >
      <MCPAuthProviderInternal>
        {children}
      </MCPAuthProviderInternal>
    </ClerkProvider>
  );
};

// Utility function to check if user has required permissions
export const requirePermissions = (user: MCPUser | null, requiredPermissions: string[]): boolean => {
  if (!user) return false;
  return requiredPermissions.every(permission => user.permissions.includes(permission));
};

// Utility function to get user tier features
export const getTierFeatures = (tier: string) => {
  const features = {
    free: {
      aiRequests: 100,
      projects: 3,
      teamMembers: 1,
      support: 'community',
      features: ['basic_ai', 'code_generation']
    },
    pro: {
      aiRequests: 5000,
      projects: 25,
      teamMembers: 10,
      support: 'email',
      features: ['advanced_ai', 'voice_synthesis', 'custom_models', 'api_access']
    },
    enterprise: {
      aiRequests: -1, // unlimited
      projects: -1,
      teamMembers: -1,
      support: 'priority',
      features: ['all_features', 'custom_deployment', 'sso', 'advanced_analytics']
    }
  };

  return features[tier as keyof typeof features] || features.free;
};
