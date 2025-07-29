/**
 * Supabase client configuration for Luna Services frontend
 * Provides type-safe access to Supabase features
 */
import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tnmsadjdeenhysllhyzp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubXNhZGpkZWVuaHlzbGxoeXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDI5MDIsImV4cCI6MjA2OTM3ODkwMn0.nQXubx2f5EdzcB2sRLjyytgj9dIiJ5FXQ9gxw5YJsaI'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types for type safety
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'developer' | 'viewer'
  permissions: string[]
  avatar?: string
  department?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  repository_url?: string
  status: 'active' | 'archived' | 'maintenance'
  settings: Record<string, any>
  created_by: string
  created_at: string
  updated_at: string
}

export interface AutomationJob {
  id: string
  name: string
  description?: string
  job_type: 'maintenance' | 'testing' | 'documentation' | 'deployment'
  status: 'active' | 'running' | 'paused' | 'error'
  schedule?: string
  parameters: Record<string, any>
  project_id?: string
  created_by: string
  last_run?: string
  next_run?: string
  success_rate: number
  avg_duration: number
  created_at: string
  updated_at: string
}

export interface JobExecution {
  id: string
  job_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at: string
  completed_at?: string
  duration?: number
  logs: any[]
  error_message?: string
  output: Record<string, any>
}

// Authentication helpers
export const auth = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  /**
   * Sign in an existing user
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  /**
   * Get the current user session
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  /**
   * Update user password
   */
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  /**
   * Users table operations
   */
  users: {
    getAll: () => supabase.from('users').select('*'),
    getById: (id: string) => supabase.from('users').select('*').eq('id', id).single(),
    getByEmail: (email: string) => supabase.from('users').select('*').eq('email', email).single(),
    create: (user: Partial<User>) => supabase.from('users').insert(user).select().single(),
    update: (id: string, updates: Partial<User>) => supabase.from('users').update(updates).eq('id', id).select().single(),
    delete: (id: string) => supabase.from('users').delete().eq('id', id),
  },

  /**
   * Projects table operations
   */
  projects: {
    getAll: () => supabase.from('projects').select('*'),
    getById: (id: string) => supabase.from('projects').select('*').eq('id', id).single(),
    getByUser: (userId: string) => supabase.from('projects').select('*').eq('created_by', userId),
    create: (project: Partial<Project>) => supabase.from('projects').insert(project).select().single(),
    update: (id: string, updates: Partial<Project>) => supabase.from('projects').update(updates).eq('id', id).select().single(),
    delete: (id: string) => supabase.from('projects').delete().eq('id', id),
  },

  /**
   * Automation jobs table operations
   */
  automationJobs: {
    getAll: () => supabase.from('automation_jobs').select('*'),
    getById: (id: string) => supabase.from('automation_jobs').select('*').eq('id', id).single(),
    getByProject: (projectId: string) => supabase.from('automation_jobs').select('*').eq('project_id', projectId),
    getByUser: (userId: string) => supabase.from('automation_jobs').select('*').eq('created_by', userId),
    create: (job: Partial<AutomationJob>) => supabase.from('automation_jobs').insert(job).select().single(),
    update: (id: string, updates: Partial<AutomationJob>) => supabase.from('automation_jobs').update(updates).eq('id', id).select().single(),
    delete: (id: string) => supabase.from('automation_jobs').delete().eq('id', id),
  },

  /**
   * Job executions table operations
   */
  jobExecutions: {
    getAll: () => supabase.from('job_executions').select('*'),
    getById: (id: string) => supabase.from('job_executions').select('*').eq('id', id).single(),
    getByJob: (jobId: string) => supabase.from('job_executions').select('*').eq('job_id', jobId),
    create: (execution: Partial<JobExecution>) => supabase.from('job_executions').insert(execution).select().single(),
    update: (id: string, updates: Partial<JobExecution>) => supabase.from('job_executions').update(updates).eq('id', id).select().single(),
    delete: (id: string) => supabase.from('job_executions').delete().eq('id', id),
  }
}

// Real-time subscriptions
export const realtime = {
  /**
   * Subscribe to table changes
   */
  subscribe: (table: string, callback: (payload: any) => void, filter?: string) => {
    let subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter
        }, 
        callback
      )
      .subscribe()
    
    return subscription
  },

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe: (subscription: any) => {
    return supabase.removeChannel(subscription)
  }
}

// Utility functions
export const utils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  },

  /**
   * Get current user ID
   */
  getCurrentUserId: async (): Promise<string | null> => {
    const { data } = await supabase.auth.getUser()
    return data.user?.id || null
  },

  /**
   * Upload file to Supabase Storage
   */
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  /**
   * Download file from Supabase Storage
   */
  downloadFile: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    return { data, error }
  },

  /**
   * Get public URL for file
   */
  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  }
}

export default supabase