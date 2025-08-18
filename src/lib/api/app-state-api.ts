'use client';

import type { AppState, CheckInResponse } from '../api-types';
import { Result, succeed, fail } from '../result';

export class AppStateAPI {
  static async getAppState(): Promise<Result<AppState>> {
    try {
      const response = await fetch('/api/app-state');
      if (!response.ok) {
        return fail('Failed to fetch app state');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to fetch app state');
    }
  }

  static async recordDailyCheckIn(): Promise<Result<CheckInResponse>> {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });
      if (!response.ok) {
        return fail('Failed to record check-in');
      }
      const data = await response.json();
      return succeed(data);
    } catch {
      return fail('Failed to record check-in');
    }
  }

  static async updateAppState(
    data: Partial<AppState>
  ): Promise<Result<AppState>> {
    try {
      const response = await fetch('/api/app-state', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return fail('Failed to update app state');
      }
      const appState = await response.json();
      return succeed(appState);
    } catch {
      return fail('Failed to update app state');
    }
  }
}
