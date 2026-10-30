import type { DamageStage } from '@/game/types/game';

export function resolveStageSprite(stages: readonly DamageStage[], hpPercent: number): string {
  for (const stage of stages) {
    if (hpPercent >= stage.fromHpPercent) {
      return stage.spriteId;
    }
  }

  return stages[stages.length - 1]?.spriteId ?? '';
}
