export interface Job {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  type: 'automation' | 'test' | 'deployment' | 'documentation';
  schedule?: string;
  lastRun?: Date;
  nextRun?: Date;
  duration?: number;
  logs: LogEntry[];
  parameters: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  status: 'active' | 'archived' | 'maintenance';
  members: ProjectMember[];
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'maintainer' | 'developer' | 'viewer';
  joinedAt: Date;
}

export interface ProjectSettings {
  enableAutomation: boolean;
  enableTesting: boolean;
  enableDocumentation: boolean;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
}

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  webhook?: string;
}

export interface IntegrationSettings {
  github?: {
    enabled: boolean;
    repository: string;
    webhook: string;
  };
  slack?: {
    enabled: boolean;
    channel: string;
    webhook: string;
  };
  jira?: {
    enabled: boolean;
    project: string;
    apiKey: string;
  };
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  projectId: string;
  tests: Test[];
  lastRun?: TestRun;
  status: 'passing' | 'failing' | 'unstable' | 'not_run';
  createdAt: Date;
  updatedAt: Date;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  file: string;
  status: 'passing' | 'failing' | 'skipped';
  duration: number;
  lastRun: Date;
}

export interface TestRun {
  id: string;
  suiteId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  results: TestResult[];
  coverage?: Coverage;
  environment: string;
}

export interface TestResult {
  testId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  output?: string;
}

export interface Coverage {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  type: 'api' | 'user' | 'technical' | 'changelog';
  projectId: string;
  version: string;
  status: 'draft' | 'review' | 'published';
  tags: string[];
  author: string;
  lastModified: Date;
  createdAt: Date;
}