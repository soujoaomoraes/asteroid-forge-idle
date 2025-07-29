import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { gameRoutes } from './routes/game';
import { initializeDatabase, testDatabaseConnection } from './services/database';
import { WebSocketService } from './services/websocket';
import { GameLoopService } from './services/gameLoop';

const app = express();
const PORT = process.env.PORT || 3000;

// Função para encontrar porta disponível
function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as any).port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Space Miner Idle API',
    version: '0.1.0'
  });
});

// Routes
app.use('/api', gameRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexão com banco
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Inicializar banco com dados padrão
    await initializeDatabase();

    // Encontrar porta disponível
    const availablePort = await findAvailablePort(Number(PORT));

    // Criar servidor HTTP com configurações de timeout
    const server = createServer(app);
    
    // Configurar timeouts para evitar desconexões
    server.keepAliveTimeout = 65000; // 65 segundos
    server.headersTimeout = 66000; // 66 segundos

    // Inicializar WebSocket
    const wsService = new WebSocketService(server);
    
    // Inicializar Game Loop
    const gameLoopService = new GameLoopService(wsService);
    
    // Conectar WebSocket com as rotas
    const { setWebSocketService, setGameLoopService } = require('./routes/game');
    setWebSocketService(wsService);
    setGameLoopService(gameLoopService);
    
    // Iniciar game loop
    gameLoopService.start();

    // Iniciar servidor
    server.listen(availablePort, () => {
      console.log(`🚀 Space Miner Idle Server running on port ${availablePort}`);
      console.log(`📊 Health check: http://localhost:${availablePort}/health`);
      console.log(`🎮 Game API: http://localhost:${availablePort}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${availablePort}`);
      console.log(`🗄️ Database: SQLite (game.db)`);
      console.log(`👥 Connected clients: ${wsService.getConnectedClientsCount()}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 