export type EventState = 'active' | 'defeated' | 'failed';

export type AttackDefinition = {
  id: string;
  name: string;
  baseDamage: number;
  cooldownSeconds: number;
};

export type CombatParticipantSeed = {
  characterId: string;
  characterName: string;
  guildName: string | null;
  damage?: number;
  firstHitAt?: number;
};

export type CombatParticipant = {
  characterId: string;
  characterName: string;
  guildName: string | null;
  damage: number;
  firstHitAt: number;
};

export type DamageLogEntry = {
  requestId: string;
  characterId: string;
  attackId: string;
  damage: number;
  at: number;
};

export type LeaderboardRow = {
  place: number;
  characterId: string;
  characterName: string;
  guildName: string | null;
  damage: number;
  sharePercent: number;
};

export type CombatEvent = {
  id: string;
  bossId: string;
  bossName: string;
  initialHp: number;
  hp: number;
  state: EventState;
  startedAt: number;
  endsAt: number;
  endedAt: number | null;
  participants: Map<string, CombatParticipant>;
  damageLog: DamageLogEntry[];
  cooldowns: Map<string, Map<string, number>>;
  results: Map<string, StoredResult>;
};

type StoredResult = {
  ok: true;
  damage: number;
  hp: number;
  state: EventState;
  readyAt: number | null;
};

export type AttackSuccess = StoredResult & { duplicate: boolean };

export type AttackFailure = {
  ok: false;
  reason: 'unknown-attack' | 'unknown-character' | 'not-active' | 'cooldown';
  readyAt?: number;
};

export type AttackResult = AttackSuccess | AttackFailure;

export type EventSnapshot = {
  id: string;
  bossId: string;
  bossName: string;
  initialHp: number;
  hp: number;
  state: EventState;
  startedAt: number;
  endsAt: number;
  endedAt: number | null;
  timeLeftSeconds: number;
  leaderboard: LeaderboardRow[];
  cooldowns: Record<string, number>;
};

type CreateEventInput = {
  id: string;
  bossId: string;
  bossName: string;
  initialHp: number;
  durationSeconds: number;
  startedAt: number;
  participants?: readonly CombatParticipantSeed[];
};

type AttackRequest = {
  requestId: string;
  characterId: string;
  attackId: string;
  now: number;
};

export function createEvent(input: CreateEventInput): CombatEvent {
  const participants = new Map<string, CombatParticipant>();

  for (const seed of input.participants ?? []) {
    participants.set(seed.characterId, {
      characterId: seed.characterId,
      characterName: seed.characterName,
      guildName: seed.guildName,
      damage: seed.damage ?? 0,
      firstHitAt: seed.firstHitAt ?? input.startedAt,
    });
  }

  return {
    id: input.id,
    bossId: input.bossId,
    bossName: input.bossName,
    initialHp: input.initialHp,
    hp: input.initialHp,
    state: 'active',
    startedAt: input.startedAt,
    endsAt: input.startedAt + input.durationSeconds * 1000,
    endedAt: null,
    participants,
    damageLog: [],
    cooldowns: new Map(),
    results: new Map(),
  };
}

export function expireEvent(event: CombatEvent, now: number): boolean {
  if (event.state === 'active' && now >= event.endsAt) {
    event.state = 'failed';
    event.endedAt = event.endsAt;
    return true;
  }

  return false;
}

export function applyAttack(
  event: CombatEvent,
  attacks: Readonly<Record<string, AttackDefinition>>,
  request: AttackRequest,
): AttackResult {
  const stored = event.results.get(request.requestId);

  if (stored) {
    return { ...stored, duplicate: true };
  }

  expireEvent(event, request.now);

  if (event.state !== 'active') {
    return { ok: false, reason: 'not-active' };
  }

  const attack = attacks[request.attackId];

  if (!attack) {
    return { ok: false, reason: 'unknown-attack' };
  }

  const participant = event.participants.get(request.characterId);

  if (!participant) {
    return { ok: false, reason: 'unknown-character' };
  }

  let cooldowns = event.cooldowns.get(request.characterId);

  if (!cooldowns) {
    cooldowns = new Map<string, number>();
    event.cooldowns.set(request.characterId, cooldowns);
  }

  const readyAt = cooldowns.get(request.attackId) ?? 0;

  if (request.now < readyAt) {
    return { ok: false, reason: 'cooldown', readyAt };
  }

  const damage = Math.min(attack.baseDamage, event.hp);
  const hadDamage = participant.damage > 0;

  event.hp -= damage;
  participant.damage += damage;

  if (!hadDamage) {
    participant.firstHitAt = request.now;
  }

  const nextReadyAt = request.now + attack.cooldownSeconds * 1000;
  cooldowns.set(request.attackId, nextReadyAt);

  event.damageLog.push({
    requestId: request.requestId,
    characterId: request.characterId,
    attackId: request.attackId,
    damage,
    at: request.now,
  });

  if (event.hp <= 0) {
    event.state = 'defeated';
    event.endedAt = request.now;
  }

  const result: StoredResult = {
    ok: true,
    damage,
    hp: event.hp,
    state: event.state,
    readyAt: nextReadyAt,
  };

  event.results.set(request.requestId, result);

  return { ...result, duplicate: false };
}

export function buildLeaderboard(event: CombatEvent): LeaderboardRow[] {
  const participants = [...event.participants.values()];
  const totalDamage = participants.reduce((sum, participant) => sum + participant.damage, 0);

  return participants
    .filter((participant) => participant.damage > 0)
    .sort((left, right) => right.damage - left.damage || left.firstHitAt - right.firstHitAt)
    .map((participant, index) => ({
      place: index + 1,
      characterId: participant.characterId,
      characterName: participant.characterName,
      guildName: participant.guildName,
      damage: participant.damage,
      sharePercent: totalDamage > 0 ? (participant.damage / totalDamage) * 100 : 0,
    }));
}

export function getSnapshot(event: CombatEvent, characterId: string, now: number): EventSnapshot {
  expireEvent(event, now);

  const characterCooldowns = event.cooldowns.get(characterId);

  return {
    id: event.id,
    bossId: event.bossId,
    bossName: event.bossName,
    initialHp: event.initialHp,
    hp: event.hp,
    state: event.state,
    startedAt: event.startedAt,
    endsAt: event.endsAt,
    endedAt: event.endedAt,
    timeLeftSeconds: Math.max(0, Math.ceil((event.endsAt - now) / 1000)),
    leaderboard: buildLeaderboard(event),
    cooldowns: characterCooldowns ? Object.fromEntries(characterCooldowns) : {},
  };
}
