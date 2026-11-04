import { getSpriteUrl, hasSprite, isVideoUrl } from '@/assets/manifest';
import { ClipPlayer } from '@/components/ui/ClipPlayer';
import styles from './CharacterSprite.module.css';
import type { CharacterLayer, ClipState } from '@/game/types/game';

type CharacterSpriteProps = {
  baseId: string;
  label: string;
  state?: ClipState;
  layers?: readonly CharacterLayer[];
  className?: string;
  onEnded?: () => void;
};

export function CharacterSprite({
  baseId,
  label,
  state = 'idle',
  layers = [],
  className,
  onEnded,
}: CharacterSpriteProps) {
  const stateClipId = `${baseId}/${state}`;
  const idleClipId = `${baseId}/idle`;
  const hasStateClip = hasSprite(stateClipId);
  const clipId = hasStateClip ? stateClipId : hasSprite(idleClipId) ? idleClipId : stateClipId;
  const clipUrl = getSpriteUrl(clipId);
  const animated = clipUrl ? isVideoUrl(clipUrl) : false;

  return (
    <div
      className={[styles.character, className].filter(Boolean).join(' ')}
      data-state={state}
      data-clip={animated ? 'true' : 'false'}
    >
      <ClipPlayer
        clipId={clipId}
        label={label}
        loop={state === 'idle'}
        className={styles.sprite}
        onEnded={onEnded}
      />
      {layers.map((layer) => (
        <SpriteLayer key={layer.id} layer={layer} />
      ))}
    </div>
  );
}

function SpriteLayer({ layer }: { layer: CharacterLayer }) {
  const url = getSpriteUrl(layer.spriteId);

  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      alt=""
      className={styles.layer}
      data-slot={layer.slot}
      draggable={false}
    />
  );
}

