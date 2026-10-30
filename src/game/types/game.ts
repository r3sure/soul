export type Faction = 'light' | 'dark';

export type ClipState = 'idle' | 'attack' | 'hit' | 'death';

export type BossState = 'upcoming' | 'active' | 'defeated' | 'failed';

export type DamageStage = {
  fromHpPercent: number;
  spriteId: string;
};

export type BossConfig = {
  id: string;
  name: string;
  tagline: string;
  state: BossState;
  initialHp: number;
  currentHp: number;
  durationMinutes: number;
  endTimeLabel: string | null;
  nextSpawnLabel: string | null;
  backgroundSpriteId: string;
  idleSpriteId: string;
  stages: DamageStage[];
  guaranteedReward: string;
  bonusRewards: string[];
};

export type AttackConfig = {
  id: string;
  name: string;
  description: string;
  iconSpriteId: string;
  baseDamage: number;
  cooldownSeconds: number;
};

export type LeaderboardEntry = {
  place: number;
  characterId: string;
  characterName: string;
  guildName: string | null;
  damage: number;
  sharePercent: number;
};

export type BattleEventView = {
  eventId: string;
  bossId: string;
  hp: number;
  initialHp: number;
  timeLeftLabel: string;
  participants: LeaderboardEntry[];
  featuredCharacterIds: string[];
};

export type PlayerCharacter = {
  id: string;
  name: string;
  faction: Faction;
  level: number;
  guildName: string | null;
  spriteBaseId: string;
};
