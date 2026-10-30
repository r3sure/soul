import { Link } from 'react-router-dom';
import { LocationLayout } from '@/components/ui/LocationLayout';
import styles from './ComingSoonScreen.module.css';

type ComingSoonScreenProps = {
  title: string;
  sceneId: string;
  description: string;
  features: string[];
};

export function ComingSoonScreen({ title, sceneId, description, features }: ComingSoonScreenProps) {
  return (
    <LocationLayout title={title} sceneId={sceneId} backTo="/">
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          <span className={styles.badge}>В разработке</span>
          <p className={styles.description}>{description}</p>
          <ul className={styles.features}>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Link to="/" className={styles.homeLink}>
            Вернуться на площадь
          </Link>
        </div>
      </div>
    </LocationLayout>
  );
}
