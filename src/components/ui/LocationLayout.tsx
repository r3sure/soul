import { Link } from 'react-router-dom';
import { AssetImage } from '@/components/ui/AssetImage';
import styles from './LocationLayout.module.css';
import type { ReactNode } from 'react';

type LocationLayoutProps = {
  title: string;
  sceneId: string;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
};

export function LocationLayout({
  title,
  sceneId,
  backTo,
  backLabel = 'Назад',
  children,
}: LocationLayoutProps) {
  return (
    <section className={styles.location}>
      <AssetImage
        spriteId={sceneId}
        alt={`Фон локации «${title}»`}
        className={styles.background}
        fallbackLabel={title}
      />
      <div className={styles.vignette} aria-hidden="true" />
      <header className={styles.header}>
        {backTo ? (
          <Link to={backTo} className={styles.back}>
            <span aria-hidden="true">‹</span> {backLabel}
          </Link>
        ) : (
          <span className={styles.spacer} />
        )}
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.spacer} />
      </header>
      <main className={styles.content}>{children}</main>
    </section>
  );
}
