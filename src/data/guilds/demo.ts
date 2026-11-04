import type { GuildSummary } from '@/game/types/game';

export const demoGuild: GuildSummary = {
  id: 'ash-circle',
  name: 'Пепельный круг',
  emblemSpriteId: 'guilds/ash-circle/emblem',
  level: 3,
  description: 'Гильдия, что греется у последнего костра. Тени помнят каждого, кто здесь остался.',
  serverRank: 12,
  progress: { current: 12_400, required: 20_000 },
  members: [
    { id: 'p1', name: 'Морвен', role: 'leader', level: 14, damage: 812_400, contribution: 3_200 },
    { id: 'p3', name: 'Гхар', role: 'officer', level: 16, damage: 1_041_900, contribution: 2_450 },
    { id: 'p5', name: 'Тень', role: 'member', level: 9, damage: 181_000, contribution: 800 },
    { id: 'p6', name: 'Сет', role: 'member', level: 11, damage: 264_300, contribution: 1_150 },
  ],
  upgrades: [
    {
      id: 'soul-altar',
      name: 'Алтарь душ',
      description: 'Открывает общий запас частиц души для гильдии.',
      cost: 15_000,
      invested: 12_400,
      status: 'available',
    },
    {
      id: 'forge',
      name: 'Гильдейская кузня',
      description: 'Требует 4 уровня дома.',
      cost: 35_000,
      invested: 0,
      status: 'locked',
    },
    {
      id: 'library',
      name: 'Библиотека имён',
      description: 'Хранит историю побед и открывает архив рейтингов.',
      cost: 60_000,
      invested: 0,
      status: 'locked',
    },
  ],
  history: [
    'Дом достиг 3 уровня',
    'Побеждён Пепельный Страж',
    'Принят новый участник: Сет',
  ],
  rankings: {
    damage: 1_842_300,
    bossesDefeated: 17,
    contribution: 9_450,
  },
};
