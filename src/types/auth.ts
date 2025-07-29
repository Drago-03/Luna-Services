export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'viewer';
  permissions: string[];
  avatar?: string;
  department: string;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };