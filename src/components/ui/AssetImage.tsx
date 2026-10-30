import { getSpriteUrl } from '@/assets/manifest';
import styles from './AssetImage.module.css';

type AssetImageProps = {
  spriteId: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
};

export function AssetImage({ spriteId, alt, className, fallbackLabel }: AssetImageProps) {
  const url = getSpriteUrl(spriteId);

  if (url) {
    return <img src={url} alt={alt} className={className} draggable={false} />;
  }

  return (
    <div
      className={[styles.placeholder, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={alt}
    >
      <span className={styles.label}>{fallbackLabel ?? alt}</span>
      <span className={styles.hint}>{spriteId}</span>
    </div>
  );
}
