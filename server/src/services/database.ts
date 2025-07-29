import { PrismaClient } from '@prisma/client';

// Instância global do Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para inicializar o banco com dados padrão
export async function initializeDatabase() {
  try {
    // Verificar se já existe um game state
    const existingGameState = await prisma.gameState.findFirst();
    
    if (!existingGameState) {
      // Criar game state padrão
      const gameState = await prisma.gameState.create({
        data: {
          playerId: 'player-1',
          resources: {
            create: {
              crystals: 100,
              energy: 100,
              research: 0,
              reputation: 0
            }
          },
          statistics: {
            create: {
              totalPlayTime: 0,
              totalCrystals: 0,
              shipsDeployed: 0,
              upgradesBought: 0
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
      
      console.log('✅ Database initialized with default game state');
      return gameState;
    }
    
    console.log('✅ Database already initialized');
    return existingGameState;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Função para testar conexão
export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
} 