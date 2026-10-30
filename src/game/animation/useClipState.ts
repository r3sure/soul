import { useCallback, useState } from 'react';
import type { ClipState } from '@/game/types/game';

export function useClipState(initial: ClipState = 'idle') {
  const [state, setState] = useState<ClipState>(initial);

  const play = useCallback((next: ClipState) => {
    setState(next);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
  }, []);

  return { state, play, reset };
}
