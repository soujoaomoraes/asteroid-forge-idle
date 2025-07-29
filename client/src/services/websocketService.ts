interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private url: string = '';
  private isConnecting: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<(connected: boolean) => void> = new Set();
  private isDestroyed: boolean = false;
  private connectionAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private connectionId: string = '';

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(url: string): void {
    if (this.isDestroyed) {
      console.warn('⚠️ WebSocket service destroyed, cannot connect');
      return;
    }

    // Se já está conectado na mesma URL, não reconectar
    if (this.url === url && this.ws?.readyState === WebSocket.OPEN) {
      console.log('🔌 Already connected to', url);
      return;
    }

    // Se está tentando conectar, não iniciar nova tentativa
    if (this.isConnecting) {
      console.log('🔌 Already attempting to connect...');
      return;
    }

    // Gerar ID único para esta conexão
    this.connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔌 Initiating connection to ${url} (ID: ${this.connectionId})`);
    this.url = url;
    this.connectionAttempts = 0;
    this.disconnect();
    this.connectInternal();
  }

  private connectInternal(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    console.log('🔌 Attempting WebSocket connection...');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected successfully');
        this.isConnecting = false;
        this.notifyConnectionChange(true);
        
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        
        // Iniciar heartbeat do cliente
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message.type);
          this.notifyMessageHandlers(message);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
          connectionAttempts: this.connectionAttempts,
          connectionId: this.connectionId
        });
        this.isConnecting = false;
        this.notifyConnectionChange(false);
        
        // Reconectar apenas se não foi fechado intencionalmente e não excedeu tentativas
        if (event.code !== 1000 && !this.isDestroyed && this.connectionAttempts < this.maxReconnectAttempts) {
          this.connectionAttempts++;
          const delay = Math.min(1000 * this.connectionAttempts, 5000); // Backoff exponencial
          console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.connectionAttempts}/${this.maxReconnectAttempts}) - ID: ${this.connectionId}`);
          this.reconnectTimeout = setTimeout(() => {
            this.connectInternal();
          }, delay);
        } else if (this.connectionAttempts >= this.maxReconnectAttempts) {
          console.log(`❌ Max reconnection attempts reached, stopping reconnection - ID: ${this.connectionId}`);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        this.notifyConnectionChange(false);
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      this.isConnecting = false;
    }
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.isConnecting = false;
    this.notifyConnectionChange(false);
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.disconnect();
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
  }

  public sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public addMessageHandler(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    
    // Retorna função para remover o handler
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public addConnectionHandler(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.add(handler);
    
    // Notificar estado atual
    handler(this.isConnected());
    
    // Retorna função para remover o handler
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('❌ Error in message handler:', error);
      }
    });
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('❌ Error in connection handler:', error);
      }
    });
  }

  private startHeartbeat(): void {
    // Limpar heartbeat anterior se existir
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Enviar heartbeat a cada 5 segundos
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN && !this.isDestroyed) {
        this.sendMessage({
          type: 'PING',
          timestamp: new Date().toISOString()
        });
        console.log('🏓 Client heartbeat sent');
      }
    }, 5000);
  }
}

export const websocketService = WebSocketService.getInstance();
export type { WebSocketMessage, MessageHandler }; 