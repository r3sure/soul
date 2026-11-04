import { describe, expect, it } from 'vitest';
import { applyAttack, buildLeaderboard, createEvent, getSnapshot } from './engine';
import type { AttackDefinition, CombatEvent } from './engine';

const attacks: Record<string, AttackDefinition> = {
  strike: { id: 'strike', name: 'Strike', baseDamage: 100, cooldownSeconds: 5 },
  heavy: { id: 'heavy', name: 'Heavy', baseDamage: 1_000, cooldownSeconds: 30 },
};

function makeEvent(initialHp = 1_000): CombatEvent {
  return createEvent({
    id: 'e1',
    bossId: 'b1',
    bossName: 'Boss',
    initialHp,
    durationSeconds: 60,
    startedAt: 0,
    participants: [
      { characterId: 'c1', characterName: 'A', guildName: null },
      { characterId: 'c2', characterName: 'B', guildName: null },
    ],
  });
}

describe('applyAttack', () => {
  it('reduces hp and records damage', () => {
    const event = makeEvent();
    const result = applyAttack(event, attacks, {
      requestId: 'r1',
      characterId: 'c1',
      attackId: 'strike',
      now: 1_000,
    });

    expect(result).toMatchObject({ ok: true, damage: 100, hp: 900, state: 'active' });
    expect(event.damageLog).toHaveLength(1);
    expect(event.participants.get('c1')?.damage).toBe(100);
  });

  it('blocks an attack during cooldown and allows it again after', () => {
    const event = makeEvent();

    expect(
      applyAttack(event, attacks, { requestId: 'r1', characterId: 'c1', attackId: 'strike', now: 0 }),
    ).toMatchObject({ ok: true });

    expect(
      applyAttack(event, attacks, {
        requestId: 'r2',
        characterId: 'c1',
        attackId: 'strike',
        now: 1_000,
      }),
    ).toMatchObject({ ok: false, reason: 'cooldown', readyAt: 5_000 });

    expect(
      applyAttack(event, attacks, {
        requestId: 'r3',
        characterId: 'c1',
        attackId: 'strike',
        now: 5_000,
      }),
    ).toMatchObject({ ok: true });
  });

  it('does not apply damage twice for the same request id', () => {
    const event = makeEvent();

    applyAttack(event, attacks, { requestId: 'r1', characterId: 'c1', attackId: 'strike', now: 0 });
    const repeated = applyAttack(event, attacks, {
      requestId: 'r1',
      characterId: 'c1',
      attackId: 'strike',
      now: 1,
    });

    expect(repeated).toMatchObject({ ok: true, duplicate: true, damage: 100 });
    expect(event.hp).toBe(900);
    expect(event.damageLog).toHaveLength(1);
  });

  it('rejects attacks after the event expires', () => {
    const event = makeEvent();
    const result = applyAttack(event, attacks, {
      requestId: 'r1',
      characterId: 'c1',
      attackId: 'strike',
      now: 60_000,
    });

    expect(result).toMatchObject({ ok: false, reason: 'not-active' });
    expect(event.state).toBe('failed');
  });

  it('clamps damage to remaining hp and finishes the event', () => {
    const event = makeEvent(150);

    const first = applyAttack(event, attacks, {
      requestId: 'r1',
      characterId: 'c1',
      attackId: 'strike',
      now: 0,
    });
    const second = applyAttack(event, attacks, {
      requestId: 'r2',
      characterId: 'c1',
      attackId: 'heavy',
      now: 5_000,
    });

    expect(first).toMatchObject({ ok: true, damage: 100, hp: 50 });
    expect(second).toMatchObject({ ok: true, damage: 50, hp: 0, state: 'defeated' });
    expect(event.state).toBe('defeated');
  });

  it('rejects unknown attacks and characters', () => {
    const event = makeEvent();

    expect(
      applyAttack(event, attacks, { requestId: 'r1', characterId: 'c1', attackId: 'nope', now: 0 }),
    ).toMatchObject({ ok: false, reason: 'unknown-attack' });

    expect(
      applyAttack(event, attacks, { requestId: 'r2', characterId: 'ghost', attackId: 'strike', now: 0 }),
    ).toMatchObject({ ok: false, reason: 'unknown-character' });
  });
});

describe('leaderboard', () => {
  it('sorts by damage and breaks ties by the earlier first hit', () => {
    const event = createEvent({
      id: 'e1',
      bossId: 'b1',
      bossName: 'Boss',
      initialHp: 1_000,
      durationSeconds: 60,
      startedAt: 0,
      participants: [
        { characterId: 'c1', characterName: 'A', guildName: null, damage: 100, firstHitAt: 20 },
        { characterId: 'c2', characterName: 'B', guildName: null, damage: 100, firstHitAt: 10 },
      ],
    });

    const leaderboard = buildLeaderboard(event);

    expect(leaderboard.map((row) => row.characterId)).toEqual(['c2', 'c1']);
    expect(leaderboard[0]?.sharePercent).toBe(50);
  });
});

describe('snapshot', () => {
  it('reports time left and cooldowns for the character', () => {
    const event = makeEvent();

    applyAttack(event, attacks, { requestId: 'r1', characterId: 'c1', attackId: 'strike', now: 0 });
    const snapshot = getSnapshot(event, 'c1', 1_000);

    expect(snapshot.timeLeftSeconds).toBe(59);
    expect(snapshot.cooldowns.strike).toBe(5_000);
    expect(snapshot.hp).toBe(900);
  });
});
