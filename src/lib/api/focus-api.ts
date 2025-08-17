'use client';

import type { FocusState } from '../api-types';
import { Result, succeed, fail } from '../result';

export class FocusAPI {
  static async getFocusState(): Promise<Result<FocusState>> {
    try {
      const response = await fetch('/api/focus');
      if (!response.ok) {
        return fail('Failed to fetch focus state');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to fetch focus state');
      }
  }

  static async setFocus(type: 'quest' | 'book' | 'course', id: string): Promise<Result<FocusState>> {
    try {
      const response = await fetch('/api/focus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });
      if (!response.ok) {
        return fail('Failed to set focus');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to set focus');
    }
  }

  static async removeFocus(type: 'quest' | 'book' | 'course'): Promise<Result<FocusState>> {
    try {
      const response = await fetch('/api/focus', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) {
        return fail('Failed to remove focus');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to remove focus');
    }
  }

  static async clearAllFocus(): Promise<Result<FocusState>> {
    try {
      const response = await fetch('/api/focus', {
        method: 'DELETE',
      });
      if (!response.ok) {
        return fail('Failed to clear focus');
      }
      const data = await response.json();
      return succeed(data);
    } catch (error) {
      return fail('Failed to clear focus');
    }
  }
}
