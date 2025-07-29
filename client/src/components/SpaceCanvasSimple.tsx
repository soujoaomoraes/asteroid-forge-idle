import React, { useEffect, useRef, useState } from 'react';
import { AsteroidService } from '../services/asteroidService';
import { MiningService } from '../services/miningService';
import { AutonomousShipService } from '../services/autonomousShipService';
import { Ship as AutonomousShip, ShipType } from '../types/ship';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SPEED = 5;

interface Ship {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  rotation: number;
  speed: number;
}

interface Star {
  id: string;
  position: { x: number; y: number };
  brightness: number;
}

interface Asteroid {
  id: string;
  x: number;
  y: number;
  size: number;
  type: string;
  health: number;
  maxHealth: number;
  rotation: number;
  isMining: boolean;
}

interface SpaceCanvasSimpleProps {
  onMiningFeedback?: (resources: any) => void;
  onDeployShip?: (type: ShipType) => void;
}

export function SpaceCanvasSimple({ onMiningFeedback, onDeployShip }: SpaceCanvasSimpleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ship, setShip] = useState<Ship>({
    position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    speed: SHIP_SPEED
  });

  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [stars, setStars] = useState<Star[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [asteroidService] = useState(() => new AsteroidService({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }));
  const [miningService] = useState(() => MiningService.getInstance());
  const [autonomousShipService] = useState(() => new AutonomousShipService());
  const [autonomousShips, setAutonomousShips] = useState<AutonomousShip[]>([]);
  const [miningMode, setMiningMode] = useState(false);
  const [lastMiningTime, setLastMiningTime] = useState(0);

  // Gerar estrelas iniciais
  useEffect(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      initialStars.push({
        id: `star-${i}`,
        position: {
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT
        },
        brightness: Math.random() * 0.7 + 0.3
      });
    }
    setStars(initialStars);
  }, []);

  // Gerar asteroides iniciais
  useEffect(() => {
    const initialAsteroids: Asteroid[] = [];
    for (let i = 0; i < 20; i++) {
      initialAsteroids.push({
        id: `asteroid-${i}`,
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 15 + 10,
        type: 'SMALL',
        health: 100,
        maxHealth: 100,
        rotation: Math.random() * Math.PI * 2,
        isMining: false
      });
    }
    setAsteroids(initialAsteroids);
  }, []);

  // Controles de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(event.key));
      
      // Toggle modo de mineração com SPACE
      if (event.key === ' ') {
        event.preventDefault();
        setMiningMode(prev => !prev);
      }
      
      // Deploy naves com teclas numéricas
      if (event.key === '1') {
        event.preventDefault();
        onDeployShip?.(ShipType.SCOUT);
        autonomousShipService.deployShip(ShipType.SCOUT, ship.position.x, ship.position.y);
      }
      if (event.key === '2') {
        event.preventDefault();
        onDeployShip?.(ShipType.MINER);
        autonomousShipService.deployShip(ShipType.MINER, ship.position.x, ship.position.y);
      }
      if (event.key === '3') {
        event.preventDefault();
        onDeployShip?.(ShipType.HAULER);
        autonomousShipService.deployShip(ShipType.HAULER, ship.position.x, ship.position.y);
      }
      if (event.key === '4') {
        event.preventDefault();
        onDeployShip?.(ShipType.DESTROYER);
        autonomousShipService.deployShip(ShipType.DESTROYER, ship.position.x, ship.position.y);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [autonomousShipService]);

  // Loop de movimento simples
  useEffect(() => {
    let animationId: number;

    const gameLoop = () => {
      try {
        setShip(prevShip => {
          let newVelocity = { ...prevShip.velocity };
          let newRotation = prevShip.rotation;

          // Movimento baseado nas teclas pressionadas
          if (keys.has('w') || keys.has('ArrowUp')) {
            newVelocity.y -= prevShip.speed;
          }
          if (keys.has('s') || keys.has('ArrowDown')) {
            newVelocity.y += prevShip.speed;
          }
          if (keys.has('a') || keys.has('ArrowLeft')) {
            newVelocity.x -= prevShip.speed;
          }
          if (keys.has('d') || keys.has('ArrowRight')) {
            newVelocity.x += prevShip.speed;
          }

          // Normalizar movimento diagonal
          if (newVelocity.x !== 0 && newVelocity.y !== 0) {
            newVelocity.x *= 0.707;
            newVelocity.y *= 0.707;
          }

          // Calcular rotação baseada na velocidade
          if (newVelocity.x !== 0 || newVelocity.y !== 0) {
            newRotation = Math.atan2(newVelocity.y, newVelocity.x);
          }

          // Aplicar velocidade à posição
          const newPosition = {
            x: prevShip.position.x + newVelocity.x,
            y: prevShip.position.y + newVelocity.y
          };

          // Manter nave dentro dos limites
          const boundedPosition = {
            x: Math.max(20, Math.min(CANVAS_WIDTH - 20, newPosition.x)),
            y: Math.max(20, Math.min(CANVAS_HEIGHT - 20, newPosition.y))
          };

          return {
            ...prevShip,
            position: boundedPosition,
            velocity: newVelocity,
            rotation: newRotation
          };
        });

        // Mover estrelas em direção oposta ao movimento da nave
        setStars(prevStars => {
          return prevStars.map(star => {
            const newX = star.position.x - ship.velocity.x * 0.1;
            const newY = star.position.y - ship.velocity.y * 0.1;

            // Reposicionar estrelas que saíram da tela
            let finalX = newX;
            let finalY = newY;

            if (newX < 0) {
              finalX = CANVAS_WIDTH;
            } else if (newX > CANVAS_WIDTH) {
              finalX = 0;
            }

            if (newY < 0) {
              finalY = CANVAS_HEIGHT;
            } else if (newY > CANVAS_HEIGHT) {
              finalY = 0;
            }

            return {
              ...star,
              position: { x: finalX, y: finalY }
            };
          });
        });

        // Atualizar asteroides usando o serviço
        asteroidService.update(16, ship.position);
        const serviceAsteroids = asteroidService.getAsteroids();
        setAsteroids(serviceAsteroids.map(asteroid => ({
          id: asteroid.id,
          x: asteroid.x,
          y: asteroid.y,
          size: asteroid.size,
          type: asteroid.type,
          health: asteroid.health,
          maxHealth: asteroid.maxHealth,
          rotation: asteroid.rotation,
          isMining: asteroid.isMining
        })));

        // Atualizar naves autônomas (simplificado)
        autonomousShipService.updatePlayerPosition(ship.position.x, ship.position.y);
        setAutonomousShips(autonomousShipService.getShips());

        // Mineração automática quando em modo de mineração
        if (miningMode) {
          const now = Date.now();
          if (now - lastMiningTime > 500) {
            const nearbyAsteroids = asteroidService.getAsteroidsInRange(ship.position.x, ship.position.y, 50);
            if (nearbyAsteroids.length > 0) {
              const closestAsteroid = nearbyAsteroids[0];
              const resources = asteroidService.mineAsteroid(closestAsteroid.id, 1);
              if (resources) {
                console.log('⛏️ Mineração:', resources);
                
                // Adicionar recursos ao sistema via API
                miningService.addMinedResources(resources).then((success: boolean) => {
                  if (success) {
                    const miningData = {
                      resources,
                      timestamp: now
                    };
                    onMiningFeedback?.(miningData);
                  }
                });
              }
            }
            setLastMiningTime(now);
          }
        }

        // Continuar loop
        animationId = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('❌ Error in simple game loop:', error);
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    // Iniciar loop
    animationId = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        console.log('🎮 Simple game loop stopped');
      }
    };
  }, [keys, ship.velocity, asteroidService, autonomousShipService]);

  // Renderização simples
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderId: number;

    const render = () => {
      try {
        // Limpar canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Desenhar fundo
        ctx.fillStyle = '#000814';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Desenhar estrelas
        stars.forEach(star => {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
          ctx.beginPath();
          ctx.arc(star.position.x, star.position.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });

        // Desenhar asteroides
        asteroids.forEach(asteroid => {
          ctx.save();
          ctx.translate(asteroid.x, asteroid.y);
          ctx.rotate(asteroid.rotation);

          // Desenhar asteroide
          ctx.fillStyle = '#8B4513';
          ctx.beginPath();
          ctx.arc(0, 0, asteroid.size, 0, Math.PI * 2);
          ctx.fill();

          // Contorno
          ctx.strokeStyle = asteroid.isMining ? '#00ff00' : '#ffffff';
          ctx.lineWidth = asteroid.isMining ? 3 : 1;
          ctx.stroke();

          ctx.restore();
        });

        // Desenhar naves autônomas
        autonomousShips.forEach(autonomousShip => {
          ctx.save();
          ctx.translate(autonomousShip.position.x, autonomousShip.position.y);

          // Cor baseada no tipo de nave
          const shipColors = {
            [ShipType.SCOUT]: '#4CAF50',
            [ShipType.MINER]: '#FF9800',
            [ShipType.HAULER]: '#2196F3',
            [ShipType.DESTROYER]: '#F44336'
          };

          // Desenhar nave autônoma (círculo menor)
          ctx.fillStyle = shipColors[autonomousShip.type];
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();

          // Contorno
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Nome da nave
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(autonomousShip.type.slice(0, 3), 0, -15);

          ctx.restore();
        });

        // Desenhar nave
        ctx.save();
        ctx.translate(ship.position.x, ship.position.y);
        ctx.rotate(ship.rotation);

        // Corpo da nave (triângulo)
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-10, 8);
        ctx.closePath();
        ctx.fill();

        // Contorno da nave
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Continuar renderização
        renderId = requestAnimationFrame(render);
      } catch (error) {
        console.error('❌ Error in simple render:', error);
        renderId = requestAnimationFrame(render);
      }
    };

    // Iniciar renderização
    renderId = requestAnimationFrame(render);

    return () => {
      if (renderId) {
        cancelAnimationFrame(renderId);
        console.log('🎨 Simple render stopped');
      }
    };
  }, [ship, stars, asteroids, autonomousShips]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white mb-4">🚀 Asteroid Forge Idle - Versão Estável</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white"
      />
      <div className="mt-4 text-center text-sm text-white">
        <p>🎮 Use WASD ou Arrow Keys para mover a nave</p>
        <p>⛏️ Pressione SPACE para ativar modo de mineração</p>
        <p>🚀 Teclas 1-4 para deploy de naves autônomas</p>
        <p>🪨 Asteroides aparecem automaticamente ao redor da nave</p>
        <p>🚀 Posição: ({Math.round(ship.position.x)}, {Math.round(ship.position.y)})</p>
        <p>⛏️ Modo Mineração: {miningMode ? 'ATIVO' : 'INATIVO'}</p>
        <p>🪨 Asteroides próximos: {asteroids.filter(a => 
          Math.sqrt(Math.pow(a.x - ship.position.x, 2) + Math.pow(a.y - ship.position.y, 2)) < 100
        ).length}</p>
        <p>🚀 Naves autônomas: {autonomousShips.length}</p>
      </div>
    </div>
  );
} 