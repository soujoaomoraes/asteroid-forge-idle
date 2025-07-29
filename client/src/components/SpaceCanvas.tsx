import React, { useEffect, useRef, useState } from 'react';
import { Ship, Star, Vector2 } from '../types/game';
import { AsteroidService } from '../services/asteroidService';
import { Asteroid, AsteroidType } from '../types/asteroid';
import { MiningService } from '../services/miningService';
import { AutonomousShipService } from '../services/autonomousShipService';
import { Ship as AutonomousShip, ShipType } from '../types/ship';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SHIP_SPEED = 5;
const WORLD_WIDTH = 1600; // Dobro do canvas
const WORLD_HEIGHT = 1200; // Dobro do canvas

interface SpaceCanvasProps {
  onMiningFeedback?: (resources: any) => void;
  onDeployShip?: (type: ShipType) => void;
}

export function SpaceCanvas({ onMiningFeedback, onDeployShip }: SpaceCanvasProps) {
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
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [miningMode, setMiningMode] = useState(false);
  const [lastMiningTime, setLastMiningTime] = useState(0);
  const [miningService] = useState(() => MiningService.getInstance());
  const [lastMinedResources, setLastMinedResources] = useState<any>(null);
  const [autonomousShipService] = useState(() => new AutonomousShipService());
  const [autonomousShips, setAutonomousShips] = useState<AutonomousShip[]>([]);

      // Gerar estrelas iniciais
    useEffect(() => {
      const initialStars: Star[] = [];
      for (let i = 0; i < 200; i++) { // Mais estrelas para o mundo maior
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
      }
      if (event.key === '2') {
        event.preventDefault();
        onDeployShip?.(ShipType.MINER);
      }
      if (event.key === '3') {
        event.preventDefault();
        onDeployShip?.(ShipType.HAULER);
      }
      if (event.key === '4') {
        event.preventDefault();
        onDeployShip?.(ShipType.DESTROYER);
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
  }, []);

    // Loop de movimento
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      try {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

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

          // Manter nave dentro dos limites do mundo
          const boundedPosition = {
            x: Math.max(20, Math.min(WORLD_WIDTH - 20, newPosition.x)),
            y: Math.max(20, Math.min(WORLD_HEIGHT - 20, newPosition.y))
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
            const relativeX = star.position.x - ship.position.x;
            const relativeY = star.position.y - ship.position.y;
            
            // Mover estrelas baseado na velocidade da nave
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

        // Atualizar asteroides
        asteroidService.update(deltaTime, ship.position);
        setAsteroids(asteroidService.getAsteroids());

        // Atualizar naves autônomas
        autonomousShipService.updatePlayerPosition(ship.position.x, ship.position.y);
        autonomousShipService.updateShips(asteroids);
        setAutonomousShips(autonomousShipService.getShips());

        // Mineração automática quando em modo de mineração
        if (miningMode) {
          const now = Date.now();
          if (now - lastMiningTime > 500) { // Mineração a cada 500ms
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
                    setLastMinedResources(miningData);
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
        console.error('❌ Error in game loop:', error);
        // Continuar mesmo com erro
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    // Iniciar loop
    animationId = requestAnimationFrame(gameLoop);
    
    // Cleanup function mais robusta
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        console.log('🎮 Game loop stopped');
      }
    };
  }, [keys, ship.velocity, ship.position, asteroidService, autonomousShipService, miningService]);

    // Renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('❌ Canvas ref is null');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Could not get 2D context');
      return;
    }

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

    // Desenhar borda dos limites navegáveis do mundo (relativa à nave)
    // Limites do mundo: 20px das bordas (WORLD_WIDTH-40 x WORLD_HEIGHT-40)
    const worldBorderLeft = 20 - ship.position.x + CANVAS_WIDTH / 2;
    const worldBorderTop = 20 - ship.position.y + CANVAS_HEIGHT / 2;
    const worldBorderRight = (WORLD_WIDTH - 20) - ship.position.x + CANVAS_WIDTH / 2;
    const worldBorderBottom = (WORLD_HEIGHT - 20) - ship.position.y + CANVAS_HEIGHT / 2;
    
    // Desenhar borda tracejada ciano
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    
    // Desenhar retângulo dos limites do mundo
    ctx.beginPath();
    ctx.moveTo(worldBorderLeft, worldBorderTop);
    ctx.lineTo(worldBorderRight, worldBorderTop);
    ctx.lineTo(worldBorderRight, worldBorderBottom);
    ctx.lineTo(worldBorderLeft, worldBorderBottom);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Borda sólida mais visível
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(worldBorderLeft, worldBorderTop);
    ctx.lineTo(worldBorderRight, worldBorderTop);
    ctx.lineTo(worldBorderRight, worldBorderBottom);
    ctx.lineTo(worldBorderLeft, worldBorderBottom);
    ctx.closePath();
    ctx.stroke();

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

    // Desenhar asteroides
    asteroids.forEach(asteroid => {
      const screenX = asteroid.x - ship.position.x + CANVAS_WIDTH / 2;
      const screenY = asteroid.y - ship.position.y + CANVAS_HEIGHT / 2;

      // Só desenhar se estiver na tela
      if (screenX >= -asteroid.size && screenX <= CANVAS_WIDTH + asteroid.size && 
          screenY >= -asteroid.size && screenY <= CANVAS_HEIGHT + asteroid.size) {
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(asteroid.rotation);

        // Cor baseada no tipo
        const colors = {
          [AsteroidType.SMALL]: '#8B4513',
          [AsteroidType.MEDIUM]: '#696969',
          [AsteroidType.LARGE]: '#2F4F4F',
          [AsteroidType.RARE]: '#FFD700',
          [AsteroidType.EPIC]: '#FF69B4'
        };

        // Desenhar asteroide
        ctx.fillStyle = colors[asteroid.type];
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.size, 0, Math.PI * 2);
        ctx.fill();

        // Contorno
        ctx.strokeStyle = asteroid.isMining ? '#00ff00' : '#ffffff';
        ctx.lineWidth = asteroid.isMining ? 3 : 1;
        ctx.stroke();

        // Barra de vida (se não estiver cheia)
        if (asteroid.health < asteroid.maxHealth) {
          const healthRatio = asteroid.health / asteroid.maxHealth;
          const barWidth = asteroid.size * 2;
          const barHeight = 4;
          
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(-barWidth/2, -asteroid.size - 10, barWidth, barHeight);
          
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(-barWidth/2, -asteroid.size - 10, barWidth * healthRatio, barHeight);
        }

        ctx.restore();
      }
    });

    // Desenhar naves autônomas
    autonomousShips.forEach(autonomousShip => {
      const screenX = autonomousShip.position.x - ship.position.x + CANVAS_WIDTH / 2;
      const screenY = autonomousShip.position.y - ship.position.y + CANVAS_HEIGHT / 2;

      // Só desenhar se estiver na tela
      if (screenX >= -20 && screenX <= CANVAS_WIDTH + 20 && 
          screenY >= -20 && screenY <= CANVAS_HEIGHT + 20) {
        
        ctx.save();
        ctx.translate(screenX, screenY);

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

        // Indicador de status
        const statusColors = {
          'IDLE': '#4CAF50',
          'MINING': '#FF9800',
          'RETURNING': '#2196F3',
          'DEPLOYING': '#9C27B0'
        };

        // Pequeno indicador de status
        ctx.fillStyle = statusColors[autonomousShip.status] || '#757575';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Nome da nave
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(autonomousShip.type.slice(0, 3), 0, -15);

        // Carga (se houver)
        if (autonomousShip.currentCargo > 0) {
          ctx.fillStyle = '#FFD700';
          ctx.font = '8px Arial';
          ctx.fillText(`${autonomousShip.currentCargo}`, 0, 20);
        }

        ctx.restore();
      }
    });

    // Desenhar nave
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
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

    // Cockpit
    ctx.fillStyle = '#00ccff';
    ctx.beginPath();
    ctx.arc(5, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Motor (quando se move)
    if (ship.velocity.x !== 0 || ship.velocity.y !== 0) {
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(-12, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-16, 0, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

        // Continuar renderização
        renderId = requestAnimationFrame(render);
      } catch (error) {
        console.error('❌ Error rendering canvas:', error);
        // Continuar mesmo com erro
        renderId = requestAnimationFrame(render);
      }
    };

    // Iniciar renderização
    renderId = requestAnimationFrame(render);

    return () => {
      if (renderId) {
        cancelAnimationFrame(renderId);
        console.log('🎨 Render loop stopped');
      }
    };
  }, [ship, stars, asteroids, miningMode, autonomousShips]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="space-canvas"
      />
      <div className="mt-4 text-center text-sm text-white">
        <p>🎮 Use WASD ou Arrow Keys para mover a nave</p>
        <p>⛏️ Pressione SPACE para ativar modo de mineração</p>
        <p>🚀 Teclas 1-4 para deploy de naves autônomas</p>
        <p>🪨 Asteroides aparecem automaticamente ao redor da nave</p>
        <p>🚀 Posição: ({Math.round(ship.position.x)}, {Math.round(ship.position.y)})</p>
        <p>🌍 Mundo: {WORLD_WIDTH}x{WORLD_HEIGHT} (4x maior!)</p>
        <p>📏 Limites: 20px das bordas (borda ciano tracejada)</p>
        <p>⛏️ Modo Mineração: {miningMode ? 'ATIVO' : 'INATIVO'}</p>
        <p>🪨 Asteroides próximos: {asteroids.filter(a => 
          Math.sqrt(Math.pow(a.x - ship.position.x, 2) + Math.pow(a.y - ship.position.y, 2)) < 100
        ).length}</p>
      </div>
    </div>
  );
} 