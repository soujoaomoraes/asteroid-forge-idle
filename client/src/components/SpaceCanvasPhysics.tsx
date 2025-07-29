import React, { useEffect, useRef, useState } from 'react';
import { PhysicsService, PhysicsBody } from '../services/physicsService';
import { AsteroidService } from '../services/asteroidService';
import { MiningService } from '../services/miningService';
import { AutonomousShipService } from '../services/autonomousShipService';
import { Ship as AutonomousShip, ShipType } from '../types/ship';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SPEED = 0.5; // Força aplicada
const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 1200;

interface Ship {
  id: string;
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

interface SpaceCanvasPhysicsProps {
  onMiningFeedback?: (resources: any) => void;
  onDeployShip?: (type: ShipType) => void;
}

export function SpaceCanvasPhysics({ onMiningFeedback, onDeployShip }: SpaceCanvasPhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ship, setShip] = useState<Ship>({
    id: 'player-ship',
    position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    speed: SHIP_SPEED
  });

  const [stars, setStars] = useState<Star[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [asteroidService] = useState(() => new AsteroidService({ width: WORLD_WIDTH, height: WORLD_HEIGHT }));
  const [miningService] = useState(() => MiningService.getInstance());
  const [autonomousShipService] = useState(() => new AutonomousShipService());
  const [autonomousShips, setAutonomousShips] = useState<AutonomousShip[]>([]);
  const [miningMode, setMiningMode] = useState(false);
  const [lastMiningTime, setLastMiningTime] = useState(0);

  // Physics service
  const [physicsService] = useState(() => PhysicsService.getInstance());
  const [shipBody, setShipBody] = useState<PhysicsBody | null>(null);
  const [asteroidBodies, setAsteroidBodies] = useState<Map<string, PhysicsBody>>(new Map());
  const [particleBodies, setParticleBodies] = useState<Map<string, PhysicsBody>>(new Map());

  // Gerar estrelas iniciais
  useEffect(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      initialStars.push({
        id: `star-${i}`,
        position: {
          x: Math.random() * WORLD_WIDTH,
          y: Math.random() * WORLD_HEIGHT
        },
        brightness: Math.random() * 0.7 + 0.3
      });
    }
    setStars(initialStars);
  }, []);

  // Inicializar física
  useEffect(() => {
    // Inicializar mundo físico
    const world = physicsService.initialize(WORLD_WIDTH, WORLD_HEIGHT);
    
    // Criar nave física
    const shipPhysicsBody = physicsService.createShip(ship.position.x, ship.position.y);
    setShipBody(shipPhysicsBody);

    // Configurar colisões
    physicsService.onCollision((bodyA, bodyB) => {
      console.log('💥 Colisão:', bodyA.type, 'vs', bodyB.type);
      
      // Criar partículas de impacto
      if (bodyA.type === 'ship' && bodyB.type === 'asteroid') {
        createImpactParticles(bodyA.body.position.x, bodyA.body.position.y);
      }
    });

    // Iniciar física
    physicsService.start();

    return () => {
      physicsService.destroy();
    };
  }, [physicsService]);

  const createImpactParticles = (x: number, y: number) => {
    for (let i = 0; i < 5; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10
      };
      const particle = physicsService.createParticle(x, y, velocity, 1000);
      setParticleBodies(prev => new Map(prev).set(particle.id, particle));
    }
  };

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
  }, [autonomousShipService, onDeployShip]);

  // Loop de física
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;

    const physicsLoop = (currentTime: number) => {
      try {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Atualizar física
        physicsService.update(deltaTime);

        // Aplicar forças na nave baseado nas teclas
        if (shipBody) {
          let forceX = 0;
          let forceY = 0;

          if (keys.has('w') || keys.has('ArrowUp')) {
            forceY -= ship.speed;
          }
          if (keys.has('s') || keys.has('ArrowDown')) {
            forceY += ship.speed;
          }
          if (keys.has('a') || keys.has('ArrowLeft')) {
            forceX -= ship.speed;
          }
          if (keys.has('d') || keys.has('ArrowRight')) {
            forceX += ship.speed;
          }

          // Normalizar força diagonal
          if (forceX !== 0 && forceY !== 0) {
            forceX *= 0.707;
            forceY *= 0.707;
          }

          // Aplicar força
          if (forceX !== 0 || forceY !== 0) {
            physicsService.applyForce(shipBody.id, { x: forceX, y: forceY });
          }

          // Atualizar posição da nave
          const position = shipBody.body.position;
          const velocity = shipBody.body.velocity;
          setShip(prev => ({
            ...prev,
            position: { x: position.x, y: position.y },
            velocity: { x: velocity.x, y: velocity.y },
            rotation: shipBody.body.angle
          }));
        }

        // Mover estrelas em direção oposta ao movimento da nave
        setStars(prevStars => {
          return prevStars.map(star => {
            const newX = star.position.x - ship.velocity.x * 0.1;
            const newY = star.position.y - ship.velocity.y * 0.1;

            // Reposicionar estrelas que saíram do mundo
            let finalX = newX;
            let finalY = newY;

            if (newX < 0) {
              finalX = WORLD_WIDTH;
            } else if (newX > WORLD_WIDTH) {
              finalX = 0;
            }

            if (newY < 0) {
              finalY = WORLD_HEIGHT;
            } else if (newY > WORLD_HEIGHT) {
              finalY = 0;
            }

            return {
              ...star,
              position: { x: finalX, y: finalY }
            };
          });
        });

        // Atualizar asteroides usando o serviço
        asteroidService.update(deltaTime, ship.position);
        const serviceAsteroids = asteroidService.getAsteroids();
        
        // Criar corpos físicos para asteroides
        serviceAsteroids.forEach(asteroid => {
          if (!asteroidBodies.has(asteroid.id)) {
            const asteroidBody = physicsService.createAsteroid(asteroid.x, asteroid.y, asteroid.size, asteroid.type);
            setAsteroidBodies(prev => new Map(prev).set(asteroid.id, asteroidBody));
          }
        });

        // Atualizar naves autônomas
        autonomousShipService.updatePlayerPosition(ship.position.x, ship.position.y);
        setAutonomousShips(autonomousShipService.getShips());

        // Mineração automática
        if (miningMode) {
          const now = Date.now();
          if (now - lastMiningTime > 500) {
            const nearbyAsteroids = asteroidService.getAsteroidsInRange(ship.position.x, ship.position.y, 50);
            if (nearbyAsteroids.length > 0) {
              const closestAsteroid = nearbyAsteroids[0];
              const resources = asteroidService.mineAsteroid(closestAsteroid.id, 1);
              if (resources) {
                console.log('⛏️ Mineração:', resources);
                
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
        animationId = requestAnimationFrame(physicsLoop);
      } catch (error) {
        console.error('❌ Error in physics loop:', error);
        animationId = requestAnimationFrame(physicsLoop);
      }
    };

    // Iniciar loop
    animationId = requestAnimationFrame(physicsLoop);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        console.log('🎮 Physics loop stopped');
      }
    };
  }, [keys, ship.velocity, asteroidService, autonomousShipService, miningService, onMiningFeedback, shipBody, physicsService]);

  // Renderização
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

        // Desenhar fundo espacial
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#000814');
        gradient.addColorStop(1, '#001122');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Desenhar borda dos limites navegáveis do mundo
        const worldBorderLeft = 20 - ship.position.x + CANVAS_WIDTH / 2;
        const worldBorderTop = 20 - ship.position.y + CANVAS_HEIGHT / 2;
        const worldBorderRight = (WORLD_WIDTH - 20) - ship.position.x + CANVAS_WIDTH / 2;
        const worldBorderBottom = (WORLD_HEIGHT - 20) - ship.position.y + CANVAS_HEIGHT / 2;
        
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        
        ctx.beginPath();
        ctx.moveTo(worldBorderLeft, worldBorderTop);
        ctx.lineTo(worldBorderRight, worldBorderTop);
        ctx.lineTo(worldBorderRight, worldBorderBottom);
        ctx.lineTo(worldBorderLeft, worldBorderBottom);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        // Desenhar estrelas
        stars.forEach(star => {
          const screenX = star.position.x - ship.position.x + CANVAS_WIDTH / 2;
          const screenY = star.position.y - ship.position.y + CANVAS_HEIGHT / 2;

          if (screenX >= -10 && screenX <= CANVAS_WIDTH + 10 && 
              screenY >= -10 && screenY <= CANVAS_HEIGHT + 10) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Desenhar corpos físicos
        const allBodies = physicsService.getAllBodies();
        allBodies.forEach(physicsBody => {
          const screenX = physicsBody.body.position.x - ship.position.x + CANVAS_WIDTH / 2;
          const screenY = physicsBody.body.position.y - ship.position.y + CANVAS_HEIGHT / 2;

          if (screenX >= -50 && screenX <= CANVAS_WIDTH + 50 && 
              screenY >= -50 && screenY <= CANVAS_HEIGHT + 50) {
            
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(physicsBody.body.angle);

            if (physicsBody.type === 'ship') {
              // Desenhar nave
              ctx.fillStyle = '#00ff00';
              ctx.beginPath();
              ctx.moveTo(15, 0);
              ctx.lineTo(-10, -8);
              ctx.lineTo(-10, 8);
              ctx.closePath();
              ctx.fill();

              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.stroke();

              ctx.fillStyle = '#00ccff';
              ctx.beginPath();
              ctx.arc(5, 0, 3, 0, Math.PI * 2);
              ctx.fill();
            } else if (physicsBody.type === 'asteroid') {
              // Desenhar asteroide
              const color = physicsBody.data?.type === 'RARE' ? '#FFD700' : 
                           physicsBody.data?.type === 'EPIC' ? '#FF69B4' : '#8B4513';
              
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(0, 0, physicsBody.data?.size || 20, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;
              ctx.stroke();
            } else if (physicsBody.type === 'particle') {
              // Desenhar partícula
              ctx.fillStyle = '#FFD700';
              ctx.beginPath();
              ctx.arc(0, 0, 2, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }
        });

        // Desenhar naves autônomas
        autonomousShips.forEach(autonomousShip => {
          const screenX = autonomousShip.position.x - ship.position.x + CANVAS_WIDTH / 2;
          const screenY = autonomousShip.position.y - ship.position.y + CANVAS_HEIGHT / 2;

          if (screenX >= -20 && screenX <= CANVAS_WIDTH + 20 && 
              screenY >= -20 && screenY <= CANVAS_HEIGHT + 20) {
            
            ctx.save();
            ctx.translate(screenX, screenY);

            const shipColors = {
              [ShipType.SCOUT]: '#4CAF50',
              [ShipType.MINER]: '#FF9800',
              [ShipType.HAULER]: '#2196F3',
              [ShipType.DESTROYER]: '#F44336'
            };

            ctx.fillStyle = shipColors[autonomousShip.type];
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(autonomousShip.type.slice(0, 3), 0, -15);

            ctx.restore();
          }
        });

        // Continuar renderização
        renderId = requestAnimationFrame(render);
      } catch (error) {
        console.error('❌ Error rendering physics canvas:', error);
        renderId = requestAnimationFrame(render);
      }
    };

    // Iniciar renderização
    renderId = requestAnimationFrame(render);

    return () => {
      if (renderId) {
        cancelAnimationFrame(renderId);
        console.log('🎨 Physics render stopped');
      }
    };
  }, [ship, stars, autonomousShips, miningMode, physicsService]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white mb-4">🚀 Asteroid Forge Idle - Física Realista</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white"
      />
      <div className="mt-4 text-center text-sm text-white">
        <p>🎮 Use WASD ou Arrow Keys para mover a nave (física realista!)</p>
        <p>⛏️ Pressione SPACE para ativar modo de mineração</p>
        <p>🚀 Teclas 1-4 para deploy de naves autônomas</p>
        <p>💥 Colisões físicas ativas - asteroides têm massa real!</p>
        <p>🚀 Posição: ({Math.round(ship.position.x)}, {Math.round(ship.position.y)})</p>
        <p>⚡ Velocidade: ({ship.velocity.x.toFixed(1)}, {ship.velocity.y.toFixed(1)})</p>
        <p>⛏️ Modo Mineração: {miningMode ? 'ATIVO' : 'INATIVO'}</p>
        <p>🪨 Corpos Físicos: {physicsService.getAllBodies().length}</p>
        <p>🚀 Naves autônomas: {autonomousShips.length}</p>
      </div>
    </div>
  );
} 