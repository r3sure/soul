import { ComingSoonScreen } from '@/components/ui/ComingSoonScreen';

export function GuildHallScreen() {
  return (
    <ComingSoonScreen
      title="Дом гильдии"
      sceneId="locations/guild-hall"
      description="Общая сцена гильдии с уровнем дома, вкладами участников и отдельными рейтингами."
      features={[
        'Название, эмблема и уровень дома',
        'Вклады и визуальные стадии развития',
        'Рейтинги: урон, победы, вложения',
      ]}
    />
  );
}
