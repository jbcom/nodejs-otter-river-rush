/**
 * Game Settings Context
 *
 * Provides game configuration settings to all components.
 */

import React, { createContext, useContext } from 'react';

export interface GameSettings {
  /** Show performance stats overlay */
  showStats: boolean;
}

const defaultSettings: GameSettings = {
  showStats: false,
};

const GameSettingsContext = createContext<GameSettings>(defaultSettings);

export interface GameSettingsProviderProps {
  settings: Partial<GameSettings>;
  children: React.ReactNode;
}

export function GameSettingsProvider({
  settings,
  children,
}: GameSettingsProviderProps): React.JSX.Element {
  const mergedSettings: GameSettings = {
    ...defaultSettings,
    ...settings,
  };

  return (
    <GameSettingsContext.Provider value={mergedSettings}>
      {children}
    </GameSettingsContext.Provider>
  );
}

export function useGameSettings(): GameSettings {
  return useContext(GameSettingsContext);
}
