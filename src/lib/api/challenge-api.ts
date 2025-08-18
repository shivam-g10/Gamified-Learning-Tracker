'use client';

import type { ChallengeItem } from '../api-types';
import { Result, succeed, fail } from '../result';

export class ChallengeAPI {
  static async getRandomChallenge(): Promise<Result<ChallengeItem | null>> {
    try {
      const response = await fetch('/api/random-challenge');
      if (!response.ok) {
        return fail('Failed to get random challenge');
      }
      const data = await response.json();

      // Handle the new response format
      if (data.focusSlotsFull) {
        return succeed(null); // Return null to indicate focus slots are full
      }

      return succeed(data.challenge || null);
    } catch {
      return fail('Failed to get random challenge');
    }
  }

  static async acceptChallenge(challengeId: string): Promise<Result<void>> {
    try {
      const response = await fetch('/api/focus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      });
      if (!response.ok) {
        return fail('Failed to accept challenge');
      }
      return succeed(undefined);
    } catch {
      return fail('Failed to accept challenge');
    }
  }
}
