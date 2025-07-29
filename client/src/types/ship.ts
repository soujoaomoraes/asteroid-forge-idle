export enum ShipType {
  SCOUT = 'SCOUT',
  MINER = 'MINER',
  HAULER = 'HAULER',
  DESTROYER = 'DESTROYER'
}

export enum ShipStatus {
  IDLE = 'IDLE',
  MINING = 'MINING',
  RETURNING = 'RETURNING',
  DEPLOYING = 'DEPLOYING'
}

export interface Ship {
  id: string;
  type: ShipType;
  status: ShipStatus;
  position: {
    x: number;
    y: number;
  };
  target?: {
    x: number;
    y: number;
  };
  speed: number;
  miningSpeed: number;
  capacity: number;
  currentCargo: number;
  health: number;
  maxHealth: number;
  deployedAt?: Date;
  lastMiningTime?: Date;
}

export interface ShipConfig {
  type: ShipType;
  name: string;
  cost: {
    crystals: number;
    energy: number;
    research: number;
    reputation: number;
  };
  stats: {
    speed: number;
    miningSpeed: number;
    capacity: number;
    health: number;
  };
  description: string;
}

export const SHIP_CONFIGS: Record<ShipType, ShipConfig> = {
  [ShipType.SCOUT]: {
    type: ShipType.SCOUT,
    name: 'Scout',
    cost: {
      crystals: 50,
      energy: 10,
      research: 0,
      reputation: 0
    },
    stats: {
      speed: 2.0,
      miningSpeed: 0.5,
      capacity: 10,
      health: 50
    },
    description: 'Nave rápida para exploração e mineração básica'
  },
  [ShipType.MINER]: {
    type: ShipType.MINER,
    name: 'Miner',
    cost: {
      crystals: 200,
      energy: 50,
      research: 10,
      reputation: 0
    },
    stats: {
      speed: 1.5,
      miningSpeed: 2.0,
      capacity: 50,
      health: 100
    },
    description: 'Especializada em mineração eficiente'
  },
  [ShipType.HAULER]: {
    type: ShipType.HAULER,
    name: 'Hauler',
    cost: {
      crystals: 500,
      energy: 100,
      research: 25,
      reputation: 10
    },
    stats: {
      speed: 1.0,
      miningSpeed: 1.0,
      capacity: 200,
      health: 150
    },
    description: 'Grande capacidade de carga para transportes'
  },
  [ShipType.DESTROYER]: {
    type: ShipType.DESTROYER,
    name: 'Destroyer',
    cost: {
      crystals: 1000,
      energy: 200,
      research: 50,
      reputation: 25
    },
    stats: {
      speed: 1.8,
      miningSpeed: 1.5,
      capacity: 100,
      health: 300
    },
    description: 'Nave de combate com boa mineração'
  }
}; 