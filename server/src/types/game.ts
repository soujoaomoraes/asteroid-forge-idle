export interface Vector2 {
  x: number;
  y: number;
}

export interface Ship {
  id: string;
  type: string;
  position: Vector2;
  velocity: Vector2;
  rotation: number;
  efficiency: number;
  capacity: number;
  createdAt: string;
}

export interface Resources {
  crystals: number;
  energy: number;
  research: number;
  reputation: number;
}

export interface Upgrade {
  id: string;
  type: string;
  name?: string;
  description?: string;
  cost: number;
  level: number;
  effect: Record<string, any>;
  purchasedAt?: string;
}

export interface GameState {
  playerId: string;
  resources: Resources;
  ships: Ship[];
  upgrades: Upgrade[];
  lastSave: string;
} 