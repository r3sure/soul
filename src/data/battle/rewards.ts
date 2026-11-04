import type { RewardRule } from '@/game/combat/rewards';

export const demoRewardRule: RewardRule = {
  guaranteed: [{ id: 'souls', amount: 500 }],
  topPlaces: [
    [{ id: 'souls', amount: 1000 }],
    [{ id: 'souls', amount: 700 }],
    [{ id: 'souls', amount: 500 }],
    [{ id: 'souls', amount: 300 }],
    [{ id: 'souls', amount: 200 }],
  ],
  personalThresholds: [
    { percent: 10, rewards: [{ id: 'souls', amount: 50 }] },
    { percent: 25, rewards: [{ id: 'souls', amount: 100 }] },
    { percent: 50, rewards: [{ id: 'souls', amount: 200 }] },
    { percent: 75, rewards: [{ id: 'souls', amount: 350 }] },
  ],
  consolationPerDamage: { id: 'souls', perDamage: 0.01 },
};
