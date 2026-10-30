import type { AttackConfig } from '@/game/types/game';

export const attacks: readonly AttackConfig[] = [
  {
    id: 'cleave',
    name: 'Рассечение',
    description: 'Широкий удар по корпусу. Надёжный базовый урон.',
    iconSpriteId: 'ui/attacks/cleave',
    baseDamage: 1200,
    cooldownSeconds: 6,
  },
  {
    id: 'soul-lance',
    name: 'Копьё души',
    description: 'Пробивает защиту и наносит повышенный урон.',
    iconSpriteId: 'ui/attacks/soul-lance',
    baseDamage: 3400,
    cooldownSeconds: 20,
  },
  {
    id: 'grave-chill',
    name: 'Могильный холод',
    description: 'Замедляет босса и снижает его сопротивление.',
    iconSpriteId: 'ui/attacks/grave-chill',
    baseDamage: 900,
    cooldownSeconds: 32,
  },
  {
    id: 'last-rite',
    name: 'Последний обряд',
    description: 'Редкий мощный удар. Требует накопленных душ.',
    iconSpriteId: 'ui/attacks/last-rite',
    baseDamage: 7200,
    cooldownSeconds: 90,
  },
];
