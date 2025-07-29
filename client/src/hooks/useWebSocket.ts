import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

interface UseWebSocketReturn {
  connected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return; // Já conectado
      }

      console.log('🔌 Attempting WebSocket connection...');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔌 WebSocket connected successfully');
        setConnected(true);
        
        // Limpar timeout de reconexão se existir
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          console.log('📨 WebSocket message received:', message.type);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setConnected(false);
        
        // Reconectar após 3 segundos se não foi fechado intencionalmente
        if (event.code !== 1000) { // 1000 = normal closure
          console.log('🔄 Attempting to reconnect in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnected(false);
      };
    };

    connect();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  };

  return {
    connected,
    sendMessage,
    lastMessage
  };
}; 