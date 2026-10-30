import { CharacterSprite } from '@/components/character/CharacterSprite';
import { LocationLayout } from '@/components/ui/LocationLayout';
import styles from './PlayerHomeScreen.module.css';

const actions = [
  { label: 'Внешность', note: 'Сборка слоёв персонажа' },
  { label: 'Экипировка', note: 'Слоты и комплекты' },
  { label: 'Инвентарь', note: 'Предметы и редкость' },
  { label: 'Характеристики', note: 'Уровень и прогресс' },
];

export function PlayerHomeScreen() {
  return (
    <LocationLayout title="Дом игрока" sceneId="locations/player-home" backTo="/">
      <div className={styles.stage}>
        <div className={styles.characterSlot}>
          <CharacterSprite baseId="characters/hero" label="Морвен" />
        </div>

        <aside className={styles.panel}>
          <div className={styles.identity}>
            <span className={styles.name}>Морвен</span>
            <span className={styles.meta}>Тьма · 14 уровень · Пепельный круг</span>
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
            Системы персонажа появятся на этапе прогрессии и предметов.
          </p>
        </aside>
      </div>
    </LocationLayout>
  );
}
