import { ComingSoonScreen } from '@/components/ui/ComingSoonScreen';

export function TavernScreen() {
  return (
    <ComingSoonScreen
      title="Таверна"
      sceneId="locations/tavern"
      description="Социальная локация для дополнительных активностей. Механики ещё не определены."
      features={[
        'Социальные активности',
        'Дополнительные задания',
        'Место для будущих событий',
      ]}
    />
  );
}
