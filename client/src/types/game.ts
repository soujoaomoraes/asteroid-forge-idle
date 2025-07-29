export interface Vector2 {
  x: number;
  y: number;
}

export interface Ship {
  id: string;
  position: Vector2;
  velocity: Vector2;
  rotation: number;
  speed: number;
}

export interface Star {
  id: string;
  position: Vector2;
  brightness: number;
}

export interface GameState {
  ship: Ship;
  stars: Star[];
  camera: Vector2;
} 