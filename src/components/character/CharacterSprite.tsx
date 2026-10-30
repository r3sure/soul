import { hasSprite } from '@/assets/manifest';
import { ClipPlayer } from '@/components/ui/ClipPlayer';
import styles from './CharacterSprite.module.css';
import type { ClipState } from '@/game/types/game';

type CharacterSpriteProps = {
  baseId: string;
  label: string;
  state?: ClipState;
  className?: string;
  onEnded?: () => void;
};

export function CharacterSprite({
  baseId,
  label,
  state = 'idle',
  className,
  onEnded,
}: CharacterSpriteProps) {
  const clipId = resolveClip(baseId, state);

  return (
    <div
      className={[styles.character, className].filter(Boolean).join(' ')}
      data-state={state}
      data-clip={hasSprite(clipId) ? 'true' : 'false'}
    >
      <ClipPlayer
        clipId={clipId}
        label={label}
        loop={state === 'idle'}
        className={styles.sprite}
        onEnded={onEnded}
      />
    </div>
  );
}

function resolveClip(baseId: string, state: ClipState): string {
  const candidate = `${baseId}/${state}`;

  if (hasSprite(candidate)) {
    return candidate;
  }

  const idle = `${baseId}/idle`;

  if (hasSprite(idle)) {
    return idle;
  }

  return candidate;
}
