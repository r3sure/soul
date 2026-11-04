const numberFormatter = new Intl.NumberFormat('ru-RU');

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(rest)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
