import { Link } from 'react-router-dom';
import { AssetImage } from '@/components/ui/AssetImage';
import { LocationLayout } from '@/components/ui/LocationLayout';
import { bosses } from '@/data/bosses/bosses';
import { formatDuration, formatNumber, formatPercent } from '@/lib/format';
import styles from './BossHallScreen.module.css';
import type { BossConfig, BossState } from '@/game/types/game';

const stateLabels: Record<BossState, string> = {
  active: 'Идёт бой',
  upcoming: 'Скоро',
  defeated: 'Побеждён',
  failed: 'Провален',
};

export function BossHallScreen() {
  return (
    <LocationLayout title="Дом боссов" sceneId="locations/boss-hall" backTo="/">
      <div className={styles.stage}>
        <div className={styles.grid}>
          {bosses.map((boss) => (
            <BossCard key={boss.id} boss={boss} />
          ))}
        </div>
      </div>
    </LocationLayout>
  );
}

function BossCard({ boss }: { boss: BossConfig }) {
  const hpPercent = (boss.currentHp / boss.initialHp) * 100;
  const isActive = boss.state === 'active';

  const content = (
    <>
      <div className={styles.portrait}>
        <AssetImage
          spriteId={boss.idleSpriteId}
          alt={`Босс: ${boss.name}`}
          className={styles.image}
          fallbackLabel={boss.name}
        />
        <span className={styles.state} data-state={boss.state}>
          {stateLabels[boss.state]}
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{boss.name}</h2>
        <p className={styles.tagline}>{boss.tagline}</p>

        {isActive ? (
          <>
            <div className={styles.hpTrack}>
              <span className={styles.hpFill} style={{ width: `${hpPercent}%` }} />
            </div>
            <div className={styles.statRow}>
              <span>
                HP {formatNumber(boss.currentHp)} / {formatNumber(boss.initialHp)}
              </span>
              <span>{formatPercent(hpPercent, 1)}</span>
            </div>
            <div className={styles.statRow}>
              <span>До конца</span>
              <span className={styles.timer}>{formatDuration(boss.timeLeftSeconds ?? 0)}</span>
            </div>
          </>
        ) : (
          <div className={styles.statRow}>
            <span>{boss.state === 'upcoming' ? 'Появление' : 'Следующий'}</span>
            <span>{boss.nextSpawnLabel ?? '—'}</span>
          </div>
        )}

        <div className={styles.rewards}>
          <span className={styles.rewardMain}>{boss.guaranteedReward}</span>
          <span className={styles.rewardBonus}>{boss.bonusRewards.join(' · ')}</span>
        </div>
      </div>
    </>
  );

  if (!isActive) {
    return <article className={styles.card}>{content}</article>;
  }

  return (
    <Link to={`/battle/${boss.id}`} className={styles.card} data-active="true">
      {content}
    </Link>
  );
}
