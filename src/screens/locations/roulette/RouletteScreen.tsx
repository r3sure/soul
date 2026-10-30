import { ComingSoonScreen } from '@/components/ui/ComingSoonScreen';

export function RouletteScreen() {
  return (
    <ComingSoonScreen
      title="Рулетка"
      sceneId="locations/roulette"
      description="Вращение с наградами. Вероятности и призы будут задаваться конфигурацией, результат определит сервер."
      features={[
        'Конфигурируемые призы и шансы',
        'Тестовая игровая валюта',
        'Результат только с сервера',
      ]}
    />
  );
}
