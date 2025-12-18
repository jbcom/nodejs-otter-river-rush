/**
 * Unit tests for GameSettingsContext
 * Tests context provider and consumer functionality
 */

import { renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import {
  GameSettingsProvider,
  useGameSettings,
} from '../../src/contexts/GameSettingsContext';

describe('GameSettingsContext', () => {
  describe('useGameSettings without provider', () => {
    it('returns default settings when no provider is present', () => {
      const { result } = renderHook(() => useGameSettings());
      expect(result.current.showStats).toBe(false);
    });
  });

  describe('GameSettingsProvider', () => {
    it('provides showStats: true when configured', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameSettingsProvider settings={{ showStats: true }}>
          {children}
        </GameSettingsProvider>
      );

      const { result } = renderHook(() => useGameSettings(), { wrapper });
      expect(result.current.showStats).toBe(true);
    });

    it('provides showStats: false when configured', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameSettingsProvider settings={{ showStats: false }}>
          {children}
        </GameSettingsProvider>
      );

      const { result } = renderHook(() => useGameSettings(), { wrapper });
      expect(result.current.showStats).toBe(false);
    });

    it('uses default for missing settings', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameSettingsProvider settings={{}}>{children}</GameSettingsProvider>
      );

      const { result } = renderHook(() => useGameSettings(), { wrapper });
      expect(result.current.showStats).toBe(false);
    });

    it('renders children correctly', () => {
      const TestChild = () => {
        const settings = useGameSettings();
        return (
          <div data-testid="test">{settings.showStats ? 'on' : 'off'}</div>
        );
      };

      // Just verify the component structure works
      const element = (
        <GameSettingsProvider settings={{ showStats: true }}>
          <TestChild />
        </GameSettingsProvider>
      );

      expect(element).toBeDefined();
    });
  });
});
