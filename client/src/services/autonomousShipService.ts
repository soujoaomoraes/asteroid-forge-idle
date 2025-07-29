import { Ship, ShipType, ShipStatus, SHIP_CONFIGS } from '../types/ship';
import { Asteroid } from '../types/asteroid';

export class AutonomousShipService {
  private ships: Map<string, Ship> = new Map();
  private playerPosition = { x: 0, y: 0 };

  constructor() {
    console.log('🚀 Autonomous Ship Service initialized');
  }

  // Deploy uma nova nave
  public deployShip(type: ShipType, playerX: number, playerY: number): Ship | null {
    const config = SHIP_CONFIGS[type];
    if (!config) {
      console.error('❌ Invalid ship type:', type);
      return null;
    }

    const ship: Ship = {
      id: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: ShipStatus.DEPLOYING,
      position: { x: playerX, y: playerY },
      speed: config.stats.speed,
      miningSpeed: config.stats.miningSpeed,
      capacity: config.stats.capacity,
      currentCargo: 0,
      health: config.stats.health,
      maxHealth: config.stats.health,
      deployedAt: new Date()
    };

    this.ships.set(ship.id, ship);
    console.log(`🚀 Deployed ${config.name} ship:`, ship.id);
    return ship;
  }

  // Atualizar posição do jogador
  public updatePlayerPosition(x: number, y: number): void {
    this.playerPosition = { x, y };
  }

  // Atualizar todas as naves
  public updateShips(asteroids: Asteroid[]): void {
    this.ships.forEach((ship, shipId) => {
      this.updateShip(ship, asteroids);
    });
  }

  // Atualizar uma nave específica
  private updateShip(ship: Ship, asteroids: Asteroid[]): void {
    switch (ship.status) {
      case ShipStatus.DEPLOYING:
        this.handleDeploying(ship);
        break;
      case ShipStatus.IDLE:
        this.handleIdle(ship, asteroids);
        break;
      case ShipStatus.MINING:
        this.handleMining(ship, asteroids);
        break;
      case ShipStatus.RETURNING:
        this.handleReturning(ship);
        break;
    }
  }

  // Lógica para nave se deployando
  private handleDeploying(ship: Ship): void {
    // Mover para uma posição aleatória próxima ao jogador
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const targetX = this.playerPosition.x + Math.cos(angle) * distance;
    const targetY = this.playerPosition.y + Math.sin(angle) * distance;

    ship.target = { x: targetX, y: targetY };
    
    // Mover em direção ao alvo
    const dx = targetX - ship.position.x;
    const dy = targetY - ship.position.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

    if (distanceToTarget < 10) {
      ship.status = ShipStatus.IDLE;
      ship.target = undefined;
      console.log(`🚀 Ship ${ship.id} deployed successfully`);
    } else {
      const moveX = (dx / distanceToTarget) * ship.speed;
      const moveY = (dy / distanceToTarget) * ship.speed;
      ship.position.x += moveX;
      ship.position.y += moveY;
    }
  }

  // Lógica para nave idle (procurando asteroides)
  private handleIdle(ship: Ship, asteroids: Asteroid[]): void {
    // Procurar asteroide mais próximo
    const nearestAsteroid = this.findNearestAsteroid(ship, asteroids);
    
    if (nearestAsteroid) {
      const distance = this.getDistance(ship.position, { x: nearestAsteroid.x, y: nearestAsteroid.y });
      
      if (distance < 50) {
        // Próximo o suficiente para minerar
        ship.status = ShipStatus.MINING;
        ship.target = { x: nearestAsteroid.x, y: nearestAsteroid.y };
        console.log(`⛏️ Ship ${ship.id} started mining asteroid`);
      } else {
        // Mover em direção ao asteroide
        ship.target = { x: nearestAsteroid.x, y: nearestAsteroid.y };
        const dx = nearestAsteroid.x - ship.position.x;
        const dy = nearestAsteroid.y - ship.position.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        
        const moveX = (dx / distanceToTarget) * ship.speed;
        const moveY = (dy / distanceToTarget) * ship.speed;
        ship.position.x += moveX;
        ship.position.y += moveY;
      }
    } else {
      // Nenhum asteroide encontrado, voltar para o jogador
      ship.status = ShipStatus.RETURNING;
    }
  }

  // Lógica para nave minerando
  private handleMining(ship: Ship, asteroids: Asteroid[]): void {
    const now = Date.now();
    const lastMining = ship.lastMiningTime?.getTime() || 0;
    
    // Minerar a cada 2 segundos
    if (now - lastMining > 2000) {
      // Encontrar asteroide sendo minerado
      const targetAsteroid = asteroids.find(asteroid => 
        Math.abs(asteroid.x - ship.target!.x) < 10 && 
        Math.abs(asteroid.y - ship.target!.y) < 10
      );

      if (targetAsteroid && targetAsteroid.health > 0) {
        // Minerar recursos
        const miningAmount = Math.min(ship.miningSpeed, targetAsteroid.health);
        targetAsteroid.health -= miningAmount;
        ship.currentCargo += miningAmount;
        ship.lastMiningTime = new Date();

        console.log(`⛏️ Ship ${ship.id} mined ${miningAmount} resources`);

        // Se asteroide destruído ou nave cheia, voltar
        if (targetAsteroid.health <= 0 || ship.currentCargo >= ship.capacity) {
          ship.status = ShipStatus.RETURNING;
          ship.target = undefined;
        }
      } else {
        // Asteroide não encontrado ou destruído
        ship.status = ShipStatus.IDLE;
        ship.target = undefined;
      }
    }
  }

  // Lógica para nave retornando
  private handleReturning(ship: Ship): void {
    const distanceToPlayer = this.getDistance(ship.position, this.playerPosition);
    
    if (distanceToPlayer < 30) {
      // Chegou ao jogador, descarregar recursos
      if (ship.currentCargo > 0) {
        console.log(`📦 Ship ${ship.id} delivered ${ship.currentCargo} resources`);
        // Aqui você pode integrar com o sistema de recursos
        ship.currentCargo = 0;
      }
      
      ship.status = ShipStatus.IDLE;
      ship.target = undefined;
    } else {
      // Mover em direção ao jogador
      const dx = this.playerPosition.x - ship.position.x;
      const dy = this.playerPosition.y - ship.position.y;
      const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
      
      const moveX = (dx / distanceToTarget) * ship.speed;
      const moveY = (dy / distanceToTarget) * ship.speed;
      ship.position.x += moveX;
      ship.position.y += moveY;
    }
  }

  // Encontrar asteroide mais próximo
  private findNearestAsteroid(ship: Ship, asteroids: Asteroid[]): Asteroid | null {
    let nearestAsteroid: Asteroid | null = null;
    let nearestDistance = Infinity;

    asteroids.forEach(asteroid => {
      if (asteroid.health > 0) { // Só asteroides com vida
        const distance = this.getDistance(ship.position, { x: asteroid.x, y: asteroid.y });
        if (distance < nearestDistance && distance < 300) { // Raio de busca de 300px
          nearestDistance = distance;
          nearestAsteroid = asteroid;
        }
      }
    });

    return nearestAsteroid;
  }

  // Calcular distância entre dois pontos
  private getDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Obter todas as naves
  public getShips(): Ship[] {
    return Array.from(this.ships.values());
  }

  // Obter nave por ID
  public getShip(id: string): Ship | undefined {
    return this.ships.get(id);
  }

  // Remover nave
  public removeShip(id: string): boolean {
    return this.ships.delete(id);
  }

  // Obter estatísticas das naves
  public getShipStats(): {
    total: number;
    idle: number;
    mining: number;
    returning: number;
    deploying: number;
    totalCargo: number;
  } {
    const ships = this.getShips();
    return {
      total: ships.length,
      idle: ships.filter(s => s.status === ShipStatus.IDLE).length,
      mining: ships.filter(s => s.status === ShipStatus.MINING).length,
      returning: ships.filter(s => s.status === ShipStatus.RETURNING).length,
      deploying: ships.filter(s => s.status === ShipStatus.DEPLOYING).length,
      totalCargo: ships.reduce((sum, ship) => sum + ship.currentCargo, 0)
    };
  }
} 