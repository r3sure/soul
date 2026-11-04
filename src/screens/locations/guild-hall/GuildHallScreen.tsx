import { AssetImage } from '@/components/ui/AssetImage';
import { LocationLayout } from '@/components/ui/LocationLayout';
import { demoGuild } from '@/data/guilds/demo';
import { formatNumber, formatPercent } from '@/lib/format';
import styles from './GuildHallScreen.module.css';
import type { GuildMemberView, GuildUpgradeView } from '@/game/types/game';

const roleLabels: Record<GuildMemberView['role'], string> = {
  leader: 'Глава',
  officer: 'Офицер',
  member: 'Участник',
};

const statusLabels: Record<GuildUpgradeView['status'], string> = {
  available: 'Доступно',
  locked: 'Закрыто',
  complete: 'Завершено',
};

export function GuildHallScreen() {
  const guild = demoGuild;
  const progressPercent = (guild.progress.current / guild.progress.required) * 100;

  return (
    <LocationLayout title="Дом гильдии" sceneId="locations/guild-hall" backTo="/">
      <div className={styles.stage}>
        <header className={styles.identity}>
          <AssetImage
            spriteId={guild.emblemSpriteId}
            alt={`Эмблема гильдии «${guild.name}»`}
            className={styles.emblem}
            fallbackLabel="Эмблема"
          />

          <div className={styles.identityBody}>
            <span className={styles.name}>{guild.name}</span>
            <span className={styles.meta}>
              Уровень {guild.level} · {guild.serverRank} место на сервере
            </span>
            <p className={styles.description}>{guild.description}</p>

            <div className={styles.progressRow}>
              <div className={styles.progressTrack}>
                <span className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
              </div>
              <span className={styles.progressText}>
                {formatNumber(guild.progress.current)} / {formatNumber(guild.progress.required)}
              </span>
            </div>
            <span className={styles.demoTag}>демо-данные</span>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Участники</h2>
            <ul className={styles.members}>
              {guild.members.map((member) => (
                <li key={member.id} className={styles.member}>
                  <span className={styles.memberName}>{member.name}</span>
                  <span className={styles.memberRole}>{roleLabels[member.role]}</span>
                  <span className={`${styles.memberStat} ${styles.memberLevel}`}>
                    {member.level} ур.
                  </span>
                  <span className={styles.memberStat}>{formatNumber(member.damage)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Улучшения дома</h2>
            <ul className={styles.upgrades}>
              {guild.upgrades.map((upgrade) => {
                const investedPercent = Math.min(100, (upgrade.invested / upgrade.cost) * 100);

                return (
                  <li key={upgrade.id} className={styles.upgrade} data-status={upgrade.status}>
                    <div className={styles.upgradeHead}>
                      <span className={styles.upgradeName}>{upgrade.name}</span>
                      <span className={styles.upgradeStatus}>{statusLabels[upgrade.status]}</span>
                    </div>
                    <p className={styles.upgradeText}>{upgrade.description}</p>
                    <div className={styles.upgradeProgress}>
                      <div className={styles.progressTrack}>
                        <span
                          className={styles.progressFill}
                          style={{ width: `${investedPercent}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {formatNumber(upgrade.invested)} / {formatNumber(upgrade.cost)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Рейтинги гильдии</h2>
            <p className={styles.cardNote}>
              Три показателя считаются отдельно и не суммируются напрямую.
            </p>
            <div className={styles.rankings}>
              <div className={styles.ranking}>
                <span className={styles.rankingValue}>{formatNumber(guild.rankings.damage)}</span>
                <span className={styles.rankingLabel}>Суммарный урон</span>
              </div>
              <div className={styles.ranking}>
                <span className={styles.rankingValue}>{guild.rankings.bossesDefeated}</span>
                <span className={styles.rankingLabel}>Побеждено боссов</span>
              </div>
              <div className={styles.ranking}>
                <span className={styles.rankingValue}>{formatNumber(guild.rankings.contribution)}</span>
                <span className={styles.rankingLabel}>Вложения</span>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>История достижений</h2>
            <ul className={styles.history}>
              {guild.history.map((entry) => (
                <li key={entry} className={styles.historyItem}>
                  {entry}
                </li>
              ))}
            </ul>
            <span className={styles.percentHint}>
              Прогресс дома: {formatPercent(progressPercent, 0)}
            </span>
          </section>
        </div>
      </div>
    </LocationLayout>
  );
}
