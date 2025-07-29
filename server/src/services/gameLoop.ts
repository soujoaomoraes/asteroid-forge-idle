import { prisma } from './database';
import { WebSocketService } from './websocket';

export class GameLoopService {
  private wsService: WebSocketService;
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private lastUpdate: Date = new Date();

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
  }

  public start() {
    console.log('🎮 Starting game loop...');
    
    // Game loop a cada 1 segundo
    this.gameLoopInterval = setInterval(async () => {
      await this.updateGame();
    }, 1000);

    console.log('✅ Game loop started');
  }

  public stop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log('⏹️ Game loop stopped');
    }
  }

  private async updateGame() {
    try {
      const now = new Date();
      const deltaTime = (now.getTime() - this.lastUpdate.getTime()) / 1000; // segundos
      this.lastUpdate = now;

      // Buscar estado atual do jogo
      const gameState = await prisma.gameState.findFirst({
        include: {
          resources: true,
          ships: true,
          upgrades: true
        }
      });

      if (!gameState?.resources) {
        console.log('⚠️ No game state found, skipping update');
        return;
      }

      // Calcular produção de recursos
      const production = this.calculateResourceProduction(gameState, deltaTime);
      
      // Atualizar recursos
      const updatedResources = await prisma.resources.update({
        where: { id: gameState.resources.id },
        data: {
          crystals: gameState.resources.crystals + production.crystals,
          energy: Math.max(0, gameState.resources.energy + production.energy),
          research: gameState.resources.research + production.research,
          reputation: gameState.resources.reputation + production.reputation
        }
      });

      // Broadcast para WebSocket (a cada 5 segundos para evitar spam)
      const shouldBroadcast = Math.floor(now.getTime() / 5000) % 5 === 0;
      if (shouldBroadcast) {
        await this.wsService.broadcastResources();
      }

      // Log a cada 10 segundos
      if (Math.floor(now.getTime() / 10000) % 10 === 0) {
        console.log(`📊 Resources updated:`, {
          crystals: updatedResources.crystals,
          energy: updatedResources.energy,
          research: updatedResources.research,
          reputation: updatedResources.reputation
        });
      }

    } catch (error) {
      console.error('❌ Error in game loop:', error);
    }
  }

  private calculateResourceProduction(gameState: any, deltaTime: number) {
    const production = {
      crystals: 0,
      energy: 0,
      research: 0,
      reputation: 0
    };

    // Produção base de crystals (1 por segundo)
    production.crystals = 1 * deltaTime;

    // Consumo de energy (0.5 por segundo)
    production.energy = -0.5 * deltaTime;

    // Produção de research baseada em crystals (1 research por 10 crystals)
    if (gameState.resources.crystals >= 10) {
      production.research = 0.1 * deltaTime;
    }

    // Produção de reputation baseada em research (1 reputation por 5 research)
    if (gameState.resources.research >= 5) {
      production.reputation = 0.2 * deltaTime;
    }

    // Aplicar multiplicadores de upgrades
    const upgrades = gameState.upgrades || [];
    const multipliers = this.calculateUpgradeMultipliers(upgrades);

    production.crystals *= multipliers.crystalMultiplier;
    production.energy *= multipliers.energyMultiplier;
    production.research *= multipliers.researchMultiplier;

    return production;
  }

  private calculateUpgradeMultipliers(upgrades: any[]) {
    const multipliers = {
      crystalMultiplier: 1.0,
      energyMultiplier: 1.0,
      researchMultiplier: 1.0
    };

    upgrades.forEach(upgrade => {
      const effect = JSON.parse(upgrade.effect || '{}');
      
      switch (upgrade.type) {
        case 'MINING_EFFICIENCY':
          multipliers.crystalMultiplier *= (effect.efficiencyMultiplier || 1.0);
          break;
        case 'ENERGY_GENERATION':
          multipliers.energyMultiplier *= (effect.energyMultiplier || 1.0);
          break;
        case 'RESEARCH_BOOST':
          multipliers.researchMultiplier *= (effect.researchMultiplier || 1.0);
          break;
      }
    });

    return multipliers;
  }

  public async getGameStats() {
    try {
      const gameState = await prisma.gameState.findFirst({
        include: {
          resources: true,
          ships: true,
          upgrades: true,
          statistics: true
        }
      });

      if (!gameState) return null;

      const production = this.calculateResourceProduction(gameState, 1); // 1 segundo

      return {
        currentResources: gameState.resources,
        production: production,
        ships: gameState.ships.length,
        upgrades: gameState.upgrades.length,
        statistics: gameState.statistics
      };
    } catch (error) {
      console.error('❌ Error getting game stats:', error);
      return null;
    }
  }
} 