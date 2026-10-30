import { getSpriteUrl, isVideoUrl } from '@/assets/manifest';
import { AssetImage } from './AssetImage';

type ClipPlayerProps = {
  clipId: string;
  label: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
};

export function ClipPlayer({ clipId, label, className, loop = true, onEnded }: ClipPlayerProps) {
  const url = getSpriteUrl(clipId);

  if (!url) {
    return (
      <AssetImage spriteId={clipId} alt={label} className={className} fallbackLabel={label} />
    );
  }

  if (isVideoUrl(url)) {
    return (
      <video
        key={url}
        className={className}
        src={url}
        autoPlay
        muted
        loop={loop}
        playsInline
        onEnded={onEnded}
        aria-label={label}
      />
    );
  }

  return <img src={url} alt={label} className={className} draggable={false} />;
}
