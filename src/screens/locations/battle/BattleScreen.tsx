import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BossSprite } from '@/components/boss/BossSprite';
import { CharacterSprite } from '@/components/character/CharacterSprite';
import { AssetImage } from '@/components/ui/AssetImage';
import { LocationLayout } from '@/components/ui/LocationLayout';
import { demoAttacks, demoParty, buildDemoBattle } from '@/data/battle/demo';
import { findBoss } from '@/data/bosses/bosses';
import { useClipState } from '@/game/animation/useClipState';
import { resolveStageSprite } from '@/game/combat/stage';
import { formatNumber, formatPercent } from '@/lib/format';
import styles from './BattleScreen.module.css';
import type { PlayerCharacter } from '@/game/types/game';

const positions = ['front', 'left', 'right', 'backLeft', 'backRight'] as const;

export function BattleScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const resolvedEventId = eventId ?? 'ash-warden';

  return <BattleView key={resolvedEventId} eventId={resolvedEventId} />;
}

function BattleView({ eventId }: { eventId: string }) {
  const battle = buildDemoBattle(eventId);
  const boss = findBoss(battle.bossId);
  const { state: heroState, play: playHero, reset: resetHero } = useClipState();
  const { state: bossState, play: playBoss, reset: resetBoss } = useClipState();
  const [hp, setHp] = useState(battle.hp);
  const [cooldowns, setCooldowns] = useState<number[]>(() => demoAttacks.map(() => 0));
  const animationTimer = useRef<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCooldowns((current) => {
        if (!current.some((seconds) => seconds > 0)) {
          return current;
        }

        return current.map((seconds) => (seconds > 0 ? seconds - 1 : 0));
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (animationTimer.current !== null) {
        window.clearTimeout(animationTimer.current);
        animationTimer.current = null;
      }
    };
  }, []);

  if (!boss) {
    return null;
  }

  const hpPercent = (hp / battle.initialHp) * 100;
  const bossDefeated = hp <= 0;
  const stageSpriteId = resolveStageSprite(boss.stages, hpPercent);
  const featured = battle.featuredCharacterIds
    .map((id) => demoParty.find((character) => character.id === id))
    .filter((character): character is PlayerCharacter => Boolean(character));

  const handleAttack = (index: number) => {
    const attack = demoAttacks[index];
    const secondsLeft = cooldowns[index] ?? 0;

    if (!attack || secondsLeft > 0 || bossDefeated) {
      return;
    }

    setCooldowns((current) =>
      current.map((seconds, attackIndex) =>
        attackIndex === index ? attack.cooldownSeconds : seconds,
      ),
    );
    playHero('attack');
    playBoss('hit');
    setHp((current) => Math.max(0, current - Math.round(battle.initialHp * 0.04)));

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
          Демо: анимации, кулдауны и HP локальные, сервер ещё не подключён
        </span>

        <div className={styles.hud}>
          <div className={styles.bossPanel}>
            <div className={styles.bossMeta}>
              <span className={styles.bossName}>{boss.name}</span>
              <span className={styles.bossHp}>
                {formatNumber(hp)} / {formatNumber(battle.initialHp)} ·{' '}
                {formatPercent(hpPercent, 1)}
              </span>
            </div>
            <div className={styles.hpTrack}>
              <span className={styles.hpFill} style={{ width: `${hpPercent}%` }} />
            </div>
          </div>

          <div className={styles.timerBox}>
            <span className={styles.timerLabel}>До конца</span>
            <span className={styles.timerValue}>{battle.timeLeftLabel}</span>
          </div>

          <ol className={styles.miniBoard}>
            {battle.participants.slice(0, 3).map((entry) => (
              <li key={entry.characterId}>
                <span className={styles.miniPlace}>{entry.place}</span>
                <span className={styles.miniName}>{entry.characterName}</span>
                <span className={styles.miniDamage}>{formatNumber(entry.damage)}</span>
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

          {featured.map((character, index) => (
            <div
              key={character.id}
              className={[styles.fighter, styles[positions[index] ?? 'backLeft']]
                .filter(Boolean)
                .join(' ')}
            >
              <CharacterSprite
                baseId={character.spriteBaseId}
                label={character.name}
                state={index === 0 ? heroState : 'idle'}
                className={styles.fighterSprite}
              />
              <span className={styles.fighterName}>{character.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {demoAttacks.map((attack, index) => {
            const secondsLeft = cooldowns[index] ?? 0;
            const disabled = secondsLeft > 0 || bossDefeated;

            return (
              <button
                key={attack.id}
                type="button"
                className={styles.attack}
                disabled={disabled}
                onClick={() => handleAttack(index)}
              >
                <AssetImage
                  spriteId={attack.iconSpriteId}
                  alt={attack.name}
                  className={styles.attackIcon}
                  fallbackLabel={attack.name}
                />
                <span className={styles.attackBody}>
                  <span className={styles.attackName}>{attack.name}</span>
                  <span className={styles.attackDamage}>Урон {formatNumber(attack.baseDamage)}</span>
                </span>
                <span
                  className={styles.attackCooldown}
                  data-ready={secondsLeft === 0 && !bossDefeated ? 'true' : 'false'}
                >
                  {bossDefeated ? '—' : secondsLeft === 0 ? 'Готово' : `${secondsLeft} с`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </LocationLayout>
  );
}
