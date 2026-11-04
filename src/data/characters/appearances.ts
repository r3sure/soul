import type { CharacterAppearance } from '@/game/types/game';

export const demoAppearances: readonly CharacterAppearance[] = [
  {
    id: 'wanderer',
    name: 'Странник',
    baseId: 'characters/hero',
    layers: [],
  },
  {
    id: 'ash-knight',
    name: 'Пепельный доспех',
    baseId: 'characters/hero-ash',
    layers: [
      { id: 'body-ash-mail', slot: 'body', spriteId: 'equipment/body/ash-mail' },
      { id: 'hands-ash-gauntlets', slot: 'hands', spriteId: 'equipment/body/ash-gauntlets' },
      { id: 'sword-ash-blade', slot: 'sword', spriteId: 'equipment/sword/ash-blade' },
    ],
  },
  {
    id: 'horned',
    name: 'Рогатый',
    baseId: 'characters/hero-horned',
    layers: [
      { id: 'horns-curved', slot: 'horns', spriteId: 'equipment/horns/curved' },
      { id: 'body-ember-cloak', slot: 'body', spriteId: 'equipment/body/ember-cloak' },
    ],
  },
];

export function findAppearance(appearanceId: string): CharacterAppearance {
  return demoAppearances.find((appearance) => appearance.id === appearanceId) ?? demoAppearances[0]!;
}
