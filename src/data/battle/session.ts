import { attacks } from '@/data/attacks/attacks';
import { demoLeaderboard, demoParty } from '@/data/battle/demo';
import { applyAttack, createEvent, expireEvent, getSnapshot } from '@/game/combat/engine';
import type { AttackDefinition, AttackResult, CombatEvent, EventSnapshot } from '@/game/combat/engine';
import type { BossConfig } from '@/game/types/game';

const attacksById: Readonly<Record<string, AttackDefinition>> = Object.fromEntries(
  attacks.map((attack) => [attack.id, attack]),
);

const DEMO_HP_DIVISOR = 200;

export type DemoBattleSession = {
  boss: BossConfig;
  event: CombatEvent;
  actorId: string;
  snapshot: (now: number) => EventSnapshot;
  attack: (attackId: string, now: number) => AttackResult;
  tick: (now: number) => void;
};

export function createDemoBattleSession(boss: BossConfig, now: number): DemoBattleSession {
  const actor = demoParty[0];
  const initialHp = Math.max(8_000, Math.round(boss.initialHp / DEMO_HP_DIVISOR));

  const participants = demoParty.map((member, index) => {
    const seeded = demoLeaderboard.find((entry) => entry.characterId === member.id);

    return {
      characterId: member.id,
      characterName: member.name,
      guildName: member.guildName,
      damage: Math.round((seeded?.damage ?? 0) / DEMO_HP_DIVISOR),
      firstHitAt: now - 60_000 + index,
    };
  });

  const seededDamage = participants.reduce((sum, participant) => sum + participant.damage, 0);

  const event = createEvent({
    id: boss.id,
    bossId: boss.id,
    bossName: boss.name,
    initialHp,
    durationSeconds: boss.timeLeftSeconds ?? boss.durationMinutes * 60,
    startedAt: now,
    participants,
  });

  event.hp = Math.max(1, initialHp - seededDamage);

  let requestCounter = 0;

  return {
    boss,
    event,
    actorId: actor.id,
    snapshot: (at) => getSnapshot(event, actor.id, at),
    tick: (at) => {
      expireEvent(event, at);
    },
    attack: (attackId, at) => {
      requestCounter += 1;

      return applyAttack(event, attacksById, {
        requestId: `${event.id}:${actor.id}:${attackId}:${requestCounter}`,
        characterId: actor.id,
        attackId,
        now: at,
      });
    },
  };
}
