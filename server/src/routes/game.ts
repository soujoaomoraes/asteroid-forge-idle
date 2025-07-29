import { Router } from 'express';
import { prisma } from '../services/database';

// Singleton para acessar o WebSocket service
let wsService: any = null;
let gameLoopService: any = null;

export function setWebSocketService(service: any) {
  wsService = service;
}

export function setGameLoopService(service: any) {
  gameLoopService = service;
}

const router = Router();

// GET /api/game-state - Get current game state
router.get('/game-state', async (req, res) => {
  try {
    const gameState = await prisma.gameState.findFirst({
      include: {
        resources: true,
        ships: true,
        upgrades: true,
        statistics: true
      }
    });

    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      });
    }

    res.json({
      success: true,
      data: gameState
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game state'
    });
  }
});

// POST /api/game-state - Save game state
router.post('/game-state', async (req, res) => {
  try {
    const { playerId, resources, ships, upgrades } = req.body;
    
    let gameState = await prisma.gameState.findFirst();
    
    if (!gameState) {
      // Criar novo game state
      gameState = await prisma.gameState.create({
        data: {
          playerId: playerId || 'player-1',
          resources: {
            create: resources || {
              crystals: 100,
              energy: 100,
              research: 0,
              reputation: 0
            }
          }
        },
        include: {
          resources: true,
          ships: true,
          upgrades: true,
          statistics: true
        }
      });
    } else {
      // Atualizar game state existente
      gameState = await prisma.gameState.update({
        where: { id: gameState.id },
        data: {
          playerId: playerId || gameState.playerId,
          resources: resources ? {
            update: resources
          } : undefined,
          updatedAt: new Date()
        },
        include: {
          resources: true,
          ships: true,
          upgrades: true,
          statistics: true
        }
      });
    }

    res.json({
      success: true,
      message: 'Game state saved successfully',
      data: gameState
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid game state data'
    });
  }
});

// GET /api/resources - Get current resources
router.get('/resources', async (req, res) => {
  try {
    const gameState = await prisma.gameState.findFirst({
      include: { resources: true }
    });

    if (!gameState?.resources) {
      return res.status(404).json({
        success: false,
        error: 'Resources not found'
      });
    }

    res.json({
      success: true,
      data: gameState.resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resources'
    });
  }
});

// PUT /api/resources - Update resources
router.put('/resources', async (req, res) => {
  try {
    const { crystals, energy, research, reputation } = req.body;
    
    const gameState = await prisma.gameState.findFirst({
      include: { resources: true }
    });

    if (!gameState?.resources) {
      return res.status(404).json({
        success: false,
        error: 'Resources not found'
      });
    }

    const updatedResources = await prisma.resources.update({
      where: { id: gameState.resources.id },
      data: {
        crystals: crystals ?? gameState.resources.crystals,
        energy: energy ?? gameState.resources.energy,
        research: research ?? gameState.resources.research,
        reputation: reputation ?? gameState.resources.reputation
      }
    });

    // Broadcast para WebSocket
    if (wsService) {
      await wsService.broadcastResources();
    }

    res.json({
      success: true,
      message: 'Resources updated successfully',
      data: updatedResources
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid resources data'
    });
  }
});

// POST /api/ships/deploy - Deploy new ship
router.post('/ships/deploy', async (req, res) => {
  try {
    const { type, position } = req.body;
    
    if (!type || !position) {
      return res.status(400).json({
        success: false,
        error: 'Ship type and position are required'
      });
    }

    const gameState = await prisma.gameState.findFirst();
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      });
    }

    const newShip = await prisma.ship.create({
      data: {
        type,
        position: JSON.stringify(position),
        velocity: JSON.stringify({ x: 0, y: 0 }),
        rotation: 0,
        efficiency: 1.0,
        capacity: 100,
        gameStateId: gameState.id
      }
    });

    // Broadcast para WebSocket
    if (wsService) {
      wsService.broadcastShipDeployed(newShip);
    }

    res.json({
      success: true,
      message: 'Ship deployed successfully',
      data: newShip
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid ship data'
    });
  }
});

// GET /api/ships - Get all ships
router.get('/ships', async (req, res) => {
  try {
    const ships = await prisma.ship.findMany({
      include: { gameState: true }
    });

    res.json({
      success: true,
      data: ships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ships'
    });
  }
});

// DELETE /api/ships/:shipId - Recall ship
router.delete('/ships/:shipId', async (req, res) => {
  try {
    const shipId = req.params.shipId;
    
    const ship = await prisma.ship.findUnique({
      where: { id: shipId }
    });
    
    if (!ship) {
      return res.status(404).json({
        success: false,
        error: 'Ship not found'
      });
    }

    await prisma.ship.delete({
      where: { id: shipId }
    });

    res.json({
      success: true,
      message: 'Ship recalled successfully',
      data: ship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to recall ship'
    });
  }
});

// GET /api/upgrades - Get available upgrades
router.get('/upgrades', async (req, res) => {
  const availableUpgrades = [
    {
      id: 'ship-speed-1',
      type: 'SHIP_SPEED',
      name: 'Ship Speed I',
      description: 'Increase ship speed by 10%',
      cost: 50,
      level: 1,
      effect: { speedMultiplier: 1.1 }
    },
    {
      id: 'ship-capacity-1',
      type: 'SHIP_CAPACITY',
      name: 'Ship Capacity I',
      description: 'Increase ship capacity by 20%',
      cost: 75,
      level: 1,
      effect: { capacityMultiplier: 1.2 }
    },
    {
      id: 'mining-efficiency-1',
      type: 'MINING_EFFICIENCY',
      name: 'Mining Efficiency I',
      description: 'Increase mining efficiency by 15%',
      cost: 100,
      level: 1,
      effect: { efficiencyMultiplier: 1.15 }
    }
  ];

  res.json({
    success: true,
    data: availableUpgrades
  });
});

// POST /api/upgrades/purchase - Purchase upgrade
router.post('/upgrades/purchase', async (req, res) => {
  try {
    const { upgradeId } = req.body;
    
    if (!upgradeId) {
      return res.status(400).json({
        success: false,
        error: 'Upgrade ID is required'
      });
    }

    const gameState = await prisma.gameState.findFirst({
      include: { resources: true }
    });

    if (!gameState?.resources) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      });
    }

    // Mock upgrade purchase logic
    const upgrade = {
      id: upgradeId,
      type: 'SHIP_SPEED' as const,
      level: 1,
      cost: 50,
      effect: JSON.stringify({ speedMultiplier: 1.1 }),
      gameStateId: gameState.id
    };

    const purchasedUpgrade = await prisma.upgrade.create({
      data: upgrade
    });

    // Deduct crystals
    await prisma.resources.update({
      where: { id: gameState.resources.id },
      data: {
        crystals: gameState.resources.crystals - upgrade.cost
      }
    });

    // Broadcast para WebSocket
    if (wsService) {
      wsService.broadcastUpgradePurchased(purchasedUpgrade);
      await wsService.broadcastResources();
    }

    res.json({
      success: true,
      message: 'Upgrade purchased successfully',
      data: purchasedUpgrade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid upgrade data'
    });
  }
});

// GET /api/game-stats - Get game statistics and production rates
router.get('/game-stats', async (req, res) => {
  try {
    if (!gameLoopService) {
      return res.status(500).json({
        success: false,
        error: 'Game loop service not available'
      });
    }

    const stats = await gameLoopService.getGameStats();
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'Game stats not found'
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game stats'
    });
  }
});

// POST /api/mining - Add mined resources to game state
router.post('/mining', async (req, res) => {
  try {
    const { crystals, metals, gems, energy } = req.body;

    if (!crystals && !metals && !gems && !energy) {
      return res.status(400).json({
        success: false,
        error: 'No resources provided'
      });
    }

    // Buscar recursos atuais
    const gameState = await prisma.gameState.findFirst({
      include: { resources: true }
    });

    if (!gameState?.resources) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      });
    }

    // Adicionar recursos minerados
    const updatedResources = await prisma.resources.update({
      where: { id: gameState.resources.id },
      data: {
        crystals: gameState.resources.crystals + (crystals || 0),
        energy: gameState.resources.energy + (energy || 0),
        research: gameState.resources.research + (gems || 0), // Gems viram research
        reputation: gameState.resources.reputation + (metals || 0) // Metals viram reputation
      }
    });

    // Broadcast via WebSocket
    if (wsService) {
      await wsService.broadcastResources();
    }

    res.json({
      success: true,
      data: {
        message: 'Resources added successfully',
        added: { crystals, metals, gems, energy },
        current: updatedResources
      }
    });
  } catch (error) {
    console.error('Error adding mined resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add mined resources'
    });
  }
});

export { router as gameRoutes }; 