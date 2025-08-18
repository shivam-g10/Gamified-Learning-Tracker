'use client';

import type { BulkSetupData } from '../api-types';
import { Result, succeed, fail } from '../result';

export interface BulkSetupResult {
  success: boolean;
  message: string;
  count: number;
  type: string;
}

export class BulkSetupAPI {
  /**
   * Perform bulk setup of items
   */
  static async bulkSetup(
    type: 'quests' | 'books' | 'courses',
    data: BulkSetupData[],
    replace: boolean
  ): Promise<Result<BulkSetupResult>> {
    try {
      const response = await fetch('/api/bulk-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data, replace }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return fail(errorData.error || 'Failed to perform bulk setup');
      }

      const result = await response.json();
      return succeed(result);
    } catch {
      return fail('Network error occurred during bulk setup');
    }
  }
}
