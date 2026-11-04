import { useEffect, useRef, useState } from 'react';
import { CharacterSprite } from '@/components/character/CharacterSprite';
import { LocationLayout } from '@/components/ui/LocationLayout';
import { demoAppearances, findAppearance } from '@/data/characters/appearances';
import { useClipState } from '@/game/animation/useClipState';
import styles from './PlayerHomeScreen.module.css';
import type { ClipState } from '@/game/types/game';

const actions = [
  { label: 'Внешность', note: 'Глаза, нос, рот' },
  { label: 'Экипировка', note: 'Слоты и комплекты' },
  { label: 'Инвентарь', note: 'Предметы и редкость' },
  { label: 'Характеристики', note: 'Уровень и прогресс' },
];

const previewStates: ReadonlyArray<{ id: ClipState; label: string }> = [
  { id: 'idle', label: 'Стойка' },
  { id: 'attack', label: 'Атака' },
  { id: 'hit', label: 'Удар' },
];

export function PlayerHomeScreen() {
  const [appearanceId, setAppearanceId] = useState(demoAppearances[0].id);
  const appearance = findAppearance(appearanceId);
  const { state, play, reset } = useClipState();
  const previewTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewTimer.current !== null) {
        window.clearTimeout(previewTimer.current);
      }
    };
  }, []);

  const preview = (next: ClipState) => {
    play(next);

    if (previewTimer.current !== null) {
      window.clearTimeout(previewTimer.current);
    }

    previewTimer.current = next === 'idle' ? null : window.setTimeout(() => reset(), 900);
  };

  return (
    <LocationLayout title="Дом игрока" sceneId="locations/player-home" backTo="/">
      <div className={styles.stage}>
        <div className={styles.characterSlot}>
          <CharacterSprite
            baseId={appearance.baseId}
            label="Морвен"
            state={state}
            layers={appearance.layers}
            onEnded={reset}
          />
        </div>

        <aside className={styles.panel}>
          <div className={styles.identity}>
            <span className={styles.name}>Морвен</span>
            <span className={styles.meta}>Тьма · 14 уровень · Пепельный круг</span>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Образ</span>
            <div className={styles.chips}>
              {demoAppearances.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={styles.chip}
                  data-active={variant.id === appearance.id ? 'true' : 'false'}
                  onClick={() => setAppearanceId(variant.id)}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Анимация</span>
            <div className={styles.chips}>
              {previewStates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  data-active={state === item.id ? 'true' : 'false'}
                  onClick={() => preview(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <nav className={styles.actions}>
            {actions.map((action) => (
              <button key={action.label} type="button" className={styles.action} disabled>
                <span className={styles.actionLabel}>{action.label}</span>
                <span className={styles.actionNote}>{action.note}</span>
              </button>
            ))}
          </nav>

          <p className={styles.note}>
            Слои и клипы пока на плейсхолдерах: появятся, когда в `sprites/` будут файлы.
          </p>
        </aside>
      </div>
    </LocationLayout>
  );
}
