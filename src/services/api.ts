// Mock API service for demonstration
export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@luna-service.com' && password === 'admin123') {
      return {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'admin@luna-service.com',
          role: 'admin' as const,
          permissions: ['read', 'write', 'admin'],
          avatar: '',
          department: 'Engineering',
          lastLogin: new Date(),
        },
        token: 'mock-jwt-token',
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  validateToken: async (token: string) => {
    // Simulate token validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token === 'mock-jwt-token') {
      return {
        id: '1',
        name: 'John Doe',
        email: 'admin@luna-service.com',
        role: 'admin' as const,
        permissions: ['read', 'write', 'admin'],
        avatar: '',
        department: 'Engineering',
        lastLogin: new Date(),
      };
    }
    
    throw new Error('Invalid token');
  },
};

export const projectsApi = {
  getProjects: async () => {
    // Mock projects data
    return [
      {
        id: '1',
        name: 'Luna Frontend',
        description: 'React frontend application',
        status: 'active' as const,
        members: [],
        settings: {
          enableAutomation: true,
          enableTesting: true,
          enableDocumentation: true,
          notifications: { email: true, slack: true },
          integrations: {},
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },
};