import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/AppLayout';
import { BattleScreen } from '@/screens/locations/battle/BattleScreen';
import { BossHallScreen } from '@/screens/locations/boss-hall/BossHallScreen';
import { GuildHallScreen } from '@/screens/locations/guild-hall/GuildHallScreen';
import { PlayerHomeScreen } from '@/screens/locations/player-home/PlayerHomeScreen';
import { PlazaScreen } from '@/screens/locations/plaza/PlazaScreen';
import { RouletteScreen } from '@/screens/locations/roulette/RouletteScreen';
import { TavernScreen } from '@/screens/locations/tavern/TavernScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <PlazaScreen /> },
      { path: 'home', element: <PlayerHomeScreen /> },
      { path: 'bosses', element: <BossHallScreen /> },
      { path: 'battle/:eventId', element: <BattleScreen /> },
      { path: 'guild', element: <GuildHallScreen /> },
      { path: 'tavern', element: <TavernScreen /> },
      { path: 'roulette', element: <RouletteScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
