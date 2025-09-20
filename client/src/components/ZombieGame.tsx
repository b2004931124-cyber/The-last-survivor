import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../lib/game/GameEngine';

const ZombieGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  const startGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
      setGameStarted(true);
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
      setGameStarted(true);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          backgroundColor: '#2a2a2a',
          cursor: 'crosshair'
        }}
      />
      
      {!gameStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Zombie Survival</h1>
          <p style={{ marginBottom: '20px' }}>
            Use WASD or Arrow Keys to move<br/>
            Hold Space or Mouse to shoot<br/>
            Press E to use items
          </p>
          <button
            onClick={startGame}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default ZombieGame;
