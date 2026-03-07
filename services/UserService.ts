/**
 * UserService - Simple username-based identity management
 * Source: design-v2-spekster.md Section 4.5
 *
 * Responsibilities:
 * - Store username in localStorage
 * - Generate UUID for user identification
 * - Validate username input
 * - No authentication (Phase 1 limitation)
 */

import type { User, Result } from '@/models/mapping/types';
import { UserError } from '@/models/mapping/types';

// ============================================================================
// UserService Class
// ============================================================================

class UserServiceClass {
  private readonly STORAGE_KEY = 'spoetzl_user_v1';

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): Result<User, UserError> {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (!stored) {
      // First time user - prompt for username
      return {
        success: false,
        error: UserError.INVALID_USERNAME
      };
    }

    try {
      const user = JSON.parse(stored) as User;

      // Validate user object structure
      if (!user.id || !user.username || !user.createdDate) {
        return {
          success: false,
          error: UserError.INVALID_USERNAME
        };
      }

      return { success: true, data: user };
    } catch {
      return {
        success: false,
        error: UserError.INVALID_USERNAME
      };
    }
  }

  /**
   * Set username and create user
   */
  setUsername(username: string): Result<User, UserError> {
    // Validate username
    const validation = this.validateUsername(username);
    if (!validation.success) {
      return validation;
    }

    // Create user object
    const user: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      createdDate: new Date().toISOString()
    };

    // Save to localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: UserError.INVALID_USERNAME
      };
    }
  }

  /**
   * Validate username
   */
  validateUsername(username: string): Result<boolean, UserError> {
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      return {
        success: false,
        error: UserError.USERNAME_TOO_SHORT
      };
    }

    if (trimmed.length > 50) {
      return {
        success: false,
        error: UserError.USERNAME_TOO_LONG
      };
    }

    return { success: true, data: true };
  }

  /**
   * Update existing user's username
   */
  updateUsername(newUsername: string): Result<User, UserError> {
    // Get current user
    const currentResult = this.getCurrentUser();
    if (!currentResult.success) {
      return currentResult;
    }

    // Validate new username
    const validation = this.validateUsername(newUsername);
    if (!validation.success) {
      return validation;
    }

    // Update user with same ID
    const updatedUser: User = {
      ...currentResult.data,
      username: newUsername.trim()
    };

    // Save to localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
      return { success: true, data: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: UserError.INVALID_USERNAME
      };
    }
  }

  /**
   * Clear user data (logout)
   */
  clearUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if user exists
   */
  hasUser(): boolean {
    const result = this.getCurrentUser();
    return result.success;
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const UserService = new UserServiceClass();
