import { buildLeaderboard } from '@/game/combat/engine';
import type { CombatEvent } from '@/game/combat/engine';

export type RewardEntry = {
  id: string;
  amount: number;
};

export type RewardRule = {
  guaranteed: RewardEntry[];
  topPlaces: RewardEntry[][];
  personalThresholds: { percent: number; rewards: RewardEntry[] }[];
  consolationPerDamage?: { id: string; perDamage: number };
};

export type RewardGrant = {
  characterId: string;
  characterName: string;
  rewards: RewardEntry[];
};

export function computeRewards(event: CombatEvent, rule: RewardRule): RewardGrant[] {
  if (event.state === 'active') {
    return [];
  }

  const leaderboard = buildLeaderboard(event);

  if (event.state === 'failed') {
    const consolation = rule.consolationPerDamage;

    if (!consolation) {
      return [];
    }

    return leaderboard
      .map((row) => {
        const amount = Math.floor(row.damage * consolation.perDamage);

        return {
          characterId: row.characterId,
          characterName: row.characterName,
          rewards: amount > 0 ? [{ id: consolation.id, amount }] : [],
        };
      })
      .filter((grant) => grant.rewards.length > 0);
  }

  return leaderboard.map((row) => {
    const rewards: RewardEntry[] = [...rule.guaranteed];
    const placeRewards = rule.topPlaces[row.place - 1];

    if (placeRewards) {
      rewards.push(...placeRewards);
    }

    const percent = (row.damage / event.initialHp) * 100;

    for (const threshold of rule.personalThresholds) {
      if (percent >= threshold.percent) {
        rewards.push(...threshold.rewards);
      }
    }

    return {
      characterId: row.characterId,
      characterName: row.characterName,
      rewards,
    };
  });
}
