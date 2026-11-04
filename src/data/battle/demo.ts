import type { LeaderboardEntry, PlayerCharacter } from '@/game/types/game';
import { attacks } from '@/data/attacks/attacks';

export const demoAttacks = attacks;

export const demoParty: readonly PlayerCharacter[] = [
  { id: 'p1', name: 'Морвен', faction: 'dark', level: 14, guildName: 'Пепельный круг', spriteBaseId: 'characters/hero', appearanceId: 'ash-knight' },
  { id: 'p2', name: 'Ильвена', faction: 'light', level: 12, guildName: 'Свет зари', spriteBaseId: 'characters/hero', appearanceId: 'horned' },
  { id: 'p3', name: 'Гхар', faction: 'dark', level: 16, guildName: null, spriteBaseId: 'characters/hero', appearanceId: 'wanderer' },
  { id: 'p4', name: 'Сестра Ода', faction: 'light', level: 11, guildName: 'Свет зари', spriteBaseId: 'characters/hero', appearanceId: 'ash-knight' },
  { id: 'p5', name: 'Тень', faction: 'dark', level: 9, guildName: 'Пепельный круг', spriteBaseId: 'characters/hero', appearanceId: 'horned' },
];

export const demoLeaderboard: readonly LeaderboardEntry[] = [
  { place: 1, characterId: 'p3', characterName: 'Гхар', guildName: null, damage: 812_400, sharePercent: 34.2 },
  { place: 2, characterId: 'p1', characterName: 'Морвен', guildName: 'Пепельный круг', damage: 641_900, sharePercent: 27.0 },
  { place: 3, characterId: 'p2', characterName: 'Ильвена', guildName: 'Свет зари', damage: 455_300, sharePercent: 19.1 },
  { place: 4, characterId: 'p4', characterName: 'Сестра Ода', guildName: 'Свет зари', damage: 287_100, sharePercent: 12.1 },
  { place: 5, characterId: 'p5', characterName: 'Тень', guildName: 'Пепельный круг', damage: 181_000, sharePercent: 7.6 },
];

