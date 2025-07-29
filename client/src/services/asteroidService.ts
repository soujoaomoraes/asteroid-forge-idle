import { Asteroid, AsteroidType, ASTEROID_CONFIGS, AsteroidSpawnConfig, AsteroidResources } from '../types/asteroid';

export class AsteroidService {
  private asteroids: Map<string, Asteroid> = new Map();
  private spawnConfig: AsteroidSpawnConfig;
  private worldBounds: { width: number; height: number };
  private lastSpawnTime: number = 0;

  constructor(worldBounds: { width: number; height: number }) {
    this.worldBounds = worldBounds;
    this.spawnConfig = {
      maxAsteroids: 20,
      spawnRadius: 200,
      minDistance: 100,
      spawnInterval: 5000 // 5 segundos
    };
  }

  public update(deltaTime: number, shipPosition: { x: number; y: number }) {
    // Atualizar rotação dos asteroides
    this.asteroids.forEach(asteroid => {
      asteroid.rotation += asteroid.rotationSpeed * deltaTime;
    });

    // Verificar se deve spawnar novos asteroides
    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnConfig.spawnInterval && 
        this.asteroids.size < this.spawnConfig.maxAsteroids) {
      this.spawnAsteroid(shipPosition);
      this.lastSpawnTime = now;
    }

    // Remover asteroides muito longe
    this.cleanupAsteroids(shipPosition);
  }

  private spawnAsteroid(shipPosition: { x: number; y: number }) {
    const asteroidType = this.selectAsteroidType();
    const config = ASTEROID_CONFIGS[asteroidType];
    
    // Gerar posição aleatória ao redor da nave
    const angle = Math.random() * Math.PI * 2;
    const distance = this.spawnConfig.spawnRadius + Math.random() * 200;
    
    let x = shipPosition.x + Math.cos(angle) * distance;
    let y = shipPosition.y + Math.sin(angle) * distance;
    
    // Garantir que está dentro dos limites do mundo
    x = Math.max(50, Math.min(this.worldBounds.width - 50, x));
    y = Math.max(50, Math.min(this.worldBounds.height - 50, y));
    
    // Verificar distância mínima de outros asteroides
    if (this.isTooCloseToOtherAsteroids(x, y)) {
      return;
    }

    const asteroid: Asteroid = {
      id: `asteroid_${Date.now()}_${Math.random()}`,
      x,
      y,
      size: config.size,
      type: asteroidType,
      resources: { ...config.resources },
      health: config.health,
      maxHealth: config.health,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: config.rotationSpeed,
      lastMined: 0,
      isMining: false
    };

    this.asteroids.set(asteroid.id, asteroid);
  }

  private selectAsteroidType(): AsteroidType {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, config] of Object.entries(ASTEROID_CONFIGS)) {
      cumulative += config.spawnChance;
      if (rand <= cumulative) {
        return type as AsteroidType;
      }
    }
    
    return AsteroidType.SMALL; // Fallback
  }

  private isTooCloseToOtherAsteroids(x: number, y: number): boolean {
    for (const asteroid of this.asteroids.values()) {
      const distance = Math.sqrt(
        Math.pow(x - asteroid.x, 2) + Math.pow(y - asteroid.y, 2)
      );
      if (distance < this.spawnConfig.minDistance) {
        return true;
      }
    }
    return false;
  }

  private cleanupAsteroids(shipPosition: { x: number; y: number }) {
    const maxDistance = 800; // Distância máxima para manter asteroides
    
    for (const [id, asteroid] of this.asteroids.entries()) {
      const distance = Math.sqrt(
        Math.pow(shipPosition.x - asteroid.x, 2) + 
        Math.pow(shipPosition.y - asteroid.y, 2)
      );
      
      if (distance > maxDistance) {
        this.asteroids.delete(id);
      }
    }
  }

  public getAsteroids(): Asteroid[] {
    return Array.from(this.asteroids.values());
  }

  public getAsteroidById(id: string): Asteroid | undefined {
    return this.asteroids.get(id);
  }

  public mineAsteroid(asteroidId: string, miningPower: number = 1): AsteroidResources | null {
    const asteroid = this.asteroids.get(asteroidId);
    if (!asteroid || asteroid.health <= 0) {
      return null;
    }

    // Calcular dano baseado no poder de mineração
    const damage = miningPower * 10;
    asteroid.health = Math.max(0, asteroid.health - damage);
    asteroid.lastMined = Date.now();
    asteroid.isMining = true;

    // Calcular recursos extraídos baseado no dano
    const extractionRatio = Math.min(1, damage / asteroid.maxHealth);
    const extractedResources: AsteroidResources = {
      crystals: Math.floor(asteroid.resources.crystals * extractionRatio),
      metals: Math.floor(asteroid.resources.metals * extractionRatio),
      gems: Math.floor(asteroid.resources.gems * extractionRatio),
      energy: Math.floor(asteroid.resources.energy * extractionRatio)
    };

    // Reduzir recursos restantes
    asteroid.resources.crystals = Math.max(0, asteroid.resources.crystals - extractedResources.crystals);
    asteroid.resources.metals = Math.max(0, asteroid.resources.metals - extractedResources.metals);
    asteroid.resources.gems = Math.max(0, asteroid.resources.gems - extractedResources.gems);
    asteroid.resources.energy = Math.max(0, asteroid.resources.energy - extractedResources.energy);

    // Se o asteroide foi destruído, removê-lo
    if (asteroid.health <= 0) {
      this.asteroids.delete(asteroidId);
    }

    return extractedResources;
  }

  public checkCollision(shipX: number, shipY: number, shipRadius: number = 15): Asteroid | null {
    for (const asteroid of this.asteroids.values()) {
      const distance = Math.sqrt(
        Math.pow(shipX - asteroid.x, 2) + Math.pow(shipY - asteroid.y, 2)
      );
      
      if (distance < (asteroid.size + shipRadius)) {
        return asteroid;
      }
    }
    return null;
  }

  public getAsteroidsInRange(x: number, y: number, range: number): Asteroid[] {
    return Array.from(this.asteroids.values())
      .filter((asteroid: Asteroid) => {
        const distance = Math.sqrt(
          Math.pow(x - asteroid.x, 2) + Math.pow(y - asteroid.y, 2)
        );
        return distance <= range;
      })
      .map((asteroid: Asteroid) => ({ ...asteroid }));
  }

  public resetMiningStatus() {
    this.asteroids.forEach(asteroid => {
      asteroid.isMining = false;
    });
  }
} 