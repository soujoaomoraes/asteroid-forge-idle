import Matter from 'matter-js';

export interface PhysicsBody {
  id: string;
  body: Matter.Body;
  type: 'ship' | 'asteroid' | 'particle';
  data?: any;
}

export interface PhysicsWorld {
  engine: Matter.Engine;
  world: Matter.World;
  bodies: Map<string, PhysicsBody>;
}

export class PhysicsService {
  private static instance: PhysicsService;
  private world: PhysicsWorld | null = null;
  private isRunning = false;

  private constructor() {}

  static getInstance(): PhysicsService {
    if (!PhysicsService.instance) {
      PhysicsService.instance = new PhysicsService();
    }
    return PhysicsService.instance;
  }

  initialize(width: number, height: number): PhysicsWorld {
    // Criar engine do Matter.js
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 } // Sem gravidade no espaço
    });

    // Configurar o mundo
    const world = engine.world;

    // Configurar limites do mundo
    const walls = this.createWalls(width, height);
    walls.forEach(wall => {
      Matter.World.add(world, wall);
    });

    this.world = {
      engine,
      world,
      bodies: new Map()
    };

    return this.world;
  }

  private createWalls(width: number, height: number): Matter.Body[] {
    const wallThickness = 50;
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'rgba(0, 255, 255, 0.3)',
        lineWidth: 2
      }
    };

    // Paredes invisíveis para manter objetos dentro do mundo
    const walls = [
      // Parede superior
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, wallOptions),
      // Parede inferior
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, wallOptions),
      // Parede esquerda
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, wallOptions),
      // Parede direita
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, wallOptions)
    ];

    return walls;
  }

  createShip(x: number, y: number, radius: number = 15): PhysicsBody {
    if (!this.world) {
      throw new Error('Physics world not initialized');
    }

    const body = Matter.Bodies.circle(x, y, radius, {
      density: 0.1,
      friction: 0.1,
      restitution: 0.8,
      render: {
        fillStyle: '#00ff00',
        strokeStyle: '#ffffff',
        lineWidth: 2
      }
    });

    const physicsBody: PhysicsBody = {
      id: `ship-${Date.now()}`,
      body,
      type: 'ship'
    };

    this.world.bodies.set(physicsBody.id, physicsBody);
    Matter.World.add(this.world.world, body);

    return physicsBody;
  }

  createAsteroid(x: number, y: number, size: number, type: string = 'SMALL'): PhysicsBody {
    if (!this.world) {
      throw new Error('Physics world not initialized');
    }

    // Criar forma irregular para asteroides
    const vertices = this.generateAsteroidShape(size);
    const body = Matter.Bodies.fromVertices(x, y, [vertices], {
      density: 0.05,
      friction: 0.3,
      restitution: 0.2,
      render: {
        fillStyle: this.getAsteroidColor(type),
        strokeStyle: '#ffffff',
        lineWidth: 1
      }
    });

    const physicsBody: PhysicsBody = {
      id: `asteroid-${Date.now()}`,
      body,
      type: 'asteroid',
      data: { size, type }
    };

    this.world.bodies.set(physicsBody.id, physicsBody);
    Matter.World.add(this.world.world, body);

    return physicsBody;
  }

  private generateAsteroidShape(size: number): Matter.Vector[] {
    const vertices: Matter.Vector[] = [];
    const segments = 8 + Math.floor(size / 10);
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const radius = size * (0.8 + Math.random() * 0.4);
      vertices.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }

    return vertices;
  }

  private getAsteroidColor(type: string): string {
    const colors: { [key: string]: string } = {
      'SMALL': '#8B4513',
      'MEDIUM': '#696969',
      'LARGE': '#2F4F4F',
      'RARE': '#FFD700',
      'EPIC': '#FF69B4'
    };
    return colors[type] || '#8B4513';
  }

  createParticle(x: number, y: number, velocity: Matter.Vector, lifetime: number = 1000): PhysicsBody {
    if (!this.world) {
      throw new Error('Physics world not initialized');
    }

    const body = Matter.Bodies.circle(x, y, 2, {
      density: 0.01,
      friction: 0.1,
      restitution: 0.9,
      render: {
        fillStyle: '#FFD700',
        strokeStyle: '#FFA500',
        lineWidth: 1
      }
    });

    // Aplicar velocidade inicial
    Matter.Body.setVelocity(body, velocity);

    const physicsBody: PhysicsBody = {
      id: `particle-${Date.now()}`,
      body,
      type: 'particle',
      data: { 
        createdAt: Date.now(),
        lifetime 
      }
    };

    this.world.bodies.set(physicsBody.id, physicsBody);
    Matter.World.add(this.world.world, body);

    return physicsBody;
  }

  applyForce(bodyId: string, force: Matter.Vector): void {
    if (!this.world) return;

    const physicsBody = this.world.bodies.get(bodyId);
    if (physicsBody) {
      Matter.Body.applyForce(physicsBody.body, physicsBody.body.position, force);
    }
  }

  setVelocity(bodyId: string, velocity: Matter.Vector): void {
    if (!this.world) return;

    const physicsBody = this.world.bodies.get(bodyId);
    if (physicsBody) {
      Matter.Body.setVelocity(physicsBody.body, velocity);
    }
  }

  getBody(bodyId: string): PhysicsBody | undefined {
    if (!this.world) return undefined;
    return this.world.bodies.get(bodyId);
  }

  getAllBodies(): PhysicsBody[] {
    if (!this.world) return [];
    return Array.from(this.world.bodies.values());
  }

  removeBody(bodyId: string): void {
    if (!this.world) return;

    const physicsBody = this.world.bodies.get(bodyId);
    if (physicsBody) {
      Matter.World.remove(this.world.world, physicsBody.body);
      this.world.bodies.delete(bodyId);
    }
  }

  update(deltaTime: number): void {
    if (!this.world || !this.isRunning) return;

    // Atualizar engine
    Matter.Engine.update(this.world.engine, deltaTime);

    // Remover partículas expiradas
    this.cleanupExpiredParticles();
  }

  private cleanupExpiredParticles(): void {
    if (!this.world) return;

    const now = Date.now();
    const expiredParticles: string[] = [];

    this.world.bodies.forEach((physicsBody, id) => {
      if (physicsBody.type === 'particle' && physicsBody.data) {
        const { createdAt, lifetime } = physicsBody.data;
        if (now - createdAt > lifetime) {
          expiredParticles.push(id);
        }
      }
    });

    expiredParticles.forEach(id => this.removeBody(id));
  }

  start(): void {
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }

  destroy(): void {
    if (this.world) {
      Matter.Engine.clear(this.world.engine);
      this.world.bodies.clear();
      this.world = null;
    }
    this.isRunning = false;
  }

  // Event listeners para colisões
  onCollision(callback: (bodyA: PhysicsBody, bodyB: PhysicsBody) => void): void {
    if (!this.world) return;

    Matter.Events.on(this.world.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = this.findPhysicsBody(pair.bodyA);
        const bodyB = this.findPhysicsBody(pair.bodyB);
        
        if (bodyA && bodyB) {
          callback(bodyA, bodyB);
        }
      });
    });
  }

  private findPhysicsBody(matterBody: Matter.Body): PhysicsBody | undefined {
    if (!this.world) return undefined;
    
    for (const physicsBody of this.world.bodies.values()) {
      if (physicsBody.body === matterBody) {
        return physicsBody;
      }
    }
    return undefined;
  }
} 