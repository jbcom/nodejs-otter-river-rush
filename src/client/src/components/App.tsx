import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load game and UI components for better bundle splitting
const GameCanvas = lazy(() =>
  import('./game/GameCanvas').then((m) => ({ default: m.GameCanvas }))
);
const GameHUD = lazy(() =>
  import('./ui/GameHUD').then((m) => ({ default: m.GameHUD }))
);
const GameOver = lazy(() =>
  import('./ui/GameOver').then((m) => ({ default: m.GameOver }))
);
const MainMenu = lazy(() =>
  import('./ui/MainMenu').then((m) => ({ default: m.MainMenu }))
);

// Loading screen component
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-[100]">
      <div className="text-center space-y-4 px-6">
        <div className="text-6xl mb-4 otter-bounce">🦦</div>
        <h1 className="otter-title text-2xl md:text-3xl">Otter River Rush</h1>
        <div className="w-64 max-w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-blue-300 text-sm">
          {progress < 100 ? 'Preparing the river...' : 'Ready to splash!'}
        </p>
      </div>
    </div>
  );
}

export function App(): React.JSX.Element {
  const { status } = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Simulate initial load progress and mark ready after a brief initialization
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Small delay to ensure everything is mounted
        setTimeout(() => setIsReady(true), 200);
      }
      setLoadProgress(Math.min(progress, 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="text-6xl mb-4">🦦</div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4 text-slate-300 max-w-md">
              We're having trouble loading the game. This might be due to a poor
              network connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="otter-btn otter-btn-primary"
            >
              Reload Page
            </button>
          </div>
        }
      >
        <Suspense fallback={<LoadingScreen progress={loadProgress} />}>
          {/* Always render GameCanvas for instant scene readiness */}
          <GameCanvas showStats={import.meta.env.DEV} />

          {/* Show loading overlay until ready */}
          {!isReady && <LoadingScreen progress={loadProgress} />}

          {/* UI overlays */}
          {isReady && status === 'menu' && <MainMenu />}
          {(status === 'playing' || status === 'paused') && <GameHUD />}
          {status === 'game_over' && <GameOver />}

          {status === 'paused' && (
            <div
              id="pauseScreen"
              className="fixed inset-0 flex items-center justify-center pointer-events-auto game-bg-overlay z-50"
            >
              <div className="otter-panel w-full max-w-sm mx-4 splash-in">
                <h2 className="otter-subtitle text-center mb-6">Paused</h2>
                <div className="space-y-3">
                  <button
                    id="resumeButton"
                    onClick={() => useGameStore.getState().resumeGame()}
                    className="otter-btn otter-btn-primary w-full"
                  >
                    Resume
                  </button>
                  <button
                    id="quitButton"
                    onClick={() => useGameStore.getState().returnToMenu()}
                    className="otter-btn otter-btn-secondary w-full"
                  >
                    River Bank
                  </button>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
