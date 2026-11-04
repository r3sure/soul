import type { BossConfig } from '@/game/types/game';

export const bosses: readonly BossConfig[] = [
  {
    id: 'ash-warden',
    name: 'Пепельный Страж',
    tagline: 'Хранитель сгоревшего двора',
    state: 'active',
    initialHp: 5_000_000,
    currentHp: 3_600_000,
    durationMinutes: 240,
    timeLeftSeconds: 8048,
    nextSpawnLabel: null,
    backgroundSpriteId: 'locations/boss-arena',
    idleSpriteId: 'bosses/ash-warden/stage-1',
    stages: [
      { fromHpPercent: 76, spriteId: 'bosses/ash-warden/stage-1' },
      { fromHpPercent: 51, spriteId: 'bosses/ash-warden/stage-2' },
      { fromHpPercent: 26, spriteId: 'bosses/ash-warden/stage-3' },
      { fromHpPercent: 1, spriteId: 'bosses/ash-warden/stage-4' },
      { fromHpPercent: 0, spriteId: 'bosses/ash-warden/dead' },
    ],
    guaranteedReward: 'Сердце пепла ×1',
    bonusRewards: ['Души ×1200', 'Осколок короны'],
  },
  {
    id: 'hollow-bride',
    name: 'Полые Невесты',
    tagline: 'Три сестры одного проклятия',
    state: 'upcoming',
    initialHp: 8_000_000,
    currentHp: 8_000_000,
    durationMinutes: 180,
    timeLeftSeconds: null,
    nextSpawnLabel: 'через 3 ч 20 мин',
    backgroundSpriteId: 'locations/boss-crypt',
    idleSpriteId: 'bosses/hollow-bride/stage-1',
    stages: [
      { fromHpPercent: 51, spriteId: 'bosses/hollow-bride/stage-1' },
      { fromHpPercent: 1, spriteId: 'bosses/hollow-bride/stage-2' },
      { fromHpPercent: 0, spriteId: 'bosses/hollow-bride/dead' },
    ],
    guaranteedReward: 'Вуаль невесты ×1',
    bonusRewards: ['Души ×2000'],
  },
  {
    id: 'moth-king',
    name: 'Мотыльковый Король',
    tagline: 'Тот, кто помнит свет лампы',
    state: 'defeated',
    initialHp: 4_200_000,
    currentHp: 0,
    durationMinutes: 240,
    timeLeftSeconds: null,
    nextSpawnLabel: 'через 21 ч',
    backgroundSpriteId: 'locations/boss-garden',
    idleSpriteId: 'bosses/moth-king/stage-1',
    stages: [
      { fromHpPercent: 51, spriteId: 'bosses/moth-king/stage-1' },
      { fromHpPercent: 1, spriteId: 'bosses/moth-king/stage-2' },
      { fromHpPercent: 0, spriteId: 'bosses/moth-king/dead' },
    ],
    guaranteedReward: 'Крыло мотылька ×1',
    bonusRewards: ['Души ×900'],
  },
];

export function findBoss(bossId: string): BossConfig | undefined {
  return bosses.find((boss) => boss.id === bossId);
}
