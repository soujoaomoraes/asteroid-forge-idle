export interface Asteroid {
  id: string;
  x: number;
  y: number;
  size: number;
  type: AsteroidType;
  resources: AsteroidResources;
  health: number;
  maxHealth: number;
  rotation: number;
  rotationSpeed: number;
  lastMined: number;
  isMining: boolean;
}

export enum AsteroidType {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  RARE = 'RARE',
  EPIC = 'EPIC'
}

export interface AsteroidResources {
  crystals: number;
  metals: number;
  gems: number;
  energy: number;
}

export interface AsteroidConfig {
  type: AsteroidType;
  size: number;
  health: number;
  resources: AsteroidResources;
  color: string;
  rotationSpeed: number;
  spawnChance: number;
}

export const ASTEROID_CONFIGS: Record<AsteroidType, AsteroidConfig> = {
  [AsteroidType.SMALL]: {
    type: AsteroidType.SMALL,
    size: 20,
    health: 50,
    resources: { crystals: 10, metals: 5, gems: 0, energy: 2 },
    color: '#8B4513',
    rotationSpeed: 0.02,
    spawnChance: 0.4
  },
  [AsteroidType.MEDIUM]: {
    type: AsteroidType.MEDIUM,
    size: 35,
    health: 100,
    resources: { crystals: 25, metals: 15, gems: 2, energy: 5 },
    color: '#696969',
    rotationSpeed: 0.015,
    spawnChance: 0.3
  },
  [AsteroidType.LARGE]: {
    type: AsteroidType.LARGE,
    size: 50,
    health: 200,
    resources: { crystals: 50, metals: 30, gems: 5, energy: 10 },
    color: '#2F4F4F',
    rotationSpeed: 0.01,
    spawnChance: 0.2
  },
  [AsteroidType.RARE]: {
    type: AsteroidType.RARE,
    size: 40,
    health: 150,
    resources: { crystals: 30, metals: 20, gems: 15, energy: 8 },
    color: '#FFD700',
    rotationSpeed: 0.025,
    spawnChance: 0.08
  },
  [AsteroidType.EPIC]: {
    type: AsteroidType.EPIC,
    size: 60,
    health: 300,
    resources: { crystals: 100, metals: 50, gems: 30, energy: 20 },
    color: '#FF69B4',
    rotationSpeed: 0.03,
    spawnChance: 0.02
  }
};

export interface AsteroidSpawnConfig {
  maxAsteroids: number;
  spawnRadius: number;
  minDistance: number;
  spawnInterval: number;
} 