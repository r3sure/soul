import { Hotspot } from '@/components/ui/Hotspot';
import { LocationLayout } from '@/components/ui/LocationLayout';
import styles from './PlazaScreen.module.css';

export function PlazaScreen() {
  return (
    <LocationLayout title="Площадь" sceneId="locations/plaza">
      <div className={styles.stage}>
        <Hotspot
          to="/home"
          label="Дом игрока"
          hint="Внешность и экипировка"
          className={styles.home}
        />
        <Hotspot
          to="/bosses"
          label="Дом боссов"
          hint="3 события"
          className={styles.bosses}
        />
        <Hotspot
          to="/guild"
          label="Дом гильдии"
          hint="Пепельный круг"
          className={styles.guild}
        />
        <Hotspot to="/tavern" label="Таверна" hint="Скоро" className={styles.tavern} />
        <Hotspot to="/roulette" label="Рулетка" hint="Скоро" className={styles.roulette} />

        <div className={styles.board} data-disabled="true" aria-disabled="true">
          <span className={styles.boardTitle}>Недельный рейтинг</span>
          <span className={styles.boardText}>Свет 42% · Тьма 58%</span>
          <span className={styles.boardHint}>демо-данные</span>
        </div>

        <div className={styles.factionBar}>
          <span className={styles.factionLight}>Свет</span>
          <span className={styles.factionTrack}>
            <span className={styles.factionFill} />
          </span>
          <span className={styles.factionDark}>Тьма</span>
        </div>
      </div>
    </LocationLayout>
  );
}
