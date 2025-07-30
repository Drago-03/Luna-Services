import { supabase } from '../lib/supabase';

export interface WaitlistUser {
  id?: string;
  email: string;
  name: string;
  company?: string;
  use_case?: string;
  created_at?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export const waitlistService = {
  /**
   * Add a user to the waitlist
   */
  async addToWaitlist(userData: Omit<WaitlistUser, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Email already registered for waitlist' };
      }

      // Insert new user
      const { error } = await supabase
        .from('waitlist')
        .insert({
          ...userData,
          status: 'pending'
        });

      if (error) {
        console.error('Error adding to waitlist:', error);
        return { success: false, error: 'Failed to join waitlist. Please try again.' };
      }

      // Send welcome email (implement email service)
      await this.sendWelcomeEmail(userData.email, userData.name);

      return { success: true };
    } catch (error) {
      console.error('Waitlist service error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get waitlist statistics
   */
  async getWaitlistStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    thisWeek: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('status, created_at');

      if (error) {
        console.error('Error getting waitlist stats:', error);
        return { total: 0, pending: 0, approved: 0, thisWeek: 0 };
      }

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = data.reduce(
        (acc: { total: number; pending: number; approved: number; thisWeek: number }, user: any) => {
          acc.total++;
          if (user.status === 'pending') acc.pending++;
          if (user.status === 'approved') acc.approved++;
          if (new Date(user.created_at) > weekAgo) acc.thisWeek++;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, thisWeek: 0 }
      );

      return stats;
    } catch (error) {
      console.error('Error getting waitlist stats:', error);
      return { total: 0, pending: 0, approved: 0, thisWeek: 0 };
    }
  },

  /**
   * Send welcome email to new waitlist user
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      // Call your email service here (e.g., SendGrid, Resend, etc.)
      // For now, we'll use a simple API call to your backend
      const response = await fetch('/api/email/waitlist-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        console.error('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate required fields
   */
  validateWaitlistData(data: Omit<WaitlistUser, 'id' | 'created_at' | 'status'>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};
