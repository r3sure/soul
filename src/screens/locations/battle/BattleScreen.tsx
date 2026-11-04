import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BossSprite } from '@/components/boss/BossSprite';
import { CharacterSprite } from '@/components/character/CharacterSprite';
import { AssetImage } from '@/components/ui/AssetImage';
import { LocationLayout } from '@/components/ui/LocationLayout';
import { demoAttacks, demoParty } from '@/data/battle/demo';
import { demoRewardRule } from '@/data/battle/rewards';
import { createDemoBattleSession } from '@/data/battle/session';
import { findBoss } from '@/data/bosses/bosses';
import { findAppearance } from '@/data/characters/appearances';
import { useClipState } from '@/game/animation/useClipState';
import { computeRewards } from '@/game/combat/rewards';
import { resolveStageSprite } from '@/game/combat/stage';
import { formatDuration, formatNumber, formatPercent } from '@/lib/format';
import styles from './BattleScreen.module.css';
import type { RewardEntry } from '@/game/combat/rewards';

const positions = ['front', 'left', 'right', 'backLeft', 'backRight'] as const;
const rewardLabels: Record<string, string> = { souls: 'Души' };

function nowMs(): number {
  return Date.now();
}

export function BattleScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const resolvedEventId = eventId ?? 'ash-warden';

  return <BattleView key={resolvedEventId} eventId={resolvedEventId} />;
}

function BattleView({ eventId }: { eventId: string }) {
  const boss = findBoss(eventId) ?? findBoss('ash-warden');
  const [session] = useState(() => (boss ? createDemoBattleSession(boss, nowMs()) : null));
  const { state: heroState, play: playHero, reset: resetHero } = useClipState();
  const { state: bossState, play: playBoss, reset: resetBoss } = useClipState();
  const [now, setNow] = useState(() => nowMs());
  const animationTimer = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const at = Date.now();
      session?.tick(at);
      setNow(at);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session]);

  useEffect(() => {
    return () => {
      if (animationTimer.current !== null) {
        window.clearTimeout(animationTimer.current);
      }
    };
  }, []);

  if (!boss || !session) {
    return null;
  }

  const snapshot = session.snapshot(now);
  const hpPercent = (snapshot.hp / snapshot.initialHp) * 100;
  const finished = snapshot.state !== 'active';
  const stageSpriteId = resolveStageSprite(boss.stages, hpPercent);
  const featured = demoParty.slice(0, 5);
  const actorGrant = finished
    ? computeRewards(session.event, demoRewardRule).find(
        (grant) => grant.characterId === session.actorId,
      )
    : undefined;

  const handleAttack = (attackId: string) => {
    if (finished) {
      return;
    }

    const result = session.attack(attackId, nowMs());
    setNow(nowMs());

    if (!result.ok) {
      return;
    }

    playHero('attack');
    playBoss('hit');

    if (animationTimer.current !== null) {
      window.clearTimeout(animationTimer.current);
    }

    animationTimer.current = window.setTimeout(() => {
      resetHero();
      resetBoss();
    }, 900);
  };

  return (
    <LocationLayout title={boss.name} sceneId={boss.backgroundSpriteId} backTo="/bosses">
      <div className={styles.stage}>
        <span className={styles.demoBadge}>
          Демо: бой считается локально, HP уменьшено для проверки, состояние живёт до перезагрузки
        </span>

        <div className={styles.hud}>
          <div className={styles.bossPanel}>
            <div className={styles.bossMeta}>
              <span className={styles.bossName}>{boss.name}</span>
              <span className={styles.bossHp}>
                {formatNumber(snapshot.hp)} / {formatNumber(snapshot.initialHp)} ·{' '}
                {formatPercent(hpPercent, 1)}
              </span>
            </div>
            <div className={styles.hpTrack}>
              <span className={styles.hpFill} style={{ width: `${hpPercent}%` }} />
            </div>
          </div>

          <div className={styles.timerBox}>
            <span className={styles.timerLabel}>До конца</span>
            <span className={styles.timerValue} data-expired={snapshot.state === 'failed'}>
              {formatDuration(snapshot.timeLeftSeconds)}
            </span>
          </div>

          <ol className={styles.miniBoard}>
            {snapshot.leaderboard.slice(0, 3).map((row) => (
              <li key={row.characterId}>
                <span className={styles.miniPlace}>{row.place}</span>
                <span className={styles.miniName}>{row.characterName}</span>
                <span className={styles.miniDamage}>{formatNumber(row.damage)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.arena}>
          <div className={styles.bossSlot}>
            <BossSprite
              baseId={`bosses/${boss.id}`}
              stageSpriteId={stageSpriteId}
              label={boss.name}
              hpPercent={hpPercent}
              state={bossState}
            />
          </div>

          {featured.map((character, index) => {
            const appearance = findAppearance(character.appearanceId);

            return (
              <div
                key={character.id}
                className={[styles.fighter, styles[positions[index] ?? 'backLeft']]
                  .filter(Boolean)
                  .join(' ')}
              >
                <CharacterSprite
                  baseId={appearance.baseId}
                  label={character.name}
                  state={index === 0 ? heroState : 'idle'}
                  layers={appearance.layers}
                  className={styles.fighterSprite}
                />
                <span className={styles.fighterName}>{character.name}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          {demoAttacks.map((attack) => {
            const readyAt = snapshot.cooldowns[attack.id];
            const secondsLeft = remainingSeconds(readyAt, now);
            const disabled = finished || secondsLeft > 0;

            return (
              <button
                key={attack.id}
                type="button"
                className={styles.attack}
                disabled={disabled}
                onClick={() => handleAttack(attack.id)}
              >
                <AssetImage
                  spriteId={attack.iconSpriteId}
                  alt={attack.name}
                  className={styles.attackIcon}
                  fallbackLabel={attack.name}
                />
                <span className={styles.attackBody}>
                  <span className={styles.attackName}>{attack.name}</span>
                  <span className={styles.attackDamage}>
                    Урон {formatNumber(attack.baseDamage)}
                  </span>
                </span>
                <span
                  className={styles.attackCooldown}
                  data-ready={!disabled ? 'true' : 'false'}
                >
                  {finished ? '—' : secondsLeft === 0 ? 'Готово' : `${secondsLeft} с`}
                </span>
              </button>
            );
          })}
        </div>

        {finished ? (
          <div className={styles.resultOverlay}>
            <div className={styles.resultPanel}>
              <span className={styles.resultBadge} data-result={snapshot.state}>
                {snapshot.state === 'defeated' ? 'Победа' : 'Провал'}
              </span>
              <h2 className={styles.resultTitle}>
                {snapshot.state === 'defeated' ? 'Босс повержен' : 'Время истекло'}
              </h2>
              <p className={styles.resultText}>
                {snapshot.state === 'defeated'
                  ? 'Награды начислены участникам с подтверждённым уроном.'
                  : 'Босс не убит. Начислены утешительные награды по урону.'}
              </p>

              <ol className={styles.resultBoard}>
                {snapshot.leaderboard.map((row) => (
                  <li key={row.characterId}>
                    <span className={styles.miniPlace}>{row.place}</span>
                    <span className={styles.resultName}>{row.characterName}</span>
                    <span className={styles.resultGuild}>{row.guildName ?? '—'}</span>
                    <span className={styles.miniDamage}>{formatNumber(row.damage)}</span>
                  </li>
                ))}
              </ol>

              {actorGrant && actorGrant.rewards.length > 0 ? (
                <div className={styles.resultRewards}>
                  <span className={styles.resultRewardsLabel}>Ваша награда</span>
                  <span className={styles.resultRewardsValue}>
                    {summarizeRewards(actorGrant.rewards)}
                  </span>
                </div>
              ) : null}

              <span className={styles.resultNote}>Результат сохранён локально (демо)</span>
            </div>
          </div>
        ) : null}
      </div>
    </LocationLayout>
  );
}

function remainingSeconds(readyAt: number | undefined, now: number): number {
  if (!readyAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((readyAt - now) / 1000));
}

function summarizeRewards(rewards: RewardEntry[]): string {
  const totals = new Map<string, number>();

  for (const reward of rewards) {
    totals.set(reward.id, (totals.get(reward.id) ?? 0) + reward.amount);
  }

  return [...totals.entries()]
    .map(([id, amount]) => `${rewardLabels[id] ?? id} +${formatNumber(amount)}`)
    .join(' · ');
}
