import { describe, expect, it } from 'vitest';
import { findBoss } from '@/data/bosses/bosses';
import { createDemoBattleSession } from './session';

describe('demo battle session', () => {
  it('seeds a leaderboard and applies real damage through the engine', () => {
    const boss = findBoss('ash-warden');

    expect(boss).toBeDefined();

    if (!boss) {
      return;
    }

    const startedAt = 1_000_000;
    const session = createDemoBattleSession(boss, startedAt);
    const before = session.snapshot(startedAt);

    expect(before.state).toBe('active');
    expect(before.leaderboard).toHaveLength(5);
    expect(before.hp).toBeLessThan(before.initialHp);

    const result = session.attack('cleave', startedAt);

    expect(result).toMatchObject({ ok: true, damage: 1_200 });
    expect(session.snapshot(startedAt).hp).toBe(before.hp - 1_200);
    expect(session.snapshot(startedAt).cooldowns.cleave).toBe(startedAt + 6_000);
  });

  it('blocks the same attack until cooldown ends', () => {
    const boss = findBoss('ash-warden');

    if (!boss) {
      return;
    }

    const startedAt = 2_000_000;
    const session = createDemoBattleSession(boss, startedAt);

    expect(session.attack('cleave', startedAt).ok).toBe(true);
    expect(session.attack('cleave', startedAt + 1_000)).toMatchObject({
      ok: false,
      reason: 'cooldown',
    });
    expect(session.attack('cleave', startedAt + 6_000).ok).toBe(true);
  });
});
