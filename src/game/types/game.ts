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
  timeLeftSeconds: number | null;
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
  timeLeftSeconds: number;
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

export type GuildRole = 'leader' | 'officer' | 'member';

export type GuildUpgradeStatus = 'available' | 'locked' | 'complete';

export type GuildMemberView = {
  id: string;
  name: string;
  role: GuildRole;
  level: number;
  damage: number;
  contribution: number;
};

export type GuildUpgradeView = {
  id: string;
  name: string;
  description: string;
  cost: number;
  invested: number;
  status: GuildUpgradeStatus;
};

export type GuildSummary = {
  id: string;
  name: string;
  emblemSpriteId: string;
  level: number;
  description: string;
  serverRank: number;
  progress: { current: number; required: number };
  members: GuildMemberView[];
  upgrades: GuildUpgradeView[];
  history: string[];
  rankings: { damage: number; bossesDefeated: number; contribution: number };
};
