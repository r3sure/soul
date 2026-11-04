import { describe, expect, it } from 'vitest';
import { createEvent } from './engine';
import { computeRewards } from './rewards';
import type { RewardRule } from './rewards';
import type { EventState } from './engine';

const rule: RewardRule = {
  guaranteed: [{ id: 'souls', amount: 10 }],
  topPlaces: [[{ id: 'souls', amount: 100 }], [{ id: 'souls', amount: 50 }]],
  personalThresholds: [{ percent: 50, rewards: [{ id: 'souls', amount: 5 }] }],
  consolationPerDamage: { id: 'souls', perDamage: 0.1 },
};

function makeEvent(damages: Array<[string, number]>, state: EventState) {
  const event = createEvent({
    id: 'e1',
    bossId: 'b1',
    bossName: 'Boss',
    initialHp: 1_000,
    durationSeconds: 60,
    startedAt: 0,
    participants: damages.map(([characterId, damage]) => ({
      characterId,
      characterName: characterId,
      guildName: null,
      damage,
    })),
  });

  event.state = state;

  return event;
}

describe('computeRewards', () => {
  it('returns nothing while the event is active', () => {
    expect(computeRewards(makeEvent([['c1', 600]], 'active'), rule)).toEqual([]);
  });

  it('adds guaranteed, place and personal threshold rewards on victory', () => {
    const grants = computeRewards(makeEvent([['c1', 600], ['c2', 400]], 'defeated'), rule);

    expect(grants).toEqual([
      {
        characterId: 'c1',
        characterName: 'c1',
        rewards: [
          { id: 'souls', amount: 10 },
          { id: 'souls', amount: 100 },
          { id: 'souls', amount: 5 },
        ],
      },
      {
        characterId: 'c2',
        characterName: 'c2',
        rewards: [
          { id: 'souls', amount: 10 },
          { id: 'souls', amount: 50 },
        ],
      },
    ]);
  });

  it('pays consolation by damage on failure and skips zero damage', () => {
    const grants = computeRewards(makeEvent([['c1', 100], ['c2', 0]], 'failed'), rule);

    expect(grants).toEqual([
      {
        characterId: 'c1',
        characterName: 'c1',
        rewards: [{ id: 'souls', amount: 10 }],
      },
    ]);
  });
});
