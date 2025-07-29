import { WebSocketServer, WebSocket } from 'ws';
import { prisma } from './database';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      perMessageDeflate: false, // Desabilitar compressão para evitar problemas
      maxPayload: 1024 * 1024 // 1MB max payload
    });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 WebSocket client connected');
      this.clients.add(ws);

      // Enviar estado inicial do jogo
      this.sendGameState(ws);

      // Heartbeat para manter conexão
      const heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
          console.log('🏓 Ping sent to client');
        }
      }, 5000); // 5 segundos (mais frequente)

      ws.on('message', (message: string) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      });

      ws.on('pong', () => {
        // Cliente respondeu ao ping, conexão está viva
        console.log('🏓 Pong received from client');
      });

      ws.on('close', (code, reason) => {
        console.log('🔌 WebSocket client disconnected:', {
          code: code,
          reason: reason?.toString(),
          timestamp: new Date().toISOString(),
          clientCount: this.clients.size
        });
        this.clients.delete(ws);
        clearInterval(heartbeat);
      });

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', {
          error: error.message,
          timestamp: new Date().toISOString(),
          clientCount: this.clients.size
        });
        this.clients.delete(ws);
        clearInterval(heartbeat);
      });
    });

    console.log('🔌 WebSocket server initialized');
  }

  private async sendGameState(ws: WebSocket) {
    try {
      const gameState = await prisma.gameState.findFirst({
        include: {
          resources: true,
          ships: true,
          upgrades: true,
          statistics: true
        }
      });

      if (gameState) {
        this.sendToClient(ws, {
          type: 'GAME_STATE_INIT',
          data: gameState,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error sending game state:', error);
    }
  }

  private async handleMessage(ws: WebSocket, message: WebSocketMessage) {
    console.log('📨 WebSocket message received:', message.type);

    switch (message.type) {
      case 'PING':
        this.sendToClient(ws, {
          type: 'PONG',
          timestamp: new Date().toISOString()
        });
        break;

      case 'REQUEST_RESOURCES':
        await this.broadcastResources();
        break;

      case 'REQUEST_SHIPS':
        await this.broadcastShips();
        break;

      default:
        console.log('⚠️ Unknown message type:', message.type);
    }
  }

  // Métodos para broadcast
  public async broadcastResources() {
    try {
      const gameState = await prisma.gameState.findFirst({
        include: { resources: true }
      });

      if (gameState?.resources) {
        this.broadcast({
          type: 'RESOURCES_UPDATED',
          data: gameState.resources,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error broadcasting resources:', error);
    }
  }

  public async broadcastShips() {
    try {
      const ships = await prisma.ship.findMany({
        include: { gameState: true }
      });

      this.broadcast({
        type: 'SHIPS_UPDATED',
        data: ships,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error broadcasting ships:', error);
    }
  }

  public broadcastShipDeployed(ship: any) {
    this.broadcast({
      type: 'SHIP_DEPLOYED',
      data: ship,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastUpgradePurchased(upgrade: any) {
    this.broadcast({
      type: 'UPGRADE_PURCHASED',
      data: upgrade,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastGameEvent(event: string, data?: any) {
    this.broadcast({
      type: 'GAME_EVENT',
      data: { event, ...data },
      timestamp: new Date().toISOString()
    });
  }

  private sendToClient(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcast(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
} 