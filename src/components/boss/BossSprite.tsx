import { getSpriteUrl, hasSprite, isVideoUrl } from '@/assets/manifest';
import { ClipPlayer } from '@/components/ui/ClipPlayer';
import styles from './BossSprite.module.css';
import type { ClipState } from '@/game/types/game';

type BossSpriteProps = {
  baseId: string;
  stageSpriteId: string;
  label: string;
  hpPercent: number;
  state?: ClipState;
  className?: string;
};

export function BossSprite({
  baseId,
  stageSpriteId,
  label,
  hpPercent,
  state = 'idle',
  className,
}: BossSpriteProps) {
  const stateClip = state === 'idle' ? `${baseId}/idle` : `${baseId}/${state}`;
  const clipId = hasSprite(stateClip) ? stateClip : stageSpriteId;
  const clipUrl = getSpriteUrl(clipId);
  const animated = clipUrl ? isVideoUrl(clipUrl) : false;

  return (
    <div
      className={[styles.boss, className].filter(Boolean).join(' ')}
      data-hp={bucket(hpPercent)}
      data-state={state}
      data-clip={animated ? 'true' : 'false'}
    >
      <ClipPlayer
        clipId={clipId}
        label={label}
        loop={state === 'idle'}
        className={styles.sprite}
      />
    </div>
  );
}

function bucket(hpPercent: number): 'healthy' | 'hurt' | 'wounded' | 'critical' {
  if (hpPercent > 75) return 'healthy';
  if (hpPercent > 50) return 'hurt';
  if (hpPercent > 25) return 'wounded';
  return 'critical';
}
