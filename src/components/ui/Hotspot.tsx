import { Link } from 'react-router-dom';
import styles from './Hotspot.module.css';

type HotspotProps = {
  to: string;
  label: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
};

export function Hotspot({ to, label, hint, className, disabled = false }: HotspotProps) {
  const classes = [styles.hotspot, className].filter(Boolean).join(' ');

  const body = (
    <>
      <span className={styles.label}>{label}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </>
  );

  if (disabled) {
    return (
      <div className={classes} data-disabled="true" aria-disabled="true">
        {body}
      </div>
    );
  }

  return (
    <Link to={to} className={classes}>
      {body}
    </Link>
  );
}
